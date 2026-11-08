import { readFile } from "node:fs/promises"
import { join, normalize, sep } from "node:path"

const ROOT = join(process.cwd(), ".zacess-media")
const TYPES: Record<string, string> = { json: "application/json; charset=utf-8", svg: "image/svg+xml" }

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  if (process.env.NODE_ENV !== "development" && process.env.ZACESS_MEDIA_LOCAL !== "1") return new Response("Not found", { status: 404 })
  const { path } = await params
  const ext = path.at(-1)?.split(".").pop() ?? ""
  const file = normalize(join(ROOT, ...path))
  if (!TYPES[ext] || !file.startsWith(ROOT + sep) || path.some((p) => p === ".." || p.includes("\0"))) return new Response("Not found", { status: 404 })
  try {
    return new Response(await readFile(file), { headers: { "Content-Type": TYPES[ext], "Cache-Control": "no-store" } })
  } catch {
    return new Response("Not found", { status: 404 })
  }
}
