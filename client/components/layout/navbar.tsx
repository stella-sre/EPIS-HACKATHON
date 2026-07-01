"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="w-6 h-6 text-primary" />
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
