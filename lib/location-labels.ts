export interface GeocodeRow {
  location: string
  lat: number | null
  lng: number | null
  city?: string | null
  country_code?: string | null
}

export function cityLabel(raw: string, g: Pick<GeocodeRow, "city" | "country_code"> | undefined): string {
  if (g?.city && g?.country_code) return `${g.city}, ${g.country_code}`
  return raw
}

export function isRemoteLocation(raw: string): boolean {
  return /\bremote\b/i.test(raw)
}

export interface LocationPoint {
  location: string
  lat: number
  lng: number
  count: number
}

export function mergeByLabel(rawPoints: LocationPoint[]): LocationPoint[] {
  const merged = new Map<string, { label: string; count: number; latSum: number; lngSum: number }>()
  for (const p of rawPoints) {
    const existing = merged.get(p.location)
    if (existing) {
      existing.count += p.count
      existing.latSum += p.lat * p.count
      existing.lngSum += p.lng * p.count
    } else {
      merged.set(p.location, { label: p.location, count: p.count, latSum: p.lat * p.count, lngSum: p.lng * p.count })
    }
  }
  return Array.from(merged.values()).map((m) => ({
    location: m.label,
    lat: m.latSum / m.count,
    lng: m.lngSum / m.count,
    count: m.count,
  }))
}
