"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Chess } from "chess.js"
import { Chessboard } from "react-chessboard"
import Sidebar from "@/components/Sidebar"
import {
  PUZZLES,
  PUZZLE_THEMES,
  drawRandomPuzzle,
  type Puzzle,
  type PuzzleTheme,
} from "@/lib/puzzles/data"
import { recordPuzzle } from "@/lib/storage"

interface Feedback {
  status: "correct" | "wrong" | "partial"
  points: number
  played: string
  expected: string
  description: string
}

export default function PuzzlesPage() {
  const [themeFilter, setThemeFilter] = useState<PuzzleTheme | null>(null)
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [game, setGame] = useState<Chess | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [solvedIdx, setSolvedIdx] = useState(0) // for multi-move puzzles
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [solved, setSolved] = useState(0)
  const [attempted, setAttempted] = useState(0)

  const loadPuzzle = useCallback((theme: PuzzleTheme | null) => {
    const p = drawRandomPuzzle(theme)
    if (!p) return
    setPuzzle(p)
    setGame(new Chess(p.fen))
    setFeedback(null)
    setSolvedIdx(0)
  }, [])

  useEffect(() => {
    loadPuzzle(themeFilter)
  }, [loadPuzzle, themeFilter])

  const boardOrientation = puzzle?.side === "black" ? "black" : "white"

  const onPieceDrop = useCallback(
    ({
      sourceSquare,
      targetSquare,
    }: {
      sourceSquare: string
      targetSquare: string | null
    }): boolean => {
      if (!targetSquare || !game || !puzzle || feedback) return false

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
      const expected = puzzle.solution[solvedIdx]

      if (played === expected) {
        // Correct move
        setGame(gameCopy)
        const nextIdx = solvedIdx + 1

        // If more moves in solution (adversary reply), auto-play it
        if (nextIdx < puzzle.solution.length) {
          const advCopy = new Chess(gameCopy.fen())
          try {
            advCopy.move(puzzle.solution[nextIdx])
            setTimeout(() => {
              setGame(advCopy)
              setSolvedIdx(nextIdx + 1)
            }, 500)
          } catch {
            // no adv reply
          }
        } else {
          // Puzzle solved!
          const points = 10
          setScore((s) => s + points)
          setStreak((st) => st + 1)
          setSolved((sv) => sv + 1)
          setAttempted((a) => a + 1)
          recordPuzzle(true, puzzle.theme, puzzle.rating)
          setFeedback({
            status: "correct",
            points,
            played,
            expected,
            description: puzzle.description,
          })
        }
        return true
      } else {
        // Wrong move
        setScore((s) => Math.max(0, s - 3))
        setStreak(0)
        setAttempted((a) => a + 1)
        recordPuzzle(false, puzzle.theme, puzzle.rating)
        setFeedback({
          status: "wrong",
          points: -3,
          played,
          expected,
          description: puzzle.description,
        })
        // Don't apply the wrong move
        return false
      }
    },
    [game, puzzle, solvedIdx, feedback]
  )

  const nextPuzzle = () => loadPuzzle(themeFilter)

  const accuracy = attempted > 0 ? Math.round((solved / attempted) * 100) : 0

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 min-w-0 ml-56">
        {/* Top */}
        <header
          className="border-b h-12 px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur"
          style={{
            borderColor: "var(--border)",
            background: "color-mix(in srgb, var(--bg-deep) 85%, transparent)",
          }}
        >
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
            <Link href="/">Home</Link>
            <span>/</span>
            <span style={{ color: "var(--text-primary)" }}>Tactiques</span>
          </div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>
            {PUZZLES.length} puzzles disponibles
          </div>
        </header>

        <div className="px-6 sm:px-10 py-10 max-w-5xl">
          <header className="mb-6">
            <div
              className="flex items-center gap-3 text-xs uppercase tracking-widest mb-2"
              style={{ color: "var(--accent)", letterSpacing: "0.3em" }}
            >
              <span className="text-lg">♟</span>
              <span>Puzzles tactiques</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Trouve le meilleur coup
            </h1>
            <p
              className="text-sm mt-2 max-w-xl"
              style={{ color: "var(--text-secondary)" }}
            >
              Drag-and-drop de la pièce vers la case cible. Feedback immédiat. Bon coup = +10
              pts. Erreur = -3. Choisis un thème ci-dessous ou reste sur "Tous".
            </p>
          </header>

          {/* Theme selector */}
          <section className="flex flex-wrap gap-2 mb-6">
            <ThemeBtn
              label="Tous"
              active={themeFilter === null}
              onClick={() => setThemeFilter(null)}
              count={PUZZLES.length}
            />
            {PUZZLE_THEMES.map((t) => {
              const count = PUZZLES.filter((p) => p.theme === t.value).length
              if (count === 0) return null
              return (
                <ThemeBtn
                  key={t.value}
                  label={t.label}
                  active={themeFilter === t.value}
                  onClick={() => setThemeFilter(t.value)}
                  count={count}
                />
              )
            })}
          </section>

          {/* Score bar */}
          <section className="grid grid-cols-4 gap-3 mb-6">
            <StatCell label="Score" value={score} accent />
            <StatCell label="Streak" value={streak} />
            <StatCell label="Résolus" value={solved} />
            <StatCell label="Précision" value={`${accuracy}%`} />
          </section>

          {/* Puzzle */}
          {puzzle && game && (
            <section className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
              {/* Board */}
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
                    boardOrientation,
                    darkSquareStyle: { backgroundColor: "#b58863" },
                    lightSquareStyle: { backgroundColor: "#f0d9b5" },
                    allowDragging: !feedback,
                  }}
                />
              </div>

              {/* Info panel */}
              <div className="space-y-4">
                <div>
                  <div
                    className="text-[10px] uppercase tracking-widest"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Contexte
                  </div>
                  <div className="text-base font-medium mt-1">
                    Trait aux{" "}
                    <span style={{ color: "var(--accent)" }}>
                      {puzzle.side === "white" ? "blancs" : "noirs"}
                    </span>
                  </div>
                  <div className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                    Thème :{" "}
                    <strong>
                      {PUZZLE_THEMES.find((t) => t.value === puzzle.theme)?.label}
                    </strong>
                    <span style={{ color: "var(--text-muted)" }}>
                      {" "}
                      · ~{puzzle.rating} elo
                    </span>
                  </div>
                </div>

                {!feedback ? (
                  <div
                    className="text-sm p-4 border-l-2"
                    style={{
                      borderColor: "var(--accent)",
                      background: "var(--surface)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Bouge une pièce pour proposer ta solution. La solution est un{" "}
                    <strong>coup unique</strong>
                    {puzzle.solution.length > 1 ? " + les suivants" : ""}.
                  </div>
                ) : (
                  <FeedbackPanel feedback={feedback} onNext={nextPuzzle} />
                )}

                <details
                  className="text-xs mt-4"
                  style={{ color: "var(--text-muted)" }}
                >
                  <summary className="cursor-pointer hover:opacity-80">Indice</summary>
                  <div className="mt-2 pl-3 border-l" style={{ borderColor: "var(--border)" }}>
                    {puzzle.description}
                  </div>
                </details>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}

function ThemeBtn({
  label,
  active,
  onClick,
  count,
}: {
  label: string
  active: boolean
  onClick: () => void
  count: number
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-xs border transition-colors flex items-center gap-2"
      style={{
        background: active ? "var(--accent)" : "transparent",
        color: active ? "var(--bg-deep)" : "var(--text-secondary)",
        borderColor: active ? "var(--accent)" : "var(--border)",
      }}
    >
      <span>{label}</span>
      <span
        className="text-[10px] tabular-nums"
        style={{ opacity: 0.7 }}
      >
        {count}
      </span>
    </button>
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

function FeedbackPanel({
  feedback,
  onNext,
}: {
  feedback: Feedback
  onNext: () => void
}) {
  const { status, points, played, expected, description } = feedback
  const correct = status === "correct"
  return (
    <div
      className="p-4 border-l-2 space-y-3"
      style={{
        borderColor: correct ? "#6cb98d" : "#d47862",
        background: correct
          ? "rgba(108, 185, 141, 0.1)"
          : "rgba(212, 120, 98, 0.1)",
      }}
    >
      <div className="flex items-baseline justify-between">
        <span
          className="text-lg font-bold"
          style={{ color: correct ? "#6cb98d" : "#d47862" }}
        >
          {correct ? "✓ Puzzle résolu" : "✗ Pas le meilleur coup"}
        </span>
        <span
          className="text-base font-bold tabular-nums"
          style={{ color: correct ? "#6cb98d" : "#d47862" }}
        >
          {points >= 0 ? "+" : ""}
          {points} pts
        </span>
      </div>

      <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
        Tu as joué : <strong className="font-mono">{played}</strong>
        {!correct && (
          <>
            {" "}
            · Coup attendu :{" "}
            <strong className="font-mono" style={{ color: "var(--accent)" }}>
              {expected}
            </strong>
          </>
        )}
      </div>

      <div className="text-sm">{description}</div>

      <button
        onClick={onNext}
        className="mt-2 px-4 py-2 text-xs uppercase tracking-widest font-semibold border"
        style={{
          background: "var(--accent)",
          color: "var(--bg-deep)",
          borderColor: "var(--accent)",
          letterSpacing: "0.2em",
        }}
      >
        Puzzle suivant →
      </button>
    </div>
  )
}
