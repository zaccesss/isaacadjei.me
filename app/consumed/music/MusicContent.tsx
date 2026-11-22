import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { artists, genres } from "@/data/consumed/music"
import { consumedTotals } from "@/data/consumed"
import { consumedSlug, normTag } from "@/lib/content/tags"
import { SpotifyNowPlaying } from "@/components/consumed/SpotifyNowPlaying"
import { ConsumedCategoryTabs } from "@/components/consumed/ConsumedCategoryTabs"
import { Separator } from "@/components/ui/separator"
import { TAG_CLASS } from "@/components/shared/lists/Tag"
import PageHeader from "@/components/layout/PageHeader"

export default function MusicContent() {
  return (
    <div className="container py-24 space-y-10">
      <div className="max-w-2xl space-y-6">
        <Link
          href="/consumed"
          className="inline-flex min-h-11 items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Consumed
        </Link>
        <PageHeader
          title="Music"
          description="Artists and genres on heavy rotation this year."
        />
      </div>

      <ConsumedCategoryTabs active="music" counts={consumedTotals()} />

      <div className="flex justify-center">
        <SpotifyNowPlaying />
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-sm text-muted-foreground font-semibold">Artists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {artists.map((a) => (
            <div key={a.name} className="group rounded-xl border border-border/60 bg-card p-4 space-y-1.5 hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link
                    href={`/consumed/music/${consumedSlug(a.name)}`}
                    className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors"
                  >
                    {a.name}
                  </Link>
                  <Link
                    href={`/tags/${normTag(a.genre)}`}
                    className="block text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
                  >
                    {a.genre}
                  </Link>
                </div>
                {a.youtubeId && (
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{a.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm text-muted-foreground font-semibold">Genres</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {genres.map((g) => (
            <div key={g.label} className="rounded-xl border border-border/60 bg-card p-4 space-y-1.5">
              <span className={TAG_CLASS}>
                {g.label}
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">{g.description}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
        I listen to far more than I can list here. Songs come and go with the season.
        The genres above are the constants.
      </p>
    </div>
  )
}
