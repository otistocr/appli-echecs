"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Chess } from "chess.js"
import { Chessboard } from "react-chessboard"
import Sidebar from "@/components/Sidebar"
import { ENDGAMES, CATEGORY_LABELS, type Endgame } from "@/lib/endgames/data"
import { recordEndgameCompleted } from "@/lib/storage"

interface Feedback {
  correct: boolean
  played: string
  expected: string
}

export default function EndgamesPage() {
  const [selectedId, setSelectedId] = useState(ENDGAMES[0].id)
  const endgame = ENDGAMES.find((e) => e.id === selectedId)!
  const [game, setGame] = useState<Chess | null>(null)
  const [moveIdx, setMoveIdx] = useState(0)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [completed, setCompleted] = useState(false)

  const resetPuzzle = useCallback((eg: Endgame) => {
    setGame(new Chess(eg.fen))
    setMoveIdx(0)
    setFeedback(null)
    setCompleted(false)
  }, [])

  useEffect(() => {
    resetPuzzle(endgame)
  }, [endgame, resetPuzzle])

  const isHeroTurn = useMemo(() => {
    if (!game) return false
    return (
      (endgame.side === "white" && game.turn() === "w") ||
      (endgame.side === "black" && game.turn() === "b")
    )
  }, [game, endgame])

  const expectedMove = endgame.solution[moveIdx]

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

      if (ok) {
        setGame(gameCopy)
        const nextIdx = moveIdx + 1

        if (nextIdx < endgame.solution.length) {
          // Auto-play opponent
          const opp = new Chess(gameCopy.fen())
          try {
            opp.move(endgame.solution[nextIdx])
            setTimeout(() => {
              setGame(opp)
              setMoveIdx(nextIdx + 1)
              if (nextIdx + 1 >= endgame.solution.length) setCompleted(true)
            }, 500)
          } catch {
            setMoveIdx(nextIdx)
            setCompleted(true)
          }
        } else {
          setMoveIdx(nextIdx)
          setCompleted(true)
          recordEndgameCompleted(endgame.id)
        }
        return true
      } else {
        setFeedback({ correct: false, played, expected: expectedMove })
        return false
      }
    },
    [game, isHeroTurn, feedback, expectedMove, moveIdx, endgame]
  )

  const grouped = useMemo(() => {
    const g: Record<string, Endgame[]> = {}
    for (const e of ENDGAMES) {
      const cat = CATEGORY_LABELS[e.category]
      if (!g[cat]) g[cat] = []
      g[cat].push(e)
    }
    return g
  }, [])

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
            <span style={{ color: "var(--text-primary)" }}>Endgames</span>
          </div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>
            {ENDGAMES.length} positions
          </div>
        </header>

        <div className="px-6 sm:px-10 py-10 max-w-6xl">
          <header className="mb-8">
            <div
              className="flex items-center gap-3 text-xs uppercase tracking-widest mb-2"
              style={{ color: "var(--accent)", letterSpacing: "0.3em" }}
            >
              <span className="text-lg">♞</span>
              <span>Endgames essentiels</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Les 6 positions à connaître par cœur
            </h1>
            <p className="text-sm mt-2 max-w-xl" style={{ color: "var(--text-secondary)" }}>
              Mats élémentaires, opposition, règle du carré, Lucena, Philidor. Choisis une
              position, joue les coups optimaux, la théorie te dira si tu suis la bonne ligne.
            </p>
          </header>

          {/* Endgame list */}
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {Object.entries(grouped).map(([cat, list]) => (
              <div key={cat}>
                <div
                  className="text-[10px] uppercase tracking-widest mb-2"
                  style={{ color: "var(--text-muted)", letterSpacing: "0.25em" }}
                >
                  {cat}
                </div>
                <div className="space-y-2">
                  {list.map((eg) => {
                    const isCurrent = selectedId === eg.id
                    return (
                      <button
                        key={eg.id}
                        onClick={() => setSelectedId(eg.id)}
                        className="w-full text-left p-3 border transition-colors text-sm"
                        style={{
                          background: isCurrent
                            ? "var(--accent-soft)"
                            : "var(--surface)",
                          borderColor: isCurrent ? "var(--accent)" : "var(--border)",
                        }}
                      >
                        {eg.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </section>

          {/* Selected endgame */}
          {game && (
            <section className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
              <div className="space-y-3">
                <div
                  className="w-full max-w-lg mx-auto"
                  style={{
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                    border: "2px solid var(--accent)",
                  }}
                >
                  <Chessboard
                    options={{
                      position: game.fen(),
                      onPieceDrop,
                      boardOrientation: endgame.side,
                      darkSquareStyle: { backgroundColor: "#b58863" },
                      lightSquareStyle: { backgroundColor: "#f0d9b5" },
                      allowDragging: isHeroTurn && !feedback && !completed,
                    }}
                  />
                </div>
                <div
                  className="text-xs text-center"
                  style={{ color: "var(--text-muted)" }}
                >
                  Coup {moveIdx} / {endgame.solution.length}
                </div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => resetPuzzle(endgame)}
                    className="text-xs px-3 py-1 border"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    ⟳ Recommencer
                  </button>
                </div>
              </div>

              {/* Info */}
              <aside className="space-y-5">
                <div>
                  <div
                    className="text-[10px] uppercase tracking-widest mb-1"
                    style={{ color: "var(--accent)", letterSpacing: "0.25em" }}
                  >
                    {CATEGORY_LABELS[endgame.category]}
                  </div>
                  <h2 className="text-xl font-bold">{endgame.name}</h2>
                  <p
                    className="text-sm mt-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <strong>Objectif :</strong> {endgame.goal}
                  </p>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Trait aux{" "}
                    <strong style={{ color: "var(--accent)" }}>
                      {endgame.side === "white" ? "blancs" : "noirs"}
                    </strong>
                  </p>
                </div>

                <div>
                  <div
                    className="text-[10px] uppercase tracking-widest mb-3"
                    style={{ color: "var(--text-muted)", letterSpacing: "0.25em" }}
                  >
                    Concepts clés
                  </div>
                  <ol className="space-y-2 text-sm">
                    {endgame.concepts.map((c, i) => (
                      <li key={i} className="flex gap-3">
                        <span
                          className="tabular-nums text-xs"
                          style={{ color: "var(--accent)" }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {feedback && !feedback.correct && (
                  <div
                    className="p-4 border-l-2 space-y-2"
                    style={{
                      borderColor: "#d47862",
                      background: "rgba(212, 120, 98, 0.1)",
                    }}
                  >
                    <div className="font-semibold" style={{ color: "#d47862" }}>
                      ✗ Pas la ligne optimale
                    </div>
                    <div className="text-sm">
                      Tu as joué <strong className="font-mono">{feedback.played}</strong>.
                      La théorie recommande :{" "}
                      <strong className="font-mono" style={{ color: "var(--accent)" }}>
                        {feedback.expected}
                      </strong>
                    </div>
                    <button
                      onClick={() => setFeedback(null)}
                      className="mt-2 px-3 py-1 text-xs uppercase tracking-widest border"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Réessayer
                    </button>
                  </div>
                )}

                {completed && (
                  <div
                    className="p-4 border-l-2"
                    style={{
                      borderColor: "#6cb98d",
                      background: "rgba(108, 185, 141, 0.1)",
                    }}
                  >
                    <div className="font-semibold" style={{ color: "#6cb98d" }}>
                      ✓ Position maîtrisée
                    </div>
                    <div className="text-sm mt-1">
                      Tu as suivi la ligne théorique complète.
                    </div>
                  </div>
                )}

                <details className="text-xs" style={{ color: "var(--text-muted)" }}>
                  <summary className="cursor-pointer hover:opacity-80">Indice</summary>
                  <div
                    className="mt-2 pl-3 border-l"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {endgame.hint}
                  </div>
                </details>
              </aside>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
