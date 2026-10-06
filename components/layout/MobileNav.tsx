"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { NAV_LINKS, NAV_MORE_LINKS } from "@/lib/constants"

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 top-16 z-55 bg-black/60" onClick={() => setOpen(false)} />
          <div className="fixed inset-x-0 top-16 z-60 bg-background border-t shadow-xl">
            <nav className="container flex flex-col gap-1 py-6">
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
              <p className="mt-3 px-4 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">More</p>
              <div className="grid grid-cols-2 gap-1">
                {NAV_MORE_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "px-4 py-2.5 text-sm font-medium rounded-md transition-colors hover:bg-accent",
                      pathname === link.href ? "bg-accent text-primary" : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  )
}
