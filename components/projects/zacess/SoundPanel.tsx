"use client"

import { useId, useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { EFFECT_LABEL, EVENT_LABEL, SOUND_EFFECTS, SOUND_EVENTS, SOUND_SETS, useZacessSound, type SoundKind } from "./sound"

const BUTTON =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

const words = (slug: string) => slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ")

export function SoundPanel({ kind, id }: { kind: SoundKind; id: string }) {
  const uid = useId()
  const [set, setSet] = useState("bells")
  const sound = useZacessSound(kind, id)
  if (!sound.supported) return null
  return (
    <section aria-labelledby={`${uid}-title`} className="mt-5 border-t border-border pt-4">
      <h3 id={`${uid}-title`} className="text-sm font-semibold">Sound</h3>
      <p className="mt-1 text-sm text-muted-foreground">Off until you turn it on. The background loop and music are the ones the programs play.</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" className={`${BUTTON} min-w-32`} aria-pressed={sound.on} onClick={sound.toggle}>
          {sound.on ? <VolumeX className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
          {sound.on ? "Pause sound" : "Play sound"}
        </button>
        <label htmlFor={`${uid}-volume`} className="text-sm font-semibold">Volume</label>
        <input
          id={`${uid}-volume`}
          type="range"
          min={0}
          max={100}
          step={5}
          value={sound.volume}
          aria-valuetext={`${sound.volume} percent`}
          onChange={(e) => sound.setVolume(Number(e.target.value))}
          className="min-h-11 min-w-32 flex-1 accent-foreground"
        />
      </div>
      <p className="mt-2 text-sm text-muted-foreground" role="status" aria-live="polite">
        {sound.failed ? "That sound did not load. Try again in a moment." : sound.on ? `Playing. ${sound.text}.` : `${sound.text}. Press Play sound to hear it.`}
      </p>
      {kind === "scenes" ? (
        <div className="mt-3">
          <label htmlFor={`${uid}-set`} className="mb-2 block text-sm font-semibold">Tone set</label>
          <select id={`${uid}-set`} value={set} onChange={(e) => setSet(e.target.value)} className="min-h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {SOUND_SETS.map((s) => <option key={s} value={s}>{words(s)}</option>)}
          </select>
          <p id={`${uid}-tones`} className="mb-2 mt-3 text-sm font-semibold">Hear a tone</p>
          <div role="group" aria-labelledby={`${uid}-tones`} className="grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-2">
            {SOUND_EVENTS.map((e) => <button key={e} type="button" className={BUTTON} onClick={() => sound.tone(set, e)}>{EVENT_LABEL[e] ?? words(e)}</button>)}
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <p id={`${uid}-effects`} className="mb-2 text-sm font-semibold">Hear an effect</p>
          <div role="group" aria-labelledby={`${uid}-effects`} className="grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-2">
            {SOUND_EFFECTS.map((e) => <button key={e} type="button" className={BUTTON} onClick={() => sound.effect(e)}>{EFFECT_LABEL[e] ?? words(e)}</button>)}
          </div>
        </div>
      )}
    </section>
  )
}
