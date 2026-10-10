"use client"

import { useSyncExternalStore } from "react"
import { flushSync } from "react-dom"
import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ORDER = ["light", "dark", "system"] as const
export type ThemeChoice = (typeof ORDER)[number]
const NAMES: Record<ThemeChoice, string> = { light: "Light", dark: "Dark", system: "System" }

const noop = () => () => {}

export default function ThemeToggle({ onChange, className }: { onChange?: (choice: ThemeChoice) => void; className?: string }) {
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(noop, () => true, () => false)
  const current: ThemeChoice = ORDER.includes(theme as ThemeChoice) ? (theme as ThemeChoice) : "system"
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length]

  function handleToggle(event: React.MouseEvent<HTMLButtonElement>) {
    onChange?.(next)
    const doc = document as Document & { startViewTransition?: (update: () => void) => { ready: Promise<void> } }
    if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTheme(next)
      return
    }
    const box = event.currentTarget.getBoundingClientRect()
    const x = box.left + box.width / 2
    const y = box.top + box.height / 2
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    const transition = doc.startViewTransition(() => flushSync(() => setTheme(next)))
    transition.ready
      .then(() =>
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 450, easing: "cubic-bezier(0.4, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" },
        ),
      )
      .catch(() => {})
  }

  const icon = (choice: ThemeChoice) =>
    cn("h-4 w-4 transition-all", choice !== "light" && "absolute", mounted && choice === current ? "rotate-0 scale-100" : "-rotate-90 scale-0")

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label={mounted ? `Theme: ${NAMES[current]}. Switch to ${NAMES[next]}` : "Change theme"}
      className={className}
    >
      <Sun className={icon("light")} aria-hidden="true" />
      <Moon className={icon("dark")} aria-hidden="true" />
      <Monitor className={icon("system")} aria-hidden="true" />
    </Button>
  )
}
