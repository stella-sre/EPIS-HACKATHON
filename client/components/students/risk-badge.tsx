import { RiskLevel } from "@/types/student"

const CONFIG: Record<RiskLevel, { label: string; className: string }> = {
  low:    { label: "Bajo",  className: "bg-green-100  text-green-800  dark:bg-green-900/30  dark:text-green-300"  },
  medium: { label: "Medio", className: "bg-amber-100  text-amber-800  dark:bg-amber-900/30  dark:text-amber-300"  },
  high:   { label: "Alto",  className: "bg-red-100    text-red-800    dark:bg-red-900/30    dark:text-red-300"    },
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  const { label, className } = CONFIG[level] ?? CONFIG.low
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}
