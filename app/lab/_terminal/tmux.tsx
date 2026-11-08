"use client"

import { useEffect, useRef, useState } from "react"
import { drawFrame, type Frames } from "@/components/projects/zacess/frames"
import { useFirst } from "@/components/projects/zacess/sources"
import { candidates } from "./scenes"
import s from "../terminal.module.css"

type Dir = "h" | "v"
type Kind = "editor" | "shell" | "logs" | "scene" | "monitor" | "git"
export type TmuxStart = "tmux" | "ide" | "idev" | "imon"

interface Win {
  name: string
  panes: Kind[]
  dir: Dir
  grid?: { columns: string; rows: string; areas: string[] }
  active: number
  zoom: boolean
}

const MAX_PANES = 4
const pad = (n: number) => String(n).padStart(2, "0")
const stamp = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
const win = (name: string, panes: Kind[], grid?: Win["grid"]): Win => ({ name, panes, dir: "h", grid, active: 0, zoom: false })

const SESSIONS: Record<TmuxStart, { name: string; windows: Win[] }> = {
  tmux: { name: "lab", windows: [win("editor", ["editor"]), win("shell", ["shell"])] },
  ide: {
    name: "portfolio",
    windows: [win("editor", ["editor", "shell", "scene"], { columns: "65fr 35fr", rows: "70fr 30fr", areas: ["a a", "b c"] }), win("git", ["git"])],
  },
  idev: {
    name: "portfolio-dev",
    windows: [win("editor", ["editor", "shell", "logs", "scene"], { columns: "35fr 40fr 25fr", rows: "65fr 35fr", areas: ["a a a", "b c d"] }), win("git", ["git"])],
  },
  imon: {
    name: "portfolio-mon",
    windows: [win("monitor", ["monitor", "shell", "scene"], { columns: "65fr 35fr", rows: "1fr 1fr", areas: ["a b", "a c"] })],
  },
}

const TAB: Record<string, string> = { editor: s.cyan, git: s.green, search: s.yellow, shell: s.magenta }

const KEYS: [string, string][] = [
  ["|", "split side by side"],
  ["-", "split top to bottom"],
  ["h j k l", "move between panes"],
  ["c", "new window"],
  ["n p", "next or previous window"],
  ["1 to 9", "go to a window"],
  ["z", "zoom the pane"],
  ["x", "close the pane"],
  ["&", "close the window"],
  ["r", "reload the config"],
  ["d", "detach"],
]

const TITLE: Record<Kind, string> = { editor: "nvim", shell: "zsh", logs: "npm run dev", scene: "zacess-scenes", monitor: "stats", git: "lazygit" }

function paneText(kind: Kind, handle: string): string[] {
  const prompt = `${handle}@lab ~ %`
  if (kind === "editor") return ["  1 # portfolio", "  2 ", "  3 set -g mouse on", "  4 set -g base-index 1", "~", "~"]
  if (kind === "logs") return ["> portfolio dev", "> next dev", "", "▲ Next.js", "- Local: http://localhost:3000", "✓ Ready", " GET /lab 200", " GET /api/wakatime-stats 200"]
  if (kind === "git") return ["Status", " main", "Files", " nothing to commit", "Branches", " main"]
  return [prompt, ""]
}

function ScenePane({ theme, reduced }: { theme: string; reduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frame = useRef(0)
  const sources = candidates({ source: "scenes", id: "harbour" }, theme)
  const frames = useFirst<Frames>(`tmux:harbour:${theme}`, sources.map((c) => c.url), true)
  const data = frames?.data ?? null
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const onVisible = () => setHidden(document.hidden)
    document.addEventListener("visibilitychange", onVisible)
    return () => document.removeEventListener("visibilitychange", onVisible)
  }, [])
  useEffect(() => {
    if (!data || !canvasRef.current) return
    frame.current = 0
    drawFrame(canvasRef.current, data, 0)
  }, [data])
  useEffect(() => {
    if (!data || reduced || hidden) return
    const id = window.setInterval(() => {
      frame.current = (frame.current + 1) % data.frames.length
      if (canvasRef.current) drawFrame(canvasRef.current, data, frame.current)
    }, 1000 / data.fps)
    return () => window.clearInterval(id)
  }, [data, reduced, hidden])

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} role="img" aria-label="The harbour scene from Zacess Scenes" className={s.recordingCanvas} hidden={!data} />
      {!data && <p className={`${s.dim} px-1`}>{frames?.failed ? "no recording" : "loading"}</p>}
    </div>
  )
}

