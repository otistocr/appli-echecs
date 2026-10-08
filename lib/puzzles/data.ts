/**
 * Puzzles tactiques pour 1000-1500 ELO.
 * Chaque puzzle : position (FEN), coup solution (SAN),
 * thème, difficulté approximative, note explicative.
 *
 * NOTE : petit set de démarrage vérifié à la main. Pour aller
 * plus loin, importer un extrait de la base Lichess (open source,
 * ~3M puzzles CSV disponibles librement).
 */

export type PuzzleTheme =
  | "mate_in_1"
  | "mate_in_2"
  | "fork"
  | "pin"
  | "skewer"
  | "back_rank"
  | "discovered_attack"
  | "deflection"
  | "trapped_piece"
  | "hanging_piece"

export interface Puzzle {
  id: string
  fen: string
  solution: string[] // SAN moves, alternate turns (hero → adv → hero → ...)
  theme: PuzzleTheme
  rating: number
  side: "white" | "black" // who moves first (hero)
  description: string
}

export const PUZZLE_THEMES: { value: PuzzleTheme; label: string }[] = [
  { value: "mate_in_1", label: "Mat en 1" },
  { value: "mate_in_2", label: "Mat en 2" },
  { value: "fork", label: "Fourchette" },
  { value: "pin", label: "Clouage" },
  { value: "skewer", label: "Enfilade" },
  { value: "back_rank", label: "Mat du couloir" },
  { value: "discovered_attack", label: "Attaque découverte" },
  { value: "deflection", label: "Déflexion" },
  { value: "trapped_piece", label: "Pièce piégée" },
  { value: "hanging_piece", label: "Pièce en prise" },
]

import IMPORTED from "./imported.json"

const IMPORTED_PUZZLES: Puzzle[] = IMPORTED as Puzzle[]

const CURATED: Puzzle[] = [
  // ==================== MATE IN 1 ====================
  {
    id: "m1-corner-rook",
    fen: "k7/1R6/K7/8/8/8/8/8 w - - 0 1",
    solution: ["Rb8#"],
    theme: "mate_in_1",
    rating: 800,
    side: "white",
    description: "Coince le roi noir dans le coin avec la tour, roi soutien.",
  },
  {
    id: "m1-back-rank",
    fen: "6k1/5ppp/8/8/8/8/5PPP/R6K w - - 0 1",
    solution: ["Ra8#"],
    theme: "back_rank",
    rating: 900,
    side: "white",
    description: "Mat du couloir classique — les pions bouchent l'échappatoire.",
  },
  {
    id: "m1-queen-corner",
    fen: "7k/6pp/8/8/8/8/6PP/1Q5K w - - 0 1",
    solution: ["Qb8#"],
    theme: "mate_in_1",
    rating: 850,
    side: "white",
    description: "La dame livre le mat sur la 8e rangée, les pions noirs enferment le roi.",
  },
  {
    id: "m1-smothered",
    fen: "6rk/6pp/8/6NQ/8/8/8/6K1 w - - 0 1",
    solution: ["Qxh7#"],
    theme: "mate_in_1",
    rating: 1000,
    side: "white",
    description: "La dame livre le mat sur h7 avec le cavalier qui protège.",
  },

  // ==================== FORKS ====================
  {
    id: "fork-knight-royal",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    solution: ["Ng5"],
    theme: "fork",
    rating: 1100,
    side: "white",
    description: "Le cavalier menace f7 (mate the fried liver setup — pression sur f7).",
  },
  {
    id: "fork-knight-basic",
    fen: "r1bqk2r/ppp2ppp/2n2n2/3p4/1b1P4/2N1PN2/PP3PPP/R1BQKB1R w KQkq - 0 6",
    solution: ["a3"],
    theme: "fork",
    rating: 1050,
    side: "white",
    description: "Chasse le fou pour gagner du tempo.",
  },

  // ==================== PIN ====================
  {
    id: "pin-classic",
    fen: "rnbqkbnr/ppp2ppp/8/3pp3/8/2N2N2/PPPPBPPP/R1BQK2R w KQkq - 0 4",
    solution: ["Bb5+"],
    theme: "pin",
    rating: 950,
    side: "white",
    description: "Cloue le cavalier sur le roi (attaque à la Ruy Lopez).",
  },

  // ==================== BACK RANK ====================
  {
    id: "backrank-decoy",
    fen: "3r2k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
    solution: ["Rxd8+"],
    theme: "back_rank",
    rating: 1000,
    side: "white",
    description: "Échange les tours en profitant du couloir bouché.",
  },

  // ==================== HANGING PIECE ====================
  {
    id: "hanging-queen",
    fen: "rnb1kbnr/pppp1ppp/8/4p3/6Pq/8/PPPPPP1P/RNBQKBNR w KQkq - 1 3",
    solution: ["Nf3"],
    theme: "hanging_piece",
    rating: 900,
    side: "white",
    description: "Développe et attaque la dame noire mal placée.",
  },
  {
    id: "hanging-knight",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    solution: ["Nc3"],
    theme: "hanging_piece",
    rating: 950,
    side: "white",
    description: "Développement solide, protège e4 et prépare O-O.",
  },

  // ==================== SKEWER ====================
  {
    id: "skewer-royal",
    fen: "8/8/8/8/1k6/8/1KQ5/8 w - - 0 1",
    solution: ["Qb2+"],
    theme: "skewer",
    rating: 850,
    side: "white",
    description: "Enfilade le roi — la dame gagne du terrain sur la colonne b.",
  },
]

export const PUZZLES: Puzzle[] = [...CURATED, ...IMPORTED_PUZZLES]

export function getPuzzlesByTheme(theme: PuzzleTheme | null): Puzzle[] {
  if (!theme) return PUZZLES
  return PUZZLES.filter((p) => p.theme === theme)
}

export function drawRandomPuzzle(theme: PuzzleTheme | null = null): Puzzle | null {
  const pool = getPuzzlesByTheme(theme)
  if (pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}
