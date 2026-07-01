import { Brain, Shield, Users, AlertTriangle, ArrowRight, GraduationCap } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'IA Generativa Explicable',
    description: 'Motor de reglas transparente que clasifica el riesgo y un LLM que genera recomendaciones contextualizadas.',
  },
  {
    icon: AlertTriangle,
    title: 'Detección Temprana',
    description: 'Identifica estudiantes en riesgo antes de que sea tarde, usando asistencia, notas y participación.',
  },
  {
    icon: Shield,
    title: 'Datos Fiicticios',
    description: 'Dataset demostrativo sin datos reales de menores. Seguro, ético y cumple con la normativa.',
  },
  {
    icon: Users,
    title: 'Apoyo al Docente',
    description: 'Herramienta de orientación que complementa, nunca reemplaza, el criterio profesional del docente.',
  },
];

const stats = [
  { value: '16.7%', label: 'Estudiantes rurales en 2do primaria alcanzan nivel esperado en comprensión lectora' },
  { value: '5.2%', label: 'Tasa de deserción en secundaria rural' },
  { value: '6/10', label: 'Estudiantes rurales sin internet en casa' },
];

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-full">
      <section className="relative flex flex-col items-center justify-center py-24 px-4 text-center bg-linear-to-b from-background to-muted">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary">
          <GraduationCap className="w-4 h-4" />
          Hackathon EPIS XXI — Innovando para el Perú
        </div>

        <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight max-w-3xl">
          Alerta Temprana <span className="text-primary">Explicable</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">Sistema de apoyo a docentes para la detección temprana de estudiantes en riesgo de bajo rendimiento o deserción escolar, con recomendaciones personalizadas generadas mediante IA.</p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <a href="#estadisticas" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            Conocer el problema
            <ArrowRight className="w-4 h-4" />
          </a>
          <a href="#caracteristicas" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-full border border-border hover:bg-muted transition-colors">
            Ver solución
          </a>
        </div>
      </section>

      <section id="estadisticas" className="py-20 px-4 bg-muted/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-heading font-semibold text-center mb-12">La realidad de la educación rural en Perú</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center p-6 bg-background rounded-2xl border shadow-sm text-center">
                <span className="text-4xl md:text-5xl font-heading font-bold text-primary">{stat.value}</span>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">Fuente: ECE MINEDU · BID 2024</p>
        </div>
      </section>

      <section id="caracteristicas" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-4">Una plataforma pensado para el docente</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Herramienta simple y transparente que ayuda a identificar señales tempranas sin reemplazar el criterio profesional.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="flex gap-4 p-6 bg-muted/30 rounded-2xl border">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-4">¿Por qué IA generativa?</h2>
          <p className="text-primary-foreground/80 leading-relaxed">
            El motor de reglas determina <strong>qué riesgo existe</strong> y <strong>por qué</strong> (explicabilidad total). El LLM traduce esos motivos en una explicación humana y una acción de apoyo concreta y contextualizada — evitando mensajes genéricos o estigmatizantes.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50 border-t">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Esta herramienta es un <strong>prototipo de apoyo pedagógico (MVP)</strong>. No reemplaza el criterio profesional del docente ni constituye una evaluación oficial. Todos los datos de estudiantes usados son <strong>ficticios</strong>.
          </p>
        </div>
      </section>
    </div>
  );
}
