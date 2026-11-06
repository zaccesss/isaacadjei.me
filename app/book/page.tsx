import type { Metadata } from "next"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { BOOKING_URL } from "@/lib/constants"
import { BookingFrame } from "@/components/BookingFrame"

export const metadata: Metadata = {
  title: "Book a call",
  description: "Book a 30 minute video call with Isaac Adjei at a time that suits you.",
  alternates: { canonical: "https://www.isaacadjei.me/book" },
  openGraph: {
    images: ["/api/og?title=Book%20a%20call&description=Book%20a%2030%20minute%20video%20call%20with%20me%20at%20a%20time%20that%20suits%20you%2E"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/api/og?title=Book%20a%20call&description=Book%20a%2030%20minute%20video%20call%20with%20me%20at%20a%20time%20that%20suits%20you%2E"],
  },
}

const link = "text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"

export default function BookPage() {
  return (
    <div className="container max-w-4xl py-24 space-y-10">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Book a call</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Pick a time for a 30 minute video call about projects, ideas, opportunities or anything else. Times show in
          your own time zone. You will get a calendar invite with a Google Meet link straight away.
        </p>
      </section>

      <Separator />

      <div className="space-y-3">
        <BookingFrame calLink={BOOKING_URL.replace("https://cal.com/", "")} />
        <p className="text-sm text-muted-foreground">
          Calendar not loading? <a href={BOOKING_URL} className={link}>Open the booking page</a> or use the{" "}
          <Link href="/contact" className={link}>contact page</Link>.
        </p>
      </div>
    </div>
  )
}
