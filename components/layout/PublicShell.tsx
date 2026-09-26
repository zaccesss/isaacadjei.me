"use client"

import { usePathname } from "next/navigation"
import Header from "./Header"
import Footer from "./Footer"
import MobileBanner from "./MobileBanner"

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname.startsWith("/dashboard") || pathname === "/maintenance") return <>{children}</>

  return (
    <div className="relative flex min-h-dvh flex-col">
      <Header />
      <MobileBanner />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
