/**
 * Stockfish wrapper that runs the engine in a Web Worker.
 * Communicates via UCI (Universal Chess Interface).
 */

export interface EvalResult {
  cp?: number // centipawns from white's perspective
  mate?: number // moves to mate (positive = white wins, negative = black wins)
  depth: number
  bestMove?: string // UCI notation
  pv?: string[] // principal variation
}

export class Stockfish {
  private worker: Worker | null = null
  private ready = false
  private listeners: ((line: string) => void)[] = []
  private initPromise: Promise<void>

  constructor() {
    this.initPromise = this.init()
  }

  private async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.worker = new Worker(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/stockfish/stockfish.js`)
        this.worker.onmessage = (e) => {
          const line = typeof e.data === "string" ? e.data : ""
          if (!line) return
          for (const l of this.listeners) l(line)
        }
        this.worker.onerror = (e) => {
          console.error("Stockfish worker error:", e)
          reject(e)
        }

        // Handshake UCI
        const onLine = (line: string) => {
          if (line === "uciok") {
            this.send("isready")
          } else if (line === "readyok") {
            this.ready = true
            this.listeners = this.listeners.filter((l) => l !== onLine)
            resolve()
          }
        }
        this.listeners.push(onLine)
        this.send("uci")
      } catch (e) {
        reject(e)
      }
    })
  }

  async whenReady(): Promise<void> {
    return this.initPromise
  }

  private send(cmd: string) {
    this.worker?.postMessage(cmd)
  }

  /**
   * Evaluate a position to a given depth, return the final eval + best move.
   */
  async evaluate(fen: string, depth: number = 12): Promise<EvalResult> {
    await this.whenReady()
    return new Promise((resolve) => {
      let latest: EvalResult = { depth: 0 }

      const onLine = (line: string) => {
        // info depth X ... score cp Y ...
        if (line.startsWith("info")) {
          const depthM = line.match(/depth (\d+)/)
          const cpM = line.match(/score cp (-?\d+)/)
          const mateM = line.match(/score mate (-?\d+)/)
          const pvM = line.match(/ pv (.+)$/)
          if (depthM) {
            latest.depth = parseInt(depthM[1], 10)
            if (cpM) {
              latest.cp = parseInt(cpM[1], 10)
              latest.mate = undefined
            }
            if (mateM) {
              latest.mate = parseInt(mateM[1], 10)
              latest.cp = undefined
            }
            if (pvM) latest.pv = pvM[1].split(" ")
          }
          return
        }
        if (line.startsWith("bestmove")) {
          const bm = line.split(" ")[1]
          latest.bestMove = bm !== "(none)" ? bm : undefined
          this.listeners = this.listeners.filter((l) => l !== onLine)
          resolve(latest)
        }
      }

      this.listeners.push(onLine)
      this.send("ucinewgame")
      this.send(`position fen ${fen}`)
      this.send(`go depth ${depth}`)
    })
  }

  destroy() {
    this.worker?.terminate()
    this.worker = null
  }
}

/**
 * Given eval before + after (both from side-to-move's perspective — same side),
 * return the classification.
 */
export type MoveQuality =
  | "best"
  | "excellent"
  | "good"
  | "inaccuracy"
  | "mistake"
  | "blunder"

export function classifyMove(cpLossFromMoverPerspective: number): MoveQuality {
  // cpLoss is always positive (how much the position worsened for the mover)
  if (cpLossFromMoverPerspective <= 10) return "best"
  if (cpLossFromMoverPerspective <= 30) return "excellent"
  if (cpLossFromMoverPerspective <= 60) return "good"
  if (cpLossFromMoverPerspective <= 150) return "inaccuracy"
  if (cpLossFromMoverPerspective <= 300) return "mistake"
  return "blunder"
}

export const QUALITY_LABEL: Record<MoveQuality, string> = {
  best: "Meilleur coup",
  excellent: "Excellent",
  good: "Bon",
  inaccuracy: "Imprécision",
  mistake: "Erreur",
  blunder: "Gaffe",
}

export const QUALITY_SYMBOL: Record<MoveQuality, string> = {
  best: "★",
  excellent: "!",
  good: "",
  inaccuracy: "?!",
  mistake: "?",
  blunder: "??",
}

export const QUALITY_COLOR: Record<MoveQuality, string> = {
  best: "#d4a343",
  excellent: "#6cb98d",
  good: "var(--text-secondary)",
  inaccuracy: "#e0b566",
  mistake: "#e08850",
  blunder: "#d47862",
}

/**
 * Format an evaluation as a human-readable string (e.g., "+1.24", "-M3").
 * Value is from white's perspective.
 */
export function formatEval(res: EvalResult | null): string {
  if (!res) return "?"
  if (res.mate !== undefined) {
    return res.mate > 0 ? `#${res.mate}` : `-#${Math.abs(res.mate)}`
  }
  if (res.cp === undefined) return "?"
  const pawns = res.cp / 100
  return pawns >= 0 ? `+${pawns.toFixed(2)}` : pawns.toFixed(2)
}
