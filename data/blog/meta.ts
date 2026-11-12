import type { BlogPost, PostType } from "./index"

export const POST_TYPES: { label: string; value: PostType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Blog", value: "blog" },
  { label: "Journal", value: "journal" },
  { label: "Explainer", value: "explainer" },
  { label: "Report", value: "report" },
  { label: "Article", value: "article" },
  { label: "Resources", value: "resources" },
]

export const PINNED_POSTS = ["ocular-prosthetics-bionic-vision", "two-stage-audio-amplifier", "thank-you-stanmore"]

export const RENAMED_POST_TYPES: ReadonlyMap<string, PostType> = new Map([["research", "explainer"], ["notes", "article"]])

export function postTypeLabel(type: string): string {
  return POST_TYPES.find((t) => t.value === type)?.label ?? type
}

export const SERIES_LABELS: Record<string, string> = {
  "life-at-aston": "Life at Aston",
  "sky-black-heritage": "Sky Black Heritage",
}

export type BlogCard = Omit<BlogPost, "content"> & { readingTime: number }
