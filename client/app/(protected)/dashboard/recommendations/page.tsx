import Link from "next/link"
import { Lightbulb, ArrowRight } from "lucide-react"
import { RiskBadge } from "@/components/students/risk-badge"
import { RiskLevel } from "@/types/student"

interface RecommendationRow {
  id: string
  student_id: string
  student_name: string
  explanation: string
  suggested_action: string
  generated_at: string
  risk: { level: RiskLevel; reasons: string[] }
}

async function getRecommendations(): Promise<RecommendationRow[]> {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/recommendations`, {
      cache: "no-store",
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

const REASON_LABELS: Record<string, string> = {
  asistencia_critica: "Asistencia crítica",
  rendimiento_bajo:   "Rendimiento bajo",
  tendencia_negativa: "Tendencia negativa",
  baja_participacion: "Baja participación",
}

export default async function RecommendationsPage() {
  const recs = await getRecommendations()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold font-heading">Recomendaciones</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {recs.length > 0
            ? `${recs.length} recomendación${recs.length > 1 ? "es" : ""} generada${recs.length > 1 ? "s" : ""} por IA`
            : "Historial de recomendaciones de intervención generadas por IA."}
        </p>
      </div>

      {recs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-muted-foreground">
          <Lightbulb className="size-8" />
          <p className="text-sm text-center max-w-xs">
            Todavía no hay recomendaciones generadas. Abre el detalle de un estudiante y usa el botón "Generar recomendación con IA".
          </p>
          <Link
            href="/dashboard/students"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            Ver estudiantes
            <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {recs.map((r) => (
            <div key={r.id} className="rounded-xl border p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <Lightbulb className="size-4 text-amber-500 shrink-0" />
                  <Link
                    href={`/dashboard/students/${r.student_id}`}
                    className="font-medium text-sm hover:underline underline-offset-4"
                  >
                    {r.student_name}
                  </Link>
                  <RiskBadge level={r.risk.level} />
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(r.generated_at).toLocaleString("es-PE")}
                </span>
              </div>

              {r.risk.reasons.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {r.risk.reasons.map((reason) => (
                    <span
                      key={reason}
                      className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {REASON_LABELS[reason] ?? reason}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Análisis</p>
                  <p className="leading-relaxed">{r.explanation}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Acción sugerida</p>
                  <p className="leading-relaxed text-muted-foreground">{r.suggested_action}</p>
                </div>
              </div>

              <Link
                href={`/dashboard/students/${r.student_id}`}
                className="self-start inline-flex items-center gap-1 text-xs text-primary hover:underline underline-offset-4"
              >
                Ver detalle del estudiante <ArrowRight className="size-3" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
