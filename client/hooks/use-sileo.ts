"use client";

import { sileo } from "sileo";

type ToastType = "success" | "error" | "warning" | "info" | "action";

interface ToastOptions {
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number;
}

export function useSileo() {
  const notify = (options: ToastOptions) => {
    const toast = sileo.show.bind(sileo);
    toast({
      title: options.title,
      description: options.message,
      state: options.type ?? "info",
      duration: options.duration ?? 6000,
    });
  };

  return { notify };
}
