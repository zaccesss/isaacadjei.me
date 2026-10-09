import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2, AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Newsletter subscription",
  robots: { index: false, follow: false },
}

const MESSAGES = {
  ok: {
    title: "You are subscribed",
    body: "Thank you. The next issue arrives in the next couple of weeks. Every past issue is on the newsletter page in the meantime.",
  },
  invalid: {
    title: "That link has expired",
    body: "Confirmation links work for three days. Sign up again from the newsletter page and a fresh link will arrive.",
  },
  error: {
    title: "Something went wrong",
    body: "Your subscription could not be saved just now. Please try the link again in a few minutes. Signing up again also works.",
  },
} as const

export default async function ConfirmedPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams
  const key = status === "ok" || status === "invalid" ? status : "error"
  const m = MESSAGES[key]
  const Icon = key === "ok" ? CheckCircle2 : AlertCircle
  return (
    <div className="container max-w-xl py-24 space-y-6">
      <Icon className={`h-8 w-8 ${key === "ok" ? "text-green-700 dark:text-green-400" : "text-amber-700 dark:text-amber-400"}`} aria-hidden="true" />
      <h1 className="text-3xl font-bold tracking-tight">{m.title}</h1>
      <p className="text-muted-foreground leading-relaxed">{m.body}</p>
      <Link href="/newsletter" className="inline-flex text-sm font-medium text-primary hover:text-primary/80">
        Go to the newsletter
      </Link>
    </div>
  )
}
