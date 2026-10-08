/**
 * Répertoire d'ouvertures simplifié pour 1000-1500 ELO.
 * Focus : 4 systèmes complets (2 blancs / 2 noirs), pas de deep theory.
 */

export type Color = "white" | "black"

export interface OpeningMove {
  san: string // Move in SAN notation
  comment?: string // Educational note about this move
}

export interface Opening {
  id: string
  name: string
  eco: string // ECO code
  color: Color // For whom we're playing
  vs?: string // What we're playing against (for black openings)
  description: string // Overall description
  key_ideas: string[] // 2-4 core strategic ideas
  main_line: OpeningMove[] // The main sequence
  key_squares?: string[] // Important squares (visualization)
}

export const OPENINGS: Opening[] = [
  // ==================== BLANCS ====================
  {
    id: "italian",
    name: "Ouverture Italienne",
    eco: "C50",
    color: "white",
    description:
      "Ouverture classique en 1.e4. Développement rapide, pression sur f7, jeu ouvert. Idéale pour apprendre les principes.",
    key_ideas: [
      "Contrôler le centre avec e4 et développer les pièces mineures avant d'attaquer.",
      "Cibler le pion f7 (faible chez le roi noir non roqué).",
      "Roquer tôt côté roi pour la sécurité.",
      "Préparer d3 pour soutenir le pion e4, puis c3 et d4 pour ouvrir le centre.",
    ],
    key_squares: ["e4", "d4", "f7"],
    main_line: [
      { san: "e4", comment: "Contrôle du centre, ouvre les diagonales pour la dame et le fou-roi." },
      { san: "e5", comment: "Réponse symétrique classique — contrôle aussi le centre." },
      { san: "Nf3", comment: "Attaque le pion e5, développe une pièce mineure." },
      { san: "Nc6", comment: "Défend e5 et développe." },
      { san: "Bc4", comment: "Vise f7, le point faible de la position noire non roquée." },
      { san: "Bc5", comment: "Réponse symétrique — vise f2, le pendant chez les blancs." },
      { san: "c3", comment: "Prépare d4 pour ouvrir le centre. Le plan italien classique." },
      { san: "Nf6", comment: "Développe et attaque e4." },
      { san: "d4", comment: "Ouvre le centre pendant que les noirs sont sous-développés." },
    ],
  },
  {
    id: "london",
    name: "Système Londonien",
    eco: "D02",
    color: "white",
    description:
      "Système ultra-solide en 1.d4. Même setup contre presque tout ce que jouent les noirs. Idéal pour économiser sa mémoire théorique.",
    key_ideas: [
      "Développement automatique : d4, Bf4, e3, Nf3, Bd3, c3, Nbd2, O-O.",
      "Prise de contrôle des cases noires du centre (e5, c5).",
      "Structure de pion en pyramide (c3-d4-e3) très solide.",
      "Attaque tardive côté roi ou minorité côté dame selon la structure adverse.",
    ],
    key_squares: ["d4", "e5", "f4"],
    main_line: [
      { san: "d4", comment: "Coup principal — occupe le centre." },
      { san: "d5", comment: "Réponse classique symétrique." },
      { san: "Bf4", comment: "Sort le fou avant e3 pour l'activer. Marque de fabrique du Londonien." },
      { san: "Nf6", comment: "Développement standard." },
      { san: "e3", comment: "Ouvre la diagonale pour le fou-roi et prépare Nf3." },
      { san: "e6", comment: "Prépare le développement du fou-roi noir." },
      { san: "Nf3", comment: "Développe et contrôle e5." },
      { san: "Bd6", comment: "Défie le fou blanc sur f4." },
      { san: "Bg3", comment: "Recule pour éviter l'échange (le fou de f4 vaut beaucoup dans le Londonien)." },
    ],
  },

  // ==================== NOIRS ====================
  {
    id: "caro-kann",
    name: "Défense Caro-Kann",
    eco: "B12",
    color: "black",
    vs: "1.e4",
    description:
      "Défense solide contre 1.e4. Structure claire, plans stratégiques nets. Moins tactique que la Sicilienne mais plus facile à apprendre.",
    key_ideas: [
      "Contester le centre avec c6 puis d5 — sans exposer le roi comme dans la Française.",
      "Le fou de cases claires (c8) sort librement avant d'être bloqué par ...e6.",
      "Endgame favorable si les blancs ne pressent pas — structure très saine.",
      "Éviter les complications tactiques, jouer la position.",
    ],
    key_squares: ["c6", "d5", "f5"],
    main_line: [
      { san: "e4", comment: "Coup blanc classique." },
      { san: "c6", comment: "Prépare d5 sans bloquer le fou c8. C'est l'idée maîtresse de la Caro-Kann." },
      { san: "d4", comment: "Occupe le centre." },
      { san: "d5", comment: "Défie le centre blanc." },
      { san: "Nc3", comment: "Développe et défend e4. La variante classique." },
      { san: "dxe4", comment: "Prend le pion et simplifie." },
      { san: "Nxe4", comment: "Reprend avec le cavalier, centre allégé." },
      { san: "Bf5", comment: "Le fou sort AVANT e6 — c'est la grande idée. Il attaque le cavalier." },
      { san: "Ng3", comment: "Chasse le fou." },
    ],
  },
  {
    id: "slav",
    name: "Défense Slave",
    eco: "D10",
    color: "black",
    vs: "1.d4",
    description:
      "Défense solide contre 1.d4. Garde le fou de cases claires actif (contrairement à la QGD). Structure de pion robuste.",
    key_ideas: [
      "Défendre d5 avec c6 au lieu de e6 — laisse le fou c8 libre.",
      "Structure de pion solide, difficile à casser pour les blancs.",
      "Plans typiques : ...Bf5 ou ...Bg4 pour activer le fou, puis développement classique.",
      "Éviter les tempêtes tactiques, viser un endgame égal.",
    ],
    key_squares: ["c6", "d5", "e6"],
    main_line: [
      { san: "d4", comment: "Coup blanc principal." },
      { san: "d5", comment: "Réponse symétrique classique." },
      { san: "c4", comment: "Gambit dame — attaque le centre noir." },
      { san: "c6", comment: "Défend d5 sans bloquer le fou de cases claires. C'est la Slave." },
      { san: "Nf3", comment: "Développement calme, évite les complications." },
      { san: "Nf6", comment: "Réponse symétrique." },
      { san: "Nc3", comment: "Développement standard." },
      { san: "dxc4", comment: "Prend le pion — la variante Slave semi-acceptée." },
      { san: "a4", comment: "Empêche ...b5 qui défendrait le pion c4." },
    ],
  },
]

export function getOpening(id: string): Opening | undefined {
  return OPENINGS.find((o) => o.id === id)
}
