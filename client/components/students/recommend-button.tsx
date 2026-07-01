"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RecommendationResponse } from "@/types/recommendation"
import { RiskBadge } from "./risk-badge"
import { Lightbulb, Loader2 } from "lucide-react"

const REASON_LABELS: Record<string, string> = {
  asistencia_critica: "Asistencia crítica (< 75%)",
  rendimiento_bajo:   "Rendimiento bajo (prom. < 11)",
  tendencia_negativa: "Tendencia negativa de notas",
  baja_participacion: "Baja participación",
}

export function RecommendButton({ studentId }: { studentId: string }) {
  const [loading, setLoading]     = useState(false)
  const [result, setResult]       = useState<RecommendationResponse | null>(null)
  const [error, setError]         = useState("")

  async function handleGenerate() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/v1/students/${studentId}/recommend`, {
        method: "POST",
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Error desconocido" }))
        throw new Error(body.error ?? "Error al generar recomendación")
      }
      setResult(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al generar recomendación")
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <div className="rounded-xl border p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="size-4 text-amber-500 shrink-0" />
          <span className="font-semibold text-sm">Recomendación generada por IA</span>
          <RiskBadge level={result.risk.level} />
        </div>

        {result.risk.reasons.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {result.risk.reasons.map((r) => (
              <span
                key={r}
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                {REASON_LABELS[r] ?? r}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Análisis</p>
            <p className="leading-relaxed">{result.explanation}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Acción sugerida</p>
            <p className="leading-relaxed">{result.suggested_action}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Generado el {new Date(result.generated_at).toLocaleString("es-PE")} · Esta orientación no reemplaza el criterio profesional del docente.
        </p>

        <Button variant="outline" size="sm" onClick={() => setResult(null)} className="self-start">
          Generar nueva recomendación
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleGenerate} disabled={loading} className="self-start gap-2">
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Generando…
          </>
        ) : (
          <>
            <Lightbulb className="size-4" />
            Generar recomendación con IA
          </>
        )}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
