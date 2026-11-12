import type { ImageLoaderProps } from "next/image"
import index from "@/data/media-index.json"

export const MEDIA_BASE = "https://media.isaacadjei.me"
export const MEDIA_WIDTHS = [96, 192, 384, 640, 1080, 1600, 2400]

const INDEX = index as Record<string, string>
const HASH_LENGTH = 10

function pathKey(path: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < path.length; i++) h = Math.imul(h ^ path.charCodeAt(i), 0x01000193) >>> 0
  return h.toString(36)
}

type Entry = { h: string; img: boolean }

export function readIndexValue(v: string): Entry {
  return v.length === HASH_LENGTH + 1 && v.startsWith("f") ? { h: v.slice(1), img: false } : { h: v, img: true }
}

function lookup(src: string): Entry | null {
  const v = INDEX[pathKey(src)]
  return v ? readIndexValue(v) : null
}

function key(path: string, hash: string, variant: string): string {
  const dot = path.lastIndexOf(".")
  return `${MEDIA_BASE}/${path.slice(1, dot)}.${hash}/${variant}`
}

export function isSyncedImage(src: string): boolean {
  return lookup(src)?.img === true
}

export function mediaLoader({ src, width }: ImageLoaderProps): string {
  const entry = lookup(src)
  if (!entry?.img) return src
  const w = MEDIA_WIDTHS.find((size) => size >= width) ?? MEDIA_WIDTHS[MEDIA_WIDTHS.length - 1]
  return key(src, entry.h, `${w}.webp`)
}

export function mediaSrc(src: string, width = 1600): string {
  const entry = lookup(src)
  if (!entry) return src
  const dot = src.lastIndexOf(".")
  return entry.img ? mediaLoader({ src, width }) : key(src, entry.h, "original" + src.slice(dot))
}

export function mediaEmailSrc(src: string): string | null {
  const entry = lookup(src)
  return entry?.img ? key(src, entry.h, "email.jpg") : null
}
