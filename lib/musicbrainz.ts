import { redis } from "@/lib/redis"
import { isJunkTag } from "@/lib/lastfm"

const MB_BASE = "https://musicbrainz.org/ws/2"
const USER_AGENT = "isaac-adjei-portfolio/1.0 (https://isaacadjei.me)"

export interface MusicBrainzGenre { name: string; count: number }

let queue: Promise<unknown> = Promise.resolve()
function throttled<T>(fn: () => Promise<T>): Promise<T> {
  const result = queue.then(fn, fn)
  queue = result.then(
    () => new Promise((resolve) => setTimeout(resolve, 1100)),
    () => new Promise((resolve) => setTimeout(resolve, 1100)),
  )
  return result
}

interface MbUrlRelation {
  urls?: { "relation-list"?: { relations?: { artist?: { id?: string } }[] }[] }[]
}
interface MbArtist {
  genres?: { name: string; count: number }[]
}

async function mbFetch<T>(path: string): Promise<T | null> {
  return throttled(async () => {
    try {
      const res = await fetch(`${MB_BASE}${path}`, {
        headers: { "User-Agent": USER_AGENT },
        signal: AbortSignal.timeout(5000),
      })
      if (!res.ok) return null
      return (await res.json()) as T
    } catch {
      return null
    }
  })
}

export async function getMusicBrainzGenresBySpotifyId(spotifyArtistId: string): Promise<MusicBrainzGenre[]> {
  if (!spotifyArtistId) return []
  const cacheKey = `musicbrainz:genres:${spotifyArtistId}`
  if (redis) {
    const cached = await redis.get<MusicBrainzGenre[]>(cacheKey)
    if (cached) return cached
  }

  const spotifyUrl = `https://open.spotify.com/artist/${spotifyArtistId}`
  const urlLookup = await mbFetch<MbUrlRelation>(`/url/?query=url:%22${encodeURIComponent(spotifyUrl)}%22&fmt=json&inc=artist-rels`)
  const mbid = urlLookup?.urls?.[0]?.["relation-list"]?.[0]?.relations?.[0]?.artist?.id
  if (!mbid) {
    if (redis) await redis.set(cacheKey, [], { ex: 60 * 60 * 24 * 7 })
    return []
  }

  const artist = await mbFetch<MbArtist>(`/artist/${mbid}?inc=genres&fmt=json`)
  const raw = (artist?.genres ?? []).filter((g) => !isJunkTag(g.name))
  const maxCount = Math.max(...raw.map((g) => g.count), 1)
  const genres: MusicBrainzGenre[] = raw.map((g) => ({ name: g.name, count: Math.round((g.count / maxCount) * 100) }))
  if (redis) await redis.set(cacheKey, genres, { ex: 60 * 60 * 24 * 7 })
  return genres
}

export async function getMusicBrainzGenresForArtists(
  artists: { id: string; name: string }[],
): Promise<Record<string, MusicBrainzGenre[]>> {
  const out: Record<string, MusicBrainzGenre[]> = {}
  await Promise.all(
    artists.map(async (a) => {
      out[a.name] = await getMusicBrainzGenresBySpotifyId(a.id)
    }),
  )
  return out
}
