"use client"

import Link from "@/components/shared/IntentLink"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { NAV_LINKS, ROUTES } from "@/lib/constants"

export default function Navigation() {
  const pathname = usePathname()
  const links = [...NAV_LINKS, { label: "More", href: ROUTES.allPages }]

  return (
    <nav className="hidden lg:flex items-center gap-5">
      {links.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
        return (
          <div key={link.href} className="relative flex flex-col items-center">
            <Link
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              aria-label={link.label === "More" ? "More: every page on the site" : undefined}
              className={cn(
                "relative text-sm font-medium transition-colors hover:text-foreground pb-1 after:absolute after:-inset-x-2.5 after:-inset-y-2.5 after:content-['']",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
            {isActive && <span aria-hidden="true" className="absolute bottom-0 h-0.5 w-4/5 rounded-full bg-primary" />}
          </div>
        )
      })}
    </nav>
  )
}
