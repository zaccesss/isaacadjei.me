import { describe, expect, it } from "vitest"
import { MEDIA_BASE, MEDIA_WIDTHS, isSyncedImage, mediaEmailSrc, mediaLoader, mediaSrc, readIndexValue } from "@/lib/content/media"
import index from "@/data/media-index.json"
import manifest from "@/data/media-manifest.json"

type ManifestEntry = { h: string; t: string }
const MANIFEST = manifest as Record<string, ManifestEntry>
const INDEX = index as Record<string, string>

function uploaded(path: string, hash: string, variant: string): string {
  return `${MEDIA_BASE}/${path.slice(1, path.lastIndexOf("."))}.${hash}/${variant}`
}

describe("readIndexValue", () => {
  it("reads an ordinary ten character hash as an image", () => {
    expect(readIndexValue("2b8ccbcd9b")).toEqual({ h: "2b8ccbcd9b", img: true })
  })

  it("reads an image hash that itself starts with f as an image and keeps the whole hash", () => {
    expect(readIndexValue("fe7c8d6c87")).toEqual({ h: "fe7c8d6c87", img: true })
  })

  it("reads the marker in front of a hash as a file that is not an image", () => {
    expect(readIndexValue("fa466b65d95")).toEqual({ h: "a466b65d95", img: false })
  })

  it("keeps a marked file whose own hash starts with f", () => {
    expect(readIndexValue("ffe7c8d6c87")).toEqual({ h: "fe7c8d6c87", img: false })
  })
})

describe("the real media index", () => {
  const entries = Object.entries(MANIFEST)
  const images = entries.filter(([, e]) => e.t === "img")
  const files = entries.filter(([, e]) => e.t !== "img")

  it("holds only bare hashes and marked hashes, so length alone tells them apart", () => {
    for (const value of Object.values(INDEX)) expect(value).toMatch(/^(?:[0-9a-f]{10}|f[0-9a-f]{10})$/)
    expect(Object.keys(INDEX).length).toBeGreaterThanOrEqual(entries.length)
  })

  it("includes images whose hash starts with f, the case that used to break", () => {
    expect(images.some(([, e]) => e.h.startsWith("f"))).toBe(true)
  })

  it("resolves every image to the uploaded address with its full hash", () => {
    for (const [path, e] of images) {
      expect(isSyncedImage(path), path).toBe(true)
      expect(mediaSrc(path), path).toBe(uploaded(path, e.h, "1600.webp"))
      expect(mediaLoader({ src: path, width: 500 }), path).toBe(uploaded(path, e.h, "640.webp"))
      expect(mediaEmailSrc(path), path).toBe(uploaded(path, e.h, "email.jpg"))
    }
  })

  it("resolves every other file to its original on the media host and offers no email copy", () => {
    for (const [path, e] of files) {
      expect(isSyncedImage(path), path).toBe(false)
      expect(mediaSrc(path), path).toBe(uploaded(path, e.h, "original" + path.slice(path.lastIndexOf("."))))
      expect(mediaLoader({ src: path, width: 500 }), path).toBe(path)
      expect(mediaEmailSrc(path), path).toBeNull()
    }
  })

  it("only ever asks for a width that was made in advance", () => {
    const [path] = images[0]
    for (const width of [1, 96, 97, 1080, 2400, 9999]) {
      const made = Number(mediaLoader({ src: path, width }).match(/\/(\d+)\.webp$/)?.[1])
      expect(MEDIA_WIDTHS).toContain(made)
    }
  })

  it("leaves a path that was never synced alone", () => {
    expect(mediaSrc("/images/not-a-real-file.webp")).toBe("/images/not-a-real-file.webp")
    expect(mediaEmailSrc("/images/not-a-real-file.webp")).toBeNull()
  })
})
