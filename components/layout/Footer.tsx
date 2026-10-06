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
      { href: "/uses", label: "Uses" },
      { href: "/guestbook", label: "Guestbook" },
      { href: "/friends", label: "Friends" },
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
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/security-policy", label: "Security Policy" },
      { href: "/disclaimer", label: "Disclaimer" },
      { href: "/copyright", label: "Copyright" },
    ],
  },
]

const linkClass = "text-sm text-muted-foreground hover:text-foreground transition-colors"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t">
      <div className="container py-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr_1.2fr]">
          <div className="flex flex-col items-start gap-5">
            <Link href="/" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
              Isaac Adjei
            </Link>
            <SocialLinks footerOnly />
            <FooterNewsletter />
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
            <p className="text-sm text-muted-foreground">Have a question, a project or an opportunity?</p>
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Send a message
            </Link>
            <Link
              href="/book"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Book a call
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <Link href="/copyright" className="hover:text-foreground transition-colors">
            &copy; {year} Isaac Adjei
          </Link>
          <a href="#top" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
            Back to top
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  )
}
