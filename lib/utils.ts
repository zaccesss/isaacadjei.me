import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function computeReadingTime(blocks: { type: string; text?: string; code?: string; items?: (string | { text: string })[] }[]): number {
  const words = blocks.reduce((acc, block) => {
    if (block.text) return acc + block.text.split(/\s+/).filter(Boolean).length
    if (block.code) return acc + block.code.split(/\s+/).filter(Boolean).length
    if (block.items) {
      const flat = block.items.map((i) => (typeof i === "string" ? i : i.text)).join(" ")
      return acc + flat.split(/\s+/).filter(Boolean).length
    }
    return acc
  }, 0)
  return Math.max(1, Math.round(words / 200))
}

export function monthsFromDates(dates: string[]): { name: string; index: number }[] {
  const seen = new Map<number, string>()
  for (const d of dates) {
    const date = new Date(d)
    const index = date.getMonth()
    if (!seen.has(index)) seen.set(index, date.toLocaleDateString("en-GB", { month: "long" }))
  }
  return [...seen.entries()].map(([index, name]) => ({ name, index })).sort((a, b) => a.index - b.index)
}
