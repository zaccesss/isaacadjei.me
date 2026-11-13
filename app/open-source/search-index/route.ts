import { getOpenSourceStats } from "@/lib/opensource/open-source"
import { toListed, toSearchHits } from "@/lib/opensource/open-source-list"

export const revalidate = 3600

export async function GET() {
  const { contributions } = await getOpenSourceStats()
  return Response.json(toSearchHits(toListed(contributions)))
}
