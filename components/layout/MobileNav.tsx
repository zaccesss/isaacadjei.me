"use client"

import { useEffect, useId, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { NAV_LINKS, ROUTES } from "@/lib/constants"

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const panelId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      setOpen(false)
      toggleRef.current?.focus()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <div className="lg:hidden">
      <Button
        ref={toggleRef}
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        aria-expanded={open}
        aria-controls={panelId}
      >
        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 top-16 z-55 bg-black/60" aria-hidden="true" onClick={() => setOpen(false)} />
          <div
            id={panelId}
            className="fixed inset-x-0 top-16 z-60 max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain bg-background border-t shadow-xl"
          >
            <nav aria-label="Main" className="container flex flex-col gap-1 py-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-4 py-3 text-base font-medium rounded-md transition-colors hover:bg-accent",
                    pathname === link.href ? "bg-accent text-primary" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={ROUTES.allPages}
                onClick={() => setOpen(false)}
                className={cn(
                  "px-4 py-3 text-base font-medium rounded-md transition-colors hover:bg-accent",
                  pathname === ROUTES.allPages ? "bg-accent text-primary" : "text-muted-foreground"
                )}
              >
                More
              </Link>
            </nav>
          </div>
        </>
      )}
    </div>
  )
}
