"use client"

import { useEffect, useRef, useState } from "react"
import manifest from "@/data/projects/zacess/studio-manifest.json"
import { drawFrame, type Frames } from "@/components/projects/zacess/frames"
import { FALLBACK_THEME, frameSources, useFirst, type FrameSource } from "@/components/projects/zacess/sources"
import { useZacessSound } from "@/components/projects/zacess/sound"
import type { Line } from "./types"
import { ZACESS_THEMES, themeById } from "./themes"
import s from "../terminal.module.css"

export type RecordingGroup = "general" | "pass" | "fail" | "mine" | "game"

export interface Recording {
  source: FrameSource
  id: string
  name: string
  description: string
  group: RecordingGroup
}

const GROUP_TITLE: Record<Exclude<RecordingGroup, "game">, string> = {
  general: "general",
  pass: "pass, shown when a build passes",
  fail: "fail, shown when a build fails",
  mine: "my scenes",
}

const words = (slug: string) => slug.replace(/-/g, " ")
const sentence = (text: string) => text.replace(/\.\s*$/, "")

export function buildScenes(): Recording[] {
  const release = (["general", "pass", "fail"] as const).flatMap((kind) =>
    manifest.catalogue.scenes
      .filter((sc) => sc.kind === kind)
      .map((sc): Recording => ({ source: "scenes", id: sc.id, name: words(sc.id), description: sentence(sc.description), group: kind })),
  )
  const mine = (manifest.catalogue.myScenes as { id: string; name?: string; description: string }[]).map(
    (sc): Recording => ({ source: "myScenes", id: sc.id, name: (sc.name ?? words(sc.id)).toLowerCase(), description: sentence(sc.description), group: "mine" }),
  )
  return [...release, ...mine]
}

export const SCENES = buildScenes()

export function findRecording(list: Recording[], raw: string): number {
  const key = raw.trim().toLowerCase().replace(/\s+/g, "-")
  if (!key) return -1
  const exact = list.findIndex((r) => r.id === key || r.name.replace(/\s+/g, "-") === key)
  return exact >= 0 ? exact : list.findIndex((r) => r.id.startsWith(key))
}

export function zacessThemeFor(labThemeId: string | null, dark: boolean): string {
  return ZACESS_THEMES.find((t) => t.id === labThemeId)?.id ?? (dark ? "dark" : "light")
}

export function sceneListLines(list: Recording[] = SCENES): Line[] {
  const width = Math.min(22, Math.max(...list.map((r) => r.id.length)))
  const out: Line[] = [
    { type: "title", text: "Zacess Scenes" },
    { type: "output", text: `  ${list.length} recordings at 80 by 24, played in the theme you chose with 'theme <name>'.` },
  ]
  for (const group of ["general", "pass", "fail", "mine"] as const) {
    const items = list.filter((r) => r.group === group)
    if (!items.length) continue
    out.push({ type: "blank", text: "" }, { type: "heading", text: `${GROUP_TITLE[group]} (${items.length})` })
    for (const r of items) out.push({ type: "pair", text: `  ${r.id.padEnd(width)}  ${r.description}` })
  }
  out.push(
    { type: "blank", text: "" },
    { type: "output", text: "  type 'zacess-scenes <name>' to play one. keys: n next, b back, Space pause, s sound and q quit." },
    { type: "output", text: "  the full program adds a build monitor and desktop notifications. sound is off until you press s:" },
    { type: "output", text: "    cargo install --locked zacess-scenes" },
    { type: "output", text: "    brew install zacesshq/tap/zacess-scenes" },
  )
  return out
}

const themeName = (id: string) => themeById(id)?.name ?? `Zacess ${words(id)}`

export function candidates(r: Pick<Recording, "source" | "id">, theme: string) {
  const own = frameSources(r.source, r.id, theme)
  const all = [...own.filter((c) => c.theme === theme), ...(theme === FALLBACK_THEME ? [] : frameSources(r.source, r.id, FALLBACK_THEME)), ...own]
  return all.filter((c, i) => all.findIndex((d) => d.url === c.url) === i)
}

