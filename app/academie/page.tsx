import Link from "next/link"
import Sidebar from "@/components/Sidebar"
import { COURSES } from "@/lib/courses/manifest"

export default function AcademiePage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <Sidebar />
      <main className="flex-1 min-w-0 lg:ml-56">
        <header
          className="border-b h-12 px-4 sm:px-6 flex items-center gap-4 sticky top-12 lg:top-0 z-30 backdrop-blur"
          style={{
            borderColor: "var(--border)",
            background: "color-mix(in srgb, var(--bg-deep) 85%, transparent)",
          }}
        >
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
            <Link href="/">Home</Link>
            <span>/</span>
            <span style={{ color: "var(--text-primary)" }}>Académie</span>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-10 sm:py-14">
          <header className="mb-10">
            <div
              className="flex items-center gap-3 text-xs uppercase tracking-widest mb-2"
              style={{ color: "var(--accent)", letterSpacing: "0.3em" }}
            >
              <span className="text-lg">♛</span>
              <span>Académie</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Sept chapitres, dans un ordre qui a du sens
            </h1>
            <p
              className="text-sm max-w-2xl leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Des règles jusqu&apos;au mental game. Chaque cours propose définitions
              rigoureuses, exemples chiffrés, et notation claire. Environ 3-4h de lecture
              au total.
            </p>
          </header>

          <div
            className="grid grid-cols-[28px_1fr_20px] sm:grid-cols-[36px_1fr_100px_60px_20px] gap-3 sm:gap-4 py-2 border-b text-[10px] uppercase tracking-widest"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            <div>N°</div>
            <div>Titre</div>
            <div className="hidden sm:block">Niveau</div>
            <div className="hidden sm:block text-right">Durée</div>
            <div></div>
          </div>

          <ol>
            {COURSES.map((c, i) => (
              <CourseRow key={c.slug} course={c} idx={i} />
            ))}
          </ol>
        </div>
      </main>
    </div>
  )
}

function CourseRow({
  course,
  idx,
}: {
  course: (typeof COURSES)[number]
  idx: number
}) {
  const levelColor =
    course.level === "Débutant"
      ? "#6cb98d"
      : course.level === "Intermédiaire"
        ? "var(--accent)"
        : "#b591b0"

  const inner = (
    <div
      className="grid grid-cols-[28px_1fr_20px] sm:grid-cols-[36px_1fr_100px_60px_20px] gap-3 sm:gap-4 py-4 border-b items-baseline"
      style={{ borderColor: "var(--border)" }}
    >
      <div
        className="text-xs decorative tabular-nums"
        style={{ color: "var(--text-muted)" }}
      >
        {String(idx + 1).padStart(2, "0")}
      </div>
      <div className="min-w-0">
        <div
          className="text-base font-medium"
          style={{
            color: course.available ? "var(--text-primary)" : "var(--text-muted)",
          }}
        >
          {stripLeadingNumber(course.title)}
        </div>
        <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
          {course.subtitle}
        </div>
        <div className="sm:hidden text-[10px] uppercase tracking-wider mt-1.5">
          <span style={{ color: levelColor }}>{course.level}</span>
          <span style={{ color: "var(--text-muted)" }}> · {course.duration_min} min</span>
        </div>
      </div>
      <div
        className="hidden sm:block text-xs font-medium uppercase tracking-wider"
        style={{ color: levelColor }}
      >
        {course.level}
      </div>
      <div
        className="hidden sm:block text-xs text-right tabular-nums"
        style={{ color: "var(--text-secondary)" }}
      >
        {course.duration_min} min
      </div>
      <div className="text-right">
        {course.available ? (
          <span style={{ color: "var(--accent)" }}>→</span>
        ) : (
          <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
            —
          </span>
        )}
      </div>
    </div>
  )

  if (course.available) {
    return (
      <li>
        <Link
          href={`/academie/${course.slug}`}
          className="block group hover:bg-[color:var(--surface)] px-2 -mx-2 transition-colors"
        >
          {inner}
        </Link>
      </li>
    )
  }
  return <li className="opacity-50">{inner}</li>
}

function stripLeadingNumber(title: string): string {
  return title.replace(/^\d+\.\s*/, "")
}
