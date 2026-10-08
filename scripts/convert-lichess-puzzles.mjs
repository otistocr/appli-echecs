/**
 * Convertit les puzzles Lichess (UCI, position "avant") en notre format :
 * - FEN = position réelle du puzzle (après le coup adverse setup)
 * - solution = coups SAN à jouer par le héros (alternés avec les réponses adverses)
 * - side = "white" ou "black" (qui joue en premier)
 */
import { Chess } from "chess.js"
import fs from "node:fs"
import path from "node:path"

const IN_FILE = path.resolve("lib/puzzles/lichess.json")
const OUT_FILE = path.resolve("lib/puzzles/imported.json")

const raw = JSON.parse(fs.readFileSync(IN_FILE, "utf-8"))
console.log(`Read ${raw.length} raw puzzles`)

const converted = []
const failed = []

for (const p of raw) {
  try {
    const game = new Chess(p.fen)
    // Apply the setup move (first UCI move played by adversary)
    const setupUci = p.moves_uci[0]
    const setup = game.move({
      from: setupUci.slice(0, 2),
      to: setupUci.slice(2, 4),
      promotion: setupUci[4] || undefined,
    })
    if (!setup) throw new Error("setup move invalid")

    const puzzleFen = game.fen()
    const heroSide = game.turn() === "w" ? "white" : "black"

    // Convert remaining moves (hero's + adv replies) to SAN
    const solutionSan = []
    for (let i = 1; i < p.moves_uci.length; i++) {
      const uci = p.moves_uci[i]
      const move = game.move({
        from: uci.slice(0, 2),
        to: uci.slice(2, 4),
        promotion: uci[4] || undefined,
      })
      if (!move) throw new Error("solution move invalid at index " + i)
      solutionSan.push(move.san)
    }

    if (solutionSan.length === 0) throw new Error("no solution moves")

    converted.push({
      id: p.id,
      fen: puzzleFen,
      solution: solutionSan,
      theme: p.theme,
      rating: p.rating,
      side: heroSide,
      description: describeSolution(solutionSan, p.theme, p.rating),
    })
  } catch (e) {
    failed.push({ id: p.id, error: e.message })
  }
}

function describeSolution(moves, theme, rating) {
  const themeLabel =
    {
      mate_in_1: "Mat en 1",
      mate_in_2: "Mat en 2",
      fork: "Fourchette",
      pin: "Clouage",
      skewer: "Enfilade",
      back_rank: "Mat du couloir",
      discovered_attack: "Attaque découverte",
      deflection: "Déflexion",
      trapped_piece: "Pièce piégée",
      hanging_piece: "Pièce en prise",
    }[theme] || theme
  return `${themeLabel} · rating Lichess ${rating}. Solution : ${moves.join(" ")}.`
}

console.log(`Converted: ${converted.length} · Failed: ${failed.length}`)
fs.writeFileSync(OUT_FILE, JSON.stringify(converted, null, 2))
console.log(`Written to ${OUT_FILE}`)

// Print breakdown
const byTheme = {}
for (const c of converted) byTheme[c.theme] = (byTheme[c.theme] ?? 0) + 1
for (const [k, v] of Object.entries(byTheme)) console.log(`  ${k}: ${v}`)
