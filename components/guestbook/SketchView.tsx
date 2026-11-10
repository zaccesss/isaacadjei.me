import type { Sketch, Stroke } from "@/lib/content/sketch"

const path = (s: Stroke) => {
  const pts: string[] = []
  for (let i = 0; i < s.p.length; i += 2) pts.push(`${s.p[i]} ${s.p[i + 1]}`)
  return `M${pts[0]}L${pts.slice(1).join("L")}`
}

export default function SketchView({ sketch, label, className }: { sketch: Sketch; label: string; className?: string }) {
  const runs: { pen: Stroke[]; erasesAfter: number }[] = []
  const erases: Stroke[] = []
  for (const s of sketch.s) {
    if (s.e) {
      erases.push(s)
    } else {
      const last = runs.at(-1)
      if (last && last.erasesAfter === erases.length) last.pen.push(s)
      else runs.push({ pen: [s], erasesAfter: erases.length })
    }
  }
  const id = `m${Math.abs(JSON.stringify(sketch.s.slice(0, 3)).split("").reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7))}`
  return (
    <svg viewBox={`0 0 ${sketch.w} ${sketch.h}`} role="img" aria-label={label} className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {runs.map((r, i) =>
          r.erasesAfter < erases.length ? (
            <mask key={i} id={`${id}-${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width={sketch.w} height={sketch.h}>
              <rect width={sketch.w} height={sketch.h} fill="#fff" />
              {erases.slice(r.erasesAfter).map((e, j) => (
                <path key={j} d={path(e)} stroke="#000" strokeWidth={e.w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              ))}
            </mask>
          ) : null,
        )}
      </defs>
      {runs.map((r, i) => (
        <g key={i} mask={r.erasesAfter < erases.length ? `url(#${id}-${i})` : undefined}>
          {r.pen.map((s, j) => (
            <path key={j} d={path(s)} stroke={s.c} strokeWidth={s.w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </g>
      ))}
    </svg>
  )
}
