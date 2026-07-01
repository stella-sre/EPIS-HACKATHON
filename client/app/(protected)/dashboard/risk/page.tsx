import Link from "next/link"
import { ShieldAlert, ArrowRight } from "lucide-react"
import { StudentListItem } from "@/types/student"
import { RiskBadge } from "@/components/students/risk-badge"

async function getStudents(): Promise<StudentListItem[]> {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/students`, {
      cache: "no-store",
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function RiskPage() {
  const students = await getStudents()

  const high   = students.filter((s) => s.risk.level === "high")
  const medium = students.filter((s) => s.risk.level === "medium")

  const REASON_LABELS: Record<string, string> = {
    asistencia_critica: "Asistencia crítica",
    rendimiento_bajo:   "Rendimiento bajo",
    tendencia_negativa: "Tendencia negativa",
    baja_participacion: "Baja participación",
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold font-heading">Evaluación de Riesgo</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Estudiantes con señales de alerta detectadas por el motor de reglas.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border p-4 flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Riesgo alto</span>
          <span className="text-3xl font-bold text-red-600 dark:text-red-400">{high.length}</span>
        </div>
        <div className="rounded-xl border p-4 flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Riesgo medio</span>
          <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">{medium.length}</span>
        </div>
        <div className="rounded-xl border p-4 flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Sin alerta</span>
          <span className="text-3xl font-bold text-green-600 dark:text-green-400">
            {students.length - high.length - medium.length}
          </span>
        </div>
      </div>

      {[
        { label: "Riesgo alto", items: high },
        { label: "Riesgo medio", items: medium },
      ].map(({ label, items }) =>
        items.length > 0 ? (
          <div key={label} className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold">{label}</h2>
            <div className="flex flex-col gap-2">
              {items.map((s) => (
                <Link
                  key={s.id}
                  href={`/dashboard/students/${s.id}`}
                  className="flex items-center gap-4 rounded-xl border p-4 hover:bg-muted/30 transition-colors"
                >
                  <ShieldAlert className="size-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.school_name}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {s.risk.reasons.map((r) => (
                      <span
                        key={r}
                        className="hidden sm:inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {REASON_LABELS[r] ?? r}
                      </span>
                    ))}
                    <RiskBadge level={s.risk.level} />
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null
      )}

      {high.length === 0 && medium.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-muted-foreground">
          <ShieldAlert className="size-8" />
          <p className="text-sm">No hay estudiantes con factores de riesgo detectados.</p>
        </div>
      )}
    </div>
  )
}
