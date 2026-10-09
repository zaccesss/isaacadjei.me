"use client"

import { usePathname } from "next/navigation"
import NewsletterForm from "@/components/shared/NewsletterForm"

export default function FooterNewsletter() {
  const pathname = usePathname()
  if (pathname === "/newsletter") return null

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <h2 className="text-sm font-semibold text-foreground">Newsletter</h2>
      <p className="text-[13px] text-muted-foreground">Notes on tech, engineering and projects, straight to your inbox.</p>
      <NewsletterForm variant="compact" />
    </div>
  )
}
