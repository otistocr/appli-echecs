"use client"

import Link from "next/link"
import { useEffect, useState, useMemo } from "react"
import Sidebar from "@/components/Sidebar"
import {
  emptyStats,
  loadStats,
  resetStats,
  estimateElo,
  getLevel,
  type UserStats,
} from "@/lib/storage"
import { PUZZLE_THEMES } from "@/lib/puzzles/data"
import { OPENINGS } from "@/lib/openings/data"
import { ENDGAMES } from "@/lib/endgames/data"

export default function StatsPage() {
  const [stats, setStats] = useState<UserStats>(emptyStats())
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setStats(loadStats())
    setLoaded(true)
  }, [])

  const elo = useMemo(() => estimateElo(stats), [stats])
  const level = useMemo(() => getLevel(elo), [elo])
  const puzzleAcc =
    stats.puzzles_total > 0
      ? Math.round((stats.puzzles_correct / stats.puzzles_total) * 100)
      : 0
  const openingAcc =
    stats.openings_moves_total > 0
      ? Math.round(
          (stats.openings_moves_correct / stats.openings_moves_total) * 100
        )
      : 0

  const days30 = useMemo(() => last30Days(stats), [stats])

  const hasActivity = stats.puzzles_total > 0 || stats.openings_moves_total > 0

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
            <span style={{ color: "var(--text-primary)" }}>Progression</span>
          </div>
          <button
            onClick={() => {
              if (confirm("Réinitialiser toutes les stats ?")) {
                resetStats()
                setStats(emptyStats())
              }
            }}
            className="text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Reset stats
          </button>
        </header>

        <div className="px-6 sm:px-10 py-10 max-w-5xl">
          <header className="mb-8">
            <div
              className="flex items-center gap-3 text-xs uppercase tracking-widest mb-2"
              style={{ color: "var(--accent)", letterSpacing: "0.3em" }}
            >
              <span className="text-lg">♟</span>
              <span>Ta progression</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Où tu en es
            </h1>
            <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
              ELO estimé, précision par thème, ouvertures maîtrisées, endgames complétés.
              Tout local — jamais transmis.
            </p>
          </header>

          {loaded && !hasActivity && (
            <div
              className="p-6 border text-sm space-y-3"
              style={{ borderColor: "var(--border)", background: "var(--surface)" }}
            >
              <div>Aucune activité enregistrée. Commence par des puzzles pour voir tes stats se remplir.</div>
              <Link
                href="/puzzles"
                className="inline-block px-4 py-2 text-xs uppercase tracking-widest font-semibold border"
                style={{
                  background: "var(--accent)",
                  color: "var(--bg-deep)",
                  borderColor: "var(--accent)",
                }}
              >
                Aller aux puzzles →
              </Link>
            </div>
          )}

          {loaded && hasActivity && (
            <>
              {/* Level card */}
              <section
                className="p-5 sm:p-6 border mb-6"
                style={{
                  borderColor: level.color,
                  background: "color-mix(in srgb, var(--accent) 6%, var(--bg-deep))",
                }}
              >
                <div className="flex items-baseline justify-between">
                  <div>
                    <div
                      className="text-[10px] uppercase tracking-widest"
                      style={{ color: "var(--text-muted)", letterSpacing: "0.25em" }}
                    >
                      Niveau estimé
                    </div>
                    <div
                      className="text-3xl sm:text-4xl font-semibold mt-1"
                      style={{ color: level.color }}
                    >
                      {level.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-[10px] uppercase tracking-widest"
                      style={{ color: "var(--text-muted)", letterSpacing: "0.25em" }}
                    >
                      ELO puzzle
                    </div>
                    <div
                      className="text-3xl sm:text-4xl font-semibold tabular-nums mt-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {elo}
                    </div>
                  </div>
                </div>
                {level.next && (
                  <div
                    className="mt-3 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {level.next - elo} points avant le niveau suivant. Estimé sur tes 20
                    meilleurs puzzles récents.
                  </div>
                )}
              </section>

              {/* Quick metrics */}
              <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <Metric label="Puzzles" value={stats.puzzles_total} sub={`${puzzleAcc}% précision`} />
                <Metric label="Streak actuel" value={stats.puzzles_streak} sub={`best ${stats.puzzles_best_streak}`} />
                <Metric label="Score" value={stats.puzzles_score} />
                <Metric
                  label="Endgames"
                  value={`${stats.endgames_completed.length}/${ENDGAMES.length}`}
                />
              </section>

              {/* 30 days chart */}
              <section className="mb-10">
                <h2 className="text-lg font-semibold mb-3">Activité — 30 derniers jours</h2>
                <div
                  className="p-4 border"
                  style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                >
                  <div className="flex items-end gap-[2px] h-32">
                    {days30.map((d) => {
                      const height = d.max > 0 ? (d.puzzles / d.max) * 100 : 0
                      const acc =
                        d.puzzles > 0 ? d.correct / d.puzzles : null
                      const color =
                        d.puzzles === 0
                          ? "var(--surface-2)"
                          : acc && acc >= 0.75
                            ? "#6cb98d"
                            : acc && acc >= 0.5
                              ? "var(--accent)"
                              : "#d47862"
                      return (
                        <div
                          key={d.date}
                          className="flex-1 rounded-t"
                          style={{
                            background: color,
                            height: `${Math.max(3, height)}%`,
                          }}
                          title={`${d.date} : ${d.puzzles} puzzles${
                            d.puzzles > 0
                              ? ` (${Math.round((acc ?? 0) * 100)}%)`
                              : ""
                          }`}
                        />
                      )
                    })}
                  </div>
                  <div
                    className="flex justify-between text-[10px] mt-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span>{days30[0].date}</span>
                    <span>{days30[days30.length - 1].date}</span>
                  </div>
                </div>
              </section>

              {/* Themes breakdown */}
              <section className="mb-10">
                <h2 className="text-lg font-semibold mb-3">Précision par thème tactique</h2>
                <div className="space-y-2">
                  {PUZZLE_THEMES.map((t) => {
                    const s = stats.puzzles_by_theme[t.value]
                    if (!s || s.attempted === 0) return null
                    const acc = Math.round((s.correct / s.attempted) * 100)
                    return (
                      <div
                        key={t.value}
                        className="p-3 border grid grid-cols-[1fr_60px_auto] gap-3 items-center"
                        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                      >
                        <div>
                          <div className="text-sm font-medium">{t.label}</div>
                          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                            {s.correct}/{s.attempted} · best {s.best_rating_solved}
                          </div>
                        </div>
                        <div className="h-1.5 rounded overflow-hidden" style={{ background: "var(--surface-2)" }}>
                          <div
                            className="h-full"
                            style={{
                              background:
                                acc >= 75 ? "#6cb98d" : acc >= 50 ? "var(--accent)" : "#d47862",
                              width: `${acc}%`,
                            }}
                          />
                        </div>
                        <div
                          className="text-sm font-semibold tabular-nums w-10 text-right"
                          style={{ color: "var(--accent)" }}
                        >
                          {acc}%
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>

              {/* Openings breakdown */}
              {stats.openings_moves_total > 0 && (
                <section className="mb-10">
                  <h2 className="text-lg font-semibold mb-1">Ouvertures</h2>
                  <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                    {openingAcc}% de coups théoriques justes sur {stats.openings_moves_total} tentatives.
                  </p>
                  <div className="space-y-2">
                    {OPENINGS.map((o) => {
                      const s = stats.openings_by_id[o.id]
                      if (!s || s.total === 0) return null
                      const acc = Math.round((s.correct / s.total) * 100)
                      return (
                        <div
                          key={o.id}
                          className="p-3 border grid grid-cols-[1fr_60px_auto] gap-3 items-center"
                          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                        >
                          <div className="text-sm font-medium">{o.name}</div>
                          <div className="h-1.5 rounded overflow-hidden" style={{ background: "var(--surface-2)" }}>
                            <div
                              className="h-full"
                              style={{
                                background:
                                  acc >= 75 ? "#6cb98d" : acc >= 50 ? "var(--accent)" : "#d47862",
                                width: `${acc}%`,
                              }}
                            />
                          </div>
                          <div
                            className="text-sm font-semibold tabular-nums w-10 text-right"
                            style={{ color: "var(--accent)" }}
                          >
                            {acc}%
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}

              {/* Endgames + Analyses */}
              <section className="grid sm:grid-cols-2 gap-4">
                <div
                  className="p-4 border"
                  style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                >
                  <div
                    className="text-[10px] uppercase tracking-widest mb-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Endgames complétés
                  </div>
                  <ul className="text-sm space-y-1">
                    {ENDGAMES.map((eg) => {
                      const done = stats.endgames_completed.includes(eg.id)
                      return (
                        <li
                          key={eg.id}
                          className="flex items-center gap-2"
                          style={{
                            color: done ? "var(--text-primary)" : "var(--text-muted)",
                          }}
                        >
                          <span style={{ color: done ? "#6cb98d" : "var(--text-muted)" }}>
                            {done ? "✓" : "○"}
                          </span>
                          <span>{eg.name}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
                <div
                  className="p-4 border"
                  style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                >
                  <div
                    className="text-[10px] uppercase tracking-widest mb-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Analyses PGN
                  </div>
                  <div className="text-4xl font-semibold tabular-nums" style={{ color: "var(--accent)" }}>
                    {stats.analyses_run}
                  </div>
                  <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    parties analysées avec Stockfish
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function Metric({
  label,
  value,
  sub,
}: {
  label: string
  value: number | string
  sub?: string
}) {
  return (
    <div
      className="p-3 border"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <div
        className="text-[10px] uppercase tracking-widest"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </div>
      <div
        className="text-2xl font-semibold tabular-nums mt-1"
        style={{ color: "var(--text-primary)" }}
      >
        {value}
      </div>
      {sub && (
        <div className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
          {sub}
        </div>
      )}
    </div>
  )
}

function last30Days(stats: UserStats): {
  date: string
  puzzles: number
  correct: number
  max: number
}[] {
  const out = []
  const today = new Date()
  let max = 1
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    const day = stats.daily[key] ?? { puzzles: 0, correct: 0 }
    max = Math.max(max, day.puzzles)
    out.push({ date: key.slice(5), puzzles: day.puzzles, correct: day.correct, max: 0 })
  }
  return out.map((d) => ({ ...d, max }))
}
