"use client"

import { useSearchParams } from "next/navigation"

const LETTER_STATUS: Record<string, string> = {
  ok: "You are on the list. The next letter will reach you.",
  invalid: "That link has expired or is not valid. Send a new request below and I will send a fresh one.",
  error: "Something went wrong adding you. Please try the link again later.",
}

export default function FriendLetterNotice() {
  const params = useSearchParams()
  const one = (k: string) => params.get(k) ?? ""
  const letters = one("letters")
  return (
    <>
      {letters === "confirm" && (
        <form action="/api/friends/confirm" method="post" className="space-y-3 rounded-xl border border-primary p-6" role="region" aria-label="Confirm the letters">
          <p className="font-semibold">Confirm the monthly letters</p>
          <p className="text-sm text-muted-foreground">Press the button to confirm this address and join the letters.</p>
          {["e", "x", "s"].map((k) => <input key={k} type="hidden" name={k} value={one(k)} />)}
          <button type="submit" className="min-h-11 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground">Send me the letters</button>
        </form>
      )}
      {LETTER_STATUS[letters] && <p role="status" className="rounded-xl border p-4 text-sm">{LETTER_STATUS[letters]}</p>}
    </>
  )
}
