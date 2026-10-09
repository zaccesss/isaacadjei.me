import Link from "next/link"
import { ArrowUp, CalendarDays, Mail } from "lucide-react"
import SocialLinks from "@/components/shared/SocialLinks"
import FooterNewsletter from "@/components/layout/FooterNewsletter"

type FooterLink = { href: string; label: string; external?: boolean }

const GROUPS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Explore",
    links: [
      { href: "/now", label: "Now" },
      { href: "/lab", label: "Lab" },
      { href: "/stats", label: "Stats" },
      { href: "/notes", label: "Notes" },
      { href: "/consumed", label: "Consumed" },
      { href: "/respub", label: "Research" },
      { href: "/skills", label: "Skills" },
      { href: "/uses", label: "Uses" },
      { href: "/friends", label: "Friends" },
      { href: "/guestbook", label: "Guestbook" },
    ],
  },
  {
    title: "Site",
    links: [
      { href: "/search", label: "Search" },
      { href: "/tags", label: "Tags" },
      { href: "/all-pages", label: "All pages" },
      { href: "/colophon", label: "Colophon" },
      { href: "/changelog", label: "Changelog" },
      { href: "/accessibility", label: "Accessibility" },
      { href: "/support", label: "Support" },
      { href: "https://status.isaacadjei.me", label: "Status", external: true },
    ],
  },
  {
    title: "Legal & Privacy",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/security-policy", label: "Security Policy" },
      { href: "/disclaimer", label: "Disclaimer" },
      { href: "/copyright", label: "Copyright" },
    ],
  },
]

const linkClass = "text-[13px] text-muted-foreground hover:text-foreground transition-colors"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t">
      <div className="container py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr_1.2fr] lg:gap-x-20 xl:gap-x-28">
          <div className="flex flex-col items-start gap-8">
            <FooterNewsletter />
            <div className="lg:mt-auto">
              <SocialLinks footerOnly />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {GROUPS.map((group) => (
              <nav key={group.title} aria-labelledby={`footer-${group.title.toLowerCase()}`}>
                <h2 id={`footer-${group.title.toLowerCase()}`} className="mb-3 text-sm font-semibold text-foreground">
                  {group.title}
                </h2>
                <ul className="space-y-2">
                  {group.links.map((item) => (
                    <li key={item.href}>
                      {item.external ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                          {item.label}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      ) : (
                        <Link href={item.href} className={linkClass}>
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Get in touch</h2>
            <p className="text-[13px] text-muted-foreground">Have a question, a project or an opportunity?</p>
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-[13px] font-medium hover:bg-accent transition-colors"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Send a message
            </Link>
            <Link
              href="/book"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Book a call
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            <Link href="/copyright" className="hover:text-foreground transition-colors">
              &copy; {year} Isaac Adjei
            </Link>
            <span>. All rights reserved.</span>
          </p>
          <a
            href="#top"
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-full"
          >
            Back to top
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowUp className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}
