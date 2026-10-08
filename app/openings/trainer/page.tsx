"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Chess } from "chess.js"
import { Chessboard } from "react-chessboard"
import Sidebar from "@/components/Sidebar"
import { OPENINGS, type Opening } from "@/lib/openings/data"
import { recordOpeningMove } from "@/lib/storage"

interface Feedback {
  correct: boolean
  played: string
  expected: string
}

export default function OpeningTrainerPage() {
  const [openingId, setOpeningId] = useState<string>(OPENINGS[0].id)
  const opening = OPENINGS.find((o) => o.id === openingId)!
  const [game, setGame] = useState<Chess | null>(null)
  const [moveIdx, setMoveIdx] = useState(0)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [total, setTotal] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)

  // Init game when opening changes
  useEffect(() => {
    setGame(new Chess())
    setMoveIdx(0)
    setFeedback(null)
    // If opening is for black, auto-play white's first move
    if (opening.color === "black") {
      const g = new Chess()
      g.move(opening.main_line[0].san)
      setGame(g)
      setMoveIdx(1)
    }
  }, [openingId, opening])

  // Determine hero's move index (which move is HIS turn to play)
  const isHeroTurn = useMemo(() => {
    if (!game) return false
    return (
      (opening.color === "white" && game.turn() === "w") ||
      (opening.color === "black" && game.turn() === "b")
    )
  }, [game, opening])

  const expectedMove = opening.main_line[moveIdx]?.san

  const onPieceDrop = useCallback(
    ({
      sourceSquare,
      targetSquare,
    }: {
      sourceSquare: string
      targetSquare: string | null
    }): boolean => {
      if (!game || !targetSquare || !isHeroTurn || feedback || !expectedMove) return false

      const gameCopy = new Chess(game.fen())
      let moveResult
      try {
        moveResult = gameCopy.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q",
        })
      } catch {
        return false
      }
      if (!moveResult) return false

      const played = moveResult.san
      const ok = played === expectedMove
      setTotal((t) => t + 1)
      recordOpeningMove(opening.id, ok)

      if (ok) {
        setScore((s) => s + 10)
        setStreak((st) => st + 1)
        setCorrectCount((c) => c + 1)
        setGame(gameCopy)
        const nextIdx = moveIdx + 1

        // Auto-play opponent's reply
        if (nextIdx < opening.main_line.length) {
          const opp = new Chess(gameCopy.fen())
          try {
            opp.move(opening.main_line[nextIdx].san)
            setTimeout(() => {
              setGame(opp)
              setMoveIdx(nextIdx + 1)
            }, 500)
          } catch {
            setMoveIdx(nextIdx)
          }
        } else {
          setMoveIdx(nextIdx)
          setFeedback({ correct: true, played, expected: expectedMove })
        }
        return true
      } else {
        setScore((s) => Math.max(0, s - 3))
        setStreak(0)
        setFeedback({ correct: false, played, expected: expectedMove })
        return false
      }
    },
    [game, isHeroTurn, feedback, expectedMove, moveIdx, opening]
  )

  const resetOpening = () => {
    const fresh = new Chess()
    setGame(fresh)
    setMoveIdx(0)
    setFeedback(null)
    if (opening.color === "black") {
      const g = new Chess()
      g.move(opening.main_line[0].san)
      setGame(g)
      setMoveIdx(1)
    }
  }

  const currentComment =
    moveIdx > 0 ? opening.main_line[moveIdx - 1]?.comment : undefined

  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0

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
          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/openings">Ouvertures</Link>
            <span>/</span>
            <span style={{ color: "var(--text-primary)" }}>Trainer</span>
          </div>
        </header>

        <div className="px-6 sm:px-10 py-10 max-w-6xl">
          <header className="mb-6">
            <div
              className="flex items-center gap-3 text-xs uppercase tracking-widest mb-2"
              style={{ color: "var(--accent)", letterSpacing: "0.3em" }}
            >
              <span className="text-lg">♞</span>
              <span>Drill ouvertures</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Joue les coups par cœur
            </h1>
            <p className="text-sm mt-2 max-w-xl" style={{ color: "var(--text-secondary)" }}>
              Choisis une ouverture. L&apos;échiquier attend ton coup théorique. Feedback
              immédiat. L&apos;adversaire répond automatiquement.
            </p>
          </header>

          {/* Opening selector */}
          <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {OPENINGS.map((o) => {
              const isCurrent = openingId === o.id
              return (
                <button
                  key={o.id}
                  onClick={() => setOpeningId(o.id)}
                  className="text-left p-3 border transition-colors"
                  style={{
                    background: isCurrent ? "var(--accent-soft)" : "var(--surface)",
                    borderColor: isCurrent ? "var(--accent)" : "var(--border)",
                  }}
                >
                  <div
                    className="text-[10px] uppercase tracking-widest mb-1"
                    style={{ color: "var(--accent)", letterSpacing: "0.2em" }}
                  >
                    {o.color === "white" ? "Blancs" : `Noirs vs ${o.vs}`}
                  </div>
                  <div className="text-sm font-medium">{o.name}</div>
                </button>
              )
            })}
          </section>

          {/* Score */}
          <section className="grid grid-cols-4 gap-3 mb-6">
            <StatCell label="Score" value={score} accent />
            <StatCell label="Streak" value={streak} />
            <StatCell label="Coup" value={`${moveIdx}/${opening.main_line.length}`} />
            <StatCell label="Précision" value={`${accuracy}%`} />
          </section>

          {game && (
            <section className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
              <div
                className="w-full max-w-lg"
                style={{
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  border: "2px solid var(--accent)",
                }}
              >
                <Chessboard
                  options={{
                    position: game.fen(),
                    onPieceDrop,
                    boardOrientation: opening.color,
                    darkSquareStyle: { backgroundColor: "#b58863" },
                    lightSquareStyle: { backgroundColor: "#f0d9b5" },
                    allowDragging: isHeroTurn && !feedback,
                  }}
                />
              </div>

              <aside className="space-y-4">
                <div>
                  <div
                    className="text-[10px] uppercase tracking-widest"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {opening.name}
                  </div>
                  <div className="text-base font-medium mt-1">
                    {isHeroTurn
                      ? `À ton tour (${opening.color === "white" ? "blancs" : "noirs"})`
                      : "L'adversaire réfléchit..."}
                  </div>
                </div>

                {currentComment && !feedback && (
                  <div
                    className="p-3 border-l-2 text-sm"
                    style={{ borderColor: "var(--accent)", background: "var(--surface)" }}
                  >
                    <div
                      className="text-[10px] uppercase tracking-widest mb-1"
                      style={{ color: "var(--accent)" }}
                    >
                      Dernier coup
                    </div>
                    {currentComment}
                  </div>
                )}

                {moveIdx >= opening.main_line.length && !feedback && (
                  <div
                    className="p-4 border-l-2"
                    style={{
                      borderColor: "#6cb98d",
                      background: "rgba(108, 185, 141, 0.1)",
                    }}
                  >
                    <div className="font-semibold" style={{ color: "#6cb98d" }}>
                      ✓ Ligne principale terminée
                    </div>
                    <div className="text-sm mt-1">
                      Tu as suivi les {opening.main_line.length} coups théoriques.
                    </div>
                    <button
                      onClick={resetOpening}
                      className="mt-3 px-3 py-1.5 text-xs uppercase tracking-widest border"
                      style={{
                        background: "var(--accent)",
                        color: "var(--bg-deep)",
                        borderColor: "var(--accent)",
                      }}
                    >
                      Recommencer
                    </button>
                  </div>
                )}

                {feedback && !feedback.correct && (
                  <div
                    className="p-4 border-l-2 space-y-2"
                    style={{
                      borderColor: "#d47862",
                      background: "rgba(212, 120, 98, 0.1)",
                    }}
                  >
                    <div className="font-semibold" style={{ color: "#d47862" }}>
                      ✗ Pas le coup théorique
                    </div>
                    <div className="text-sm">
                      Tu as joué <strong className="font-mono">{feedback.played}</strong>.
                      Coup attendu :{" "}
                      <strong className="font-mono" style={{ color: "var(--accent)" }}>
                        {feedback.expected}
                      </strong>
                    </div>
                    <button
                      onClick={() => setFeedback(null)}
                      className="mt-2 px-3 py-1.5 text-xs uppercase tracking-widest border"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Réessayer
                    </button>
                  </div>
                )}

                <button
                  onClick={resetOpening}
                  className="text-xs uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  ⟳ Reset la partie
                </button>
              </aside>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}

function StatCell({
  label,
  value,
  accent,
}: {
  label: string
  value: number | string
  accent?: boolean
}) {
  return (
    <div
      className="p-3 border"
      style={{
        borderColor: accent ? "var(--accent)" : "var(--border)",
        background: accent
          ? "color-mix(in srgb, var(--accent) 6%, var(--bg-deep))"
          : "var(--surface)",
      }}
    >
      <div
        className="text-[10px] uppercase tracking-widest"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </div>
      <div
        className="text-xl sm:text-2xl font-semibold tabular-nums mt-1"
        style={{ color: accent ? "var(--accent)" : "var(--text-primary)" }}
      >
        {value}
      </div>
    </div>
  )
}
