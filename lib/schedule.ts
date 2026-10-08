export function londonToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" }).format(now)
}

export function isLive(date: string | undefined, now: Date = new Date()): boolean {
  if (!date) return true
  return date.slice(0, 10) <= londonToday(now)
}

export function liveOnly<T extends object>(items: T[], now: Date = new Date()): T[] {
  return items.filter((item) => {
    const { date, published } = item as { date?: string; published?: boolean }
    return published !== false && isLive(date, now)
  })
}

export function secondsUntilLondonMidnight(now: Date = new Date()): number {
  const [y, m, d] = londonToday(now).split("-").map(Number)
  const hourFmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", hourCycle: "h23" })
  for (const offsetHours of [1, 0]) {
    const candidate = new Date(Date.UTC(y, m - 1, d + 1, 0, 0, 0) - offsetHours * 3600_000)
    if (candidate > now && hourFmt.format(candidate) === "00") {
      return Math.max(1, Math.ceil((candidate.getTime() - now.getTime()) / 1000))
    }
  }
  return 3600
}

export function cacheUntilMidnight(maxSeconds = 3600): string {
  const ttl = Math.min(maxSeconds, secondsUntilLondonMidnight())
  return `public, max-age=${ttl}, s-maxage=${ttl}`
}
