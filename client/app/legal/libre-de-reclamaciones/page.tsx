export default function LibreDeReclamacionesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-heading font-bold mb-6">Libre de Reclamaciones</h1>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
        <p><strong>Declaración de exención de responsabilidad — Prototipo de Hackathon.</strong></p>
        <h2 className="text-xl font-semibold text-foreground">Naturaleza del proyecto</h2>
        <p>Este sistema fue desarrollado como parte del Hackathon EPIS XXI — "Innovando para el Perú", Categoría B: Vanguardia (IA Generativa).</p>
        <h2 className="text-xl font-semibold text-foreground">Exclusión de responsabilidad</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Esta herramienta es un <strong>prototipo de apoyo pedagógico (MVP)</strong>.</li>
          <li>No constituye un producto certificado ni aprobado por el MINEDU.</li>
          <li>No reemplaza evaluaciones oficiales ni sistemas como SIAGIE.</li>
          <li>Todos los datos son ficticios; no representa menores de edad reales.</li>
          <li>Las recomendaciones generadas por IA son orientaciones, no diagnósticos.</li>
        </ul>
        <h2 className="text-xl font-semibold text-foreground">Equipo Stella</h2>
        <p>Isaias Ramos Lopez (27202506) y John Carlos Solca Prado (27210502) — UNSCH, Escuela Profesional de Ingeniería de Sistemas.</p>
      </div>
    </div>
  );
}
