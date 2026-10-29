"use client"

import { ExternalLink } from "lucide-react"
import type { ProductCardBlock } from "@/data/projects"
import { renderInline, slugify } from "@/components/shared/ContentBlocks"
import ThemeSwitcher from "./zacess/ThemeSwitcher"
import FramePlayer from "./zacess/FramePlayer"
import { GAME_CLIPS, GAMES_STILL, SCENE_CLIPS } from "@/data/projects/zacess/previews"

function Preview({ id }: { id: ProductCardBlock["preview"] }) {
  switch (id) {
    case "zacess-themes":
      return <ThemeSwitcher />
    case "zacess-scenes":
      return <FramePlayer clips={SCENE_CLIPS} label="Zacess Scenes preview" nextText="Next scene" />
    case "zacess-games":
      return <FramePlayer clips={GAME_CLIPS} still={GAMES_STILL} label="Zacess Games preview" nextText="Next game" />
  }
}

export default function ProductCard({ block }: { block: ProductCardBlock }) {
  const id = slugify(block.heading)
  return (
    <section aria-labelledby={id} className="my-4 space-y-4 rounded-lg border border-border/60 bg-card p-4 sm:p-5">
      <div className="space-y-2">
        <h3 id={id} className="text-lg font-semibold tracking-tight scroll-mt-24">{block.heading}</h3>
        <p className="text-base leading-relaxed text-foreground/90">{renderInline(block.text)}</p>
      </div>
      <Preview id={block.preview} />
      <a
        href={block.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center gap-2 font-medium text-primary underline underline-offset-4 hover:opacity-80"
      >
        See everything
        <span className="sr-only"> about {block.heading} on {new URL(block.href).host} (opens in a new tab)</span>
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
    </section>
  )
}
