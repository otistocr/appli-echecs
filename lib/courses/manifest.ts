export type CourseLevel = "Débutant" | "Intermédiaire" | "Avancé"

export interface CourseMeta {
  slug: string
  title: string
  subtitle: string
  level: CourseLevel
  duration_min: number
  available: boolean
  order: number
}

export const COURSES: CourseMeta[] = [
  {
    slug: "regles-notation",
    title: "1. Les règles et la notation",
    subtitle: "Mouvement des pièces, coups spéciaux, notation algébrique",
    level: "Débutant",
    duration_min: 25,
    available: true,
    order: 1,
  },
  {
    slug: "principes-ouverture",
    title: "2. Principes d'ouverture",
    subtitle: "Contrôle du centre, développement, sécurité du roi",
    level: "Débutant",
    duration_min: 30,
    available: true,
    order: 2,
  },
  {
    slug: "tactiques",
    title: "3. Tactiques fondamentales",
    subtitle: "Fork, pin, skewer, attaque découverte, déflexion",
    level: "Intermédiaire",
    duration_min: 35,
    available: true,
    order: 3,
  },
  {
    slug: "finales",
    title: "4. Finales élémentaires",
    subtitle: "Opposition, mats basiques, règle du carré, K+P vs K",
    level: "Intermédiaire",
    duration_min: 40,
    available: true,
    order: 4,
  },
  {
    slug: "positionnel",
    title: "5. Principes positionnels",
    subtitle: "Structures de pions, cases fortes, colonnes ouvertes",
    level: "Intermédiaire",
    duration_min: 35,
    available: true,
    order: 5,
  },
  {
    slug: "attaque-roi",
    title: "6. L'attaque du roi",
    subtitle: "Sacrifices classiques, ouverture des lignes, comptage",
    level: "Avancé",
    duration_min: 35,
    available: true,
    order: 6,
  },
  {
    slug: "mental",
    title: "7. Mental et progression",
    subtitle: "Gestion du temps, analyse post-partie, étude vs jeu",
    level: "Débutant",
    duration_min: 25,
    available: true,
    order: 7,
  },
]

export function getCourseBySlug(slug: string): CourseMeta | undefined {
  return COURSES.find((c) => c.slug === slug)
}
