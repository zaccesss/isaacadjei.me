import Link from "next/link"
import { ArrowRight, Download, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ContactCTA() {
  return (
    <section aria-labelledby="contact" className="border-t py-16 sm:py-20">
      <div className="mx-auto w-full max-w-2xl space-y-6 px-6 text-center">
        <Mail className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
        <h2 id="contact" className="text-3xl font-bold tracking-tight">Let&apos;s work together</h2>
        <p className="text-lg leading-relaxed text-foreground/90">
          I am actively looking for internship and placement opportunities in engineering and technology. Whether you have
          a role, a project, a collaboration idea or just want to connect, I am always open to a conversation.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="gap-2">
            <a href="/api/cv-pdf">
              <Download className="h-4 w-4" aria-hidden="true" />
              Download my CV
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link href="/projects">
              View my work
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
