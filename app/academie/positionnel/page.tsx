import CourseLayout, {
  Section,
  SubSection,
  KeyIdea,
  Definition,
  Notation,
} from "@/components/CourseLayout"
import { getCourseBySlug } from "@/lib/courses/manifest"

const TOC = [
  { id: "activite", title: "L'activité des pièces" },
  { id: "cases-fortes", title: "Cases fortes et avant-postes" },
  { id: "structures", title: "Les structures de pions" },
  { id: "colonnes", title: "Colonnes ouvertes" },
  { id: "paire-fous", title: "La paire de fous" },
  { id: "mauvais-fou", title: "Le mauvais fou" },
]

export default function CoursePositionnel() {
  const meta = getCourseBySlug("positionnel")!
  return (
    <CourseLayout meta={meta} toc={TOC}>
      <p className="mb-10" style={{ color: "var(--text-secondary)" }}>
        La stratégie positionnelle, c&apos;est ce qui se passe <strong>entre les
        tactiques</strong>. Quand aucune combinaison n&apos;est disponible, comment améliorer
        sa position pour créer les conditions d&apos;une tactique future ? Ce chapitre
        introduit les 5-6 concepts qui te feront jouer mieux que la moyenne à ton niveau.
      </p>

      <Section id="activite" title="L'activité des pièces">
        <p>
          Une pièce active contrôle beaucoup de cases et menace des choses. Une pièce
          passive est bloquée par ses propres pions ou celles de l&apos;adversaire.
        </p>
        <KeyIdea>
          Avant chaque coup, demande-toi : &laquo; Quelle est ma pièce la moins active ?
          Comment l&apos;améliorer ? &raquo;. C&apos;est la clé du jeu positionnel.
        </KeyIdea>
        <p>Exemples de pièces passives typiques :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Cavalier bloqué en <Notation>b1</Notation> ou <Notation>h1</Notation> parce que ton fou-dame est encore chez lui.</li>
          <li>Fou bloqué par ses propres pions (mauvais fou — voir plus bas).</li>
          <li>Tour sur une colonne fermée par des pions.</li>
          <li>Dame trop tôt sortie qui a été chassée en h5 et ne peut plus rentrer.</li>
        </ul>
      </Section>

      <Section id="cases-fortes" title="Cases fortes et avant-postes">
        <Definition term="Case forte">
          une case qui ne peut plus être attaquée par un pion adverse. Souvent située en 5ème
          ou 6ème rangée dans le camp adverse.
        </Definition>
        <Definition term="Avant-poste">
          une pièce (généralement un cavalier) installée sur une case forte. C&apos;est un
          énorme atout — le cavalier ne peut être délogé que par un échange coûteux.
        </Definition>
        <p>
          Comment créer une case forte : soit tu forces l&apos;adversaire à avancer ses pions
          (ce qui laisse des trous), soit tu échanges les pions qui pouvaient défendre la
          case.
        </p>
      </Section>

      <Section id="structures" title="Les structures de pions">
        <p>
          La structure de pions dicte les plans stratégiques. Les pièces bougent, les pions
          moins.
        </p>
        <SubSection title="Pions doublés">
          <p>
            Deux pions de la même couleur sur la même colonne. Généralement une faiblesse
            (l&apos;un ne peut pas défendre l&apos;autre), mais parfois utile pour ouvrir une
            colonne pour la tour.
          </p>
        </SubSection>
        <SubSection title="Pion isolé">
          <p>
            Pion sans pion voisin sur les colonnes adjacentes. Faiblesse — il ne peut plus
            être défendu par un pion. Souvent une cible d&apos;attaque à long terme.
          </p>
        </SubSection>
        <SubSection title="Pion arriéré">
          <p>
            Un pion qui ne peut pas avancer parce qu&apos;il serait capturé, et que ses
            voisins ont déjà avancé. Similaire à l&apos;isolé, souvent une cible.
          </p>
        </SubSection>
        <SubSection title="Pion passé">
          <p>
            Un pion sans pion adverse devant lui ni sur les colonnes voisines. Il peut
            marcher vers la promotion. Extrêmement précieux en finale — parfois une pièce
            entière est sacrifiée pour créer un pion passé lointain.
          </p>
        </SubSection>
        <SubSection title="Chaîne de pions">
          <p>
            Plusieurs pions liés en diagonale. Se défendent mutuellement. La base
            (l&apos;arrière) est le point faible.
          </p>
        </SubSection>
      </Section>

      <Section id="colonnes" title="Colonnes ouvertes et semi-ouvertes">
        <Definition term="Colonne ouverte">
          une colonne sans aucun pion. C&apos;est une autoroute pour les tours.
        </Definition>
        <Definition term="Colonne semi-ouverte">
          une colonne où tu n&apos;as pas de pion mais l&apos;adversaire en a un. Ta tour
          peut attaquer ce pion.
        </Definition>
        <KeyIdea>
          Quand une colonne s&apos;ouvre, place tes tours dessus rapidement. Le contrôle
          d&apos;une colonne ouverte est souvent un avantage structurel majeur qui se
          matérialise 10-15 coups plus tard.
        </KeyIdea>
      </Section>

      <Section id="paire-fous" title="La paire de fous">
        <Definition term="Paire de fous">
          avoir tes deux fous alors que ton adversaire n&apos;en a qu&apos;un (ou zéro).
          Statistiquement, la paire vaut environ +0,5 pion en position ouverte.
        </Definition>
        <p>
          Pourquoi ? Les deux fous contrôlent ensemble toutes les couleurs de cases,
          couvrant efficacement tout l&apos;échiquier. Un fou seul est aveugle sur la moitié
          des cases.
        </p>
        <KeyIdea>
          Si ton adversaire propose un échange fou-contre-cavalier alors que tu as les deux
          fous, réfléchis à deux fois avant d&apos;accepter. Ta paire vaut cher.
        </KeyIdea>
      </Section>

      <Section id="mauvais-fou" title="Le mauvais fou">
        <Definition term="Mauvais fou">
          un fou coincé derrière ses propres pions, qui se trouvent tous sur la même couleur
          que le fou. Il ne peut plus contrôler grand-chose.
        </Definition>
        <p>
          Exemple : ton fou est sur cases claires (blanches), et beaucoup de tes pions sont
          sur cases claires aussi (<Notation>e4, d5, f3</Notation>). Ton fou n&apos;a pas de
          diagonales libres.
        </p>
        <p>
          Solutions : échanger le mauvais fou (même contre un cavalier), le sortir de la
          chaîne, ou avancer les pions pour libérer ses diagonales.
        </p>
      </Section>
    </CourseLayout>
  )
}
