export default function TerminosPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-heading font-bold mb-6">Términos y Condiciones</h1>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
        <p><strong>Prototipo de Hackathon — No constituye un producto terminado.</strong></p>
        <h2 className="text-xl font-semibold text-foreground">Uso previsto</h2>
        <p>Esta herramienta es un prototipo de apoyo pedagógico desarrollado para el Hackathon EPIS XXI. No reemplaza el criterio profesional del docente ni constituye una evaluación oficial.</p>
        <h2 className="text-xl font-semibold text-foreground">Datos ficticios</h2>
        <p>Todos los datos de estudiantes utilizados en esta demostración son ficticios. No representan menores de edad reales.</p>
        <h2 className="text-xl font-semibold text-foreground">Limitación de responsabilidad</h2>
        <p>El equipo Stella y la UNSCH no se hacen responsables por decisiones tomadas basándose en este prototipo.</p>
      </div>
    </div>
  );
}
