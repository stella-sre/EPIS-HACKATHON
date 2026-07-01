"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ClipboardList, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Props {
  studentId: string
}

export function RecordForm({ studentId }: Props) {
  const router = useRouter()
  const [term, setTerm] = useState("1")
  const [attendance, setAttendance] = useState("")
  const [grade, setGrade] = useState("")
  const [participation, setParticipation] = useState("3")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSaved(false)
    setError(null)

    try {
      const res = await fetch(`/api/v1/students/${studentId}/records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          term: Number(term),
          attendance_pct: Number(attendance),
          grade_avg: Number(grade),
          participation: Number(participation),
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? `Error ${res.status}`)
        return
      }

      setSaved(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const labelClass = "text-xs text-muted-foreground mb-1 block"
  const selectClass =
    "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Bimestre</label>
          <select
            className={selectClass}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            required
          >
            <option value="1">Bimestre 1</option>
            <option value="2">Bimestre 2</option>
            <option value="3">Bimestre 3</option>
            <option value="4">Bimestre 4</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Participación (1–5)</label>
          <select
            className={selectClass}
            value={participation}
            onChange={(e) => setParticipation(e.target.value)}
            required
          >
            <option value="1">1 — Muy baja</option>
            <option value="2">2 — Baja</option>
            <option value="3">3 — Regular</option>
            <option value="4">4 — Buena</option>
            <option value="5">5 — Excelente</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Asistencia (%)</label>
          <Input
            type="number"
            min={0}
            max={100}
            step={0.1}
            placeholder="85.0"
            value={attendance}
            onChange={(e) => setAttendance(e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Promedio (0–20)</label>
          <Input
            type="number"
            min={0}
            max={20}
            step={0.1}
            placeholder="14.5"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
          />
        </div>
      </div>

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      {saved && (
        <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
          <CheckCircle2 className="size-3.5" />
          Registro guardado correctamente
        </div>
      )}

      <Button type="submit" disabled={loading} className="self-start">
        {loading ? (
          <Loader2 className="size-4 mr-2 animate-spin" />
        ) : (
          <ClipboardList className="size-4 mr-2" />
        )}
        {loading ? "Guardando..." : "Guardar registro"}
      </Button>
    </form>
  )
}
