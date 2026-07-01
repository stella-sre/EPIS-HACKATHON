import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

const legalLinks = [
  { href: "/legal/cookies", label: "Cookies" },
  { href: "/legal/terminos", label: "Términos y condiciones" },
  { href: "/legal/privacidad", label: "Privacidad" },
  { href: "/legal/libre-de-reclamaciones", label: "Libre de reclamaciones" },
];

export function Footer() {
  return (
    <footer className="border-t py-6 px-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={24} height={24} className="object-contain" />
          <span className="font-medium text-foreground">Equipo Stella</span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-4">
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <span>Hackathon EPIS XXI — UNSCH</span>
          <Heart className="w-4 h-4 text-destructive fill-destructive" />
        </div>
      </div>
    </footer>
  );
}
