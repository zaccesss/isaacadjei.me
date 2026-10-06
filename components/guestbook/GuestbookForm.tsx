"use client"

import { useRef, useState } from "react"
import { Loader2, PenLine } from "lucide-react"
import { Turnstile } from "@marsidev/react-turnstile"
import type { TurnstileInstance } from "@marsidev/react-turnstile"
import { Button } from "@/components/ui/button"

const field = "w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"

export default function GuestbookForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", message: "", website: "" })
  const [token, setToken] = useState<string | null>(null)
  const turnstileRef = useRef<TurnstileInstance>(null)
  const turnstileOn = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const liveToken = turnstileRef.current?.getResponse?.() ?? token
    if (turnstileOn && !liveToken) return
    setStatus("loading")
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          _hp: e.currentTarget.querySelector<HTMLInputElement>("[name=_hp]")?.value ?? "",
          turnstileToken: liveToken,
        }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.")
      setStatus("success")
    } catch (err) {
      setStatus("error")
      setError(err instanceof Error ? err.message : "Something went wrong.")
      setToken(null)
      turnstileRef.current?.reset()
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-xl border border-dashed p-6 text-center">
        <p className="font-semibold">Thanks for signing.</p>
        <p className="mt-1 text-sm text-muted-foreground">Your message will appear here once I have read it.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-dashed p-6">
      <h2 className="text-lg font-semibold">Sign the guestbook</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium">
          <span>Name</span>
          <input className={field} name="name" required maxLength={60} autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label className="space-y-1.5 text-sm font-medium">
          <span>Website <span className="font-normal text-muted-foreground">(optional)</span></span>
          <input className={field} name="website" type="url" maxLength={200} placeholder="https://" autoComplete="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
        </label>
      </div>
      <label className="block space-y-1.5 text-sm font-medium">
        <span>Message</span>
        <textarea className={field} name="message" required maxLength={280} rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <span className="block text-xs font-normal text-muted-foreground" aria-live="polite">{280 - form.message.length} characters left</span>
      </label>
      <input type="text" name="_hp" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      {turnstileOn && (
        <Turnstile
          ref={turnstileRef}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          options={{ refreshExpired: "auto", refreshTimeout: "auto" }}
          onSuccess={setToken}
          onExpire={() => setToken(null)}
          onError={() => setToken(null)}
        />
      )}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={status === "loading" || (turnstileOn && !token)}>
        {status === "loading" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : <PenLine className="mr-2 h-4 w-4" aria-hidden="true" />}
        {status === "loading" ? "Signing" : "Sign"}
      </Button>
    </form>
  )
}
