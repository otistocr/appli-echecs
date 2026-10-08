"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const GROUPS = [
  {
    label: "Étudier",
    icon: "♛",
    items: [
      { href: "/academie", title: "Académie", desc: "Théorie & principes" },
      { href: "/outils", title: "Outils", desc: "Notations, calculs" },
    ],
  },
  {
    label: "Jouer",
    icon: "♞",
    items: [
      { href: "/openings", title: "Ouvertures", desc: "Répertoire e4 / d4" },
      { href: "/endgames", title: "Endgames", desc: "Positions clés" },
      { href: "/analyze", title: "Analyse PGN", desc: "Stockfish évalue" },
    ],
  },
  {
    label: "S'entraîner",
    icon: "♟",
    items: [
      { href: "/puzzles", title: "Tactiques", desc: "Puzzles quotidiens" },
      { href: "/openings/trainer", title: "Drill ouvertures", desc: "Coups par cœur" },
      { href: "/stats", title: "Progression", desc: "ELO estimé, thèmes" },
    ],
  },
]

export default function Sidebar() {
  const path = usePathname()
  const [open, setOpen] = useState(false)

  // Le menu mobile se referme à chaque changement de page
  useEffect(() => setOpen(false), [path])

  return (
    <>
    {/* Mobile : barre du haut avec bouton menu */}
    <div
      className="lg:hidden sticky top-0 z-50 h-12 px-4 border-b flex items-center justify-between"
      style={{ borderColor: "var(--border)", background: "var(--bg-deep)" }}
    >
      <Link href="/" className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center border-2 text-xs font-black"
          style={{ background: "var(--accent)", borderColor: "var(--text-primary)", color: "var(--bg-deep)" }}
        >
          ♞
        </div>
        <span className="text-sm font-semibold">appli échecs</span>
      </Link>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        className="w-10 h-10 -mr-2 flex items-center justify-center text-xl"
        style={{ color: "var(--text-primary)" }}
      >
        {open ? "✕" : "☰"}
      </button>
    </div>
    {open && (
      <div
        className="lg:hidden fixed inset-0 top-12 z-40 overflow-y-auto p-4"
        style={{ background: "var(--bg-deep)" }}
      >
        <nav className="space-y-6">
          {GROUPS.map((g) => (
            <div key={g.label}>
              <div
                className="flex items-center gap-2 px-2 mb-2 text-[10px] uppercase tracking-widest"
                style={{ color: "var(--accent)", letterSpacing: "0.25em" }}
              >
                <span className="text-sm">{g.icon}</span>
                <span>{g.label}</span>
              </div>
              <div className="space-y-0.5">
                {g.items.map((item) => {
                  const active = path === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-3 rounded text-base"
                      style={{
                        color: active ? "var(--accent)" : "var(--text-primary)",
                        background: active ? "var(--accent-soft)" : "transparent",
                      }}
                    >
                      <div>{item.title}</div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {item.desc}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    )}

    {/* Ordinateur : barre latérale fixe */}
    <aside
      className="hidden lg:flex w-56 shrink-0 border-r flex-col fixed left-0 top-0 bottom-0 z-40"
      style={{ borderColor: "var(--border)", background: "var(--bg-deep)" }}
    >
      <div
        className="p-4 border-b flex items-center gap-3"
        style={{ borderColor: "var(--border)" }}
      >
        <Link href="/" className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-black"
            style={{
              background: "var(--accent)",
              borderColor: "var(--text-primary)",
              color: "var(--bg-deep)",
            }}
          >
            ♞
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">appli échecs</div>
            <div
              className="text-[10px]"
              style={{ color: "var(--text-muted)" }}
            >
              training 1000-1500 ELO
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
        {GROUPS.map((g) => (
          <div key={g.label}>
            <div
              className="flex items-center gap-2 px-2 mb-2 text-[10px] uppercase tracking-widest"
              style={{ color: "var(--accent)", letterSpacing: "0.25em" }}
            >
              <span className="text-sm">{g.icon}</span>
              <span>{g.label}</span>
            </div>
            <div className="space-y-0.5">
              {g.items.map((item) => {
                const active = path === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-2 py-1.5 rounded text-sm transition-colors group"
                    style={{
                      color: active ? "var(--accent)" : "var(--text-secondary)",
                      background: active ? "var(--accent-soft)" : "transparent",
                    }}
                  >
                    <div className="group-hover:text-[color:var(--text-primary)] transition-colors">
                      {item.title}
                    </div>
                    <div
                      className="text-[10px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item.desc}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div
        className="p-3 border-t text-xs flex items-center justify-between"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px]"
            style={{ background: "var(--surface-2)" }}
          >
            M
          </div>
          <span>moi</span>
        </div>
        <div>v0.1</div>
      </div>
    </aside>
    </>
  )
}
