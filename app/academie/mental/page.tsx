import CourseLayout, {
  Section,
  SubSection,
  KeyIdea,
  Definition,
} from "@/components/CourseLayout"
import { getCourseBySlug } from "@/lib/courses/manifest"

const TOC = [
  { id: "temps", title: "Gestion du temps" },
  { id: "checklist", title: "La checklist avant chaque coup" },
  { id: "analyse-post", title: "L'analyse post-partie" },
  { id: "etudier", title: "Étudier plutôt que jouer" },
  { id: "progression", title: "Ta progression semaine par semaine" },
]

export default function CourseMental() {
  const meta = getCourseBySlug("mental")!
  return (
    <CourseLayout meta={meta} toc={TOC}>
      <p className="mb-10" style={{ color: "var(--text-secondary)" }}>
        Le chapitre le plus important pour ta progression réelle. Personne ne devient meilleur
        aux échecs juste en jouant plus. Ce qui compte : la <strong>qualité</strong> de tes
        parties, ton <strong>analyse</strong> post-partie, ta <strong>discipline</strong> à
        étudier.
      </p>

      <Section id="temps" title="Gestion du temps">
        <p>
          Le zeitnot (manque de temps) est responsable d&apos;une partie énorme des défaites
          à ton niveau. Quelques règles simples :
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>
            <strong>Rapide (10 min) :</strong> vise 15-20 secondes par coup en moyenne. Ne
            passe pas plus de 1-2 minutes sur un coup important.
          </li>
          <li>
            <strong>Blitz (5 min) :</strong> ne réfléchis longuement qu&apos;aux moments
            critiques. Le reste doit être quasi-automatique — d&apos;où l&apos;importance de
            connaître les patterns tactiques par cœur.
          </li>
          <li>
            <strong>Contrôle long (15+10, 30+0) :</strong> réfléchis vraiment sur les 2-3
            coups décisifs de la partie. C&apos;est là que tu progresses.
          </li>
        </ul>
        <KeyIdea>
          Ne joue jamais un coup instinctif si tu as le temps. Le premier coup qui vient à
          l&apos;esprit est souvent bon, mais parfois catastrophique. Vérifie toujours.
        </KeyIdea>
      </Section>

      <Section id="checklist" title="La checklist avant chaque coup">
        <p>
          Avant de jouer, prends 5-10 secondes pour parcourir cette liste :
        </p>
        <ol className="list-decimal pl-6 space-y-2 my-4">
          <li>
            <strong>Y a-t-il des échecs ?</strong> (des miens, mais aussi les échecs adverses
            possibles après mon coup)
          </li>
          <li>
            <strong>Y a-t-il des captures avantageuses ?</strong>
          </li>
          <li>
            <strong>Y a-t-il des menaces ?</strong> Une pièce non défendue, un mat en 1 pour
            l&apos;adversaire ?
          </li>
          <li>
            <strong>Est-ce que mon coup laisse une pièce en prise ?</strong>
          </li>
          <li>
            <strong>Y a-t-il des tactiques dans la position ?</strong> Fork, pin, skewer,
            découverte, back rank ?
          </li>
        </ol>
        <p>
          Ces 5 questions ne prennent pas longtemps une fois automatisées. Elles éliminent
          80% des gaffes.
        </p>
      </Section>

      <Section id="analyse-post" title="L'analyse post-partie">
        <p>
          C&apos;est l&apos;étape que tout le monde skippe et qui te fait progresser 10x plus
          vite que jouer.
        </p>
        <SubSection title="Protocole en 4 étapes">
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>Sans l&apos;engine.</strong> Rejoue ta partie et écris (mentalement ou
              sur papier) ce que tu pensais à chaque coup critique. Où as-tu hésité ? Où
              as-tu joué vite ?
            </li>
            <li>
              <strong>Avec Stockfish.</strong> Fais tourner l&apos;analyse (module{" "}
              <em>Analyse PGN</em>). Regarde les blunders et les meilleures alternatives.
            </li>
            <li>
              <strong>Comprends pourquoi.</strong> Ne te contente pas de &laquo; ah oui,
              Nf6 était mieux &raquo;. Pourquoi ? Quelle idée as-tu manquée ?
            </li>
            <li>
              <strong>Retiens un pattern.</strong> Chaque partie doit t&apos;apprendre au
              moins un motif tactique ou positionnel que tu n&apos;oublies pas.
            </li>
          </ol>
        </SubSection>
        <KeyIdea>
          Analyser 1 partie en profondeur (30 min) &gt; jouer 10 parties d&apos;affilée.
          La progression vient de la compréhension, pas de la répétition aveugle.
        </KeyIdea>
      </Section>

      <Section id="etudier" title="Étudier plutôt que jouer">
        <p>
          À 1000-1500, tu devrais consacrer <strong>autant de temps à étudier qu&apos;à
          jouer</strong>, si ce n&apos;est plus. Répartition indicative :
        </p>
        <ul className="list-disc pl-6 space-y-1 my-4">
          <li><strong>40% de puzzles tactiques.</strong> C&apos;est ce qui a le plus gros ROI à ton niveau.</li>
          <li><strong>25% d&apos;analyse de tes parties.</strong> Chaque partie sérieuse analysée.</li>
          <li><strong>20% de jeu (contrôle long).</strong> Pour appliquer et voir tes leaks.</li>
          <li><strong>15% d&apos;étude théorique.</strong> Endgames, principes positionnels, quelques ouvertures.</li>
        </ul>
      </Section>

      <Section id="progression" title="Ta progression semaine par semaine">
        <p>Une semaine type qui donne des résultats :</p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>
            <strong>Chaque jour :</strong> 15-20 puzzles tactiques (5-10 min). Régularité &gt;
            volume ponctuel.
          </li>
          <li>
            <strong>2-3 fois par semaine :</strong> une partie sérieuse (contrôle 15+10 ou
            30+0) + analyse complète dans la foulée.
          </li>
          <li>
            <strong>1 fois par semaine :</strong> une session d&apos;étude sur un thème
            spécifique (une finale, une ouverture, un motif tactique).
          </li>
          <li>
            <strong>Toutes les 2 semaines :</strong> révision de tes patterns manqués sur les
            2 dernières semaines.
          </li>
        </ul>
        <KeyIdea>
          La progression aux échecs n&apos;est jamais linéaire. Tu vas plateauer plusieurs
          fois. La patience et la constance des habitudes battent toujours les burst
          d&apos;intensité.
        </KeyIdea>
      </Section>
    </CourseLayout>
  )
}
