"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { NAV_LINKS, NAV_MORE_LINKS } from "@/lib/constants"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navigation() {
  const pathname = usePathname()
  const moreActive = NAV_MORE_LINKS.some((link) => pathname === link.href)
  const pages = NAV_MORE_LINKS.filter((link) => link.href !== "/all-pages")

  return (
    <nav className="hidden md:flex items-center gap-5">
      {NAV_LINKS.map((link) => {
        const isActive = pathname === link.href
        return (
          <div key={link.href} className="relative flex flex-col items-center">
            <Link
              href={link.href}
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

      <DropdownMenu>
        <div className="relative flex flex-col items-center">
          <DropdownMenuTrigger
            className={cn(
              "group inline-flex items-center gap-1 pb-1 text-sm font-medium transition-colors hover:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-sm",
              moreActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            More
            <ChevronDown
              className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </DropdownMenuTrigger>
          {moreActive && <span className="absolute bottom-0 h-0.5 w-full rounded-full bg-primary" />}
        </div>
        <DropdownMenuContent align="end" sideOffset={10} className="w-44">
          {pages.map((link) => (
            <DropdownMenuItem key={link.href} asChild>
              <Link href={link.href} className={cn(pathname === link.href && "text-primary")}>
                {link.label}
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/all-pages">All pages</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}
