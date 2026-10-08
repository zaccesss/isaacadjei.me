"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { useScrollPosition } from "@/hooks/useScrollPosition"
import { cn } from "@/lib/utils"
import Navigation from "./Navigation"
import MobileNav from "./MobileNav"
import ThemeToggle from "@/components/shared/ThemeToggle"
import { Button } from "@/components/ui/button"
import { Rss, Search } from "lucide-react"
import { useModKey } from "@/hooks/useModKey"
import ScriptMark from "@/components/shared/ScriptMark"

const WORDMARK = "isaac adjei"
const RESIGN_MS = 5 * 60 * 1000

function useHeaderIdentity(pathname: string) {
  const [shown, setShown] = useState(WORDMARK)
  const [typing, setTyping] = useState(false)
  const [signKey, setSignKey] = useState(0)
  const firstNav = useRef(true)

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const greeted = sessionStorage.getItem("ia-greeted")

    if (reduce) return
    if (greeted) {
      const t = window.setTimeout(() => setSignKey((k) => k + 1), 0)
      return () => window.clearTimeout(t)
    }

    sessionStorage.setItem("ia-greeted", "1")
    let interval: number | undefined
    const start = window.setTimeout(() => {
      setShown("")
      setTyping(true)
      let i = 0
      interval = window.setInterval(() => {
        i += 1
        setShown(WORDMARK.slice(0, i))
        if (i >= WORDMARK.length) {
          window.clearInterval(interval)
          setTyping(false)
          setSignKey((k) => k + 1)
        }
      }, 80)
    }, 0)

    return () => {
      window.clearTimeout(start)
      window.clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (firstNav.current) {
      firstNav.current = false
      return
    }
    const t = window.setTimeout(() => setSignKey((k) => k + 1), 0)
    return () => window.clearTimeout(t)
  }, [pathname])

  useEffect(() => {
    const id = window.setInterval(() => setSignKey((k) => k + 1), RESIGN_MS)
    return () => window.clearInterval(id)
  }, [])

  return { shown, typing, signKey }
}

export default function Header() {
  const scrollY = useScrollPosition()
  const pathname = usePathname()
  const isScrolled = scrollY > 10
  const isHome = pathname === "/"
  const { shown, typing, signKey } = useHeaderIdentity(pathname)
  const { modLabel } = useModKey()

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-200 border-b",
        isScrolled
          ? "bg-background/95 sm:backdrop-blur-sm sm:supports-backdrop-filter:bg-background/60"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          title="Home"
          aria-label="Isaac Adjei, home"
          className="flex flex-col items-center gap-1 group w-fit rounded-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ScriptMark
            signKey={signKey}
            size={30}
            className={cn("transition-colors", isHome ? "text-foreground" : "text-foreground/90 group-hover:text-foreground")}
          />
          <span
            className={cn(
              "font-mono text-[10px] font-semibold tracking-tight transition-colors leading-none min-h-[10px]",
              isHome ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            )}
          >
            {shown}
            {typing && <span className="ml-px inline-block w-px h-[9px] align-middle bg-primary animate-pulse" />}
          </span>
        </Link>
        <Navigation />
        <div className="flex items-center gap-2 sm:gap-4 justify-end">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search and jump to any page"
            title={`Search (${modLabel} + I)`}
            onClick={() => window.dispatchEvent(new Event("open-command-menu"))}
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button asChild variant="ghost" size="icon">
            <Link href="/feeds" aria-label="RSS feeds" title="RSS feeds">
              <Rss className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
