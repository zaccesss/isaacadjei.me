import { GET as combinedFeed } from "../feeds/all.xml/route"

export const dynamic = "force-dynamic"

export function GET(request: Request) {
  return combinedFeed(request)
}
