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
  { id: "trois-principes", title: "Les trois principes cardinaux" },
  { id: "centre", title: "Contrôler le centre" },
  { id: "developpement", title: "Développer les pièces" },
  { id: "securite", title: "La sécurité du roi" },
  { id: "erreurs", title: "Les erreurs classiques" },
]

export default function CoursePrincipes() {
  const meta = getCourseBySlug("principes-ouverture")!
  return (
    <CourseLayout meta={meta} toc={TOC}>
      <p className="mb-10" style={{ color: "var(--text-secondary)" }}>
        L&apos;ouverture, ce sont les 10-15 premiers coups. À ton niveau, tu n&apos;as pas
        besoin de mémoriser des variantes — tu as besoin de respecter trois principes simples
        que 90% des joueurs 1000-1500 violent régulièrement.
      </p>

      <Section id="trois-principes" title="Les trois principes cardinaux">
        <p>Toute ouverture, quelle qu&apos;elle soit, doit répondre à ces trois questions :</p>
        <ol className="list-decimal pl-6 space-y-2 my-4">
          <li><strong>Est-ce que je contrôle le centre ?</strong></li>
          <li><strong>Est-ce que je développe mes pièces (cavaliers et fous) rapidement ?</strong></li>
          <li><strong>Est-ce que je mets mon roi en sécurité (roque) ?</strong></li>
        </ol>
        <p>
          Si tu réponds oui aux trois dans les 10 premiers coups, tu as une ouverture correcte.
          Peu importe que tu joues Italienne, Londonien ou Sicilienne.
        </p>
      </Section>

      <Section id="centre" title="Contrôler le centre">
        <p>
          Le centre, ce sont les 4 cases <Notation>d4</Notation>, <Notation>e4</Notation>,{" "}
          <Notation>d5</Notation>, <Notation>e5</Notation>. Le joueur qui contrôle le centre a
          plus de mobilité pour ses pièces et peut attaquer sur les deux flancs.
        </p>
        <SubSection title="Deux façons de le contrôler">
          <p>
            <strong>Occupation directe :</strong> tu places un pion au centre. C&apos;est
            l&apos;approche classique. <Notation>1.e4</Notation> ou <Notation>1.d4</Notation>{" "}
            comme premier coup.
          </p>
          <p>
            <strong>Contrôle indirect :</strong> tu attaques les cases centrales sans y
            placer un pion tout de suite. Défense Alekhine (<Notation>1.e4 Nf6</Notation>) ou
            Grünfeld par exemple. Approche moderne, plus complexe.
          </p>
          <p>
            <strong>Pour 1000-1500 ELO : joue l&apos;occupation directe.</strong> C&apos;est
            plus simple à comprendre et à jouer.
          </p>
        </SubSection>
      </Section>

      <Section id="developpement" title="Développer les pièces">
        <Definition term="Développement">
          sortir les pièces de leur case de départ pour qu&apos;elles contrôlent des cases et
          soient prêtes à agir. Priorité aux cavaliers et fous.
        </Definition>
        <SubSection title="Ordre à respecter">
          <ol className="list-decimal pl-6 space-y-1">
            <li><strong>Cavaliers avant les fous.</strong> Les cavaliers ont moins d&apos;options, donc leur meilleur poste (généralement f3/c3 pour les blancs) est clair. Les fous attendent de voir la structure.</li>
            <li><strong>Une pièce à la fois</strong>, pas deux fois la même. Chaque coup doit développer une nouvelle pièce.</li>
            <li><strong>Ne sors pas ta dame tôt.</strong> Elle est chère et vulnérable — les cavaliers et fous adverses vont l&apos;attaquer avec tempo.</li>
            <li><strong>Ne bouge pas plusieurs fois les pions.</strong> Chaque coup de pion en ouverture doit avoir un but précis (soutien du centre, ouverture de diagonale pour le fou).</li>
          </ol>
        </SubSection>
        <Example title="Une ouverture correcte">
          <p>
            <Notation>1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.O-O Nf6 5.d3</Notation> — Italienne
            classique.
          </p>
          <p>
            Blancs : centre (e4), 2 cavaliers, 1 fou, roi roqué. Tout en 5 coups. C&apos;est
            l&apos;idéal.
          </p>
        </Example>
      </Section>

      <Section id="securite" title="La sécurité du roi">
        <p>
          Le roi doit être à l&apos;abri avant que le combat sérieux commence. C&apos;est
          <strong> à ça que sert le roque</strong>.
        </p>
        <SubSection title="Petit roque (O-O)">
          <p>
            Rapide, plus sûr. Le roi va sur <Notation>g1</Notation>/<Notation>g8</Notation>,
            protégé par les pions <Notation>f2 g2 h2</Notation> intacts. Statistiquement le
            plus joué à haut niveau.
          </p>
        </SubSection>
        <SubSection title="Grand roque (O-O-O)">
          <p>
            Plus long à préparer (il faut sortir la dame et le fou-dame). Plus agressif car
            garde l&apos;option d&apos;attaque de pions du côté roi si l&apos;adversaire a
            fait petit roque.
          </p>
        </SubSection>
        <KeyIdea>
          Vise le roque dans les <strong>10 premiers coups</strong>. Au-delà, tu prends le
          risque de subir une attaque avec le roi au centre. La plupart des mini-parties
          perdues à ton niveau viennent de là.
        </KeyIdea>
      </Section>

      <Section id="erreurs" title="Les erreurs classiques">
        <SubSection title="1. Ouvrir avec un coup de dame">
          <p>
            <Notation>1.Qh5</Notation> (Scholar&apos;s Mate setup) vise une menace unique
            (mat en <Notation>f7</Notation>). Contre un adversaire qui connaît ses règles,
            tu perds du tempo dès le début.
          </p>
        </SubSection>
        <SubSection title="2. Développer les fous avant les cavaliers">
          <p>
            <Notation>1.b3</Notation> puis <Notation>2.Bb2</Notation> avant tout cavalier. Ce
            n&apos;est pas mauvais en soi mais tu manques d&apos;influence centrale.
          </p>
        </SubSection>
        <SubSection title="3. Ne pas roquer">
          <p>
            &laquo; Je vais attaquer d&apos;abord &raquo; — non. Tu roques d&apos;abord, tu
            attaques ensuite avec un roi en sécurité.
          </p>
        </SubSection>
        <SubSection title="4. Bouger la même pièce plusieurs fois">
          <p>
            Tu sors ton cavalier en <Notation>f3</Notation>, puis en <Notation>g5</Notation>,
            puis en <Notation>h3</Notation>. Pendant ce temps l&apos;adversaire sort 3 pièces
            et te dépasse.
          </p>
        </SubSection>
        <SubSection title="5. Prendre un pion offert = piège">
          <p>
            Les gambits (pions sacrifiés) sont souvent des pièges. Refuse le pion et
            développe. À ton niveau, la sécurité du développement vaut plus qu&apos;un pion.
          </p>
        </SubSection>
      </Section>
    </CourseLayout>
  )
}
