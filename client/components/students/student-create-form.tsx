"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function StudentCreateForm() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [schoolName, setSchoolName] = useState("")
  const [zone, setZone] = useState("rural")
  const [level, setLevel] = useState("primary")
  const [grade, setGrade] = useState("1")
  const [language, setLanguage] = useState("Español")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const gradeOptions =
    level === "primary"
      ? ["1", "2", "3", "4", "5", "6"]
      : ["1", "2", "3", "4", "5"]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/v1/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          school_name: schoolName.trim(),
          zone,
          education_level: level,
          grade: Number(grade),
          native_language: language,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? `Error ${res.status}`)
        return
      }

      const student = await res.json()
      router.push(`/dashboard/students/${student.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const labelClass = "text-sm font-medium mb-1.5 block"
  const selectClass =
    "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Nombre completo del estudiante</label>
          <Input
            placeholder="Ej: Ana Rosa Mamani Quispe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Nombre de la institución educativa</label>
          <Input
            placeholder="Ej: IE N° 38540 San Francisco"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Zona</label>
          <select
            className={selectClass}
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            required
          >
            <option value="rural">Rural</option>
            <option value="urban">Urbana</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Lengua materna</label>
          <select
            className={selectClass}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            required
          >
            <option value="Español">Español</option>
            <option value="Quechua">Quechua</option>
            <option value="Aymara">Aymara</option>
            <option value="Asháninka">Asháninka</option>
            <option value="Otra">Otra lengua originaria</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Nivel educativo</label>
          <select
            className={selectClass}
            value={level}
            onChange={(e) => {
              setLevel(e.target.value)
              setGrade("1")
            }}
            required
          >
            <option value="primary">Primaria</option>
            <option value="secondary">Secundaria</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Grado</label>
          <select
            className={selectClass}
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
          >
            {gradeOptions.map((g) => (
              <option key={g} value={g}>
                {g}° grado
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex gap-3 pt-1">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="size-4 mr-2 animate-spin" />}
          {loading ? "Guardando..." : "Registrar estudiante"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
