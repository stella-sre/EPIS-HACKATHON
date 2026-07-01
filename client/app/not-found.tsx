import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center min-h-[60vh]">
      <div className="p-4 rounded-full bg-primary/10 mb-6">
        <span className="text-6xl font-heading font-bold text-primary">404</span>
      </div>
      <h1 className="text-2xl font-heading font-bold mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md">The page you are looking for does not exist or has been moved.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
        <button onClick={() => window.history.back()} className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-full border border-border hover:bg-muted transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    </div>
  );
}
