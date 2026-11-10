import { useEffect, useState } from "react"
import manifest from "@/data/projects/zacess/studio-manifest.json"
import { ZACESS_STUDIO_BASE } from "@/lib/content/zacess-media"

export type FrameSource = "scenes" | "games" | "myScenes"

export const FALLBACK_THEME = manifest.fallbackTheme
const available = manifest.available as Record<string, Record<string, string[]> | string[]>

export function frameSources(source: FrameSource, id: string, theme: string, base: string = ZACESS_STUDIO_BASE): { url: string; theme: string }[] {
  const out: { url: string; theme: string }[] = []
  const own = (available[source] as Record<string, string[]>)[theme]
  if (own?.includes(id)) out.push({ url: `${base}/${manifest.layout[source].replace("{theme}", theme).replace("{id}", id)}`, theme })
  if (source !== "myScenes" && (manifest.local[source] as string[]).includes(id)) out.push({ url: `/frames/zacess/${source}/${id}.json`, theme: FALLBACK_THEME })
  return out
}

export function isRecorded(source: FrameSource, id: string): boolean {
  return (
    Object.values(available[source] as Record<string, string[]>).some((l) => l.includes(id)) ||
    (source !== "myScenes" && (manifest.local[source] as string[]).includes(id))
  )
}

const cache = new Map<string, Promise<unknown>>()
function fetchJson(url: string): Promise<unknown> {
  let p = cache.get(url)
  if (!p) {
    p = fetch(url).then((r) => {
      if (!r.ok) throw new Error(String(r.status))
      return r.json()
    })
    p.catch(() => cache.delete(url))
    cache.set(url, p)
  }
  return p
}
export async function fetchFirst(urls: string[]): Promise<{ data: unknown; index: number }> {
  for (let i = 0; i < urls.length; i++) {
    try {
      return { data: await fetchJson(urls[i]), index: i }
    } catch {
      // the next address is tried
    }
  }
  throw new Error("none of the addresses answered")
}

export function useFirst<T>(key: string | null, urls: string[], enabled: boolean) {
  const [state, setState] = useState<{ key: string; data?: T; index?: number; failed?: boolean } | null>(null)
  const joined = urls.join("\n")
  useEffect(() => {
    if (!key || !enabled || !joined) return
    let live = true
    fetchFirst(joined.split("\n"))
      .then(({ data, index }) => { if (live) setState({ key, data: data as T, index }) })
      .catch(() => { if (live) setState({ key, failed: true }) })
    return () => { live = false }
  }, [key, joined, enabled])
  if (!key) return null
  if (!joined) return { key, failed: true }
  return state?.key === key ? state : null
}
