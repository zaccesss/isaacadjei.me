import { NextResponse } from "next/server"
import { verifySigned } from "@/lib/newsletter/newsletter-subscribe"
import { addToLetters, LETTERS_PURPOSE } from "@/lib/friends/friend-letters"
import { supabase } from "@/lib/core/supabase"
import { recordActivity } from "@/lib/core/activity"

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null)
  const params = new URLSearchParams()
  for (const k of ["e", "x", "s"]) {
    const v = form?.get(k)
    if (typeof v === "string") params.set(k, v)
  }
  const email = verifySigned(params, LETTERS_PURPOSE)
  let status = "invalid"
  if (email) {
    const { data, error: readError } = await supabase.from("friend_requests").select("id").eq("email", email).eq("status", "approved").eq("wants_letters", true).limit(1)
    if (readError) console.error("[friends/confirm] request not read:", readError.message)
    if (data?.length && (await addToLetters(email))) {
      const { error: saveError } = await supabase.from("friend_requests").update({ letters_confirmed_at: new Date().toISOString() }).eq("id", data[0].id)
      if (saveError) console.error("[friends/confirm] confirmation not saved:", saveError.message)
      await recordActivity("friends.letters")
      status = "ok"
    } else {
      status = data?.length ? "error" : "invalid"
    }
  }
  const target = new URL("/friends", req.url)
  target.searchParams.set("letters", status)
  return NextResponse.redirect(target, { status: 303, headers: { "Cache-Control": "no-store" } })
}
