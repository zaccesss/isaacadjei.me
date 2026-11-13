export type AppliedCommit = { url: string; tree: string }

export type Comparison = { status?: string; behind_by?: number }

export const MAINLINE = "mainline"

export const mainlineCommitUrl = (sha: string) =>
  `https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=${sha}`

export function commitSha(url: string): string | null {
  return url.match(/[?&]id=([0-9a-f]{40})(?![0-9a-f])/)?.[1] ?? null
}

export function isInMaster(comparison: Comparison | null | undefined): boolean {
  if (!comparison) return false
  return (comparison.status === "ahead" || comparison.status === "identical") && comparison.behind_by === 0
}

export const needsMainlineCheck = (recorded: AppliedCommit) => recorded.tree !== MAINLINE && commitSha(recorded.url) !== null

export function shownCommit(recorded: AppliedCommit, comparison: Comparison | null | undefined): AppliedCommit {
  const sha = commitSha(recorded.url)
  if (!sha || !needsMainlineCheck(recorded) || !isInMaster(comparison)) return recorded
  return { url: mainlineCommitUrl(sha), tree: MAINLINE }
}

async function compareWithMaster(sha: string): Promise<Comparison | null> {
  const token = process.env.GITHUB_PUBLIC_PAT
  try {
    const res = await fetch(`https://api.github.com/repos/torvalds/linux/compare/${sha}...master?per_page=1&page=2`, {
      headers: { Accept: "application/vnd.github+json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const body = (await res.json()) as Comparison
    return { status: body.status, behind_by: body.behind_by }
  } catch {
    return null
  }
}

export async function currentCommit(recorded: AppliedCommit): Promise<AppliedCommit> {
  const sha = commitSha(recorded.url)
  if (!sha || !needsMainlineCheck(recorded)) return recorded
  return shownCommit(recorded, await compareWithMaster(sha))
}
