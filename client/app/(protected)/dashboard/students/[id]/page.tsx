import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, BookOpen, Globe } from "lucide-react"
import { StudentDetail } from "@/types/student"
import { RiskBadge } from "@/components/students/risk-badge"
import { AssessButton } from "@/components/students/assess-button"

async function getStudent(id: string): Promise<StudentDetail | null> {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/students/${id}`, {
      cache: "no-store",
    })
    if (res.status === 404) return null
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

const REASON_LABELS: Record<string, string> = {
  asistencia_critica:  "Asistencia crítica (promedio < 75%)",
  rendimiento_bajo:    "Rendimiento bajo (promedio < 11/20)",
  tendencia_negativa:  "Tendencia negativa de notas",
  baja_participacion:  "Baja participación en clase",
}

const LEVEL_LABELS: Record<string, string> = {
  primary: "Primaria",
  secondary: "Secundaria",
}

function StatBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const student = await getStudent(id)
  if (!student) notFound()

  const risk = student.risk

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/students"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Estudiantes
        </Link>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold font-heading">{student.name}</h1>
          <RiskBadge level={risk.level} />
        </div>
        <p className="text-sm text-muted-foreground">{student.school_name}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="size-4 shrink-0" />
          {LEVEL_LABELS[student.education_level]} · {student.grade}° grado
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" />
          {student.zone === "rural" ? "Rural" : "Urbana"}
          {student.district.name ? ` · ${student.district.name}` : ""}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="size-4 shrink-0" />
          {student.native_language}
        </div>
      </div>

      {student.district.department && (
        <div className="rounded-xl border bg-muted/30 p-4 grid gap-2 sm:grid-cols-2 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Departamento</p>
            <p className="font-medium">{student.district.department}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Tasa de deserción distrital 2023/24</p>
            <p className="font-medium">
              Primaria {student.district.primary_dropout_rate.toFixed(2)}% · Secundaria{" "}
              {student.district.secondary_dropout_rate.toFixed(2)}%
            </p>
          </div>
        </div>
      )}

      <div className="rounded-xl border p-5 flex flex-col gap-4">
        <h2 className="font-semibold text-sm">Evaluación de riesgo</h2>
        <div className="flex items-center gap-3">
          <RiskBadge level={risk.level} />
          <span className="text-sm text-muted-foreground">
            {risk.level === "high"   && "Requiere intervención inmediata"}
            {risk.level === "medium" && "Seguimiento cercano recomendado"}
            {risk.level === "low"    && "Sin señales de alerta activas"}
          </span>
        </div>

        {risk.reasons.length > 0 && (
          <ul className="flex flex-col gap-2">
            {risk.reasons.map((r) => (
              <li key={r} className="flex items-center gap-2 text-sm">
                <span className="size-1.5 rounded-full bg-foreground/50 shrink-0" />
                {REASON_LABELS[r] ?? r}
              </li>
            ))}
          </ul>
        )}

        <AssessButton studentId={student.id} />
      </div>

      {student.records.length > 0 && (
        <div className="rounded-xl border p-5 flex flex-col gap-4">
          <h2 className="font-semibold text-sm">Seguimiento académico por bimestre</h2>

          <div className="grid gap-4">
            {student.records.map((rec) => (
              <div key={rec.term} className="grid gap-2">
                <p className="text-xs font-medium text-muted-foreground">Bimestre {rec.term}</p>

                <div className="grid gap-1.5">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="w-24 text-muted-foreground">Asistencia</span>
                    <div className="flex-1">
                      <StatBar
                        value={rec.attendance_pct}
                        max={100}
                        color={rec.attendance_pct < 75 ? "bg-red-500" : "bg-green-500"}
                      />
                    </div>
                    <span className="w-10 text-right">{rec.attendance_pct.toFixed(1)}%</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="w-24 text-muted-foreground">Promedio</span>
                    <div className="flex-1">
                      <StatBar
                        value={rec.grade_avg}
                        max={20}
                        color={rec.grade_avg < 11 ? "bg-red-500" : rec.grade_avg < 14 ? "bg-amber-500" : "bg-green-500"}
                      />
                    </div>
                    <span className="w-10 text-right">{rec.grade_avg.toFixed(1)}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="w-24 text-muted-foreground">Participación</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`size-2.5 rounded-full ${i < rec.participation ? "bg-primary" : "bg-muted"}`}
                        />
                      ))}
                    </div>
                    <span className="w-10 text-right">{rec.participation}/5</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
