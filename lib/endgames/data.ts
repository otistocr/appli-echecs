/**
 * Endgames essentiels pour 1000-1500 ELO.
 * Chaque endgame : position, concept, solution optimale pour le héros.
 * L'adversaire joue automatiquement le meilleur coup.
 */

export type EndgameCategory =
  | "elementary_mate"
  | "pawn_endgame"
  | "rook_endgame"
  | "practical"

export interface Endgame {
  id: string
  name: string
  category: EndgameCategory
  fen: string
  side: "white" | "black"
  goal: string
  concepts: string[]
  solution: string[] // Alternating hero + opponent moves
  hint: string
}

export const ENDGAMES: Endgame[] = [
  // ==================== ELEMENTARY MATES ====================
  {
    id: "kq-vs-k-basic",
    name: "Mat élémentaire — Roi + Dame vs Roi",
    category: "elementary_mate",
    fen: "8/8/8/3k4/8/8/2Q5/3K4 w - - 0 1",
    side: "white",
    goal: "Mater en 8 coups maximum",
    concepts: [
      "Contraindre le roi adverse à un bord de l'échiquier avec la dame.",
      "Attention à ne pas pater le roi noir (dame à un pas — jamais).",
      "Amener ton roi en soutien pour livrer le mat.",
      "Le mat final est toujours dame protégée par le roi, roi adverse coincé.",
    ],
    solution: [
      "Qc4",
      "Kd6",
      "Kd2",
      "Ke5",
      "Qd4+",
      "Ke6",
      "Kd3",
      "Kf5",
      "Qe4+",
      "Kf6",
      "Kd4",
      "Kg5",
      "Qf5+",
      "Kh4",
      "Qg4#",
    ],
    hint: "Utilise la dame comme un cavalier — reste à une case du roi adverse pour restreindre sans pater.",
  },
  {
    id: "kr-vs-k-basic",
    name: "Mat élémentaire — Roi + Tour vs Roi",
    category: "elementary_mate",
    fen: "8/8/8/3k4/8/8/8/R3K3 w - - 0 1",
    side: "white",
    goal: "Mater par la méthode de l'échelle",
    concepts: [
      "Utiliser la tour pour couper le roi adverse d'une ligne (colonne ou rangée).",
      "Amener son roi pour l'affronter en opposition.",
      "Faire tomber le roi adverse rangée après rangée (mat de l'échelle).",
      "Le mat final : roi adverse sur le bord, ton roi en opposition, ta tour livre l'échec.",
    ],
    solution: [
      "Rd1+",
      "Ke5",
      "Ke2",
      "Ke4",
      "Rd4+",
      "Ke5",
      "Ke3",
      "Kf5",
      "Rd5+",
      "Kg4",
      "Kf2",
      "Kh4",
      "Rd4+",
      "Kh5",
      "Kg3",
      "Kg5",
      "Rd5+",
    ],
    hint: "Couper d'abord la colonne, puis pousser le roi vers le bord avec ton propre roi en soutien.",
  },

  // ==================== PAWN ENDGAMES ====================
  {
    id: "opposition-kpk",
    name: "Opposition — Roi + Pion vs Roi",
    category: "pawn_endgame",
    fen: "8/8/8/4k3/8/4K3/4P3/8 w - - 0 1",
    side: "white",
    goal: "Promouvoir le pion et gagner",
    concepts: [
      "L'opposition : les deux rois face à face avec une case entre eux et à l'adversaire de bouger.",
      "Avoir l'opposition = forcer l'adversaire à céder du terrain.",
      "Le roi doit précéder le pion — jamais le pousser sans soutien royal.",
      "Règle du carré : si le roi adverse est dans le carré du pion, il peut le rattraper.",
    ],
    solution: [
      "Kd4",
      "Kd6",
      "e4",
      "Ke6",
      "e5",
      "Kd7",
      "Kd5",
      "Ke7",
      "e6",
      "Kd8",
      "Kd6",
    ],
    hint: "Prendre l'opposition (Kd4 face à Kd6), puis avancer avec soutien du roi.",
  },
  {
    id: "square-rule",
    name: "Règle du carré",
    category: "pawn_endgame",
    fen: "4k3/8/8/8/8/8/P7/4K3 w - - 0 1",
    side: "white",
    goal: "Promouvoir le pion — le roi noir peut-il l'attraper ?",
    concepts: [
      "Trace un carré depuis le pion jusqu'à sa case de promotion. Si le roi adverse peut entrer dans ce carré, il peut arrêter le pion.",
      "Ici, le pion sur a2 va sur a8 — le carré est a2-a8-g8-g2.",
      "Le roi noir en e8 est en dehors du carré. Il ne peut pas rattraper.",
      "Solution : pousser le pion à toute vitesse.",
    ],
    solution: ["a4", "Kd7", "a5", "Kc6", "a6", "Kb6", "a7", "Kb7", "a8=Q+"],
    hint: "Compte les cases entre le pion et la promotion. Compare avec la distance du roi adverse.",
  },

  // ==================== ROOK ENDGAMES ====================
  {
    id: "lucena",
    name: "Position de Lucena — construire le pont",
    category: "rook_endgame",
    fen: "1K6/1P6/8/8/8/8/r7/1k4R1 w - - 0 1",
    side: "white",
    goal: "Promouvoir le pion en construisant le pont",
    concepts: [
      "Position gagnante fondamentale : ton roi devant ton pion (7e rangée), près de la promotion.",
      "L'idée du pont : placer ta tour sur la 4e rangée pour bloquer les échecs latéraux quand le roi sortira.",
      "Une fois le pont construit, le roi sort et le pion promeut avec la tour qui protège des échecs.",
      "L'une des positions les plus importantes du endgame de tour.",
    ],
    solution: [
      "Rg4",
      "Ra1",
      "Kc7",
      "Rc1+",
      "Kb6",
      "Rb1+",
      "Kc6",
      "Rc1+",
      "Kd5",
      "Rb1",
      "Rd4",
      "Rxb7",
      "Kxb7",
    ],
    hint: "Ta tour va sur g4 pour préparer le pont. Puis roi qui sort de la 8e rangée.",
  },
  {
    id: "philidor",
    name: "Position de Philidor — défense passive",
    category: "rook_endgame",
    fen: "4k3/R7/4P3/4K3/8/8/8/2r5 b - - 0 1",
    side: "black",
    goal: "Défendre la nulle (position théoriquement nulle)",
    concepts: [
      "Position nulle fondamentale : ta tour bloque la 3e rangée (depuis ta perspective).",
      "Tant que le pion adverse n'a pas atteint la 6e rangée, tu joues Ra6 (ou équivalent) pour bloquer le roi.",
      "Quand le pion arrive en 6e, tu descends ta tour à Ra1 pour donner des échecs latéraux.",
      "Défense en deux temps : bloquer, puis contre-attaquer.",
    ],
    solution: ["Rc6", "Ra8+", "Kd7", "Rd8+", "Ke7"],
    hint: "Défense passive : bloque avec Rc6, attends que le pion avance, puis passe à l'attaque avec des échecs.",
  },
]

export function getEndgame(id: string): Endgame | undefined {
  return ENDGAMES.find((e) => e.id === id)
}

export const CATEGORY_LABELS: Record<EndgameCategory, string> = {
  elementary_mate: "Mats élémentaires",
  pawn_endgame: "Finales de pions",
  rook_endgame: "Finales de tours",
  practical: "Pratique",
}