interface Stats {
  totalSeconds: number
  languages?: { name: string; total_seconds: number }[]
  editors?: { name: string; total_seconds: number }[]
}

function MonitorPane() {
  const [state, setState] = useState<{ data?: Stats; failed?: boolean }>({})
  useEffect(() => {
    let current = true
    fetch("/api/wakatime-stats?period=all")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: Stats) => current && setState("totalSeconds" in d ? { data: d } : { failed: true }))
      .catch(() => current && setState({ failed: true }))
    return () => {
      current = false
    }
  }, [])
  const { data, failed } = state
  if (failed) return <p className={`${s.dim} px-1`}>stats unavailable right now</p>
  if (!data) return <p className={`${s.dim} px-1`}>loading</p>
  const bars = (title: string, list: { name: string; total_seconds: number }[] | undefined, tone: string) => (
    <div className="px-1 pb-1">
      <p className={`${s.fg} font-bold`}>{title}</p>
      {(list ?? []).slice(0, 4).map((x) => {
        const pct = data.totalSeconds > 0 ? Math.round((x.total_seconds / data.totalSeconds) * 100) : 0
        return (
          <p key={x.name} className={`${s.fg} whitespace-pre`}>
            <span className={tone}>{"█".repeat(Math.max(1, Math.round(pct / 5)))}</span>
            {` ${pct}% ${x.name}`}
          </p>
        )
      })}
    </div>
  )
  return (
    <div>
      <p className={`${s.dim} px-1`}>{Math.round(data.totalSeconds / 3600).toLocaleString("en-GB")} h coding, all time</p>
      {bars("languages", data.languages, s.cyan)}
      {bars("editors", data.editors, s.magenta)}
    </div>
  )
}

