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
  { id: "plateau", title: "Le plateau et les pièces" },
  { id: "mouvements", title: "Comment se déplacent les pièces" },
  { id: "speciaux", title: "Les coups spéciaux" },
  { id: "notation", title: "La notation algébrique" },
  { id: "objectif", title: "L'objectif et les fins de partie" },
]

export default function CourseRegles() {
  const meta = getCourseBySlug("regles-notation")!
  return (
    <CourseLayout meta={meta} toc={TOC}>
      <p className="mb-10" style={{ color: "var(--text-secondary)" }}>
        Ce chapitre est la base. Si tu maîtrises déjà les règles, tu peux le survoler — mais
        la <strong>notation algébrique</strong> est indispensable pour lire des cours, écrire
        tes parties et suivre les autres modules de l&apos;app.
      </p>

      <Section id="plateau" title="Le plateau et les pièces">
        <p>
          L&apos;échiquier est un carré de 8×8, alternance de cases claires et foncées. Chaque
          joueur commence avec 16 pièces : 1 roi, 1 dame, 2 tours, 2 fous, 2 cavaliers, 8 pions.
        </p>
        <p>
          Les colonnes sont notées <Notation>a</Notation> à <Notation>h</Notation> (de gauche à
          droite du côté des blancs), les rangées de <Notation>1</Notation> à{" "}
          <Notation>8</Notation> (les blancs commencent en rangée 1). Une case a donc un nom
          unique : <Notation>e4</Notation>, <Notation>h8</Notation>, etc.
        </p>
        <p>
          <strong>Placement initial :</strong> les rois blanc en <Notation>e1</Notation>, noir
          en <Notation>e8</Notation>. Les dames sur leur couleur (dame blanche en{" "}
          <Notation>d1</Notation> case blanche, dame noire en <Notation>d8</Notation> case
          noire). Tours aux coins, cavaliers à côté, fous à côté des cavaliers, pions sur la
          2ème rangée pour les blancs et 7ème pour les noirs.
        </p>
      </Section>

      <Section id="mouvements" title="Comment se déplacent les pièces">
        <SubSection title="Le pion">
          <p>
            Avance d&apos;une case en avant. Peut avancer de 2 cases à son premier mouvement.
            Capture en diagonale (une case en avant à gauche ou à droite). Ne recule jamais.
          </p>
        </SubSection>
        <SubSection title="Le cavalier (N)">
          <p>
            Se déplace en <strong>L</strong> : 2 cases dans une direction + 1 case
            perpendiculaire. C&apos;est la seule pièce qui peut sauter par-dessus d&apos;autres
            pièces.
          </p>
        </SubSection>
        <SubSection title="Le fou (B)">
          <p>
            Se déplace en diagonale, sur autant de cases que voulu. Reste toujours sur les
            cases de sa couleur d&apos;origine.
          </p>
        </SubSection>
        <SubSection title="La tour (R)">
          <p>Se déplace en ligne droite : horizontalement ou verticalement, autant de cases voulu.</p>
        </SubSection>
        <SubSection title="La dame (Q)">
          <p>La pièce la plus puissante : combine les mouvements de la tour et du fou. Diagonale, horizontale, verticale.</p>
        </SubSection>
        <SubSection title="Le roi (K)">
          <p>
            Se déplace d&apos;une seule case dans n&apos;importe quelle direction. Ne peut
            jamais se placer sur une case attaquée par une pièce adverse (règle de
            l&apos;échec).
          </p>
        </SubSection>
      </Section>

      <Section id="speciaux" title="Les coups spéciaux">
        <SubSection title="Le roque">
          <p>
            Le seul coup où deux pièces bougent en même temps. Le roi va vers la tour de deux
            cases, la tour saute par-dessus le roi pour se placer à côté.
          </p>
          <p>
            <strong>Petit roque</strong> (côté roi) : <Notation>O-O</Notation> — plus rapide,
            plus sûr, plus fréquent.
          </p>
          <p>
            <strong>Grand roque</strong> (côté dame) : <Notation>O-O-O</Notation> — plus lent,
            garde plus d&apos;options d&apos;attaque.
          </p>
          <p>Conditions : ni le roi ni la tour ne se sont déjà déplacés, aucune pièce entre
            eux, le roi ne traverse pas de case attaquée, il n&apos;est pas en échec au moment
            du roque.
          </p>
        </SubSection>

        <SubSection title="La prise en passant">
          <p>
            Quand un pion adverse avance de 2 cases et vient se placer à côté de ton pion, tu
            peux le capturer comme s&apos;il n&apos;avait avancé que d&apos;une case — mais
            <strong> uniquement au coup suivant</strong>.
          </p>
        </SubSection>

        <SubSection title="La promotion">
          <p>
            Un pion qui atteint la dernière rangée (8ème pour les blancs, 1ère pour les noirs)
            devient <strong>obligatoirement</strong> une autre pièce : dame, tour, fou ou
            cavalier. Presque toujours dame.
          </p>
          <p>
            Notation : <Notation>e8=Q</Notation> pour promouvoir en dame.
          </p>
        </SubSection>
      </Section>

      <Section id="notation" title="La notation algébrique">
        <p>C&apos;est le langage universel du jeu d&apos;échecs. Une fois maîtrisée, tu peux lire tout ouvrage, tout site.</p>

        <SubSection title="Symboles des pièces">
          <p>
            <Notation>K</Notation> = Roi (King), <Notation>Q</Notation> = Dame (Queen),{" "}
            <Notation>R</Notation> = Tour (Rook), <Notation>B</Notation> = Fou (Bishop),{" "}
            <Notation>N</Notation> = Cavalier (Knight — N car K est pris par le roi). Les pions
            n&apos;ont pas de lettre.
          </p>
        </SubSection>

        <SubSection title="Écriture d'un coup">
          <p>
            <strong>Format standard</strong> : lettre de la pièce + case de destination.
          </p>
          <Example>
            <p>
              <Notation>e4</Notation> = pion en e4. <Notation>Nf3</Notation> = cavalier en f3.{" "}
              <Notation>Bc4</Notation> = fou en c4. <Notation>O-O</Notation> = petit roque.
            </p>
          </Example>
          <p>
            <strong>Captures</strong> : <Notation>x</Notation> entre la pièce et la case.
            <Notation>Nxe5</Notation> = le cavalier capture en e5. <Notation>exd5</Notation>{" "}
            = le pion de la colonne e capture en d5.
          </p>
          <p>
            <strong>Échec</strong> : ajouter <Notation>+</Notation> à la fin (<Notation>Qh5+</Notation>).
            <strong> Mat</strong> : <Notation>#</Notation> (<Notation>Qh7#</Notation>).
          </p>
          <p>
            <strong>Désambiguïsation</strong> : si deux mêmes pièces peuvent aller sur la même
            case, on précise la colonne d&apos;origine. <Notation>Nbd2</Notation> = le cavalier
            de la colonne b va en d2.
          </p>
        </SubSection>

        <KeyIdea>
          Force-toi à noter tes parties. C&apos;est le prix d&apos;entrée pour analyser tes
          erreurs, importer tes parties dans l&apos;analyseur Stockfish, et progresser
          sérieusement.
        </KeyIdea>
      </Section>

      <Section id="objectif" title="L'objectif et les fins de partie">
        <Definition term="Échec">
          le roi est attaqué. On <strong>doit</strong> répondre : bouger le roi, bloquer
          l&apos;échec avec une pièce, ou capturer l&apos;attaquant.
        </Definition>

        <Definition term="Échec et mat">
          le roi est en échec et n&apos;a aucune réponse légale. Fin de partie, victoire de
          l&apos;attaquant.
        </Definition>

        <Definition term="Pat">
          le joueur qui doit jouer n&apos;a aucun coup légal, mais son roi n&apos;est pas en
          échec. C&apos;est une nulle. Attention : c&apos;est LA gaffe que les débutants font
          régulièrement quand ils ont une dame contre un roi seul.
        </Definition>

        <Definition term="Autres nulles">
          répétition de la même position 3 fois, 50 coups sans capture ni mouvement de pion,
          matériel insuffisant (roi + fou vs roi par exemple), ou accord mutuel.
        </Definition>
      </Section>
    </CourseLayout>
  )
}
