"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { TAG_CLASS, postTypeLabelClass } from "@/components/shared/Tag"
import { Button } from "@/components/ui/button"
import { staggerContainer, fadeUp } from "@/lib/animations"
import type { PostType } from "@/data/blog"
import type { BlogCard } from "@/data/blog/meta"

const TYPE_LABELS: Record<PostType, string> = {
  blog: "Blog", journal: "Journal", research: "Research", notes: "Notes",
  report: "Report", article: "Article", resources: "Resources",
}

const PINNED = [
  "why-software-engineers-should-understand-hardware",
  "ocular-prosthetics-bionic-vision",
]
const TOTAL = 6

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

function FeaturedPostCard({ post }: { post: BlogCard }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-lg border border-border/60 bg-muted/40 hover:bg-muted/60 hover:border-border transition-all overflow-hidden"
    >
      <div className="px-5 py-4 space-y-3">
        <span className={postTypeLabelClass(post.type)}>
          {TYPE_LABELS[post.type]}
        </span>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold tracking-tight leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {post.description}
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            {formatDate(post.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            {post.readingTime} min read
          </span>
        </div>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={TAG_CLASS}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

export default function FeaturedBlogPosts({ posts: all }: { posts: BlogCard[] }) {
  const pinned = PINNED
    .map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is BlogCard => p !== undefined)
  const latest = [...all]
    .filter((p) => !PINNED.includes(p.slug))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, TOTAL - pinned.length)
  const featured = [...pinned, ...latest]

  if (featured.length === 0) return null

  return (
    <section className="py-24 border-t">
      <div className="container space-y-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-10"
        >
          <motion.div variants={fadeUp} className="flex items-end justify-between">
            <div className="space-y-2">
              <p className="text-sm font-mono text-primary uppercase tracking-widest">Writing</p>
              <h2 className="text-3xl font-bold tracking-tight">Featured posts</h2>
            </div>
            <Button asChild variant="ghost" className="hidden sm:flex">
              <Link href="/blog">
                All posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((post) => (
              <FeaturedPostCard key={post.slug} post={post} />
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="flex sm:hidden">
            <Button asChild variant="outline">
              <Link href="/blog">
                All posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
