import type { Metadata } from "next"
import { feedAlternates } from "@/lib/feeds"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import {
  Mail,
  Cpu,
  Globe,
  Rocket,
  Navigation,
  History,
  Terminal,
  Accessibility,
  Briefcase,
  GraduationCap,
  Heart,
  Newspaper,
  Rss,
} from "lucide-react"
import NewsletterForm from "@/components/shared/NewsletterForm"
import RecentIssues from "@/components/shared/RecentIssues"
import AuthorCard from "@/components/blog/AuthorCard"

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Subscribe to my newsletter: engineering write-ups, project breakdowns, tech reflections and things I am building and learning. Written by Isaac Adjei.",
  alternates: {
    canonical: "https://www.isaacadjei.me/newsletter",
    types: feedAlternates("newsletter"),
  },
  openGraph: {
    images: ["/api/og?title=Newsletter&description=Engineering%20write-ups%2C%20project%20breakdowns%20and%20things%20I%20am%20building%2E"],
  },
}

const topics = [
  {
    icon: Cpu,
    title: "Embedded systems and electronics",
    description: "Bare metal C, RTOS scheduling, UART, SPI and I2C, FPGAs, datasheets and circuits built by hand.",
  },
  {
    icon: Rocket,
    title: "Building PHAEMOS, MELOPHOS and Vitafolio",
    description: "The decisions behind my own projects, from predictive maintenance firmware to keyboard LED bars and a CV platform.",
  },
  {
    icon: Navigation,
    title: "Drone navigation research",
    description: "GPS-denied navigation, LiDAR terrain matching, ArduPilot simulation and reading flight logs.",
  },
  {
    icon: History,
    title: "Engineering history and failures",
    description: "Ariane 5, the Apollo Guidance Computer, Therac-25 and the Mars Climate Orbiter: what each one teaches.",
  },
  {
    icon: Globe,
    title: "Full-stack software",
    description: "Next.js, TypeScript, databases, real-time data and what it takes to keep a production site running.",
  },
  {
    icon: Terminal,
    title: "Developer tools and terminals",
    description: "Git, shells, machine bootstrapping and terminal themes that stay readable.",
  },
  {
    icon: Accessibility,
    title: "Accessibility",
    description: "WCAG 2.2 in practice, contrast that holds up and working with low vision.",
  },
  {
    icon: Briefcase,
    title: "Careers and placements",
    description: "Industry virtual experiences, the placement search and UK engineering as an international student.",
  },
  {
    icon: GraduationCap,
    title: "University life and leadership",
    description: "Life at Aston, representing my course, running a society's finances and how I revise.",
  },
  {
    icon: Heart,
    title: "Faith and life",
    description: "Reflections on faith, gratitude, Ghanaian heritage and choosing hard things.",
  },
]

export default function NewsletterPage() {
  return (
    <div className="container max-w-2xl py-24 space-y-16">

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <p className="text-xs font-mono text-primary uppercase tracking-widest">newsletter</p>
          </div>
          <a
            href="/newsletter/feed.xml"
            title="RSS feed"
            aria-label="Newsletter RSS feed"
            className="inline-flex items-center gap-1.5 text-base font-medium text-primary hover:text-primary/70 transition-colors shrink-0"
          >
            <Rss className="h-5 w-5 shrink-0" />
            Feed
          </a>
        </div>
        <div className="flex items-start gap-2">
          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            Engineering, hardware and software. Straight to your inbox.
          </h1>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">
          I write about the things I am building and learning: embedded systems, full-stack software,
          university projects and the ideas behind them. No filler, no clickbait. Just honest
          write-ups from someone who spends most of their time at the intersection of hardware and
          software.
        </p>
      </section>

      <AuthorCard />

      <Separator />

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">What you will read</h2>
        <div className="grid gap-4">
          {topics.map((topic) => (
            <div key={topic.title} className="flex gap-4 rounded-lg border border-border/60 bg-muted/20 p-4">
              <div className="shrink-0 mt-0.5">
                <topic.icon className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm">{topic.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{topic.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      <section id="subscribe" className="space-y-6 scroll-mt-28">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Subscribe</h2>
          <p className="text-muted-foreground">
            Free, always. How your details are handled is in the{" "}
            <Link href="/privacy" className="text-primary underline underline-offset-4 hover:text-primary/80">
              privacy policy
            </Link>
            .
          </p>
        </div>
        <NewsletterForm />
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-muted-foreground">Already subscribed?</span>
          <a
            href="#recent-issues"
            className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 hover:border-primary/50 transition-all"
          >
            <Newspaper className="h-3.5 w-3.5" aria-hidden="true" />
            Browse recent issues
          </a>
        </div>
      </section>

      <Separator />

      <RecentIssues />

    </div>
  )
}
