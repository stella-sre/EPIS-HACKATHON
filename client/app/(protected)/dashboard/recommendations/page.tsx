import Link from "next/link"
import { Lightbulb, ArrowRight } from "lucide-react"

interface RecommendationRow {
  id: string
  student_id: string
  explanation: string
  suggested_action: string
  generated_at: string
  risk: { level: string; reasons: string[] }
}

async function getRecommendations(): Promise<RecommendationRow[]> {
  return []
}

const LEVEL_LABELS: Record<string, string> = {
  low:    "Bajo",
  medium: "Medio",
  high:   "Alto",
}

const LEVEL_COLORS: Record<string, string> = {
  low:    "text-green-600 dark:text-green-400",
  medium: "text-amber-600 dark:text-amber-400",
  high:   "text-red-600 dark:text-red-400",
}

export default async function RecommendationsPage() {
  const recs = await getRecommendations()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold font-heading">Recomendaciones</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Historial de recomendaciones de intervención generadas por IA.
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
        <div className="flex flex-col gap-3">
          {recs.map((r) => (
            <div key={r.id} className="rounded-xl border p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="size-4 text-amber-500 shrink-0" />
                  <span className={`text-xs font-semibold ${LEVEL_COLORS[r.risk.level]}`}>
                    Riesgo {LEVEL_LABELS[r.risk.level]}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(r.generated_at).toLocaleDateString("es-PE")}
                </span>
              </div>
              <p className="text-sm">{r.explanation}</p>
              <p className="text-sm text-muted-foreground">{r.suggested_action}</p>
              <Link
                href={`/dashboard/students/${r.student_id}`}
                className="self-start inline-flex items-center gap-1 text-xs text-primary hover:underline underline-offset-4"
              >
                Ver estudiante <ArrowRight className="size-3" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
