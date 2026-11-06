export type LatestRelease = { tag: string; date: string; url: string }

export async function latestRelease(repo: string): Promise<LatestRelease | null> {
  const token = process.env.GITHUB_PUBLIC_PAT
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      next: { revalidate: 86400 },
    })
    if (!res.ok) return null
    const r = (await res.json()) as { tag_name: string; published_at: string; html_url: string }
    return { tag: r.tag_name, date: r.published_at, url: r.html_url }
  } catch {
    return null
  }
}

export const releaseDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" })
