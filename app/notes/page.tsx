import type { Metadata } from "next"
import { feedAlternates } from "@/lib/feeds"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Lightbulb, Wrench, CalendarDays, ExternalLink, ArrowRight, Rss } from "lucide-react"
import { FaGithub as Github } from "react-icons/fa6"
import InspirationWidget from "@/components/shared/InspirationWidget"
import { notes } from "@/data/notes"
import NotePostsList from "@/components/notes/NotePostsList"
import { TAG_CLASS } from "@/components/shared/Tag"

export const revalidate = 21600

export const metadata: Metadata = {
  title: "Notes",
  description: "A public notebook. What I am building, thinking about and planning.",
  alternates: {
    canonical: "https://www.isaacadjei.me/notes",
    types: feedAlternates("notes", "all"),
  },
  openGraph: {
    images: ["/api/og?title=Notes&description=A%20public%20notebook%2E%20What%20I%20am%20building%2C%20thinking%20about%20and%20planning%2E"],
  },
}

const currentProjects = [
  {
    name: "LidarSAT",
    badge: "Team research",
    description:
      "GPS-denied drone navigation with a four-person team: matching a drone's LiDAR height profiles against the Environment Agency's national terrain maps, comparing a classic matcher with a learned one in simulation and on a real flight. I look after the tooling, the flight path generator, error measurement and the drone build.",
    projectHref: "/projects/lidarsat",
    githubHref: "https://github.com/ENGNERDS",
  },
  {
    name: "MELOPHOS",
    badge: "Early build",
    description:
      "An open instrument-learning platform: an ESP32-S3 hub lights the next notes above the keys of any keyboard, then scores every note for pitch and timing. The browser Studio already runs light-guided practice; the first hub board and LED bars are in design.",
    projectHref: "/projects/melophos",
    websiteHref: "https://melophos.com",
    githubHref: "https://github.com/melophos/melophos",
  },
  {
    name: "Vitafolio",
    badge: "Live",
    description:
      "A web app for building, storing and sharing every version of a CV, with a CV checker, a student jobs board and an application tracker. Live and growing.",
    projectHref: "/projects/vitafolio",
    websiteHref: "https://vitafolio.isaacadjei.me",
    githubHref: "https://github.com/zaccesss/vitafolio",
  },
  {
    name: "PHAEMOS",
    badge: "Ongoing",
    description:
      "An open predictive maintenance platform: four sensor nodes, a FastAPI backend with per-node anomaly models that raise alerts and tickets on their own plus a live Next.js dashboard. The software runs end to end against a simulator; wiring the physical nodes is the current phase.",
    projectHref: "/projects/phaemos",
    websiteHref: "https://phaemos.com",
    githubHref: "https://github.com/phaemos/phaemos",
  },
  {
    name: "avr-zac",
    badge: "Ongoing",
    description:
      "Bare metal AVR C project on an ATmega644P. Working through a structured curriculum from basic GPIO to a nine-mode state machine with interrupts, PWM, ADC and a Tetris melody. Sessions are documented with notes and lab files. Still actively being extended.",
    projectHref: "/projects/avr-zac",
    githubHref: "https://github.com/zaccesss/avr-zac",
  },
  {
    name: "Business Website",
    badge: "Ongoing",
    description:
      "A terminal-style personal site that will evolve into a business presence. The direction is not fully set yet - it will likely serve whatever venture comes next. Keeping the terminal aesthetic for now and using it as a playground for ideas. Suggestions welcome via the contact form or by typing 'suggest' in the lab terminal.",
    projectHref: "/projects/zacess-pages",
    websiteHref: "https://zacess.com",
    githubHref: "https://github.com/zaccesss/zacess-pages",
  },
]

