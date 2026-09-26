export function cdnCache(sMaxage: number, swr: number = sMaxage * 2): Record<string, string> {
  const cdn = `public, s-maxage=${sMaxage}, stale-while-revalidate=${swr}`
  return {
    "Cache-Control": "public, max-age=0, must-revalidate",
    "CDN-Cache-Control": cdn,
    "Vercel-CDN-Cache-Control": cdn,
  }
}
