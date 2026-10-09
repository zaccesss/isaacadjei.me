import { NextResponse } from "next/server"
import { verifyConfirm, addSubscriber } from "@/lib/newsletter-subscribe"

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null)
  const params = new URLSearchParams()
  for (const k of ["e", "x", "s"]) {
    const v = form?.get(k)
    if (typeof v === "string") params.set(k, v)
  }
  const email = verifyConfirm(params)
  const target = new URL("/newsletter/confirmed", req.url)
  target.searchParams.set("status", !email ? "invalid" : (await addSubscriber(email)) ? "ok" : "error")
  return NextResponse.redirect(target, { status: 303, headers: { "Cache-Control": "no-store" } })
}
