"use client"

import { useSyncExternalStore } from "react"
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

  function handleToggle() {
    const html = document.documentElement
    html.classList.add("theme-transitioning")
    setTheme(next)
    window.setTimeout(() => html.classList.remove("theme-transitioning"), 100)
    onChange?.(next)
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
