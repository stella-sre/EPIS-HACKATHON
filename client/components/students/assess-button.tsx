"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AssessResponse } from "@/types/student"
import { RiskBadge } from "./risk-badge"

const REASON_LABELS: Record<string, string> = {
  asistencia_critica:  "Asistencia crítica (< 75%)",
  rendimiento_bajo:    "Rendimiento bajo (prom. < 11)",
  tendencia_negativa:  "Tendencia negativa de notas",
  baja_participacion:  "Baja participación",
}

export function AssessButton({ studentId }: { studentId: string }) {
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState<AssessResponse | null>(null)
  const [error, setError]       = useState("")

  async function handleAssess() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/v1/students/${studentId}/assess`, {
        method: "POST",
      })
      if (!res.ok) throw new Error(await res.text())
      setResult(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar la evaluación")
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <div className="rounded-xl border p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Evaluación guardada</span>
          <RiskBadge level={result.risk_level} />
        </div>
        {result.reasons.length > 0 && (
          <ul className="flex flex-col gap-1">
            {result.reasons.map((r) => (
              <li key={r} className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-current shrink-0" />
                {REASON_LABELS[r] ?? r}
              </li>
            ))}
          </ul>
        )}
        {result.reasons.length === 0 && (
          <p className="text-sm text-muted-foreground">Sin factores de riesgo detectados.</p>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleAssess} disabled={loading} size="sm">
        {loading ? "Evaluando…" : "Guardar evaluación de riesgo"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
