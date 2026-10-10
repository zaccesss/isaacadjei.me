"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { TILEntry } from "@/data/til"
import { tilCategoryLabelClass } from "@/components/shared/Tag"
import { staggerContainer, fadeUp } from "@/lib/animations"

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

export default function FeaturedTIL({ entries }: { entries: TILEntry[] }) {

  if (entries.length === 0) return null

  return (
    <section className="py-24 border-t">
      <div className="mx-auto w-full max-w-6xl px-8 space-y-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-10"
        >
          <motion.div variants={fadeUp} className="flex items-end justify-between">
            <div className="space-y-2">
              <p className="text-sm font-mono text-primary uppercase tracking-widest">Learning</p>
              <h2 className="text-3xl font-bold tracking-tight">Today I Learned</h2>
            </div>
            <Button asChild variant="ghost" className="hidden sm:flex">
              <Link href="/til">
                All TILs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} className="grid gap-3 sm:grid-cols-3">
            {entries.map((entry) => {
              return (
                <Link
                  key={entry.id}
                  href={`/til/${entry.id}`}
                  className="group flex min-w-0 flex-col gap-3 rounded-lg border border-border/60 bg-muted/40 hover:bg-muted/60 hover:border-border transition-all p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={tilCategoryLabelClass(entry.category)}>{entry.category}</span>
                    <Lightbulb className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                  </div>
                  <p className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {entry.title}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">
                    {entry.body}
                  </p>
                  <p className="text-[11px] font-mono text-muted-foreground/70 mt-auto">
                    {formatDate(entry.date)}
                  </p>
                </Link>
              )
            })}
          </motion.div>

          <motion.div variants={fadeUp} className="flex sm:hidden">
            <Button asChild variant="outline">
              <Link href="/til">
                All TILs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
