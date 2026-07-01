export default function PrivacidadPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-heading font-bold mb-6">Política de Privacidad</h1>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
        <p><strong>Prototipo de Hackathon — No procesa datos reales.</strong></p>
        <h2 className="text-xl font-semibold text-foreground">Datos recopilados</h2>
        <p>Esta aplicación es un prototipo. Los datos de estudiantes mostrados son completamente ficticios y generados únicamente con fines demostrativos.</p>
        <h2 className="text-xl font-semibold text-foreground">Almacenamiento</h2>
        <p>Los datos se almacenan localmente en la base de datos PostgreSQL del prototipo. No se realiza transferencia de datos personales a terceros.</p>
        <h2 className="text-xl font-semibold text-foreground">Contacto</h2>
        <p>Para consultas sobre privacidad, contactar al equipo Stella a través del Hackathon EPIS XXI.</p>
      </div>
    </div>
  );
}
