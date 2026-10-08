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
  { id: "fourchette", title: "La fourchette (fork)" },
  { id: "clouage", title: "Le clouage (pin)" },
  { id: "enfilade", title: "L'enfilade (skewer)" },
  { id: "decouverte", title: "L'attaque à la découverte" },
  { id: "deflexion", title: "Déflexion et attraction" },
  { id: "couloir", title: "Le mat du couloir" },
  { id: "surcharge", title: "La pièce surchargée" },
]

export default function CourseTactiques() {
  const meta = getCourseBySlug("tactiques")!
  return (
    <CourseLayout meta={meta} toc={TOC}>
      <p className="mb-10" style={{ color: "var(--text-secondary)" }}>
        À 1000-1500 ELO, <strong>80% des parties se décident sur une tactique</strong> —
        une gaffe qui perd une pièce, un mat rapide, une combinaison à 2 coups. Ce chapitre
        présente les 7 motifs qui reviennent le plus souvent. Une fois assimilés, va faire
        des puzzles pour les reconnaître à vue.
      </p>

      <Section id="fourchette" title="La fourchette (fork)">
        <Definition term="Fourchette">
          une pièce (souvent le cavalier ou la dame) attaque simultanément deux pièces
          adverses. L&apos;adversaire ne peut sauver qu&apos;une seule.
        </Definition>
        <SubSection title="Fourchette du cavalier">
          <p>
            Le cavalier est le maître de la fourchette parce que ses attaques en L touchent
            souvent des pièces éloignées les unes des autres. La <strong>fourchette
            royale</strong> — cavalier qui attaque le roi et la dame simultanément — est
            classique.
          </p>
          <p>
            À chercher : cases où un cavalier attaque plusieurs pièces. Cases clés :{" "}
            <Notation>c7</Notation>, <Notation>f7</Notation>, <Notation>d6</Notation>,{" "}
            <Notation>e6</Notation> (miroir pour les noirs).
          </p>
        </SubSection>
        <KeyIdea>
          Quand tu regardes un coup de cavalier adverse, demande-toi toujours : est-ce
          qu&apos;il vient forker deux de mes pièces ?
        </KeyIdea>
      </Section>

      <Section id="clouage" title="Le clouage (pin)">
        <Definition term="Clouage absolu">
          une pièce ne peut pas bouger car elle protège le roi (elle est &laquo; clouée &raquo; sur le roi). Bouger serait un coup illégal.
        </Definition>
        <Definition term="Clouage relatif">
          une pièce peut légalement bouger, mais si elle le fait, elle expose une pièce plus
          précieuse derrière elle.
        </Definition>
        <SubSection title="Comment exploiter un clouage">
          <p>
            La pièce clouée ne peut pas défendre. Tu peux attaquer avec des pions ou des
            pièces mineures sans risquer sa contre-attaque.
          </p>
        </SubSection>
        <Example title="Ruy Lopez classique">
          <p>
            <Notation>1.e4 e5 2.Nf3 Nc6 3.Bb5</Notation> — le fou cloue le cavalier{" "}
            <Notation>c6</Notation> sur le roi <Notation>e8</Notation>. Le cavalier ne peut
            plus défendre <Notation>e5</Notation> efficacement.
          </p>
        </Example>
      </Section>

      <Section id="enfilade" title="L'enfilade (skewer)">
        <Definition term="Enfilade">
          l&apos;inverse du clouage. Tu attaques une pièce précieuse (souvent le roi ou la
          dame) qui doit bouger — et cela expose une pièce moins précieuse derrière, que tu
          peux capturer.
        </Definition>
        <Example>
          <p>
            Roi en <Notation>a8</Notation>, dame en <Notation>a1</Notation>. Tu joues{" "}
            <Notation>Ra1+</Notation> (échec au roi). Le roi bouge → tu prends la dame au
            coup suivant.
          </p>
        </Example>
      </Section>

      <Section id="decouverte" title="L'attaque à la découverte">
        <Definition term="Attaque à la découverte">
          tu bouges une pièce, et ce mouvement révèle une attaque d&apos;une autre pièce
          derrière. Deux menaces en un coup — souvent dévastateur.
        </Definition>
        <SubSection title="Cas le plus fort : l'échec à la découverte">
          <p>
            La pièce qui bouge attaque quelque chose, la pièce révélée fait échec au roi.
            L&apos;adversaire doit parer l&apos;échec — pendant ce temps la pièce mobile fait
            un dégât.
          </p>
        </SubSection>
        <KeyIdea>
          Quand tu vois une de tes pièces alignée entre une autre de tes pièces et une pièce
          adverse précieuse (roi/dame), demande-toi si tu peux la bouger avec effet.
        </KeyIdea>
      </Section>

      <Section id="deflexion" title="Déflexion et attraction">
        <Definition term="Déflexion">
          forcer une pièce adverse à quitter la case qu&apos;elle défend, généralement en la
          menaçant ou l&apos;attaquant avec quelque chose qu&apos;elle doit prendre ou fuir.
        </Definition>
        <Definition term="Attraction (decoy)">
          l&apos;inverse — attirer une pièce adverse sur une case où elle sera vulnérable
          (souvent par un sacrifice).
        </Definition>
        <Example title="Déflexion classique">
          <p>
            Le roi noir est en <Notation>g8</Notation>, sa tour en <Notation>f8</Notation>{" "}
            protège <Notation>f7</Notation>. Tu joues <Notation>Rxf7</Notation> — pour
            reprendre, le roi doit bouger de <Notation>g8</Notation>, ce qui ouvre une menace
            de mat sur la 8ème rangée.
          </p>
        </Example>
      </Section>

      <Section id="couloir" title="Le mat du couloir">
        <Definition term="Mat du couloir (back rank mate)">
          le roi adverse est coincé sur sa rangée de départ par ses propres pions
          (<Notation>f7 g7 h7</Notation>) et une tour ou dame vient l&apos;attaquer sur cette
          rangée. Sans défense sur la 8ème rangée, c&apos;est mat.
        </Definition>
        <SubSection title="Comment prévenir">
          <p>
            Toujours faire un &laquo; petit trou &raquo; pour le roi en jouant{" "}
            <Notation>h3</Notation> (ou <Notation>g3</Notation>) une fois roqué, pour éviter
            ce mat. Petite habitude, énorme retour sur investissement.
          </p>
        </SubSection>
        <KeyIdea>
          Chaque fois que tu joues une partie, vérifie régulièrement si TOI ou ton adversaire
          êtes en danger sur la 8ème rangée. C&apos;est la tactique la plus fréquente à ton
          niveau.
        </KeyIdea>
      </Section>

      <Section id="surcharge" title="La pièce surchargée">
        <Definition term="Pièce surchargée">
          une pièce a deux tâches défensives simultanées. Si tu la déloges d&apos;une, elle
          ne peut plus faire l&apos;autre.
        </Definition>
        <Example>
          <p>
            La dame noire défend à la fois <Notation>e5</Notation> (une pièce) et{" "}
            <Notation>h7</Notation> (contre un mat). Si tu forces la dame à prendre en{" "}
            <Notation>e5</Notation>, tu mates en <Notation>h7</Notation>. Si elle défend le
            mat, tu prends la pièce.
          </p>
        </Example>
      </Section>
    </CourseLayout>
  )
}
