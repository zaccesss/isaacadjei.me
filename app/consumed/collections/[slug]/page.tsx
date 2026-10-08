import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { CONSUMED_COLLECTIONS, findCollection } from "@/data/consumed/collections"
import { consumedCollectionItems } from "@/data/consumed/summary"
import { SummaryCard } from "@/components/consumed/SummaryCard"

export const revalidate = 21600

export function generateStaticParams() {
  return CONSUMED_COLLECTIONS.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const collection = findCollection(slug)
  if (!collection) return { title: "Not found" }
  const title = `${collection.title} | Consumed`
  return {
    title,
    description: collection.description,
    alternates: { canonical: `https://www.isaacadjei.me/consumed/collections/${slug}` },
    openGraph: {
      title,
      images: [`/api/og?title=${encodeURIComponent(collection.title)}&description=${encodeURIComponent(collection.description)}`],
    },
  }
}

export default async function ConsumedCollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const collection = findCollection(slug)
  if (!collection) notFound()
  const items = consumedCollectionItems(collection)
  const others = CONSUMED_COLLECTIONS.filter((c) => c.slug !== slug)

  return (
    <div className="container max-w-4xl py-24 space-y-10">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/consumed" className="hover:text-foreground transition-colors">Consumed</Link>
        <span aria-hidden="true">/</span>
        <Link href="/consumed#collections" className="hover:text-foreground transition-colors">Collections</Link>
      </nav>

      <header className="space-y-3 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight">{collection.title}</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">{collection.description}</p>
        <p className="text-xs font-mono text-muted-foreground">{items.length} {items.length === 1 ? "item" : "items"}, newest first</p>
      </header>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Nothing in this collection yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item) => <SummaryCard key={item.key} item={item} />)}
        </div>
      )}

      <section aria-labelledby="more-collections" className="space-y-3 border-t border-border/60 pt-8">
        <h2 id="more-collections" className="text-xs font-mono text-muted-foreground uppercase tracking-widest">More collections</h2>
        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {others.map((c) => (
            <li key={c.slug}>
              <Link href={`/consumed/collections/${c.slug}`} className="text-primary underline underline-offset-2 hover:text-primary/80">
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Link href="/consumed" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Consumed
      </Link>
    </div>
  )
}
