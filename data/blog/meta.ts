import type { BlogPost, PostType } from "./index"

export const POST_TYPES: { label: string; value: PostType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Blog", value: "blog" },
  { label: "Journal", value: "journal" },
  { label: "Research", value: "research" },
  { label: "Report", value: "report" },
  { label: "Article", value: "article" },
  { label: "Notes", value: "notes" },
  { label: "Resources", value: "resources" },
]

export const SERIES_LABELS: Record<string, string> = {
  "life-at-aston": "Life at Aston",
  "sky-black-heritage": "Sky Black Heritage",
}

export type BlogCard = Omit<BlogPost, "content"> & { readingTime: number }
