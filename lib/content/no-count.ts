export const NO_COUNT_COOKIE = "no_count"

export function asksNotToBeCounted(cookies: string | null | undefined): boolean {
  if (!cookies) return false
  return cookies.split(";").some((pair) => {
    const eq = pair.indexOf("=")
    return eq > 0 && pair.slice(0, eq).trim() === NO_COUNT_COOKIE && pair.slice(eq + 1).trim() === "1"
  })
}
