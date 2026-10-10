import type { ImageLoaderProps } from "next/image"
import manifest from "@/data/media-manifest.json"

export const MEDIA_BASE = "https://media.isaacadjei.me"
export const MEDIA_WIDTHS = [96, 192, 384, 640, 1080, 1600, 2400]

type Entry = { h: string; t: "img" | "file"; w?: number; ht?: number }
const MEDIA = manifest as Record<string, Entry>

function key(path: string, hash: string, variant: string): string {
  const dot = path.lastIndexOf(".")
  return `${MEDIA_BASE}/${path.slice(1, dot)}.${hash}/${variant}`
}

export function isSyncedImage(src: string): boolean {
  return MEDIA[src]?.t === "img"
}

export function mediaLoader({ src, width }: ImageLoaderProps): string {
  const entry = MEDIA[src]
  if (!entry || entry.t !== "img") return src
  const w = MEDIA_WIDTHS.find((size) => size >= width) ?? MEDIA_WIDTHS[MEDIA_WIDTHS.length - 1]
  return key(src, entry.h, `${w}.webp`)
}

export function mediaSrc(src: string, width = 1600): string {
  const entry = MEDIA[src]
  if (!entry) return src
  const dot = src.lastIndexOf(".")
  return entry.t === "img" ? mediaLoader({ src, width }) : key(src, entry.h, "original" + src.slice(dot))
}

export function mediaEmailSrc(src: string): string | null {
  const entry = MEDIA[src]
  return entry?.t === "img" ? key(src, entry.h, "email.jpg") : null
}
