import Link from "next/link"
import Sidebar from "@/components/Sidebar"
import BoardDemo from "@/components/BoardDemo"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <Sidebar />

      <main className="flex-1 min-w-0 lg:ml-56">
        {/* Slim top bar */}
        <header
          className="border-b h-12 px-4 sm:px-6 flex items-center justify-between sticky top-12 lg:top-0 z-30 backdrop-blur"
          style={{
            borderColor: "var(--border)",
            background: "color-mix(in srgb, var(--bg-deep) 85%, transparent)",
          }}
        >
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>
            Home
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Nouveau · pas de progression
            </span>
          </div>
        </header>

        <div className="px-5 sm:px-8 lg:px-12 py-8 sm:py-16 max-w-6xl">
          {/* Hero */}
          <div
            className="text-xs uppercase tracking-widest mb-4"
            style={{ color: "var(--accent)", letterSpacing: "0.3em" }}
          >
            ♛ ♜ ♝ ♞ ♟  ·  Training 1000-1500 ELO
          </div>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05] mb-4 text-balance">
            Progresse aux échecs
            <br />
            <span style={{ color: "var(--accent)" }}>sans y passer ta vie.</span>
          </h1>
          <p
            className="text-lg leading-relaxed max-w-xl mb-10"
            style={{ color: "var(--text-secondary)" }}
          >
            Puzzles tactiques, ouvertures principales, endgames essentiels, analyse de tes
            parties avec Stockfish. Rien à installer, aucun compte.
          </p>

          <div className="flex flex-wrap gap-3 mb-16">
            <Link href="/puzzles" className="chip-btn">
              Commencer par un puzzle
            </Link>
            <Link href="/academie" className="chip-btn chip-btn-ghost">
              Lire l&apos;académie
            </Link>
          </div>

          {/* Interactive board + intro */}
          <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-start mb-16">
            <div>
              <div
                className="text-xs uppercase tracking-widest mb-3"
                style={{ color: "var(--text-muted)", letterSpacing: "0.25em" }}
              >
                Essaie l&apos;échiquier
              </div>
              <h2 className="text-2xl font-semibold mb-3">
                Bouge les pièces, l&apos;app valide les coups légaux.
              </h2>
              <p
                className="text-base leading-relaxed max-w-md"
                style={{ color: "var(--text-secondary)" }}
              >
                Interface simple, drag-and-drop, statut de la partie en direct. C&apos;est
                l&apos;échiquier qu&apos;on utilise partout dans l&apos;app pour les puzzles,
                l&apos;analyse et l&apos;entraînement.
              </p>
            </div>
            <BoardDemo />
          </div>

          {/* Modules preview */}
          <section
            className="border-t pt-14"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="text-xs uppercase tracking-widest mb-6"
              style={{ color: "var(--text-muted)", letterSpacing: "0.25em" }}
            >
              Ce que tu peux faire
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <ModuleGroup
                icon="♛"
                title="Étudier"
                items={[
                  { name: "Académie", desc: "Théorie & principes" },
                  { name: "Outils", desc: "Notations, calculs" },
                ]}
              />
              <ModuleGroup
                icon="♞"
                title="Jouer"
                items={[
                  { name: "Ouvertures", desc: "Répertoire e4/d4" },
                  { name: "Endgames", desc: "Positions clés" },
                  { name: "Analyse PGN", desc: "Stockfish évalue" },
                ]}
              />
              <ModuleGroup
                icon="♟"
                title="S'entraîner"
                items={[
                  { name: "Tactiques", desc: "Puzzles quotidiens" },
                  { name: "Drill ouvertures", desc: "Coups par cœur" },
                  { name: "Progression", desc: "ELO estimé, thèmes" },
                ]}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

function ModuleGroup({
  icon,
  title,
  items,
}: {
  icon: string
  title: string
  items: { name: string; desc: string }[]
}) {
  return (
    <div>
      <div
        className="flex items-center gap-2 text-xs uppercase tracking-widest mb-3"
        style={{ color: "var(--accent)", letterSpacing: "0.25em" }}
      >
        <span className="text-base">{icon}</span>
        <span>{title}</span>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.name}>
            <div className="text-base font-medium">{item.name}</div>
            <div
              className="text-xs mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              {item.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