export function RecordingView({
  kind,
  items,
  start,
  theme,
  siteDefault,
  reducedMotion,
  heightClass,
  onExit,
}: {
  kind: "scenes" | "games"
  items: Recording[]
  start: number
  theme: string
  siteDefault: boolean
  reducedMotion: boolean
  heightClass: string
  onExit: (message: string) => void
}) {
  const [index, setIndex] = useState(start)
  const [choice, setChoice] = useState<{ play: boolean; reduced: boolean } | null>(null)
  const [visible, setVisible] = useState(true)
  const [hidden, setHidden] = useState(false)
  const [said, setSaid] = useState("")
  const regionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frame = useRef(0)
  const item = items[index]
  const program = kind === "scenes" ? "zacess-scenes" : "zacess-games"
  const sound = useZacessSound(kind, item.id)
  const playing = choice && choice.reduced === reducedMotion ? choice.play : !reducedMotion

  const sources = candidates(item, theme)
  const frames = useFirst<Frames>(`${item.source}:${item.id}:${theme}`, sources.map((c) => c.url), true)
  const data = frames?.data ?? null
  const shown = data && frames?.index !== undefined ? sources[frames.index].theme : theme

  useEffect(() => {
    regionRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    const el = regionRef.current
    if (!el) return
    const obs = new IntersectionObserver((entries) => setVisible(entries[0]?.isIntersecting ?? false))
    obs.observe(el)
    const onVis = () => setHidden(document.hidden)
    document.addEventListener("visibilitychange", onVis)
    return () => {
      obs.disconnect()
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [])

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

  const go = (step: number) => {
    const next = (((index + step) % items.length) + items.length) % items.length
    setIndex(next)
    setSaid(`${items[next].name}: ${items[next].description}`)
  }
  const togglePause = () => {
    setChoice({ play: !playing, reduced: reducedMotion })
    setSaid(playing ? "Paused." : "Playing.")
  }
  const toggleSound = () => {
    sound.toggle()
    setSaid(sound.on ? "Sound off." : `Sound on. ${sound.text}.`)
  }
  const quit = () => onExit(`Closed ${program} after ${item.name}.`)

  const onKeyDown = (e: React.KeyboardEvent) => {
    const k = e.key
    if (k === "n" || k === "N" || k === "ArrowRight") go(1)
    else if (k === "b" || k === "B" || k === "ArrowLeft") go(-1)
    else if (k === " ") togglePause()
    else if ((k === "s" || k === "S") && sound.supported) toggleSound()
    else if (k === "q" || k === "Q" || k === "Escape") quit()
    else return
    e.preventDefault()
    e.stopPropagation()
  }

  let note = ""
  if (!sources.length) note = `${item.name} has not been recorded in ${themeName(theme)} yet.`
  else if (!frames) note = "Loading the recording."
  else if (frames.failed) note = "The recording could not load."
  else if (shown !== theme) note = `Not recorded in ${themeName(theme)} yet, so this is the ${themeName(shown)} recording.`
  else if (siteDefault) note = `Shown in ${themeName(shown)}, the Zacess theme nearest the site palette.`
  const state = !data ? "stopped" : playing ? "playing" : "paused"
  const label = `${item.name} in ${themeName(shown)}: ${item.description}`

  return (
    <div
      ref={regionRef}
      role="region"
      tabIndex={0}
      aria-label={`${kind === "scenes" ? "Zacess Scenes" : "Zacess Games"}: ${item.name}. Keys: n next, b back, Space pause, s sound, q quit.`}
      onKeyDown={onKeyDown}
      className={`${s.viewRegion} flex flex-col pt-2 ${heightClass}`}
    >
      <div className={`${s.recording} relative flex-1 min-h-0 flex items-center justify-center px-1 sm:px-2`}>
        <canvas ref={canvasRef} role="img" aria-label={label} className={s.recordingCanvas} hidden={!data} />
        {!data && <p className={`${s.line} ${s.fg} text-center px-2`}>{note}</p>}
      </div>
      {data && note && <p className={`${s.line} ${s.white} text-xs leading-relaxed px-1 sm:px-2 pt-1 shrink-0`}>{note}</p>}
      <div className={`${s.nvimStatus} flex items-stretch text-xs leading-6 shrink-0`} aria-hidden="true">
        <span className={`${s.nvimMode} px-2 font-bold`}>{kind === "scenes" ? "SCENES" : "GAMES"}</span>
        <span className="px-2 flex-1 min-w-0 truncate">
          {item.id} {index + 1}/{items.length}
        </span>
        <span className="px-2 hidden sm:inline truncate">{themeName(shown)}</span>
        {sound.supported && <span className="px-2 hidden sm:inline">sound {sound.on ? "on" : "off"}</span>}
        <span className={`${s.nvimB} px-2`}>{state}</span>
      </div>
      <div className="flex flex-wrap gap-1 px-1 sm:px-2 pt-1 shrink-0">
        <button type="button" onClick={() => go(-1)} className={`${s.chip} min-h-11 px-3 rounded text-xs`}>
          b back
        </button>
        <button
          type="button"
          onClick={togglePause}
          disabled={!data}
          className={`${s.chip} min-h-11 px-3 rounded text-xs`}
        >
          Space {playing ? "pause" : "play"}
        </button>
        <button type="button" onClick={() => go(1)} className={`${s.chip} min-h-11 px-3 rounded text-xs`}>
          n next
        </button>
        {sound.supported && (
          <button type="button" onClick={toggleSound} aria-pressed={sound.on} className={`${s.chip} min-h-11 px-3 rounded text-xs`}>
            s sound {sound.on ? "on" : "off"}
          </button>
        )}
        <button type="button" onClick={quit} className={`${s.chip} min-h-11 px-3 rounded text-xs`}>
          q quit
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {said} {data && note ? note : ""} {sound.failed ? "That sound did not load." : ""}
      </p>
    </div>
  )
}
