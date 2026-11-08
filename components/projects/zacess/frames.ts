export interface Frames {
  width: number
  height: number
  fps: number
  background: string
  frames: { x: number; y: number; text: string; colour: string }[][]
}

const FONT = "15px ui-monospace, SFMono-Regular, Menlo, Consolas, 'DejaVu Sans Mono', monospace"
const ROW = 19

type Rect = [number, number, number, number]
const FULL: Rect[] = [[0, 0, 1, 1]]
const TL: Rect = [0, 0, 0.5, 0.5], TR: Rect = [0.5, 0, 1, 0.5], BL: Rect = [0, 0.5, 0.5, 1], BR: Rect = [0.5, 0.5, 1, 1]
const BLOCKS: Record<string, [Rect[], number]> = {
  "█": [FULL, 1], "▀": [[[0, 0, 1, 0.5]], 1], "▄": [[[0, 0.5, 1, 1]], 1],
  "▌": [[[0, 0, 0.5, 1]], 1], "▐": [[[0.5, 0, 1, 1]], 1],
  "▁": [[[0, 0.875, 1, 1]], 1], "▂": [[[0, 0.75, 1, 1]], 1], "▃": [[[0, 0.625, 1, 1]], 1],
  "▅": [[[0, 0.375, 1, 1]], 1], "▆": [[[0, 0.25, 1, 1]], 1], "▇": [[[0, 0.125, 1, 1]], 1],
  "▉": [[[0, 0, 0.875, 1]], 1], "▊": [[[0, 0, 0.75, 1]], 1], "▋": [[[0, 0, 0.625, 1]], 1],
  "▍": [[[0, 0, 0.375, 1]], 1], "▎": [[[0, 0, 0.25, 1]], 1], "▏": [[[0, 0, 0.125, 1]], 1],
  "▔": [[[0, 0, 1, 0.125]], 1], "▕": [[[0.875, 0, 1, 1]], 1],
  "░": [FULL, 0.25], "▒": [FULL, 0.5], "▓": [FULL, 0.75],
  "▖": [[BL], 1], "▗": [[BR], 1], "▘": [[TL], 1], "▝": [[TR], 1],
  "▙": [[TL, BL, BR], 1], "▚": [[TL, BR], 1], "▛": [[TL, TR, BL], 1],
  "▜": [[TL, TR, BR], 1], "▞": [[TR, BL], 1], "▟": [[TR, BL, BR], 1],
}

export function drawFrame(canvas: HTMLCanvasElement, data: Frames, index: number) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  ctx.font = FONT
  const cellWidth = Math.ceil(ctx.measureText("M").width * 10) / 10
  const ratio = window.devicePixelRatio || 1
  const w = Math.round(data.width * cellWidth * ratio)
  const h = Math.round(data.height * ROW * ratio)
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
  }
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  ctx.fillStyle = data.background
  ctx.fillRect(0, 0, data.width * cellWidth, data.height * ROW)
  ctx.font = FONT
  ctx.textBaseline = "middle"
  for (const run of data.frames[index] ?? []) {
    ctx.fillStyle = run.colour
    const chars = Array.from(run.text)
    for (let c = 0; c < chars.length; c++) {
      const ch = chars[c]
      if (ch === " ") continue
      const x = (run.x + c) * cellWidth
      const y = run.y * ROW
      const block = BLOCKS[ch]
      if (block) {
        ctx.globalAlpha = block[1]
        for (const [l, t, r, b] of block[0]) ctx.fillRect(x + l * cellWidth, y + t * ROW, (r - l) * cellWidth + 0.5, (b - t) * ROW + 0.5)
        ctx.globalAlpha = 1
      } else {
        ctx.fillText(ch, x, y + ROW / 2)
      }
    }
  }
}
