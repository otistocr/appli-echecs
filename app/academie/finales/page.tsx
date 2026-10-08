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
  { id: "roi-actif", title: "Le roi devient une pièce active" },
  { id: "opposition", title: "L'opposition, notion clé" },
  { id: "carre", title: "La règle du carré" },
  { id: "mats-elementaires", title: "Les mats élémentaires" },
  { id: "kpk", title: "Roi + pion contre roi" },
  { id: "tours", title: "Aperçu des finales de tours" },
]

export default function CourseFinales() {
  const meta = getCourseBySlug("finales")!
  return (
    <CourseLayout meta={meta} toc={TOC}>
      <p className="mb-10" style={{ color: "var(--text-secondary)" }}>
        À ton niveau, gagner une finale simple contre un adversaire qui ne connaît pas la
        technique fait gagner de l&apos;ELO à chaque partie serrée. Ce chapitre couvre les
        positions <strong>obligatoires</strong> à connaître par cœur.
      </p>

      <Section id="roi-actif" title="Le roi devient une pièce active">
        <p>
          En début de partie, le roi se cache. En finale, il devient l&apos;une des pièces
          les plus fortes du plateau. La règle absolue : <strong>en finale, active ton roi
          au centre</strong>.
        </p>
        <KeyIdea>
          Perdre un tempo pour amener ton roi au centre vaut souvent plus qu&apos;un pion. Le
          roi actif transforme des positions égales en gains.
        </KeyIdea>
      </Section>

      <Section id="opposition" title="L'opposition, notion clé">
        <Definition term="Opposition">
          les deux rois sont face à face, avec exactement une case entre eux, et
          c&apos;est à l&apos;adversaire de bouger. Celui qui doit bouger &laquo; perd
          l&apos;opposition &raquo; et doit céder du terrain.
        </Definition>
        <Example>
          <p>
            Blanc <Notation>Ke5</Notation>, Noir <Notation>Ke7</Notation>, trait aux noirs.
            Les noirs doivent bouger. Ils ne peuvent pas rester en face → le roi blanc peut
            avancer vers <Notation>d6</Notation> ou <Notation>f6</Notation>.
          </p>
        </Example>
        <SubSection title="Comment prendre l'opposition">
          <p>
            Approche ton roi de sorte qu&apos;il y ait un nombre impair de cases entre les
            deux rois quand tu joues. Cela force l&apos;adversaire à bouger d&apos;abord.
          </p>
        </SubSection>
        <KeyIdea>
          Sans l&apos;opposition, tu ne peux pas gagner K+P vs K dans les positions litigieuses.
          C&apos;est LA notion à maîtriser en finale.
        </KeyIdea>
      </Section>

      <Section id="carre" title="La règle du carré">
        <Definition term="Règle du carré">
          trace mentalement un carré depuis le pion passé jusqu&apos;à sa case de promotion.
          Si le roi adverse peut entrer dans ce carré, il peut rattraper le pion. Sinon, le
          pion promeut.
        </Definition>
        <Example>
          <p>
            Pion blanc en <Notation>a3</Notation>, cases de promotion <Notation>a8</Notation>.
            Le carré est <Notation>a3-a8-f8-f3</Notation> (5×5 cases). Si le roi noir est en
            <Notation>g5</Notation>, il est en dehors du carré → il ne peut pas attraper le
            pion. Si le roi noir est en <Notation>e6</Notation>, il est dans le carré → il
            peut.
          </p>
        </Example>
        <SubSection title="Astuce mentale">
          <p>
            Compte les cases entre le pion et sa promotion. Compare avec la distance en cases
            entre le roi adverse et la même colonne. Si le pion est plus près (ou à
            égalité + trait à celui qui bouge), le pion passe.
          </p>
        </SubSection>
      </Section>

      <Section id="mats-elementaires" title="Les mats élémentaires">
        <SubSection title="Roi + Dame vs Roi">
          <p>
            Simple mais piégé : ne pate pas ton adversaire. Garde la dame à une case du roi
            adverse (pas plus près) pour le restreindre sans le pater. Amène ton roi en
            soutien. Livre le mat avec la dame protégée.
          </p>
        </SubSection>
        <SubSection title="Roi + Tour vs Roi">
          <p>
            La méthode de l&apos;échelle : la tour coupe le roi d&apos;une ligne, ton roi
            avance en opposition, puis tu &laquo; pousses &raquo; le roi adverse rangée après
            rangée jusqu&apos;au bord. Mat final avec le roi opposant.
          </p>
        </SubSection>
        <SubSection title="Roi + 2 Fous vs Roi">
          <p>
            Plus technique, à connaître pour le sport. Les deux fous coopèrent pour repousser
            le roi vers un coin.
          </p>
        </SubSection>
        <SubSection title="Roi + Fou + Cavalier vs Roi">
          <p>
            Le mat le plus difficile — technique de la triangulation Delétang. À ton niveau,
            savoir juste que c&apos;est gagnant suffit. Va t&apos;entraîner uniquement si tu
            adores la technique.
          </p>
        </SubSection>
      </Section>

      <Section id="kpk" title="Roi + pion contre roi">
        <p>
          La finale la plus commune. Le principe clé : <strong>le roi précède toujours son
          pion</strong>. Ne pousse jamais un pion sans que ton roi soit devant ou à côté.
        </p>
        <SubSection title="Positions gagnantes vs nulles">
          <p>
            <strong>Gagnant :</strong> ton roi est devant le pion, sur la 6ème rangée
            (compté depuis toi). Tu gagnes indépendamment de l&apos;opposition.
          </p>
          <p>
            <strong>Litigieux :</strong> ton roi est devant le pion mais sur les 3-4-5ème
            rangées. Il faut avoir l&apos;opposition pour gagner.
          </p>
          <p>
            <strong>Nul :</strong> ton pion est plus avancé que ton roi ET le roi adverse est
            devant le pion — le roi adverse peut souvent tenir avec l&apos;opposition.
          </p>
        </SubSection>
        <KeyIdea>
          Pour promouvoir, ton roi doit atteindre la case-clé de ton pion. Les cases-clés
          d&apos;un pion sur X sont X+2 rangée sur les colonnes voisines. Pour un pion en{" "}
          <Notation>e4</Notation>, les cases-clés sont <Notation>d6, e6, f6</Notation>.
        </KeyIdea>
      </Section>

      <Section id="tours" title="Aperçu des finales de tours">
        <p>
          Les finales de tours sont les plus fréquentes en pratique. Deux positions à connaître :
        </p>
        <SubSection title="Position de Lucena">
          <p>
            La position gagnante fondamentale K+R+P vs K+R. Ton roi bloque la case de
            promotion, ton pion est en 7ème rangée. Tu construis un &laquo; pont &raquo; avec
            ta tour pour empêcher les échecs latéraux quand ton roi sort.
          </p>
        </SubSection>
        <SubSection title="Position de Philidor">
          <p>
            La position de nulle fondamentale K+R vs K+R+P. Tu défends passivement en bloquant
            la 3ème rangée (depuis ta perspective) avec ta tour. Quand le pion adverse arrive
            en 6ème, tu passes à l&apos;attaque avec des échecs de dos.
          </p>
        </SubSection>
        <p>Va t&apos;entraîner sur ces deux positions dans le module Endgames.</p>
      </Section>
    </CourseLayout>
  )
}
