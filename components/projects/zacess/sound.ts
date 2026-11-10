"use client"

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"
import sounds from "@/data/projects/zacess/sounds.json"
import { ZACESS_STUDIO_BASE } from "@/lib/content/zacess-media"

export type SoundKind = "scenes" | "games"
type Level = "tone" | "ambient" | "music" | "effect"

export const SOUND_SETS: string[] = sounds.sets
export const SOUND_EVENTS: string[] = sounds.events
export const SOUND_EFFECTS: string[] = sounds.effects
export const EVENT_LABEL: Record<string, string> = { pass: "Pass", fail: "Fail", tick: "Rebuild", recovered: "Fixed", still_failing: "Still failing", warnings: "Warnings", typo: "Typo", clean: "Warnings cleared", stopped: "Stopped" }
export const EFFECT_LABEL: Record<string, string> = { tick: "Step", tap: "Place", good: "Clear", win: "Win", low: "Miss", warn: "Warning", note0: "Note" }

const STORE = "zacess-studio-volume"
const LEVELS = sounds.levels as Record<Level, number>
const summaries = Object.fromEntries(sounds.ambient.map((a) => [a.id, a.summary])) as Record<string, string>

const url = (path: string) => `${ZACESS_STUDIO_BASE}/sounds/${path}.m4a`

let volumeValue: number | null = null
const volumeListeners = new Set<() => void>()
const subscribeVolume = (listener: () => void) => {
  volumeListeners.add(listener)
  return () => volumeListeners.delete(listener)
}
function readVolume(): number {
  if (volumeValue === null) {
    volumeValue = 50
    try {
      const saved = localStorage.getItem(STORE)
      if (saved !== null && Number.isFinite(Number(saved))) volumeValue = Math.max(0, Math.min(100, Number(saved)))
    } catch {
      // storage blocked: the default volume stands
    }
  }
  return volumeValue
}
function storeVolume(v: number) {
  volumeValue = v
  try {
    localStorage.setItem(STORE, String(v))
  } catch {
    // storage blocked
  }
  volumeListeners.forEach((l) => l())
}
const noSubscribe = () => () => {}
const canPlay = () => Boolean(window.AudioContext ?? (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext)

let context: AudioContext | null = null
const buffers = new Map<string, Promise<AudioBuffer>>()

function audio(): AudioContext {
  if (!context) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    context = new Ctor()
  }
  if (context.state === "suspended") void context.resume()
  return context
}

function load(path: string): Promise<AudioBuffer> {
  let p = buffers.get(path)
  if (!p) {
    p = fetch(url(path))
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.arrayBuffer()
      })
      // the callback form, so a Safari without the promise form still decodes
      .then((data) => new Promise<AudioBuffer>((resolve, reject) => audio().decodeAudioData(data, resolve, reject)))
    p.catch(() => buffers.delete(path))
    buffers.set(path, p)
  }
  return p
}

const gainFor = (level: Level, volume: number) => Math.min(1, (volume / 100) * 2 * (LEVELS[level] / 100))

export function soundPlan(kind: SoundKind, id: string) {
  if (kind === "games") {
    const loop = (sounds.games as Record<string, string>)[id] ?? "night"
    return { text: `Music and background: ${loop}, ${(summaries[loop] ?? "").toLowerCase()}`, parts: [{ path: `music/${id}`, level: "music" as Level }, { path: `ambient/${loop}`, level: "ambient" as Level }] }
  }
  const loop = (sounds.scenes as Record<string, string>)[id] ?? "night"
  return { text: `Background: ${loop}, ${(summaries[loop] ?? "").toLowerCase()}`, parts: [{ path: `ambient/${loop}`, level: "ambient" as Level }] }
}

export function useZacessSound(kind: SoundKind | null, id: string) {
  const [on, setOn] = useState(false)
  const [failedFor, setFailedFor] = useState<string | null>(null)
  const loops = useRef<{ source: AudioBufferSourceNode; gain: GainNode; level: Level }[]>([])
  const volume = useSyncExternalStore(subscribeVolume, readVolume, () => 50)
  const volumeRef = useRef(volume)
  const supported = useSyncExternalStore(noSubscribe, canPlay, () => false)
  const here = `${kind}:${id}`
  const failed = on && failedFor === here

  useEffect(() => {
    volumeRef.current = volume
    loops.current.forEach((l) => (l.gain.gain.value = gainFor(l.level, volume)))
  }, [volume])

  useEffect(() => {
    if (!on || !kind) return
    let current = true
    const plan = soundPlan(kind, id)
    plan.parts.forEach((part) => {
      load(part.path)
        .then((buffer) => {
          if (!current) return
          const c = audio()
          const source = c.createBufferSource()
          source.buffer = buffer
          source.loop = true
          const gain = c.createGain()
          gain.gain.value = gainFor(part.level, volumeRef.current)
          source.connect(gain).connect(c.destination)
          source.start()
          loops.current.push({ source, gain, level: part.level })
        })
        .catch(() => current && setFailedFor(`${kind}:${id}`))
    })
    return () => {
      current = false
      loops.current.forEach((l) => {
        try {
          l.source.stop()
        } catch {
          // already stopped
        }
      })
      loops.current = []
    }
  }, [on, kind, id])

  useEffect(() => {
    const onVisible = () => {
      if (!context) return
      if (document.hidden) void context.suspend()
      else if (on) void context.resume()
    }
    document.addEventListener("visibilitychange", onVisible)
    return () => document.removeEventListener("visibilitychange", onVisible)
  }, [on])

  const playOne = useCallback((path: string, level: Level) => {
    load(path)
      .then((buffer) => {
        const c = audio()
        const source = c.createBufferSource()
        source.buffer = buffer
        const gain = c.createGain()
        gain.gain.value = gainFor(level, volumeRef.current)
        source.connect(gain).connect(c.destination)
        source.start()
      })
      .catch(() => setFailedFor("tone"))
  }, [])

  const text = kind ? soundPlan(kind, id).text : ""
  return { on, toggle: () => { setFailedFor(null); setOn((v) => !v) }, volume, setVolume: storeVolume, failed: failed || failedFor === "tone", supported, text, tone: (set: string, event: string) => playOne(`tones/${set}/${event}`, "tone"), effect: (name: string) => playOne(`effects/${name}`, "effect") }
}
