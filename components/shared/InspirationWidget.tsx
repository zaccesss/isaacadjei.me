"use client"

import { useCallback, useRef, useState } from "react"
import { Separator } from "@/components/ui/separator"
import { usePoll } from "@/lib/use-live-polling"

export default function InspirationWidget() {
  const [quote, setQuote] = useState<{ quote: string; author: string } | null>(null)
  const [bible, setBible] = useState<{ verse: string; reference: string } | null>(null)

  const rootRef = useRef<HTMLDivElement>(null)

  const loadQuote = useCallback(async (fresh = false) => {
    try {
      const res = await fetch(fresh ? `/api/quote?r=${Date.now()}` : "/api/quote")
      setQuote(await res.json())
    } catch {}
  }, [])
  const loadVerse = useCallback(async (fresh = false) => {
    try {
      const res = await fetch(fresh ? `/api/bible-verse?r=${Date.now()}` : "/api/bible-verse")
      setBible(await res.json())
    } catch {}
  }, [])
  const loadBoth = useCallback(() => {
    void loadQuote()
    void loadVerse()
  }, [loadQuote, loadVerse])

  usePoll(loadBoth, rootRef, 30 * 60 * 1000)

  return (
    <div ref={rootRef} className="space-y-4">
      <Separator />

      <div className="rounded-lg border border-border/60 bg-muted/30 px-6 py-5 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-mono text-primary uppercase tracking-widest">motivation</p>
          <button
            type="button"
            onClick={() => {
              setQuote(null)
              void loadQuote(true)
            }}
            className="relative text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors after:absolute after:-inset-x-1 after:-inset-y-1.5 after:content-['']"
          >
            refresh ↻
          </button>
        </div>
        {quote ? (
          <>
            <p className="text-base font-medium leading-relaxed">&ldquo;{quote.quote}&rdquo;</p>
            <p className="text-xs text-muted-foreground">- {quote.author}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground font-mono animate-pulse">loading quote...</p>
        )}
      </div>

      <div className="rounded-lg border border-border/60 bg-muted/30 px-6 py-5 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-mono text-primary uppercase tracking-widest">scripture</p>
          <button
            type="button"
            onClick={() => {
              setBible(null)
              void loadVerse(true)
            }}
            className="relative text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors after:absolute after:-inset-x-1 after:-inset-y-1.5 after:content-['']"
          >
            refresh ↻
          </button>
        </div>
        {bible ? (
          <>
            <p className="text-base font-medium leading-relaxed">&ldquo;{bible.verse}&rdquo;</p>
            <p className="text-xs text-muted-foreground">- {bible.reference}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground font-mono animate-pulse">loading verse...</p>
        )}
      </div>
    </div>
  )
}
