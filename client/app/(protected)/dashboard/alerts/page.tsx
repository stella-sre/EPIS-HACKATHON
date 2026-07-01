import Link from "next/link"
import { Bell, ArrowRight, ShieldAlert } from "lucide-react"
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

const REASON_LABELS: Record<string, string> = {
  asistencia_critica: "Asistencia crítica (< 75%)",
  rendimiento_bajo:   "Rendimiento bajo (promedio < 11)",
  tendencia_negativa: "Tendencia negativa de notas",
  baja_participacion: "Baja participación en clase",
}

export default async function AlertsPage() {
  const students = await getStudents()
  const alerts = students.filter((s) => s.risk.level === "high")

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold font-heading">Alertas</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Estudiantes con riesgo alto que requieren intervención inmediata.
        </p>
      </div>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-muted-foreground">
          <Bell className="size-8" />
          <p className="text-sm">No hay alertas activas.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {alerts.map((s) => (
            <div key={s.id} className="rounded-xl border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="size-4 text-red-600 dark:text-red-400 shrink-0" />
                  <span className="font-medium text-sm">{s.name}</span>
                  <RiskBadge level={s.risk.level} />
                </div>
                <Link
                  href={`/dashboard/students/${s.id}`}
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline underline-offset-4 shrink-0"
                >
                  Ver detalle <ArrowRight className="size-3" />
                </Link>
              </div>

              <p className="text-xs text-muted-foreground">{s.school_name} · {s.zone === "rural" ? "Rural" : "Urbana"}</p>

              <ul className="flex flex-col gap-1">
                {s.risk.reasons.map((r) => (
                  <li key={r} className="flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
                    <span className="size-1.5 rounded-full bg-red-500 shrink-0" />
                    {REASON_LABELS[r] ?? r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
