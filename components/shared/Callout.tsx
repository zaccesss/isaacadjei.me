import { Info, Lightbulb, MessageSquareWarning, OctagonAlert, TriangleAlert, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type CalloutKind = "note" | "tip" | "important" | "warning" | "caution"

const KINDS: Record<CalloutKind, { label: string; icon: LucideIcon; frame: string; accent: string }> = {
  note: {
    label: "Note",
    icon: Info,
    frame: "border-l-[#0550ae] bg-[#0550ae]/[0.08] dark:border-l-[#4493f8] dark:bg-[#4493f8]/10",
    accent: "text-[#0550ae] dark:text-[#4493f8]",
  },
  tip: {
    label: "Tip",
    icon: Lightbulb,
    frame: "border-l-[#116329] bg-[#116329]/[0.08] dark:border-l-[#3fb950] dark:bg-[#3fb950]/10",
    accent: "text-[#116329] dark:text-[#3fb950]",
  },
  important: {
    label: "Important",
    icon: MessageSquareWarning,
    frame: "border-l-[#6639ba] bg-[#6639ba]/[0.08] dark:border-l-[#ab7df8] dark:bg-[#ab7df8]/10",
    accent: "text-[#6639ba] dark:text-[#ab7df8]",
  },
  warning: {
    label: "Warning",
    icon: TriangleAlert,
    frame: "border-l-[#7d4e00] bg-[#7d4e00]/[0.08] dark:border-l-[#d29922] dark:bg-[#d29922]/10",
    accent: "text-[#7d4e00] dark:text-[#d29922]",
  },
  caution: {
    label: "Caution",
    icon: OctagonAlert,
    frame: "border-l-[#a40e26] bg-[#a40e26]/[0.08] dark:border-l-[#f85149] dark:bg-[#f85149]/10",
    accent: "text-[#a40e26] dark:text-[#f85149]",
  },
}

interface CalloutProps {
  kind?: CalloutKind
  children: React.ReactNode
  className?: string
}

export default function Callout({ kind = "note", children, className }: CalloutProps) {
  const { label, icon: Icon, frame, accent } = KINDS[kind] ?? KINDS.note
  return (
    <aside role="note" aria-label={label} className={cn("my-4 rounded-r-lg border-l-4 px-4 py-3", frame, className)}>
      <p className={cn("flex items-center gap-2 text-sm font-semibold", accent)}>
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        {label}
      </p>
      <div className="mt-1.5 text-base leading-relaxed text-foreground">{children}</div>
    </aside>
  )
}