export default function NotesPage() {
  return (
    <div className="container max-w-3xl py-24 space-y-16">
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-4xl font-bold tracking-tight">Notes</h1>
          <a
            href="/notes/feed.xml"
            title="RSS feed"
            aria-label="Notes RSS feed"
            className="inline-flex items-center gap-1.5 text-base font-medium text-primary hover:text-primary/70 transition-colors shrink-0"
          >
            <Rss className="h-5 w-5 shrink-0" />
            Feed
          </a>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">
          A public notebook. Not polished posts, just honest notes on what I am building, thinking
          about and planning. Updated as things change.
        </p>
        <p className="text-sm text-muted-foreground">
          <span aria-hidden="true">💡 </span>Shorter, faster notes live on the{" "}
          <Link href="/til" className="text-primary underline underline-offset-4 hover:opacity-80">TIL page</Link>: snippets from things I discover day to day.
        </p>
      </section>

      <Separator />

      <NotePostsList />

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Lightbulb className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Upcoming Projects</h2>
        </div>

        <div className="space-y-4">
          {notes.map((note) => (
            <Link
              key={note.slug}
              href={`/notes/${note.slug}`}
              className="group block rounded-lg border border-border/60 bg-muted/20 px-6 py-5 hover:border-primary/40 hover:bg-muted/30 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {note.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{note.lead}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {note.tags.map((tag) => (
                      <span key={tag} className={TAG_CLASS}>{tag}</span>
                    ))}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Separator />

      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <Wrench className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Currently Building</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          {currentProjects.map((p) => (
            <div key={p.name} className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium text-foreground">{p.name}</p>
                {p.badge && (
                  <span className="text-xs text-muted-foreground">{p.badge}</span>
                )}
                {p.projectHref && (
                  <Link
                    href={p.projectHref}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Project page
                  </Link>
                )}
                {p.websiteHref && (
                  <a
                    href={p.websiteHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Website
                  </a>
                )}
                {p.githubHref && (
                  <a
                    href={p.githubHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github className="h-3 w-3" />
                    GitHub
                  </a>
                )}
              </div>
              <p className="text-sm">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Autumn 2026 Plans</h2>
        </div>
        <div className="space-y-3 text-muted-foreground text-sm">
          <p>
            Autumn 2026 is about balance: a heavy term of modules, three roles on campus and the
            projects I care about, while I line up a placement for next year. The plan:
          </p>
          <ul className="space-y-2 list-none">
            <li className="flex gap-2">
              <span className="text-primary shrink-0 mt-0.5">→</span>
              <span>Apply for year-long placements and work experience for 2027, with a weekly routine for finding roles, tailoring each application and preparing for assessment centres</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary shrink-0 mt-0.5">→</span>
              <span>Keep working towards a First by staying on top of every module from week one rather than catching up before exams</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary shrink-0 mt-0.5">→</span>
              <span>Keep building: ship the next PHAEMOS and MELOPHOS milestones, grow Vitafolio and fly the LidarSAT drone</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary shrink-0 mt-0.5">→</span>
              <span>Run PAL sessions every week, keep the society&apos;s books in order and turn course feedback into real changes as a rep</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary shrink-0 mt-0.5">→</span>
              <span>Publish writing three days a week until the end of December: blog posts, TILs and notes</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary shrink-0 mt-0.5">→</span>
              <span>Start working out life after university: the kind of engineer I want to be, where I want to work and what I want to build</span>
            </li>
          </ul>
        </div>
      </section>

      <Separator />

      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Summer 2026 Plans</h2>
        </div>
        <div className="space-y-3 text-muted-foreground text-sm">
          <p>
            Summer 2026 is about building things that matter and documenting them properly. The
            plan:
          </p>
          <ul className="space-y-2 list-none">
            <li className="flex gap-2">
              <span className="text-primary shrink-0 mt-0.5">→</span>
              <span>Prepare for next academic year - reviewing modules, getting ahead on coursework and sharpening fundamentals</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary shrink-0 mt-0.5">→</span>
              <span>Learn FPGA development and VHDL - starting from scratch and working up to real hardware designs</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary shrink-0 mt-0.5">→</span>
              <span>Get serious about competitive programming - consistent Codeforces practice and improving my rating</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary shrink-0 mt-0.5">→</span>
              <span>
                Publish the remaining blog posts and keep the newsletter active with regular issues
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary shrink-0 mt-0.5">→</span>
              <span>Complete the avr-zac state machine project and document it fully</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary shrink-0 mt-0.5">→</span>
              <span>Get the multi-sport AI predictor properly shipped, starting with football (see above)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary shrink-0 mt-0.5">→</span>
              <span>
                Begin deep research into retinoblastoma, ocular prosthetics and bio-integrated
                health technology
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary shrink-0 mt-0.5">→</span>
              <span>Study fields outside engineering and tech - business, psychology, economics and anything else worth understanding</span>
            </li>
          </ul>
        </div>
      </section>

      <InspirationWidget />

    </div>
  )
}
