import CourseLayout, {
  Section,
  SubSection,
  KeyIdea,
  Definition,
  Notation,
  Example,
} from "@/components/CourseLayout"
import { getCourseBySlug } from "@/lib/courses/manifest"

const TOC = [
  { id: "quand-attaquer", title: "Quand attaquer le roi" },
  { id: "comptage", title: "Le comptage : attaquants vs défenseurs" },
  { id: "sacrifice-fou", title: "Le sacrifice classique du fou" },
  { id: "attaque-pions", title: "L'attaque de pions" },
  { id: "roi-central", title: "Le roi resté au centre" },
]

export default function CourseAttaque() {
  const meta = getCourseBySlug("attaque-roi")!
  return (
    <CourseLayout meta={meta} toc={TOC}>
      <p className="mb-10" style={{ color: "var(--text-secondary)" }}>
        Attaquer le roi est l&apos;objectif ultime. Mais ce n&apos;est pas au hasard : il y a
        des conditions à remplir. Ce chapitre te donne le cadre pour savoir <strong>quand
        attaquer</strong>, et <strong>comment le faire proprement</strong>.
      </p>

      <Section id="quand-attaquer" title="Quand attaquer le roi">
        <p>Tu peux lancer une attaque si tu remplis au moins 2 des 3 conditions :</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            <strong>Ton développement est meilleur que le sien.</strong> Tu as plus de pièces
            actives sur le flanc où tu veux attaquer.
          </li>
          <li>
            <strong>Ton roi est en sécurité.</strong> Sinon l&apos;attaque se retourne contre
            toi.
          </li>
          <li>
            <strong>Tu as un avantage structurel côté attaque.</strong> Colonne semi-ouverte,
            pion avancé, faiblesse dans la structure de pion adverse près de son roi.
          </li>
        </ol>
        <KeyIdea>
          Attaquer &laquo; parce que je veux gagner vite &raquo; est la source de 80% des
          attaques ratées à ton niveau. Vérifie que les conditions sont là avant de te
          lancer.
        </KeyIdea>
      </Section>

      <Section id="comptage" title="Le comptage : attaquants vs défenseurs">
        <p>
          La règle mathématique de l&apos;attaque : pour percer la défense d&apos;une case
          proche du roi, tu dois avoir <strong>plus d&apos;attaquants</strong> que
          l&apos;adversaire n&apos;a de défenseurs sur cette case.
        </p>
        <Example title="Comptage sur h7">
          <p>
            La case <Notation>h7</Notation> est défendue par le roi <Notation>g8</Notation>{" "}
            (1 défenseur). Si tu attaques avec la dame + un cavalier + un fou (3
            attaquants), tu gagnes en general la case. Un sacrifice devient possible.
          </p>
        </Example>
        <p>
          Compte scrupuleusement avant de sacrifier. Le sacrifice le plus enthousiaste ne
          marche pas si un défenseur peut arriver au coup suivant.
        </p>
      </Section>

      <Section id="sacrifice-fou" title="Le sacrifice classique du fou (Bxh7+)">
        <p>
          Le sacrifice le plus emblématique du jeu d&apos;échecs. Fou blanc en{" "}
          <Notation>d3</Notation>, cavalier en <Notation>f3</Notation>, dame prête à sauter.
          Roi noir roqué en <Notation>g8</Notation>.
        </p>
        <SubSection title="Conditions">
          <ul className="list-disc pl-6 space-y-1">
            <li>Un pion noir en <Notation>h7</Notation> (défendu uniquement par le roi).</li>
            <li>Cavalier blanc en <Notation>f3</Notation> prêt à sauter en <Notation>g5</Notation>.</li>
            <li>Dame blanche prête à arriver en <Notation>h5</Notation>.</li>
            <li>Le pion noir en <Notation>f6</Notation> ou fou en <Notation>e7</Notation> ne
              bloque pas les cases importantes.</li>
          </ul>
        </SubSection>
        <SubSection title="Séquence">
          <p>
            <Notation>1.Bxh7+ Kxh7 2.Ng5+ Kg8 3.Qh5</Notation> — menace{" "}
            <Notation>Qh7#</Notation>. Souvent gagne du matériel ou mate directement.
          </p>
        </SubSection>
        <KeyIdea>
          Ce sacrifice est un pattern à mémoriser. Quand la position te le suggère, calcule 2-3
          coups. Si la dame arrive avec appui du cavalier, c&apos;est presque toujours gagnant.
        </KeyIdea>
      </Section>

      <Section id="attaque-pions" title="L'attaque de pions">
        <p>
          Quand tu as roqué du même côté que l&apos;adversaire, attaquer avec des pions est
          souvent difficile (tu ouvres les lignes vers ton propre roi).
        </p>
        <p>
          Quand vous avez roqué des <strong>côtés opposés</strong>, l&apos;attaque de pions
          est le plan naturel : pousse tes pions du côté du roi adverse (typiquement
          <Notation> g4-g5</Notation>, <Notation>h4-h5</Notation>) pour ouvrir des colonnes
          contre son roi.
        </p>
        <KeyIdea>
          Roques opposés = course à qui casse le roi adverse en premier. Chaque tempo compte.
          Ne perds pas de temps à défendre — attaque tant que tu es dans les temps.
        </KeyIdea>
      </Section>

      <Section id="roi-central" title="Le roi resté au centre">
        <p>
          Si ton adversaire n&apos;a pas roqué au coup 10, il y a de fortes chances que son
          roi soit vulnérable. Ouvre les lignes centrales (<Notation>d</Notation>,{" "}
          <Notation>e</Notation>) et amène tes pièces sur ces colonnes.
        </p>
        <SubSection title="Comment ouvrir les lignes">
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Sacrifier un pion central pour ouvrir une colonne (<Notation>e5</Notation> ou{" "}
              <Notation>d5</Notation> par ex.).
            </li>
            <li>Échanger les pions au centre pour ouvrir la colonne <Notation>e</Notation>.</li>
            <li>Sacrifier une pièce mineure pour arracher les pions centraux et laisser le roi à découvert.</li>
          </ul>
        </SubSection>
      </Section>
    </CourseLayout>
  )
}
