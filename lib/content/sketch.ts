export type Stroke = { c: string; w: number; e?: true; p: number[] }
export type Sketch = { w: number; h: number; s: Stroke[] }

export const SKETCH_LIMITS = { bytes: 60 * 1024, strokes: 400, points: 6000, side: 1200 } as const
const COLOUR = /^#[0-9a-f]{6}$/

export function parseSketch(v: unknown): Sketch | null | string {
  if (v === undefined || v === null || v === "") return null
  if (typeof v !== "object" || Array.isArray(v)) return "not a sketch"
  const o = v as Record<string, unknown>
  const w = Number(o.w), h = Number(o.h)
  if (!Number.isInteger(w) || !Number.isInteger(h) || w < 1 || h < 1 || w > SKETCH_LIMITS.side || h > SKETCH_LIMITS.side) return "bad size"
  if (!Array.isArray(o.s)) return "no strokes"
  if (o.s.length > SKETCH_LIMITS.strokes) return "too many strokes"
  let points = 0
  const s: Stroke[] = []
  for (const raw of o.s) {
    if (!raw || typeof raw !== "object") return "bad stroke"
    const st = raw as Record<string, unknown>
    const c = typeof st.c === "string" ? st.c.toLowerCase() : ""
    const width = Number(st.w)
    if (!COLOUR.test(c) || !Number.isFinite(width) || width < 1 || width > 60) return "bad stroke"
    if (!Array.isArray(st.p) || st.p.length < 2 || st.p.length % 2 !== 0) return "bad points"
    const p = st.p.map((n) => Math.round(Number(n)))
    if (p.some((n) => !Number.isFinite(n) || n < -50 || n > SKETCH_LIMITS.side + 50)) return "bad points"
    points += p.length / 2
    if (points > SKETCH_LIMITS.points) return "too many points"
    s.push({ c, w: Math.round(width), ...(st.e === true ? { e: true as const } : {}), p })
  }
  if (s.length === 0) return null
  const out = { w, h, s }
  if (JSON.stringify(out).length > SKETCH_LIMITS.bytes) return "too big"
  return out
}

export const sketchHasInk = (s: Sketch | null | undefined) => !!s && s.s.some((st) => !st.e)
