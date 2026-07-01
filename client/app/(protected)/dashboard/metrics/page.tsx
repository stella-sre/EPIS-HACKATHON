import { BarChart3, Users, ShieldAlert, Lightbulb, Bell } from "lucide-react"
import { StudentListItem } from "@/types/student"

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

export default async function MetricsPage() {
  const students = await getStudents()

  const total  = students.length
  const high   = students.filter((s) => s.risk.level === "high").length
  const medium = students.filter((s) => s.risk.level === "medium").length
  const low    = students.filter((s) => s.risk.level === "low").length

  const byReason: Record<string, number> = {}
  for (const s of students) {
    for (const r of s.risk.reasons) {
      byReason[r] = (byReason[r] ?? 0) + 1
    }
  }

  const REASON_LABELS: Record<string, string> = {
    asistencia_critica: "Asistencia crítica",
    rendimiento_bajo:   "Rendimiento bajo",
    tendencia_negativa: "Tendencia negativa",
    baja_participacion: "Baja participación",
  }

  const rural  = students.filter((s) => s.zone === "rural").length
  const quechua = students.filter((s) => s.native_language === "Quechua").length

  const stats = [
    { label: "Total estudiantes",  value: total,  icon: Users,       color: "text-blue-600 dark:text-blue-400"   },
    { label: "Riesgo alto",        value: high,   icon: ShieldAlert, color: "text-red-600 dark:text-red-400"     },
    { label: "Riesgo medio",       value: medium, icon: Bell,        color: "text-amber-600 dark:text-amber-400" },
    { label: "Sin alerta",         value: low,    icon: Lightbulb,   color: "text-green-600 dark:text-green-400" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold font-heading">Métricas</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Resumen del sistema de detección temprana — datos del conjunto de demostración.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className={`size-4 ${s.color}`} />
            </div>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border p-5 flex flex-col gap-4">
          <h2 className="font-semibold text-sm">Factores de riesgo detectados</h2>
          {Object.keys(byReason).length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin factores detectados.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {Object.entries(byReason)
                .sort((a, b) => b[1] - a[1])
                .map(([key, count]) => (
                  <div key={key} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{REASON_LABELS[key] ?? key}</span>
                      <span className="font-medium">{count}/{total}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(count / total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border p-5 flex flex-col gap-4">
          <h2 className="font-semibold text-sm">Contexto socioeducativo</h2>
          <div className="flex flex-col gap-3">
            {[
              { label: "Zona rural",         value: rural,   total },
              { label: "Lengua materna quechua", value: quechua, total },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}/{total}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: total > 0 ? `${(value / total) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-auto">
            Datos ficticios generados a partir de tasas de deserción distritales reales (MINEDU 2023/24).
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20 p-4">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <strong>Aviso:</strong> Estas métricas corresponden al conjunto de demostración. No representan datos reales de estudiantes.
        </p>
      </div>
    </div>
  )
}
