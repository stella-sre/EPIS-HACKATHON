import Image from "next/image";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-6 px-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={24} height={24} className="object-contain" />
          <span className="font-medium text-foreground">Equipo Stella</span>
        </div>
        <div className="flex items-center gap-1">
          <span>Hackathon EPIS XXI — UNSCH</span>
          <Heart className="w-4 h-4 text-destructive fill-destructive" />
        </div>
      </div>
    </footer>
  );
}
