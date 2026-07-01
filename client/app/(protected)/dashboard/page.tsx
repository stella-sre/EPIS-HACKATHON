import { auth } from '@/auth';
import { Users, ShieldAlert, Bell, BarChart3 } from 'lucide-react';

const stats = [
  { label: 'Estudiantes', value: '20', sub: 'registrados en demo', icon: Users },
  { label: 'En riesgo alto', value: '—', sub: 'pendiente de análisis', icon: ShieldAlert },
  { label: 'Alertas activas', value: '—', sub: 'sin intervención', icon: Bell },
  { label: 'Recomendaciones', value: '—', sub: 'generadas esta semana', icon: BarChart3 },
];

export default async function DashboardPage() {
  const session = await auth();

  return (
    <>
      {/* ── Welcome ── */}
      <div>
        <h1 className="text-2xl font-semibold font-heading">Bienvenido, {session?.user?.name?.split(' ')[0]}</h1>
        <p className="text-sm text-muted-foreground mt-1">Resumen del estado actual de los estudiantes registrados.</p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{s.label}</span>
              <s.icon className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Legal notice ── */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20 p-4">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <strong>Aviso:</strong> Esta herramienta es un prototipo de apoyo pedagógico (MVP). No reemplaza el criterio profesional del docente ni constituye una evaluación oficial. Todos los datos de estudiantes son <strong>ficticios</strong>.
        </p>
      </div>
    </>
  );
}
