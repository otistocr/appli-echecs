/**
 * Télécharge un chunk de la base Lichess puzzles (CSV compressé Zstandard),
 * filtre par rating 800-1500, thèmes utiles pour 1000-1500 ELO,
 * échantillonne ~600 puzzles et sauvegarde en JSON.
 */
import { Decompress } from "fzstd"
import fs from "node:fs"
import path from "node:path"
import https from "node:https"

const URL = "https://database.lichess.org/lichess_db_puzzle.csv.zst"
const OUT_FILE = path.resolve("lib/puzzles/lichess.json")
const CHUNK_BYTES = 30_000_000 // 30 MB compressé — donne ~500K rows uncompressed
const TARGET_COUNT = 600
const MIN_RATING = 700
const MAX_RATING = 1500

// Thèmes Lichess → nos catégories
const THEME_MAP = {
  mateIn1: "mate_in_1",
  mateIn2: "mate_in_2",
  fork: "fork",
  pin: "pin",
  skewer: "skewer",
  backRankMate: "back_rank",
  discoveredAttack: "discovered_attack",
  deflection: "deflection",
  trappedPiece: "trapped_piece",
  hangingPiece: "hanging_piece",
  attraction: "deflection",
  intermezzo: "deflection",
  smotheredMate: "mate_in_1",
  advancedPawn: "hanging_piece",
  queensideAttack: "hanging_piece",
  kingsideAttack: "hanging_piece",
}

// Score de préférence par thème (pour équilibrer le sample)
const THEME_TARGETS = {
  mate_in_1: 100,
  mate_in_2: 80,
  fork: 100,
  pin: 60,
  skewer: 40,
  back_rank: 50,
  discovered_attack: 40,
  deflection: 40,
  trapped_piece: 30,
  hanging_piece: 60,
}

function detectTheme(themesStr) {
  const themes = themesStr.split(" ")
  for (const lichessTheme of themes) {
    if (THEME_MAP[lichessTheme]) return THEME_MAP[lichessTheme]
  }
  return null
}

console.log(`Downloading first ${CHUNK_BYTES / 1_000_000} MB from ${URL}...`)

const decompressor = new Decompress()
let buffer = ""
const collected = {}
for (const key of Object.keys(THEME_TARGETS)) collected[key] = []
let totalRows = 0
let bytesReceived = 0
let done = false

function processLine(line) {
  if (done) return
  const cols = line.split(",")
  if (cols.length < 8) return
  const [id, fen, movesStr, ratingStr, , , , themesStr] = cols
  const rating = parseInt(ratingStr, 10)
  if (isNaN(rating) || rating < MIN_RATING || rating > MAX_RATING) return

  const ourTheme = detectTheme(themesStr ?? "")
  if (!ourTheme) return

  const bucket = collected[ourTheme]
  if (!bucket || bucket.length >= THEME_TARGETS[ourTheme]) return

  const moves = movesStr.split(" ")
  if (moves.length < 2) return

  bucket.push({
    id,
    lichess_id: id,
    fen,
    moves_uci: moves, // will convert to SAN in a post-step
    theme: ourTheme,
    rating,
  })

  totalRows++

  if (totalRows >= TARGET_COUNT) {
    done = true
  }
}

decompressor.ondata = (chunk) => {
  buffer += new TextDecoder().decode(chunk)
  const lines = buffer.split("\n")
  buffer = lines.pop() ?? ""
  for (const line of lines) processLine(line)
}

const req = https.get(URL, { headers: { Range: `bytes=0-${CHUNK_BYTES - 1}` } }, (res) => {
  if (res.statusCode !== 200 && res.statusCode !== 206) {
    console.error(`HTTP ${res.statusCode}`)
    process.exit(1)
  }
  res.on("data", (chunk) => {
    bytesReceived += chunk.length
    if (done) {
      res.destroy()
      return
    }
    try {
      decompressor.push(new Uint8Array(chunk), false)
    } catch (e) {
      // Streaming decompression may abort mid-frame when we destroy — that's OK.
    }
  })
  res.on("end", finalize)
  res.on("close", finalize)
  res.on("error", (e) => {
    console.error("network error", e.message)
    finalize()
  })
})

let finalized = false
function finalize() {
  if (finalized) return
  finalized = true
  try {
    decompressor.push(new Uint8Array(0), true)
  } catch {}
  const all = []
  for (const [theme, arr] of Object.entries(collected)) {
    console.log(`  ${theme}: ${arr.length}`)
    all.push(...arr)
  }
  console.log(`\nTotal collected: ${all.length}`)

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
  fs.writeFileSync(OUT_FILE, JSON.stringify(all, null, 2))
  console.log(`Written to ${OUT_FILE}`)
}

req.on("error", (e) => {
  console.error("request error", e.message)
  process.exit(1)
})
