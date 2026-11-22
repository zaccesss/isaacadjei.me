"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useScrolledPast } from "@/hooks/useScrollPosition"
import { cn } from "@/lib/utils"
import Navigation from "./Navigation"
import MobileNav from "./MobileNav"
import ThemeToggle from "@/components/shared/ThemeToggle"
import { Button } from "@/components/ui/button"
import { Rss, Search } from "lucide-react"
import { useModKey } from "@/hooks/useModKey"
import ScriptMark from "@/components/shared/motion/ScriptMark"

const ICON_TARGET = "relative after:absolute after:-inset-0.5 after:content-['']"

function useSignOnce() {
  const [sign, setSign] = useState(true)

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const t = window.setTimeout(() => setSign(false), 0)
    return () => window.clearTimeout(t)
  }, [])

  return { sign, settle: () => setSign(false) }
}

export default function Header() {
  const isScrolled = useScrolledPast(10)
  const pathname = usePathname()
  const isHome = pathname === "/"
  const { sign, settle } = useSignOnce()
  const { modLabel } = useModKey()

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-200 border-b",
        isScrolled
          ? "bg-background/95 sm:backdrop-blur-xl sm:backdrop-saturate-150 sm:supports-backdrop-filter:bg-background/65"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          title="Home"
          aria-label="Isaac Adjei, home"
          className="inline-flex min-h-11 min-w-11 items-center justify-center group w-fit rounded-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ScriptMark
            sign={sign}
            onSigned={settle}
            size={34}
            className={cn("transition-colors", isHome ? "text-foreground" : "text-foreground/90 group-hover:text-foreground")}
          />
        </Link>
        <Navigation />
        <div className="flex items-center gap-2 sm:gap-4 justify-end">
          <Button
            variant="ghost"
            size="icon"
            className={ICON_TARGET}
            aria-label="Search and jump to any page"
            title={`Search (${modLabel} + I)`}
            onClick={() => window.dispatchEvent(new Event("open-command-menu"))}
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button asChild variant="ghost" size="icon" className={ICON_TARGET}>
            <Link href="/feeds" aria-label="RSS feeds" title="RSS feeds">
              <Rss className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <ThemeToggle className={ICON_TARGET} />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
