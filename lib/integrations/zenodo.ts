export interface ZenodoRecordStats {
  views: number
  downloads: number
  unique_views?: number
  unique_downloads?: number
}

export async function zenodoStats(recordId: string): Promise<ZenodoRecordStats | null> {
  try {
    const res = await fetch(`https://zenodo.org/api/records/${recordId}`, {
      headers: { Accept: "application/json", "User-Agent": "record-stats/1.0" },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null
    const data = (await res.json()) as { stats?: Partial<ZenodoRecordStats> }
    const stats = data.stats
    if (!stats || typeof stats.views !== "number" || typeof stats.downloads !== "number") return null
    return stats as ZenodoRecordStats
  } catch {
    return null
  }
}
