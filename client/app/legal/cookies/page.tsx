export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-heading font-bold mb-6">Política de Cookies</h1>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
        <p>Esta aplicación utiliza cookies únicamente con fines técnicos esenciales para su funcionamiento. No recopilamos datos personales mediante cookies de seguimiento ni publicidad.</p>
        <h2 className="text-xl font-semibold text-foreground">Tipos de cookies utilizadas</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Cookies técnicas:</strong> Necesarias para el funcionamiento de la aplicación (preferencias de tema, sesión).</li>
        </ul>
        <h2 className="text-xl font-semibold text-foreground">Control de cookies</h2>
        <p>Puede configurar su navegador para bloquear cookies. Sin embargo, algunas funciones de la aplicación podrían no funcionar correctamente.</p>
      </div>
    </div>
  );
}
