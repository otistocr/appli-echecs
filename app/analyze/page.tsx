"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Chess } from "chess.js"
import { Chessboard } from "react-chessboard"
import Sidebar from "@/components/Sidebar"
import {
  Stockfish,
  classifyMove,
  formatEval,
  QUALITY_COLOR,
  QUALITY_LABEL,
  QUALITY_SYMBOL,
  type EvalResult,
  type MoveQuality,
} from "@/lib/analyze/stockfish"
import { recordAnalysis } from "@/lib/storage"

const SAMPLE_PGN = `[Event "Sample game"]
[Site "?"]
[Date "2026.07.14"]
[White "Hero"]
[Black "Opponent"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. Ng5 d5 5. exd5 Nxd5 6. Nxf7 Kxf7
7. Qf3+ Ke6 8. Nc3 Nce7 9. d4 c6 10. Bg5 h6 11. Bxe7 Bxe7 12. O-O-O
Nf4 13. Ne4 Kf7 14. Qb3+ Kg6 15. Rxd8 Rxd8 16. Bxg8 Rxg8 17. Ng5 hxg5
18. Qf7# 1-0`

interface AnalyzedMove {
  san: string
  fen_before: string
  fen_after: string
  eval_before: EvalResult | null
  eval_after: EvalResult | null
  best_move_uci?: string
  cp_loss?: number // positive = how bad the move was
  quality?: MoveQuality
  ply: number // 1-based
}

