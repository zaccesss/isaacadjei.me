import type { Metadata } from "next"
import Link from "next/link"
import ContactForm from "@/components/forms/ContactForm"
import PageHeader from "@/components/layout/PageHeader"

export const metadata: Metadata = {
  title: "Contact",
  description: "Send a message or book a 30 minute call with Isaac Adjei.",
  alternates: {
    canonical: "https://isaacadjei.me/contact",
  },
  openGraph: {
    images: ["/api/og?title=Contact&description=Get%20in%20touch%20with%20Isaac%20Adjei%2E"],
  },
}

const rowLink = "body-link inline-flex min-h-11 items-center"
const row = "sm:grid sm:grid-cols-[10rem_1fr] sm:items-start sm:gap-4"
const label = "font-medium text-foreground sm:py-2.5"
const value = "text-muted-foreground"

export default function ContactPage() {
  return (
    <div className="container max-w-2xl py-24 space-y-10">
      <PageHeader
        title="Get in touch"
        description={
          <>
            I like hearing from people about anything: a question, a suggestion, a correction, an idea,
            a project, a collaboration or an opportunity such as a placement or an internship. Send me a
            message here.
            There are more ways to reach me below the form.
          </>
        }
      />
      <ContactForm />
      <section aria-labelledby="other-ways" className="space-y-4 pt-2">
        <h2 id="other-ways" className="text-2xl font-bold">
          Other ways to reach me
        </h2>
        <dl className="space-y-3 sm:space-y-1">
          <div className={row}>
            <dt className={label}>Email:</dt>
            <dd className={value}>
              <a href="mailto:contact@isaacadjei.me" className={rowLink}>
                contact@isaacadjei.me
              </a>
            </dd>
          </div>
          <div className={row}>
            <dt className={label}>Book a call:</dt>
            <dd className={value}>
              A short call at a time that suits you.{" "}
              <a href="/book" className={rowLink}>
                Book here
              </a>
            </dd>
          </div>
          <div className={row}>
            <dt className={label}>Security reports:</dt>
            <dd className={value}>
              <a href="mailto:security@isaacadjei.me" className={rowLink}>
                security@isaacadjei.me
              </a>
              , where you can attach a file. My{" "}
              <Link href="/security-policy" className={rowLink}>
                security policy
              </Link>{" "}
              says what to include.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
