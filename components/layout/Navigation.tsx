"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { NAV_LINKS, ROUTES } from "@/lib/constants"

export default function Navigation() {
  const pathname = usePathname()
  const links = [...NAV_LINKS, { label: "More", href: ROUTES.allPages }]

  return (
    <nav className="hidden lg:flex items-center gap-5">
      {links.map((link) => {
        const isActive = pathname === link.href
        return (
          <div key={link.href} className="relative flex flex-col items-center">
            <Link
              href={link.href}
              aria-label={link.label === "More" ? "More: every page on the site" : undefined}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground pb-1",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
            {isActive && <span className="absolute bottom-0 h-0.5 w-4/5 rounded-full bg-primary" />}
          </div>
        )
      })}
    </nav>
  )
}
