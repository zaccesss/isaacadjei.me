import { redis } from "@/lib/redis"

const LASTFM_API_KEY = process.env.LASTFM_API_KEY
const BASE = "https://ws.audioscrobbler.com/2.0/"

const JUNK_TAGS = new Set([
  "seen live", "favorites", "favourites", "favorite", "favourite", "spotify",
  "my music", "love", "beautiful", "amazing", "best", "awesome", "music",
  "under 2000 listeners", "albums i own", "want to see live",
])

const PLACE_TAGS = new Set([
  "uk", "united kingdom", "england", "english", "britain", "british", "scotland", "scottish",
  "wales", "welsh", "ireland", "irish", "france", "french", "germany", "german", "italy", "italian",
  "spain", "spanish", "usa", "america", "american", "canada", "canadian", "australia", "australian",
  "nigeria", "nigerian", "ghana", "ghanaian", "jamaica", "jamaican", "africa", "african", "europe",
  "european", "asia", "asian", "korea", "korean", "japan", "japanese", "china", "chinese", "brazil",
  "brazilian", "mexico", "mexican", "russia", "russian", "india", "indian", "sweden", "swedish",
  "norway", "norwegian", "denmark", "danish", "netherlands", "dutch", "poland", "polish", "portugal",
  "portuguese", "south africa", "south african",
])

export function isJunkTag(name: string): boolean {
  const normalised = name.toLowerCase().trim().replace(/-/g, " ")
  return JUNK_TAGS.has(normalised) || PLACE_TAGS.has(normalised) || normalised.includes("_")
}

export interface LastfmTag { name: string; count: number }

export function genreKey(name: string): string {
  const key = name.toLowerCase().replace(/[\s\-_/&]+/g, "")
  return key.length > 3 ? key.replace(/s$/, "") : key
}

export function mergeGenreTags(...sources: LastfmTag[][]): LastfmTag[] {
  const merged = new Map<string, LastfmTag>()
  for (const tag of sources.flat()) {
    const key = genreKey(tag.name)
    const existing = merged.get(key)
    if (!existing || tag.count > existing.count) merged.set(key, tag)
  }
  return [...merged.values()].sort((a, b) => b.count - a.count)
}

export async function getArtistTags(artist: string): Promise<LastfmTag[]> {
  if (!LASTFM_API_KEY || !artist) return []
  const cacheKey = `lastfm:tags:${artist.toLowerCase()}`
  if (redis) {
    const cached = await redis.get<LastfmTag[]>(cacheKey)
    if (cached) return cached
  }
  try {
    const url =
      `${BASE}?method=artist.gettoptags&artist=${encodeURIComponent(artist)}` +
      `&api_key=${LASTFM_API_KEY}&format=json&autocorrect=1`
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return []
    const data = (await res.json()) as { toptags?: { tag?: { name: string; count: number }[] } }

    const raw = (data.toptags?.tag ?? [])
      .map((t) => ({ name: t.name.toLowerCase().trim(), count: t.count }))
      .filter((t) => t.count > 0 && !isJunkTag(t.name))
    const seen = new Set<string>()
    const tags: LastfmTag[] = []
    for (const t of raw) {
      const k = genreKey(t.name)
      if (seen.has(k)) continue
      seen.add(k)
      tags.push(t)
      if (tags.length >= 5) break
    }

    if (redis) await redis.set(cacheKey, tags, { ex: 60 * 60 * 24 * 7 })
    return tags
  } catch {
    return []
  }
}

export async function getTagsForArtists(names: string[]): Promise<Record<string, LastfmTag[]>> {
  const out: Record<string, LastfmTag[]> = {}
  await Promise.all(
    names.map(async (name) => {
      out[name] = await getArtistTags(name)
    }),
  )
  return out
}

export function aggregateGenres(
  artists: { rank: number; tags: LastfmTag[] }[],
): { genre: string; value: number }[] {
  const totals = new Map<string, { value: number; display: string; count: number }>()
  for (const { rank, tags } of artists) {
    const rankWeight = 1 / Math.sqrt(rank)
    for (const t of tags) {
      const k = genreKey(t.name)
      const cur = totals.get(k)
      if (cur) {
        cur.value += (t.count / 100) * rankWeight
        if (t.count > cur.count) { cur.display = t.name; cur.count = t.count }
      } else {
        totals.set(k, { value: (t.count / 100) * rankWeight, display: t.name, count: t.count })
      }
    }
  }
  return [...totals.values()]
    .map(({ display, value }) => ({ genre: display, value: Math.round(value * 1000) / 1000 }))
    .sort((a, b) => b.value - a.value)
}
