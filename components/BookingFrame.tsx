"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"

export function BookingFrame({ url }: { url: string }) {
  const { resolvedTheme } = useTheme()
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false)

  if (!mounted || !resolvedTheme) {
    return <div className="h-[760px] w-full rounded-xl border bg-background" aria-hidden="true" />
  }

  const theme = resolvedTheme === "dark" ? "dark" : "light"

  return (
    <iframe
      key={theme}
      src={`${url}?embed=true&layout=month_view&theme=${theme}`}
      title="Booking calendar for a call with Isaac Adjei"
      className="h-[760px] w-full rounded-xl border bg-background"
      loading="lazy"
    />
  )
}
