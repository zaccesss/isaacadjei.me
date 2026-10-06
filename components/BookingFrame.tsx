"use client"

import { useEffect, useSyncExternalStore } from "react"
import Cal, { getCalApi } from "@calcom/embed-react"
import { useTheme } from "next-themes"

const NAMESPACE = "book"

export function BookingFrame({ calLink }: { calLink: string }) {
  const { resolvedTheme } = useTheme()
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false)
  const theme = resolvedTheme === "dark" ? "dark" : "light"

  useEffect(() => {
    if (!mounted || !resolvedTheme) return
    void getCalApi({ namespace: NAMESPACE }).then((cal) => cal("ui", { theme, hideEventTypeDetails: false }))
  }, [mounted, resolvedTheme, theme])

  if (!mounted || !resolvedTheme) return <div className="min-h-[640px] w-full" aria-hidden="true" />

  return (
    <Cal
      key={theme}
      namespace={NAMESPACE}
      calLink={calLink}
      config={{ layout: "month_view", theme }}
      className="w-full"
      style={{ width: "100%", overflow: "auto" }}
    />
  )
}
