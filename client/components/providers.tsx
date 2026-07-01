"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SileoProvider } from "sileo";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SileoProvider>{children}</SileoProvider>
    </NextThemesProvider>
  );
}
