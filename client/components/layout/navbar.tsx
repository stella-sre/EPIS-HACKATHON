"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image src="/logo.png" alt="Alerta Temprana" width={32} height={32} className="object-contain" />
          <span>Alerta Temprana</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-primary transition-colors">
            Inicio
          </Link>
          <Link href="/students" className="hover:text-primary transition-colors">
            Estudiantes
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
