"use client"

import { useRef, useState } from "react"
import { Loader2, Send } from "lucide-react"
import { Turnstile } from "@marsidev/react-turnstile"
import type { TurnstileInstance } from "@marsidev/react-turnstile"
import { Button } from "@/components/ui/button"

const field = "min-h-11 w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
const check = "h-5 w-5 shrink-0 accent-primary"

export default function FriendRequestForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ kind: "friend" as "friend" | "penpal", name: "", email: "", website: "", note: "", showOnPage: false, wantsLetters: false })
  const [token, setToken] = useState<string | null>(null)
  const turnstileRef = useRef<TurnstileInstance>(null)
  const turnstileOn = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)
  const hasSite = /^https:\/\/\S+$/i.test(form.website.trim())

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const liveToken = turnstileRef.current?.getResponse?.() ?? token
    if (turnstileOn && !liveToken) return
    setStatus("loading")
    try {
      const res = await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          showOnPage: form.kind === "friend" && hasSite && form.showOnPage,
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
        <p className="font-semibold">Thanks, I have your request.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          I read each one myself. If you asked for the letters, an email will ask you to confirm once I have said yes.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-dashed p-6">
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">I would like to be</legend>
        <div className="flex flex-wrap gap-2">
          {(["friend", "penpal"] as const).map((k) => (
            <label key={k} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-4 text-sm ${form.kind === k ? "border-primary bg-accent font-semibold" : ""}`}>
              <input type="radio" name="kind" value={k} checked={form.kind === k} onChange={() => setForm({ ...form, kind: k })} className="h-4 w-4 accent-primary" />
              {k === "friend" ? "Friends" : "Pen pals"}
            </label>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {form.kind === "penpal" ? "Pen pals get my letter once a month and can write back." : "Friends can ask to be listed on this page and can get the monthly letter too."}
        </p>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium">
          <span>Name</span>
          <input className={field} name="name" required maxLength={60} autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label className="space-y-1.5 text-sm font-medium">
          <span>Email <span className="font-normal text-muted-foreground">(never shown)</span></span>
          <input className={field} name="email" type="email" required maxLength={254} autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
      </div>
      <label className="block space-y-1.5 text-sm font-medium">
        <span>Website <span className="font-normal text-muted-foreground">(optional)</span></span>
        <input className={field} name="website" type="url" maxLength={200} placeholder="https://" autoComplete="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
      </label>
      <label className="block space-y-1.5 text-sm font-medium">
        <span>A little about you <span className="font-normal text-muted-foreground">(optional)</span></span>
        <textarea className={field} name="note" maxLength={500} rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        <span className="block text-xs font-normal text-muted-foreground" aria-live="polite">{500 - form.note.length} characters left</span>
      </label>
      {form.kind === "friend" && (
        <div className="space-y-3">
          <label className={`flex min-h-11 items-center gap-3 text-sm ${hasSite ? "" : "opacity-60"}`}>
            <input type="checkbox" className={check} disabled={!hasSite} checked={hasSite && form.showOnPage} onChange={(e) => setForm({ ...form, showOnPage: e.target.checked })} />
            <span>List me on this page with my name and website{hasSite ? "" : " (add a website starting with https:// first)"}</span>
          </label>
          <label className="flex min-h-11 items-center gap-3 text-sm">
            <input type="checkbox" className={check} checked={form.wantsLetters} onChange={(e) => setForm({ ...form, wantsLetters: e.target.checked })} />
            <span>Send me the monthly letter too</span>
          </label>
        </div>
      )}
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
      <Button type="submit" className="min-h-11" disabled={status === "loading" || (turnstileOn && !token)}>
        {status === "loading" ? <Loader2 className="mr-2 h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Send className="mr-2 h-4 w-4" aria-hidden="true" />}
        {status === "loading" ? "Sending" : "Send request"}
      </Button>
    </form>
  )
}
