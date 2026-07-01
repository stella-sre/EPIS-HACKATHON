import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { StudentCreateForm } from "@/components/students/student-create-form"

export default function NewStudentPage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/students"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Estudiantes
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-semibold font-heading">Registrar estudiante</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Añade un nuevo estudiante al sistema para comenzar a registrar su asistencia y notas.
        </p>
      </div>

      <div className="rounded-xl border p-6">
        <StudentCreateForm />
      </div>
    </div>
  )
}
