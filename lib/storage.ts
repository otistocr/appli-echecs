"use client"

import type { PuzzleTheme } from "./puzzles/data"

const STORAGE_KEY = "appli_echecs_stats_v1"

export interface ThemeStats {
  attempted: number
  correct: number
  best_rating_solved: number
}

export interface DailyStats {
  puzzles: number
  correct: number
}

export interface UserStats {
  // Puzzles
  puzzles_total: number
  puzzles_correct: number
  puzzles_score: number
  puzzles_streak: number
  puzzles_best_streak: number
  puzzles_by_theme: Record<string, ThemeStats>
  puzzles_ratings_solved: number[] // ratings of solved puzzles (for ELO estimate)
  // Openings drill
  openings_moves_correct: number
  openings_moves_total: number
  openings_by_id: Record<string, { correct: number; total: number }>
  // Endgames
  endgames_completed: string[] // ids
  // Analysis
  analyses_run: number
  // Meta
  daily: Record<string, DailyStats>
  last_seen: string | null
}

export function emptyStats(): UserStats {
  return {
    puzzles_total: 0,
    puzzles_correct: 0,
    puzzles_score: 0,
    puzzles_streak: 0,
    puzzles_best_streak: 0,
    puzzles_by_theme: {},
    puzzles_ratings_solved: [],
    openings_moves_correct: 0,
    openings_moves_total: 0,
    openings_by_id: {},
    endgames_completed: [],
    analyses_run: 0,
    daily: {},
    last_seen: null,
  }
}

export function loadStats(): UserStats {
  if (typeof window === "undefined") return emptyStats()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStats()
    return { ...emptyStats(), ...JSON.parse(raw) }
  } catch {
    return emptyStats()
  }
}

export function saveStats(stats: UserStats): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  } catch {
    /* ignore */
  }
}

export function resetStats(): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(STORAGE_KEY)
}

function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`
}

/* ============================================================
   Recording helpers
   ============================================================ */

export function recordPuzzle(
  correct: boolean,
  theme: PuzzleTheme,
  rating: number
): UserStats {
  const stats = loadStats()
  stats.puzzles_total += 1
  if (correct) {
    stats.puzzles_correct += 1
    stats.puzzles_score += 10
    stats.puzzles_streak += 1
    stats.puzzles_best_streak = Math.max(
      stats.puzzles_best_streak,
      stats.puzzles_streak
    )
    stats.puzzles_ratings_solved = [
      ...stats.puzzles_ratings_solved.slice(-49),
      rating,
    ]
  } else {
    stats.puzzles_score = Math.max(0, stats.puzzles_score - 3)
    stats.puzzles_streak = 0
  }

  const themeStats = stats.puzzles_by_theme[theme] ?? {
    attempted: 0,
    correct: 0,
    best_rating_solved: 0,
  }
  themeStats.attempted += 1
  if (correct) {
    themeStats.correct += 1
    themeStats.best_rating_solved = Math.max(
      themeStats.best_rating_solved,
      rating
    )
  }
  stats.puzzles_by_theme[theme] = themeStats

  updateDaily(stats, correct)

  saveStats(stats)
  return stats
}

export function recordOpeningMove(id: string, correct: boolean): UserStats {
  const stats = loadStats()
  stats.openings_moves_total += 1
  if (correct) stats.openings_moves_correct += 1
  const s = stats.openings_by_id[id] ?? { correct: 0, total: 0 }
  s.total += 1
  if (correct) s.correct += 1
  stats.openings_by_id[id] = s

  updateDaily(stats, correct)
  saveStats(stats)
  return stats
}

export function recordEndgameCompleted(id: string): UserStats {
  const stats = loadStats()
  if (!stats.endgames_completed.includes(id)) {
    stats.endgames_completed = [...stats.endgames_completed, id]
  }
  stats.last_seen = new Date().toISOString()
  saveStats(stats)
  return stats
}

export function recordAnalysis(): UserStats {
  const stats = loadStats()
  stats.analyses_run += 1
  stats.last_seen = new Date().toISOString()
  saveStats(stats)
  return stats
}

function updateDaily(stats: UserStats, correct: boolean) {
  const day = todayKey()
  const d = stats.daily[day] ?? { puzzles: 0, correct: 0 }
  d.puzzles += 1
  if (correct) d.correct += 1
  stats.daily[day] = d
  stats.last_seen = new Date().toISOString()
}

/* ============================================================
   Derived metrics
   ============================================================ */

export function estimateElo(stats: UserStats): number {
  const arr = stats.puzzles_ratings_solved
  if (arr.length < 5) return 800
  // Take the average of the 20 highest ratings solved recently
  const sorted = [...arr].sort((a, b) => b - a).slice(0, 20)
  const avg = sorted.reduce((s, x) => s + x, 0) / sorted.length
  return Math.round(avg)
}

export type Level = "Débutant" | "Amateur" | "Club" | "Fort" | "Expert"

export function getLevel(elo: number): {
  name: Level
  color: string
  next: number | null
} {
  if (elo < 900)
    return { name: "Débutant", color: "#8a7350", next: 900 }
  if (elo < 1200)
    return { name: "Amateur", color: "#6cb98d", next: 1200 }
  if (elo < 1500)
    return { name: "Club", color: "var(--accent)", next: 1500 }
  if (elo < 1800)
    return { name: "Fort", color: "#7fa8ce", next: 1800 }
  return { name: "Expert", color: "#c290b8", next: null }
}
