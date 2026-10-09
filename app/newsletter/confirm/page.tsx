import type { Metadata } from "next"
import { Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "Confirm your subscription",
  robots: { index: false, follow: false },
}

export default async function ConfirmPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { e = "", x = "", s = "" } = await searchParams
  return (
    <div className="container max-w-xl py-24 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>
        <p className="text-xs font-mono text-primary uppercase tracking-widest">newsletter</p>
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Confirm your subscription</h1>
      {e ? (
        <>
          <p className="text-muted-foreground leading-relaxed">
            Press the button to start getting the newsletter at <strong className="text-foreground">{e}</strong>. An
            issue arrives every couple of weeks.
          </p>
          <form action="/api/newsletter/confirm" method="post">
            <input type="hidden" name="e" value={e} />
            <input type="hidden" name="x" value={x} />
            <input type="hidden" name="s" value={s} />
            <button
              type="submit"
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Confirm my subscription
            </button>
          </form>
        </>
      ) : (
        <p className="text-muted-foreground">This link is missing its details. Sign up again from the newsletter page.</p>
      )}
    </div>
  )
}
