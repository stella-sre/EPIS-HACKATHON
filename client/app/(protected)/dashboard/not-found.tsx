import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = (): React.ReactNode => (
  <section className="flex flex-1 items-center justify-center">
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="flex flex-col items-center gap-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Error 404</span>
        <span className="font-heading text-8xl font-bold text-border">404</span>
        <h1 className="font-heading text-lg font-semibold text-foreground">Ruta no encontrada</h1>
        <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">La sección que buscas no existe o no tienes permisos para acceder.</p>
      </div>

      <Button size="sm" asChild>
        <Link href="/dashboard" className="flex items-center gap-1.5">
          <LayoutDashboard className="size-3.5" />
          Volver al dashboard
        </Link>
      </Button>
    </div>
  </section>
);

export default NotFound;