export function TmuxView({
  start,
  handle,
  theme,
  reduced,
  heightClass,
  onExit,
}: {
  start: TmuxStart
  handle: string
  theme: string
  reduced: boolean
  heightClass: string
  onExit: (message: string) => void
}) {
  const session = SESSIONS[start]
  const [wins, setWins] = useState<Win[]>(session.windows)
  const [cur, setCur] = useState(0)
  const [prefix, setPrefix] = useState(false)
  const [said, setSaid] = useState(`tmux session ${session.name}, window 1 of ${session.windows.length}. Press Control B, then a key. Control B then ? lists the keys.`)
  const [now, setNow] = useState(() => new Date())
  const regionRef = useRef<HTMLDivElement>(null)
  const w = wins[cur]

  useEffect(() => {
    regionRef.current?.focus()
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const say = (text: string) => setSaid(text)
  const update = (fn: (win: Win) => Win) => setWins((prev) => prev.map((x, i) => (i === cur ? fn(x) : x)))

  const split = (dir: Dir) => {
    if (w.grid) return say("This window keeps the layout the ide command built. Open a new window with c to split freely.")
    if (w.panes.length >= MAX_PANES) return say(`No room for a fifth pane: this demo holds ${MAX_PANES} in a window.`)
    if (w.panes.length > 1 && w.dir !== dir) return say(`This window is already split ${w.dir === "h" ? "side by side" : "top to bottom"}: the demo keeps one direction in a window.`)
    update((x) => ({ ...x, dir, panes: [...x.panes, "shell"], active: x.panes.length, zoom: false }))
    say(`Split ${dir === "h" ? "side by side" : "top to bottom"}: pane ${w.panes.length + 1} of ${w.panes.length + 1} is active.`)
  }
  const movePane = (delta: number) => {
    if (w.panes.length < 2) return say("One pane: nothing to move to.")
    const active = (w.active + delta + w.panes.length) % w.panes.length
    update((x) => ({ ...x, active, zoom: false }))
    say(`Pane ${active + 1} of ${w.panes.length} is active: ${TITLE[w.panes[active]]}.`)
  }
  const go = (i: number) => {
    if (i < 0 || i >= wins.length) return say(`Can't find window ${i + 1}.`)
    setCur(i)
    say(`Window ${i + 1} of ${wins.length}: ${wins[i].name}.`)
  }
  const newWindow = () => {
    setWins((prev) => [...prev, win("zsh", ["shell"])])
    setCur(wins.length)
    say(`New window ${wins.length + 1}: zsh.`)
  }
  const detach = () => onExit(`[detached (from session ${session.name})]`)
  const killWindow = () => {
    if (wins.length === 1) return onExit("[exited]")
    setWins((prev) => prev.filter((_, i) => i !== cur))
    const next = Math.max(0, cur - 1)
    setCur(next)
    say(`Window closed. The rest are renumbered. Window ${next + 1} is showing.`)
  }
  const killPane = () => {
    if (w.panes.length === 1) return killWindow()
    if (w.grid) return say("This window keeps the layout the ide command built. Close the whole window with Control B then &.")
    update((x) => ({ ...x, panes: x.panes.filter((_, i) => i !== x.active), active: Math.min(x.active, x.panes.length - 2), zoom: false }))
    say(`Pane closed: ${w.panes.length - 1} left.`)
  }
  const zoom = () => {
    if (w.panes.length < 2) return say("One pane: nothing to zoom.")
    update((x) => ({ ...x, zoom: !x.zoom }))
    say(w.zoom ? "Zoom off." : `Zoomed: pane ${w.active + 1} fills the window.`)
  }

  const run = (k: string) => {
    if (k === "|") split("h")
    else if (k === "-") split("v")
    else if (k === "h" || k === "k") movePane(-1)
    else if (k === "j" || k === "l") movePane(1)
    else if (k === "H" || k === "J" || k === "K" || k === "L") say("Resized by 5. The demo keeps its panes an equal size.")
    else if (k === "c") newWindow()
    else if (k === "n") go((cur + 1) % wins.length)
    else if (k === "p") go((cur - 1 + wins.length) % wins.length)
    else if (/^[1-9]$/.test(k)) go(Number(k) - 1)
    else if (k === "x") killPane()
    else if (k === "&") killWindow()
    else if (k === "z") zoom()
    else if (k === "d") detach()
    else if (k === "r") say("tmux config reloaded")
    else if (k === "f") say("The project list opens in the real tmux with Control B then f. There are no projects here.")
    else if (k === "?") say(`Keys after Control B: ${KEYS.map(([key, what]) => `${key}, ${what}`).join("; ")}.`)
    else return false
    return true
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Control" || e.key === "Shift" || e.key === "Alt" || e.key === "Meta") return
    if (prefix) {
      setPrefix(false)
      if (e.key === "Escape") say("Prefix cancelled.")
      else if (!run(e.key)) say(`Unknown key: ${e.key}. Control B then ? lists the keys.`)
      e.preventDefault()
      e.stopPropagation()
      return
    }
    if (e.ctrlKey && (e.key === "b" || e.key === "B")) {
      setPrefix(true)
      say("Prefix. Press a key: ? lists them.")
    } else if (e.key === "Escape") {
      return
    } else {
      say("Control B is the prefix. Press it, then a key: ? lists them.")
    }
    e.preventDefault()
    e.stopPropagation()
  }

  const shown = w.zoom ? [w.active] : w.panes.map((_, i) => i)
  const gridded = Boolean(w.grid) && !w.zoom
  const chips: [string, () => void][] = [
    ["| split", () => split("h")],
    ["- split", () => split("v")],
    ["h pane", () => movePane(-1)],
    ["l pane", () => movePane(1)],
    ["c new window", newWindow],
    ["n next", () => go((cur + 1) % wins.length)],
    ["z zoom", zoom],
    ["x close pane", killPane],
    ["d detach", detach],
  ]

  return (
    <div
      ref={regionRef}
      role="region"
      tabIndex={0}
      aria-label={`tmux session ${session.name}, window ${cur + 1}: ${w.name}. Press Control B then a key. | and - split, h j k l move, c new window, n and p change window, z zoom, x close, d detach.`}
      onKeyDown={onKeyDown}
      className={`${s.viewRegion} flex flex-col pt-2 ${heightClass}`}
    >
      <div
        className={`flex-1 min-h-0 gap-1 px-1 sm:px-2 ${gridded ? "grid" : `flex ${w.dir === "h" ? "flex-row" : "flex-col"}`}`}
        style={gridded ? { gridTemplateColumns: w.grid!.columns, gridTemplateRows: w.grid!.rows, gridTemplateAreas: w.grid!.areas.map((a) => `"${a}"`).join(" ") } : undefined}
      >
        {shown.map((i) => {
          const here = i === w.active
          const kind = w.panes[i]
          return (
            <div
              key={`${cur}:${i}`}
              style={gridded ? { gridArea: "abcd"[i] } : undefined}
              className={`${s.line} ${gridded ? "" : "flex-1"} min-w-0 min-h-0 overflow-hidden border text-xs leading-5 ${here ? "border-[var(--t-green)]" : "border-[var(--t-border)]"}`}
            >
              <p className={`${here ? s.green : s.dim} px-1 font-bold truncate`} aria-hidden="true">
                {here && w.panes.length > 1 ? "▸ " : ""}
                {i + 1} {TITLE[kind]}
              </p>
              {kind === "scene" ? (
                <div className="h-[calc(100%-1.25rem)]">
                  <ScenePane theme={theme} reduced={reduced} />
                </div>
              ) : kind === "monitor" ? (
                <MonitorPane />
              ) : (
                paneText(kind, handle).map((text, n) => (
                  <p key={n} className={`${s.fg} px-1`} aria-hidden="true">
                    {text || " "}
                  </p>
                ))
              )}
            </div>
          )
        })}
      </div>
      <div className={`${s.tmux} flex items-stretch text-xs leading-6 shrink-0 mt-1`} aria-hidden="true">
        <span className="px-2 font-bold">{session.name}</span>
        <span className="flex-1 min-w-0 flex overflow-hidden">
          {wins.map((x, i) =>
            i === cur ? (
              <span key={i} className={`${s.tmuxCurrent} font-bold whitespace-nowrap`}>
                {i + 1}:{x.name}*{x.zoom ? "Z" : ""}
              </span>
            ) : (
              <span key={i} className={`${TAB[x.name] ?? s.blue} px-1 whitespace-nowrap`}>
                {i + 1}:{x.name}
              </span>
            ),
          )}
        </span>
        {prefix && <span className="px-2 font-bold">^B</span>}
        <span className="px-2 hidden sm:inline">{stamp(now)}</span>
      </div>
      <div className="flex flex-wrap gap-1 px-1 sm:px-2 pt-1 shrink-0">
        {chips.map(([label, action]) => (
          <button key={label} type="button" onClick={() => { action(); regionRef.current?.focus() }} className={`${s.chip} min-h-11 px-3 rounded text-xs`}>
            {label}
          </button>
        ))}
      </div>
      <p className={`${s.line} ${s.dim} text-xs px-1 sm:px-2 pt-1 shrink-0`} role="status" aria-live="polite">
        {said}
      </p>
    </div>
  )
}
