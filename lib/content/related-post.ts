import { getPostBySlug } from "@/data/blog"
import type { TILEntry } from "@/data/til"

export function liveRelatedPost(entry: Pick<TILEntry, "relatedPost">): { slug: string; title: string } | null {
  if (!entry.relatedPost) return null
  const post = getPostBySlug(entry.relatedPost)
  return post ? { slug: post.slug, title: post.title } : null
}
