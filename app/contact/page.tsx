import type { Metadata } from "next"
import ContactForm from "@/components/forms/ContactForm"
import SocialLinks from "@/components/shared/SocialLinks"
import { Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Isaac Adjei.",
  alternates: {
    canonical: "https://www.isaacadjei.me/contact",
  },
  openGraph: {
    images: ["/api/og?title=Contact&description=Get%20in%20touch%20with%20Isaac%20Adjei%2E"],
  },
}

export default function ContactPage() {
  return (
    <div className="container max-w-2xl py-24 space-y-10">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">Get in Touch</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          A placement or internship, a project to build together, an idea or simply a question: I am
          happy to hear about any of it. Honest feedback is as welcome as an opportunity.
        </p>
        <p className="text-muted-foreground">
          Easier to talk it through?{" "}
          <a href="/book" className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors">
            Book a short call
          </a>{" "}
          at a time that suits you.
        </p>
      </div>
      <ContactForm />
      <div className="space-y-4 pt-2">
        <p className="text-sm text-muted-foreground">
          Prefer email?{" "}
          <a
            href="mailto:contact@isaacadjei.me"
            className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
          >
            contact@isaacadjei.me
          </a>
        </p>
        <p className="text-sm text-muted-foreground">Or find me on:</p>
        <SocialLinks />
      </div>
    </div>
  )
}
