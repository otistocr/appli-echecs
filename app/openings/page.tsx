"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Chess } from "chess.js"
import { Chessboard } from "react-chessboard"
import Sidebar from "@/components/Sidebar"
import { OPENINGS, type Opening } from "@/lib/openings/data"

export default function OpeningsPage() {
  const [selectedId, setSelectedId] = useState(OPENINGS[0].id)
  const opening = OPENINGS.find((o) => o.id === selectedId)!
  const [moveIdx, setMoveIdx] = useState(opening.main_line.length)

  const game = useMemo(() => {
    const g = new Chess()
    for (let i = 0; i < moveIdx; i++) {
      const move = opening.main_line[i]
      try {
        g.move(move.san)
      } catch {
        break
      }
    }
    return g
  }, [opening, moveIdx])

  const currentMove = moveIdx > 0 ? opening.main_line[moveIdx - 1] : null

  const selectOpening = (id: string) => {
    const o = OPENINGS.find((x) => x.id === id)!
    setSelectedId(id)
    setMoveIdx(o.main_line.length)
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 min-w-0 ml-56">
        <header
          className="border-b h-12 px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur"
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
            <span style={{ color: "var(--text-primary)" }}>Ouvertures</span>
          </div>
          <Link
            href="/openings/trainer"
            className="text-xs uppercase tracking-widest px-3 py-1 border"
            style={{
              background: "var(--accent)",
              color: "var(--bg-deep)",
              borderColor: "var(--accent)",
              letterSpacing: "0.2em",
            }}
          >
            ♞ Trainer →
          </Link>
        </header>

        <div className="px-6 sm:px-10 py-10 max-w-6xl">
          <header className="mb-8">
            <div
              className="flex items-center gap-3 text-xs uppercase tracking-widest mb-2"
              style={{ color: "var(--accent)", letterSpacing: "0.3em" }}
            >
              <span className="text-lg">♞</span>
              <span>Ouvertures</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Ton répertoire simple
            </h1>
            <p className="text-sm mt-2 max-w-xl" style={{ color: "var(--text-secondary)" }}>
              Quatre systèmes qui suffisent pour 1000-1500 ELO : deux côté blancs, deux
              réponses côté noirs. Zéro theorie deep, focus sur les idées maîtresses.
            </p>
          </header>

          {/* Opening selector */}
          <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {OPENINGS.map((o) => {
              const isCurrent = selectedId === o.id
              return (
                <button
                  key={o.id}
                  onClick={() => selectOpening(o.id)}
                  className="text-left p-4 border transition-colors"
                  style={{
                    background: isCurrent ? "var(--accent-soft)" : "var(--surface)",
                    borderColor: isCurrent ? "var(--accent)" : "var(--border)",
                  }}
                >
                  <div
                    className="text-[10px] uppercase tracking-widest mb-1"
                    style={{ color: "var(--accent)", letterSpacing: "0.2em" }}
                  >
                    {o.color === "white" ? "Blancs" : `Noirs vs ${o.vs}`} · {o.eco}
                  </div>
                  <div className="text-lg font-medium">{o.name}</div>
                </button>
              )
            })}
          </section>

          {/* Selected opening */}
          <section className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
            {/* Board with move navigation */}
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
                    position: game.fen(),
                    allowDragging: false,
                    boardOrientation: opening.color,
                    darkSquareStyle: { backgroundColor: "#b58863" },
                    lightSquareStyle: { backgroundColor: "#f0d9b5" },
                  }}
                />
              </div>

              {/* Move navigation */}
              <div className="flex items-center justify-center gap-2 mt-4 max-w-lg mx-auto">
                <button
                  onClick={() => setMoveIdx(0)}
                  disabled={moveIdx === 0}
                  className="px-2 py-1 text-xs border disabled:opacity-30"
                  style={{ borderColor: "var(--border)" }}
                >
                  ⏮
                </button>
                <button
                  onClick={() => setMoveIdx((i) => Math.max(0, i - 1))}
                  disabled={moveIdx === 0}
                  className="px-3 py-1 text-xs border disabled:opacity-30"
                  style={{ borderColor: "var(--border)" }}
                >
                  ◀
                </button>
                <div
                  className="text-xs tabular-nums px-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  Coup {moveIdx} / {opening.main_line.length}
                </div>
                <button
                  onClick={() =>
                    setMoveIdx((i) => Math.min(opening.main_line.length, i + 1))
                  }
                  disabled={moveIdx === opening.main_line.length}
                  className="px-3 py-1 text-xs border disabled:opacity-30"
                  style={{ borderColor: "var(--border)" }}
                >
                  ▶
                </button>
                <button
                  onClick={() => setMoveIdx(opening.main_line.length)}
                  disabled={moveIdx === opening.main_line.length}
                  className="px-2 py-1 text-xs border disabled:opacity-30"
                  style={{ borderColor: "var(--border)" }}
                >
                  ⏭
                </button>
              </div>

              {/* Current move comment */}
              {currentMove && (
                <div
                  className="mt-4 p-4 border-l-2 max-w-lg mx-auto"
                  style={{
                    borderColor: "var(--accent)",
                    background: "var(--surface)",
                  }}
                >
                  <div
                    className="text-[10px] uppercase tracking-widest mb-1"
                    style={{ color: "var(--accent)" }}
                  >
                    Coup {moveIdx} · {currentMove.san}
                  </div>
                  {currentMove.comment && (
                    <div className="text-sm">{currentMove.comment}</div>
                  )}
                </div>
              )}
            </div>

            {/* Opening info panel */}
            <aside className="space-y-6">
              <div>
                <div
                  className="text-[10px] uppercase tracking-widest mb-1"
                  style={{ color: "var(--accent)", letterSpacing: "0.25em" }}
                >
                  {opening.color === "white" ? "Pour les blancs" : `Contre ${opening.vs}`} ·{" "}
                  {opening.eco}
                </div>
                <h2 className="text-2xl font-bold">{opening.name}</h2>
                <p
                  className="text-sm mt-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {opening.description}
                </p>
              </div>

              <div>
                <div
                  className="text-[10px] uppercase tracking-widest mb-3"
                  style={{ color: "var(--text-muted)", letterSpacing: "0.25em" }}
                >
                  Idées maîtresses
                </div>
                <ol className="space-y-3 text-sm">
                  {opening.key_ideas.map((idea, i) => (
                    <li key={i} className="flex gap-3">
                      <span
                        className="tabular-nums text-xs"
                        style={{ color: "var(--accent)" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{idea}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <div
                  className="text-[10px] uppercase tracking-widest mb-2"
                  style={{ color: "var(--text-muted)", letterSpacing: "0.25em" }}
                >
                  Ligne principale
                </div>
                <div className="text-sm font-mono flex flex-wrap gap-x-2 gap-y-1">
                  {opening.main_line.map((m, i) => {
                    const num = Math.floor(i / 2) + 1
                    const isWhite = i % 2 === 0
                    const active = i < moveIdx
                    return (
                      <span key={i} className="flex items-center gap-1">
                        {isWhite && (
                          <span
                            style={{ color: "var(--text-muted)" }}
                            className="tabular-nums"
                          >
                            {num}.
                          </span>
                        )}
                        <button
                          onClick={() => setMoveIdx(i + 1)}
                          className="hover:underline"
                          style={{
                            color: active ? "var(--text-primary)" : "var(--text-muted)",
                            fontWeight: i === moveIdx - 1 ? 700 : 400,
                          }}
                        >
                          {m.san}
                        </button>
                      </span>
                    )
                  })}
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </div>
  )
}
