import { NextResponse } from "next/server"
import { heavyApiLimiter, checkRateLimit, getIp } from "@/lib/ratelimit"
import { stripHtmlTags } from "@/lib/strip-html-tags"

export const revalidate = 0

export async function GET(req: Request) {
  if (!await checkRateLimit(heavyApiLimiter, getIp(req))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }
  try {
    const res = await fetch("https://labs.bible.org/api/?passage=random&type=json", {
      next: { revalidate: 0 },
    })

    if (!res.ok) throw new Error("Bible API fetch failed")

    const data = await res.json()
    const { bookname, chapter, verse, text } = data[0]

    const cleanText = stripHtmlTags(text as string)

    return NextResponse.json({
      verse: cleanText,
      reference: `${bookname} ${chapter}:${verse}`,
    })
  } catch {
    return NextResponse.json({
      verse:
        "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.",
      reference: "Jeremiah 29:11",
    })
  }
}
