"use client"

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react"
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react"
import { Box, Check, ChevronDown, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import manifest from "@/data/projects/zacess/studio-manifest.json"
import { ZACESS_THEMES } from "@/data/projects/zacess/themes-preview"
import { ZACESS_STUDIO_BASE } from "@/lib/zacess-media"
import { drawFrame, type Frames } from "./frames"
import { frameSources, isRecorded, useFirst, type FrameSource } from "./sources"
import { SoundPanel } from "./SoundPanel"
import styles from "./studio.module.css"

type Mode = "scenes" | "games" | "code" | "profile"
type Source = FrameSource
type Theme = (typeof ZACESS_THEMES.themes)[number]

interface CodeSample {
  label: string
  background: string
  foreground: string
  lines: [string, string, number][][]
}
interface Profile {
  id: string
  name: string
  description?: string
  needs: {
    reduce_motion?: boolean
    cursor_size?: string
    focus_ring_width_px?: number
    line_spacing?: number
    contrast?: { text?: number }
    font?: { family?: string; size_pt?: number }
  }
  palette: Record<string, string> & { syntax?: Record<string, string>; terminal?: { ansi?: string[] } }
  file?: string
  toml: string
  check: { command: string; output: string; passed: boolean } | null
}

const MODES: { id: Mode; label: string }[] = [
  { id: "scenes", label: "Scenes" },
  { id: "games", label: "Games" },
  { id: "code", label: "Editor themes" },
  { id: "profile", label: "Profile" },
]
const ITEM_LEGEND: Record<Mode, string> = { scenes: "Scene", games: "Game", code: "Language", profile: "Starter profile" }
const KIND: Record<string, string> = { general: "Original scenes", pass: "Pass scenes", fail: "Fail scenes" }
const EXT: Record<string, string> = {
  typescript: "ts", javascript: "js", python: "py", rust: "rs", java: "java", c: "c", cpp: "cpp", csharp: "cs", go: "go", php: "php",
  ruby: "rb", swift: "swift", kotlin: "kt", html: "html", css: "css", json: "json", yaml: "yaml", markdown: "md", bash: "sh", sql: "sql",
}
const available = manifest.available as Record<string, Record<string, string[]> | string[]>
const DEFAULT_SCENE = "harbour"
const DEFAULT_GAME = "drift"

export const words = (slug: string): string => {
  const t = slug.replace(/-/g, " ")
  return t.charAt(0).toUpperCase() + t.slice(1)
}
const themeById = (id: string): Theme => ZACESS_THEMES.themes.find((t) => t.id === id) ?? ZACESS_THEMES.themes[0]
const shortName = (name: string) => name.replace(/^Zacess /, "")

export { frameSources }

const REDUCE = "(prefers-reduced-motion: reduce)"
const subscribeReduce = (cb: () => void) => {
  const m = window.matchMedia(REDUCE)
  m.addEventListener("change", cb)
  return () => m.removeEventListener("change", cb)
}
const readReduce = () => window.matchMedia(REDUCE).matches

type TomlKind = "comment" | "header" | "key" | "string" | "number" | "bool" | "plain"
export function tomlTokens(line: string): { text: string; kind: TomlKind }[] {
  if (/^\s*#/.test(line)) return [{ text: line, kind: "comment" }]
  if (/^\s*\[/.test(line)) return [{ text: line, kind: "header" }]
  const out: { text: string; kind: TomlKind }[] = []
  let rest = line
  const pair = /^(\s*)([A-Za-z0-9_-]+)(\s*=\s*)/.exec(line)
  if (pair) {
    out.push({ text: pair[1], kind: "plain" }, { text: pair[2], kind: "key" }, { text: pair[3], kind: "plain" })
    rest = line.slice(pair[0].length)
  }
  const re = /("(?:[^"\\]|\\.)*")|\b(true|false)\b|(-?\d+(?:\.\d+)?)(?![\w#])/g
  let last = 0
  for (let m = re.exec(rest); m; m = re.exec(rest)) {
    if (m.index > last) out.push({ text: rest.slice(last, m.index), kind: "plain" })
    out.push({ text: m[0], kind: m[1] ? "string" : m[2] ? "bool" : "number" })
    last = re.lastIndex
  }
  if (last < rest.length) out.push({ text: rest.slice(last), kind: "plain" })
  return out
}

export function needsLine(p: Pick<Profile, "needs">): string {
  const n = p.needs ?? {}
  const parts: string[] = []
  if (n.contrast?.text) parts.push(`text contrast ${n.contrast.text}:1 or more`)
  if (n.font) parts.push(`${n.font.family ?? "the system font"}${n.font.size_pt ? ` at ${n.font.size_pt} point` : ""}`)
  if (n.line_spacing) parts.push(`line spacing ${n.line_spacing}`)
  if (n.cursor_size) parts.push(`a ${n.cursor_size} cursor`)
  if (n.reduce_motion) parts.push("reduced motion")
  if (!parts.length) return ""
  const last = parts.pop()
  return `Needs: ${parts.length ? `${parts.join(", ")} and ${last}` : last}.`
}

function themeVars(t: Theme): CSSProperties {
  return {
    "--t-bg": t.ui.background,
    "--t-fg": t.ui.foreground,
    "--t-border": t.ui.border,
    "--t-bar": t.ui.lineHighlight,
    "--t-muted": t.ui.lineNumber,
    "--t-accent": t.syntax.function,
    "--t-cursor": t.ui.foreground,
    "--t-focus": t.ui.lineNumberActive,
  } as CSSProperties
}
function profileVars(p: Profile): CSSProperties {
  const pal = p.palette
  const size = p.needs.font?.size_pt
  return {
    "--t-bg": pal.background,
    "--t-fg": pal.foreground,
    "--t-border": pal.border,
    "--t-bar": pal.surface_alt ?? pal.surface,
    "--t-muted": pal.muted,
    "--t-accent": pal.accent,
    "--t-cursor": pal.cursor ?? pal.foreground,
    "--t-focus": pal.focus_ring ?? pal.accent,
    "--scale": size ? Math.max(0.8, Math.min(1.6, size / 14)).toFixed(3) : undefined,
    "--leading": p.needs.line_spacing ?? undefined,
    "--cursor-w": p.needs.cursor_size === "large" ? "1ch" : p.needs.cursor_size === "small" ? "0.15ch" : "0.55ch",
    "--ring-w": p.needs.focus_ring_width_px ? `${p.needs.focus_ring_width_px}px` : undefined,
  } as CSSProperties
}

interface Item { value: string; label: string; description: string; source?: Source; id: string; group?: string }

function buildItems(): Record<Mode, Item[]> {
  const playable = isRecorded
  const mine: Item[] = (manifest.catalogue.myScenes as { id: string; name?: string; description: string }[]).map((s) => ({ value: `my:${s.id}`, id: s.id, label: s.name ?? words(s.id), description: s.description, source: "myScenes", group: "My scenes" }))
  const release: Item[] = ["general", "pass", "fail"].flatMap((k) =>
    manifest.catalogue.scenes
      .filter((s) => s.kind === k && playable("scenes", s.id))
      .map((s) => ({ value: s.id, id: s.id, label: words(s.id), description: s.description, source: "scenes" as Source, group: KIND[k] })),
  )
  const games: Item[] = manifest.catalogue.games.filter((g) => playable("games", g.id)).map((g) => ({ value: g.id, id: g.id, label: g.name, description: g.description, source: "games" }))
  const code: Item[] = manifest.catalogue.languages.map((l) => ({ value: l.id, id: l.id, label: l.name, description: "" }))
  const profileIds = new Set([...manifest.local.profile, ...(available.profile as string[])])
  const profile: Item[] = ZACESS_THEMES.themes
    .filter((t) => profileIds.has(`zacess-${t.id}`))
    .map((t) => ({ value: `zacess-${t.id}`, id: `zacess-${t.id}`, label: t.name, description: "" }))
  return { scenes: [...mine, ...release], games, code, profile }
}

const OPTION =
  "flex min-h-11 w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm leading-tight peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background"
const OPTION_ON = "border-2 border-primary bg-primary/10 font-semibold text-foreground"
const OPTION_OFF = "border border-border bg-background text-foreground/90 hover:bg-muted"
const SELECT =
  "min-h-11 w-full min-w-0 appearance-none rounded-md border border-border bg-background py-2 pl-3 pr-9 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
const BUTTON =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

function Option({ name, value, checked, onPick, children }: { name: string; value: string; checked: boolean; onPick: (v: string) => void; children: React.ReactNode }) {
  return (
    <label className="relative block">
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onPick(value)} className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0" />
      <span className={`${OPTION} ${checked ? OPTION_ON : OPTION_OFF}`}>
        <span aria-hidden="true" className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border-2 ${checked ? "border-primary bg-primary text-primary-foreground" : "border-foreground/60"}`}>
          {checked && <Check className="h-3 w-3" strokeWidth={3} />}
        </span>
        {children}
      </span>
    </label>
  )
}

function Picker({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative min-w-0 flex-1">
      <select {...props} className={SELECT}>{children}</select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}

const ITEMS = buildItems()

export default function ZacessStudio() {
  const items = ITEMS
  const [mode, setMode] = useState<Mode>("scenes")
  const [theme, setTheme] = useState("deep-contrast-dark")
  const [chosen, setChosen] = useState<Record<Mode, string>>(() => ({
    scenes: items.scenes.find((i) => i.value === DEFAULT_SCENE)?.value ?? items.scenes[0]?.value ?? "",
    games: items.games.find((i) => i.value === DEFAULT_GAME)?.value ?? items.games[0]?.value ?? "",
    code: items.code[0]?.value ?? "",
    profile: items.profile.find((p) => p.value === "zacess-deep-contrast-dark")?.value ?? items.profile[0]?.value ?? "",
  }))
  const [playChoice, setPlayChoice] = useState<boolean | null>(null)
  const [tilt, setTilt] = useState(false)
  const reduce = useSyncExternalStore(subscribeReduce, readReduce, () => true)
  const playing = playChoice ?? !reduce
  const flat = reduce || !tilt
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [status, setStatus] = useState("")
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frame = useRef(0)

  const item = items[mode].find((i) => i.value === chosen[mode]) ?? items[mode][0]
  const isFrames = mode === "scenes" || mode === "games"
  const uid = useId()
  const currentTheme = themeById(theme)
  const position = Math.max(1, items[mode].findIndex((i) => i.value === item?.value) + 1)
  const groups: [string, Item[]][] = []
  for (const it of items[mode]) {
    const last = groups[groups.length - 1]
    if (last && last[0] === (it.group ?? "")) last[1].push(it)
    else groups.push([it.group ?? "", [it]])
  }
  const themeName = (id: string) => themeById(id).name

  const sources = isFrames && item?.source ? frameSources(item.source, item.id, theme) : []
  const framesKey = isFrames && item ? `${item.source}:${item.id}:${theme}` : null
  const frames = useFirst<Frames>(framesKey, sources.map((s) => s.url), near)
  const shownTheme = frames?.data && frames.index !== undefined ? sources[frames.index].theme : theme
  const codeKey = mode === "code" && item ? `${theme}/${item.id}` : null
  const code = useFirst<CodeSample>(codeKey, codeKey ? [`/frames/zacess/code/${codeKey}.json`] : [], near)
  const profileUrls = mode === "profile" && item
    ? [...((available.profile as string[]).includes(item.id) ? [`${ZACESS_STUDIO_BASE}/${manifest.layout.profile.replace("{id}", item.id)}`] : []), ...(manifest.local.profile.includes(item.id) ? [`/frames/zacess/profile/${item.id}.json`] : [])]
    : []
  const profile = useFirst<Profile>(mode === "profile" && item ? item.id : null, profileUrls, near)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const nearObs = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setNear(true)
        nearObs.disconnect()
      }
    }, { rootMargin: "400px 0px" })
    const visObs = new IntersectionObserver((entries) => setVisible(entries[0]?.isIntersecting ?? false))
    nearObs.observe(el)
    visObs.observe(el)
    return () => {
      nearObs.disconnect()
      visObs.disconnect()
    }
  }, [])

  useEffect(() => {
    const onVis = () => setHidden(document.hidden)
    document.addEventListener("visibilitychange", onVis)
    return () => document.removeEventListener("visibilitychange", onVis)
  }, [])

  useEffect(() => {
    const m = window.matchMedia(REDUCE)
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setPlayChoice(false)
        setStatus("Paused")
      }
    }
    m.addEventListener("change", onChange)
    return () => m.removeEventListener("change", onChange)
  }, [])

  const data = frames?.data ?? null
  useEffect(() => {
    if (!data || !canvasRef.current) return
    frame.current = 0
    drawFrame(canvasRef.current, data, 0)
  }, [data])

  useEffect(() => {
    if (!data || !playing || !visible || hidden) return
    const id = window.setInterval(() => {
      frame.current = (frame.current + 1) % data.frames.length
      if (canvasRef.current) drawFrame(canvasRef.current, data, frame.current)
    }, 1000 / data.fps)
    return () => window.clearInterval(id)
  }, [data, playing, visible, hidden])

  const pickMode = useCallback((m: string) => {
    setMode(m as Mode)
    setStatus(`Showing ${MODES.find((x) => x.id === m)?.label ?? m}`)
  }, [])
  const pickTheme = useCallback((t: string) => {
    setTheme(t)
    if (items.profile.some((p) => p.value === `zacess-${t}`)) setChosen((c) => ({ ...c, profile: `zacess-${t}` }))
    setStatus(`${themeById(t).name} chosen`)
  }, [items.profile])
  const pickItem = useCallback((v: string) => {
    setChosen((c) => ({ ...c, [mode]: v }))
    const it = items[mode].find((i) => i.value === v)
    if (mode === "profile") setTheme(v.replace(/^zacess-/, ""))
    setStatus(`${it?.label ?? v} chosen`)
  }, [items, mode])

  const step = useCallback((by: number) => {
    const list = items[mode]
    if (!list.length) return
    const at = list.findIndex((i) => i.value === item?.value)
    pickItem(list[(at + by + list.length) % list.length].value)
  }, [items, mode, item, pickItem])

  const togglePlay = useCallback(() => {
    setStatus(playing ? "Paused" : "Playing")
    setPlayChoice(!playing)
  }, [playing])

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current
    if (!stage || flat || e.pointerType !== "mouse") return
    const box = stage.getBoundingClientRect()
    const x = (e.clientX - box.left) / box.width - 0.5
    const y = (e.clientY - box.top) / box.height - 0.5
    stage.style.setProperty("--ry", `${(-12 + x * 8).toFixed(2)}deg`)
    stage.style.setProperty("--rx", `${(8 - y * 6).toFixed(2)}deg`)
  }, [flat])
  const onPointerLeave = useCallback(() => {
    stageRef.current?.style.removeProperty("--rx")
    stageRef.current?.style.removeProperty("--ry")
  }, [])

  const screenStyle = mode === "profile" && profile?.data ? profileVars(profile.data) : themeVars(themeById(mode === "profile" ? item?.id.replace(/^zacess-/, "") ?? theme : isFrames ? shownTheme : theme))
  const barTitle = !item ? "" : mode === "scenes" ? `zacess-scenes ${item.id}` : mode === "games" ? `zacess-games ${item.id}` : mode === "code" ? `sample.${EXT[item.id] ?? "txt"}` : `${item.id}.toml`
  const barTheme = mode === "profile" ? item?.label ?? "" : themeName(isFrames ? shownTheme : theme)

  let note = ""
  if (isFrames && item) {
    const kind = mode === "scenes" ? "scene" : "game"
    if (!sources.length) note = `This ${kind} has not been recorded in ${themeName(theme)} yet.`
    else if (!near || !frames) note = "The recording loads as you reach it."
    else if (frames.failed) note = item.source === "myScenes" ? "This recording is not on the media server yet." : "The recording could not load."
    else if (shownTheme !== theme) note = `Not recorded in ${themeName(theme)} yet, so this is the ${themeName(shownTheme)} recording from the latest release.`
    else if (item.source === "myScenes") note = `One of my own Lua scenes, recorded at 80 by 24 in ${themeName(theme)} with the clock at ${manifest.recording.clock}.`
    else note = `A recording at 80 by 24 in ${themeName(theme)}.`
  } else if (mode === "code" && item) {
    note = code?.failed ? "The sample could not load." : `Coloured with the ${themeName(theme)} editor theme.`
  } else if (mode === "profile") {
    note = profile?.failed ? "The profile could not load." : profile?.data ? needsLine(profile.data) : ""
  }
  const description = mode === "code" && item ? `The ${item.label} sample from the zacess.com code themes playground.` : mode === "profile" ? profile?.data?.description ?? "" : item?.description ?? ""
  const label = item ? (mode === "scenes" ? `The ${item.label.toLowerCase()} scene` : item.label) : ""
  const canvasLabel = `${label} in ${themeName(shownTheme)}${item?.description ? `: ${item.description}` : ""}`

  return (
    <div ref={rootRef} data-zacess-studio="" className={`${styles.root} ${flat ? styles.flat : ""} @container my-6`}>
      <div className="grid gap-6 @5xl:grid-cols-[minmax(0,1fr)_17rem]">
      <div className={styles.main}>
        <div ref={stageRef} className={styles.stage} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
          <div className={styles.device}>
            <div className={styles.lid}>
              <div className={styles.screen} style={screenStyle}>
                <p className={styles.bar}>
                  <span>{barTitle}</span>
                  <span className={styles.barTheme}>{barTheme}</span>
                </p>
                <div className={styles.view}>
                  {isFrames && (
                    <>
                      <canvas ref={canvasRef} role="img" aria-label={canvasLabel} className={styles.canvas} hidden={!data} />
                      {!data && <p className={styles.message}>{frames?.failed || !sources.length ? note : "Loading"}</p>}
                    </>
                  )}
                  {mode === "code" && (
                    code?.data ? (
                      <pre tabIndex={0} aria-label={`${item?.label} sample in ${themeName(theme)}`} className={styles.code} style={{ background: code.data.background, color: code.data.foreground }}>
                        <code>
                          {code.data.lines.map((line, i) => (
                            <span key={i}>
                              <span className={styles.ln} aria-hidden="true">{i + 1}</span>
                              {line.map(([text, colour, flags], j) => (
                                <span key={j} style={{ color: colour, fontWeight: flags & 1 ? 700 : undefined, fontStyle: flags & 2 ? "italic" : undefined, textDecoration: flags & 4 ? "underline" : undefined }}>{text}</span>
                              ))}
                              {"\n"}
                            </span>
                          ))}
                        </code>
                      </pre>
                    ) : (
                      <p className={styles.message}>{code?.failed ? note : "Loading"}</p>
                    )
                  )}
                  {mode === "profile" && (
                    profile?.data ? (
                      <ProfileScreen p={profile.data} />
                    ) : (
                      <p className={styles.message}>{profile?.failed ? note : "Loading"}</p>
                    )
                  )}
                </div>
              </div>
            </div>
            <div className={styles.base} aria-hidden="true">
              <span className={styles.pad} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1 basis-64 space-y-1">
            <p className="text-lg font-semibold">{item?.label}</p>
            {description && <p className="text-base leading-relaxed text-foreground/90">{description}</p>}
            {note && <p className="text-sm text-muted-foreground">{note}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            {isFrames && sources.length > 0 && !frames?.failed && (
              <button type="button" className={BUTTON} onClick={togglePlay} aria-label={`${playing ? "Pause" : "Play"} the recording`}>
                {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
                {playing ? "Pause" : "Play"}
              </button>
            )}
            {!reduce && (
              <button type="button" className={BUTTON} aria-pressed={tilt} onClick={() => setTilt((t) => !t)}>
                <Box className="h-4 w-4" aria-hidden="true" />
                3D view
                <span aria-hidden="true" className={`h-3 w-3 rounded-sm border-2 border-current ${tilt ? "bg-current" : ""}`} />
              </button>
            )}
          </div>
        </div>
        <p className="sr-only" role="status" aria-live="polite">{status}</p>
      </div>

      <div className="space-y-5">
        <fieldset className="min-w-0">
          <legend className="mb-2 text-sm font-semibold">Show</legend>
          <div className="grid grid-cols-2 gap-2 @lg:grid-cols-4 @5xl:grid-cols-2">
            {MODES.map((m) => (
              <Option key={m.id} name="zacess-studio-mode" value={m.id} checked={mode === m.id} onPick={pickMode}>{m.label}</Option>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-4 @lg:grid-cols-2 @5xl:grid-cols-1">
          <div className="min-w-0">
            <label htmlFor={`${uid}-theme`} className="mb-2 block text-sm font-semibold">Theme</label>
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className={styles.swatch} style={{ background: currentTheme.ui.background, color: currentTheme.ui.foreground, borderColor: currentTheme.ui.border, boxShadow: `inset 0 -3px 0 ${currentTheme.syntax.function}` }}>Aa</span>
              <Picker id={`${uid}-theme`} value={theme} onChange={(e) => pickTheme(e.target.value)}>
                {ZACESS_THEMES.themes.map((t) => (
                  <option key={t.id} value={t.id}>{shortName(t.name)}</option>
                ))}
              </Picker>
            </div>
          </div>
          <div className="min-w-0">
            <label htmlFor={`${uid}-item`} className="mb-2 block text-sm font-semibold">{ITEM_LEGEND[mode]} <span className="font-normal text-muted-foreground">({position} of {items[mode].length})</span></label>
            <Picker id={`${uid}-item`} value={item?.value ?? ""} onChange={(e) => pickItem(e.target.value)}>
              {groups.map(([group, list]) =>
                group ? (
                  <optgroup key={group} label={group}>
                    {list.map((it) => <option key={it.value} value={it.value}>{mode === "profile" ? shortName(it.label) : it.label}</option>)}
                  </optgroup>
                ) : (
                  list.map((it) => <option key={it.value} value={it.value}>{mode === "profile" ? shortName(it.label) : it.label}</option>)
                ),
              )}
            </Picker>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button type="button" className={BUTTON} onClick={() => step(-1)} aria-label={`Previous ${ITEM_LEGEND[mode].toLowerCase()}`}>
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Previous
              </button>
              <button type="button" className={BUTTON} onClick={() => step(1)} aria-label={`Next ${ITEM_LEGEND[mode].toLowerCase()}`}>
                Next
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        {(mode === "scenes" || mode === "games") && item && <SoundPanel kind={mode} id={item.id} />}
      </div>
      </div>
    </div>
  )
}

const TOML_COLOUR: Record<TomlKind, string | null> = { comment: "comment", header: "type", key: "property", string: "string", number: "number", bool: "keyword", plain: null }

function ProfileScreen({ p }: { p: Profile }) {
  const syntax = p.palette.syntax ?? {}
  const ansi = p.palette.terminal?.ansi ?? []
  return (
    <div className={styles.profile}>
      <div className={styles.editor}>
        <div tabIndex={0} role="region" aria-label="The starter profile file" className={`${styles.pre} h-full`}>
          <code>
            {p.toml.replace(/\n$/, "").split("\n").map((line, i) => (
              <span key={i}>
                {tomlTokens(line).map((t, j) => {
                  const role = TOML_COLOUR[t.kind]
                  return (
                    <span key={j} style={{ color: role ? syntax[role] : undefined, fontStyle: t.kind === "comment" ? "italic" : undefined, fontWeight: t.kind === "header" || t.kind === "bool" ? 700 : undefined }}>{t.text}</span>
                  )
                })}
                {"\n"}
              </span>
            ))}
          </code>
        </div>
      </div>
      <div className={styles.term}>
        <div tabIndex={0} role="region" aria-label="What zprf check prints" className={`${styles.pre} ${styles.termText}`}>
          <code>
            <span className={styles.prompt}>$</span> {p.check ? p.check.command : `zprf check ${p.file ?? `${p.id}.toml`}`}
            {"\n"}
            {p.check?.output}
            {"\n"}
            <span className={styles.prompt}>$</span> <span className={styles.cursor} aria-hidden="true" />
          </code>
        </div>
        <ol className={styles.ansi} aria-label="The profile's 16 terminal colours, numbered 0 to 15">
          {ansi.map((c, i) => (
            <li key={i} title={`Colour ${i}: ${c}`}>
              <span className={styles.chip} style={{ background: c }} />
              {i}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