export default function AnalyzePage() {
  const [pgn, setPgn] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [total, setTotal] = useState(0)
  const [moves, setMoves] = useState<AnalyzedMove[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [depth, setDepth] = useState(12)
  const engineRef = useRef<Stockfish | null>(null)

  useEffect(() => {
    return () => {
      engineRef.current?.destroy()
    }
  }, [])

  const analyze = useCallback(async () => {
    setError(null)
    setMoves([])
    setCurrentIdx(0)

    if (!pgn.trim()) {
      setError("Colle un PGN pour commencer.")
      return
    }

    const game = new Chess()
    try {
      game.loadPgn(pgn)
    } catch (e) {
      setError(
        "PGN invalide : " + (e instanceof Error ? e.message : "erreur inconnue")
      )
      return
    }

    const history = game.history({ verbose: true })
    if (history.length === 0) {
      setError("Aucun coup trouvé dans le PGN.")
      return
    }

    setAnalyzing(true)
    setTotal(history.length)
    setProgress(0)

    if (!engineRef.current) engineRef.current = new Stockfish()
    const engine = engineRef.current

    try {
      await engine.whenReady()
    } catch {
      setError("Impossible de charger Stockfish. Rafraîchis la page.")
      setAnalyzing(false)
      return
    }

    // Replay from scratch, analyze each position
    const replay = new Chess()
    const results: AnalyzedMove[] = []

    for (let i = 0; i < history.length; i++) {
      const fenBefore = replay.fen()
      const evalBefore = await engine.evaluate(fenBefore, depth)
      const move = history[i]
      replay.move({ from: move.from, to: move.to, promotion: move.promotion })
      const fenAfter = replay.fen()
      const evalAfter = await engine.evaluate(fenAfter, depth)

      // Compute cp loss from mover's perspective
      // evals are from white's perspective (cp field)
      // If mover was white, moverPerspectiveBefore = +cp, moverPerspectiveAfter = +cp (of opponent's turn after)
      // Actually eval_after is from side-to-move-after's perspective? No, we always evaluate from white's absolute perspective.
      const moverWasWhite = move.color === "w"
      const beforeMover = signedEval(evalBefore, moverWasWhite)
      const afterMover = signedEval(evalAfter, moverWasWhite)
      // After the move, it's opponent's turn. beforeMover / afterMover are both from mover's perspective.
      // A good move → afterMover >= beforeMover (mover keeps advantage).
      // Cp loss = beforeMover - afterMover (positive means mover lost equity)
      const cpLoss = Math.max(0, beforeMover - afterMover)

      const analyzed: AnalyzedMove = {
        san: move.san,
        fen_before: fenBefore,
        fen_after: fenAfter,
        eval_before: evalBefore,
        eval_after: evalAfter,
        best_move_uci: evalBefore.bestMove,
        cp_loss: cpLoss,
        quality: classifyMove(cpLoss),
        ply: i + 1,
      }
      results.push(analyzed)
      setProgress(i + 1)
      setMoves([...results])
    }

    setAnalyzing(false)
    recordAnalysis()
  }, [pgn, depth])

  // Current board position
  const boardFen = moves[currentIdx - 1]?.fen_after ?? new Chess().fen()

  const currentMove = currentIdx > 0 ? moves[currentIdx - 1] : null

  const stats = useMemo(() => {
    const counters: Record<MoveQuality, number> = {
      best: 0,
      excellent: 0,
      good: 0,
      inaccuracy: 0,
      mistake: 0,
      blunder: 0,
    }
    for (const m of moves) if (m.quality) counters[m.quality]++
    return counters
  }, [moves])

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <Sidebar />
      <main className="flex-1 min-w-0 lg:ml-56">
        <header
          className="border-b h-12 px-4 sm:px-6 flex items-center justify-between sticky top-12 lg:top-0 z-30 backdrop-blur"
          style={{
            borderColor: "var(--border)",
            background: "color-mix(in srgb, var(--bg-deep) 85%, transparent)",
          }}
        >
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
            <Link href="/">Home</Link>
            <span>/</span>
            <span style={{ color: "var(--text-primary)" }}>Analyse PGN</span>
          </div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>
            Stockfish 18 · WASM local
          </div>
        </header>

        <div className="px-6 sm:px-10 py-8 max-w-6xl">
          <header className="mb-6">
            <div
              className="flex items-center gap-3 text-xs uppercase tracking-widest mb-2"
              style={{ color: "var(--accent)", letterSpacing: "0.3em" }}
            >
              <span className="text-lg">♞</span>
              <span>Analyse PGN</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Analyse une de tes parties
            </h1>
            <p className="text-sm mt-2 max-w-xl" style={{ color: "var(--text-secondary)" }}>
              Colle un PGN, Stockfish évalue chaque coup en local (7 MB WebAssembly, aucune
              donnée envoyée). Classification des coups : meilleur, excellent, bon, imprécision,
              erreur, gaffe.
            </p>
          </header>

          {/* PGN input */}
          {moves.length === 0 && !analyzing && (
            <section className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <label
                  className="text-xs uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  PGN
                </label>
                <button
                  onClick={() => setPgn(SAMPLE_PGN)}
                  className="text-xs"
                  style={{ color: "var(--accent)" }}
                >
                  Charger un exemple
                </button>
              </div>
              <textarea
                value={pgn}
                onChange={(e) => setPgn(e.target.value)}
                placeholder="Colle un PGN (issu de Lichess, Chess.com, ou autre)..."
                className="w-full h-48 p-3 border font-mono text-xs focus:outline-none"
                style={{ borderColor: "var(--border)" }}
              />
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={analyze}
                  disabled={!pgn.trim()}
                  className="px-4 py-2 text-xs uppercase tracking-widest font-semibold border disabled:opacity-40"
                  style={{
                    background: "var(--accent)",
                    color: "var(--bg-deep)",
                    borderColor: "var(--accent)",
                    letterSpacing: "0.2em",
                  }}
                >
                  ♞ Analyser
                </button>
                <label
                  className="text-xs flex items-center gap-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Profondeur
                  <select
                    value={depth}
                    onChange={(e) => setDepth(parseInt(e.target.value, 10))}
                    className="px-2 py-1 border bg-transparent"
                    style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
                  >
                    <option value={8}>8 (rapide)</option>
                    <option value={12}>12 (moyen)</option>
                    <option value={16}>16 (précis)</option>
                    <option value={20}>20 (lent)</option>
                  </select>
                </label>
              </div>
              {error && (
                <div
                  className="text-sm p-3 border-l-2"
                  style={{
                    borderColor: "#d47862",
                    color: "var(--text-secondary)",
                    background: "rgba(212, 120, 98, 0.05)",
                  }}
                >
                  {error}
                </div>
              )}
            </section>
          )}

          {/* Analyzing progress */}
          {analyzing && (
            <section
              className="p-5 border-l-2 mb-6"
              style={{
                borderColor: "var(--accent)",
                background: "var(--surface)",
              }}
            >
              <div
                className="text-xs uppercase tracking-widest mb-2"
                style={{ color: "var(--accent)" }}
              >
                Analyse en cours
              </div>
              <div className="text-sm mb-2">
                Coup {progress} / {total * 2} évaluations
              </div>
              <div className="h-1 rounded overflow-hidden" style={{ background: "var(--surface-2)" }}>
                <div
                  className="h-full transition-all"
                  style={{
                    background: "var(--accent)",
                    width: `${total > 0 ? (progress / total) * 100 : 0}%`,
                  }}
                />
              </div>
              <div
                className="text-[10px] mt-2"
                style={{ color: "var(--text-muted)" }}
              >
                Stockfish 18 tourne dans un Web Worker en profondeur {depth}. Ça prend
                quelques secondes par coup selon ta machine.
              </div>
            </section>
          )}

          {/* Results */}
          {moves.length > 0 && (
            <section className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
              {/* Board + nav */}
              <div>
                <div
                  className="w-full max-w-lg mx-auto"
                  style={{
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                    border: "2px solid var(--accent)",
                  }}
                >
                  <Chessboard
                    options={{
                      position: boardFen,
                      allowDragging: false,
                      darkSquareStyle: { backgroundColor: "#b58863" },
                      lightSquareStyle: { backgroundColor: "#f0d9b5" },
                    }}
                  />
                </div>

                {/* Nav */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button
                    onClick={() => setCurrentIdx(0)}
                    disabled={currentIdx === 0}
                    className="px-2 py-1 text-xs border disabled:opacity-30"
                    style={{ borderColor: "var(--border)" }}
                  >
                    ⏮
                  </button>
                  <button
                    onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                    disabled={currentIdx === 0}
                    className="px-3 py-1 text-xs border disabled:opacity-30"
                    style={{ borderColor: "var(--border)" }}
                  >
                    ◀
                  </button>
                  <div
                    className="text-xs tabular-nums px-3"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {currentIdx} / {moves.length}
                  </div>
                  <button
                    onClick={() => setCurrentIdx((i) => Math.min(moves.length, i + 1))}
                    disabled={currentIdx === moves.length}
                    className="px-3 py-1 text-xs border disabled:opacity-30"
                    style={{ borderColor: "var(--border)" }}
                  >
                    ▶
                  </button>
                  <button
                    onClick={() => setCurrentIdx(moves.length)}
                    disabled={currentIdx === moves.length}
                    className="px-2 py-1 text-xs border disabled:opacity-30"
                    style={{ borderColor: "var(--border)" }}
                  >
                    ⏭
                  </button>
                </div>

                {/* Current move detail */}
                {currentMove && (
                  <div
                    className="mt-4 p-4 border-l-2 space-y-2"
                    style={{
                      borderColor: currentMove.quality
                        ? QUALITY_COLOR[currentMove.quality]
                        : "var(--border)",
                      background: "var(--surface)",
                    }}
                  >
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span
                          className="text-lg font-mono font-bold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {Math.ceil(currentMove.ply / 2)}
                          {currentMove.ply % 2 === 1 ? "." : "..."}
                          {" "}
                          {currentMove.san}
                          {currentMove.quality && QUALITY_SYMBOL[currentMove.quality]}
                        </span>
                      </div>
                      <div
                        className="text-sm font-mono tabular-nums"
                        style={{ color: "var(--accent)" }}
                      >
                        {formatEval(currentMove.eval_after)}
                      </div>
                    </div>
                    {currentMove.quality && (
                      <div
                        className="text-xs uppercase tracking-widest"
                        style={{
                          color: QUALITY_COLOR[currentMove.quality],
                          letterSpacing: "0.15em",
                        }}
                      >
                        {QUALITY_LABEL[currentMove.quality]}
                        {currentMove.cp_loss !== undefined &&
                          currentMove.cp_loss > 10 && (
                            <span
                              className="ml-2"
                              style={{ color: "var(--text-muted)" }}
                            >
                              (perte : {(currentMove.cp_loss / 100).toFixed(2)})
                            </span>
                          )}
                      </div>
                    )}
                    {currentMove.best_move_uci &&
                      currentMove.quality !== "best" && (
                        <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                          Meilleur coup :{" "}
                          <strong className="font-mono">{currentMove.best_move_uci}</strong>
                        </div>
                      )}
                  </div>
                )}
              </div>

              {/* Move list */}
              <aside className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <StatBadge label="Gaffes" value={stats.blunder} color="#d47862" />
                  <StatBadge label="Erreurs" value={stats.mistake} color="#e08850" />
                  <StatBadge label="Imprécis." value={stats.inaccuracy} color="#e0b566" />
                  <StatBadge label="Bons" value={stats.good} color="var(--text-secondary)" />
                  <StatBadge label="Excellents" value={stats.excellent} color="#6cb98d" />
                  <StatBadge label="Meilleurs" value={stats.best} color="var(--accent)" />
                </div>

                {/* Moves list */}
                <div
                  className="border p-3 max-h-96 overflow-y-auto text-sm"
                  style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                >
                  <div
                    className="text-[10px] uppercase tracking-widest mb-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Coups
                  </div>
                  <div className="grid grid-cols-[auto_1fr_1fr] gap-x-2 gap-y-0.5 font-mono text-xs">
                    {Array.from({ length: Math.ceil(moves.length / 2) }).map((_, i) => {
                      const white = moves[i * 2]
                      const black = moves[i * 2 + 1]
                      return (
                        <div key={i} className="contents">
                          <div style={{ color: "var(--text-muted)" }} className="tabular-nums">
                            {i + 1}.
                          </div>
                          <MoveCell
                            move={white}
                            active={currentIdx === i * 2 + 1}
                            onClick={() => setCurrentIdx(i * 2 + 1)}
                          />
                          {black ? (
                            <MoveCell
                              move={black}
                              active={currentIdx === i * 2 + 2}
                              onClick={() => setCurrentIdx(i * 2 + 2)}
                            />
                          ) : (
                            <div />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setMoves([])
                    setCurrentIdx(0)
                    setPgn("")
                  }}
                  className="text-xs uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  ⟳ Nouvelle analyse
                </button>
              </aside>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}

function StatBadge({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div
      className="p-2 border"
      style={{
        borderColor: "var(--border)",
        color,
      }}
    >
      <div
        className="text-[10px] uppercase tracking-widest"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </div>
      <div className="text-lg font-bold tabular-nums" style={{ color }}>
        {value}
      </div>
    </div>
  )
}

function MoveCell({
  move,
  active,
  onClick,
}: {
  move: AnalyzedMove | undefined
  active: boolean
  onClick: () => void
}) {
  if (!move) return <div />
  const q = move.quality
  const symbol = q ? QUALITY_SYMBOL[q] : ""
  const color = q ? QUALITY_COLOR[q] : "var(--text-primary)"
  return (
    <button
      onClick={onClick}
      className="text-left px-1 hover:bg-[color:var(--surface-2)]"
      style={{
        color,
        fontWeight: active ? 700 : 400,
        background: active ? "var(--surface-2)" : undefined,
      }}
    >
      {move.san}
      {symbol}
    </button>
  )
}

/**
 * Convert a stockfish eval (from white's perspective) into the mover's perspective.
 */
function signedEval(res: EvalResult | null, moverWasWhite: boolean): number {
  if (!res) return 0
  if (res.mate !== undefined) {
    // Very large signed value : +100000 for white winning, -100000 for black winning
    const val = res.mate > 0 ? 100000 : -100000
    return moverWasWhite ? val : -val
  }
  if (res.cp === undefined) return 0
  return moverWasWhite ? res.cp : -res.cp
}
