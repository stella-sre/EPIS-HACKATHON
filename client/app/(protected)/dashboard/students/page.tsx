import Link from "next/link"
import { StudentListItem } from "@/types/student"
import { RiskBadge } from "@/components/students/risk-badge"
import { Users, UserPlus } from "lucide-react"

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

const LEVEL_LABELS: Record<string, string> = {
  primary: "Primaria",
  secondary: "Secundaria",
}

const ZONE_LABELS: Record<string, string> = {
  rural: "Rural",
  urban: "Urbana",
}

export default async function StudentsPage() {
  const students = await getStudents()

  const high   = students.filter((s) => s.risk.level === "high").length
  const medium = students.filter((s) => s.risk.level === "medium").length
  const low    = students.filter((s) => s.risk.level === "low").length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold font-heading">Estudiantes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {students.length} estudiantes registrados — {high} alto riesgo · {medium} medio · {low} bajo
          </p>
        </div>
        <Link
          href="/dashboard/students/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors shrink-0"
        >
          <UserPlus className="size-4" />
          Nuevo estudiante
        </Link>
      </div>

      {students.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-muted-foreground">
          <Users className="size-8" />
          <p className="text-sm">No hay estudiantes disponibles. Ejecuta <code className="font-mono text-xs">make seed</code> primero.</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Institución</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nivel / Grado</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Zona</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Idioma</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Riesgo</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {students.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/students/${s.id}`}
                      className="font-medium hover:underline underline-offset-4"
                    >
                      {s.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{s.school_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {LEVEL_LABELS[s.education_level]} · {s.grade}°
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{ZONE_LABELS[s.zone]}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.native_language}</td>
                  <td className="px-4 py-3">
                    <RiskBadge level={s.risk.level} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
