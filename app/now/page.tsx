import type { Metadata } from "next"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import LiveStatusCards from "@/components/shared/LiveStatusCards"
import InspirationWidget from "@/components/shared/InspirationWidget"
import { getPublishedNotes } from "@/data/notes"
import {
  BookOpen,
  Code2,
  GraduationCap,
  Headphones,
  MapPin,
  Wrench,
  Dumbbell,
  ArrowUpRight,
  Lightbulb,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Now",
  description: "What I am studying, building and thinking about right now.",
  alternates: {
    canonical: "https://www.isaacadjei.me/now",
  },
  openGraph: {
    images: ["/api/og?title=Now&description=What%20I%20am%20studying%2C%20building%20and%20thinking%20about%20right%20now%2E"],
  },
}

const BUILDING_NEXT = ["multi-sport-ai-predictor", "codeforces-auto-push", "prosthetics-health-tech"]

export default function NowPage() {
  const live = getPublishedNotes()
  const buildingNext = BUILDING_NEXT.map((slug) => live.find((n) => n.slug === slug)).filter((n) => n !== undefined)
  return (
    <div className="container max-w-2xl py-24 space-y-14">
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span className="relative flex h-1.5 w-1.5">
            <span className="motion-safe:animate-ping motion-reduce:hidden absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
          </span>
          Updated live
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Now</h1>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">
          A snapshot of what I am doing in my life at this moment. Inspired by{" "}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
          >
            Derek Sivers
          </a>
          . Also listed on{" "}
          <a
            href="https://nownownow.com/p/n4lZ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
          >
            nownownow.com
          </a>
          .
        </p>
        <LiveStatusCards alwaysShowDiscord />
      </section>

      <Separator />

      <section className="space-y-3">
        <div className="flex items-center gap-2.5">
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          <h2 className="text-base font-semibold">Where I am</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Back in Birmingham for the autumn term at Aston University, where I study Electronic
          Engineering and Computer Science and aim for a First. Weeks are split between lectures,
          labs, running PAL sessions and society work, with London visits to family when I can.
        </p>
      </section>

      <Separator />

      <section className="space-y-3">
        <div className="flex items-center gap-2.5">
          <GraduationCap className="h-4 w-4 text-primary shrink-0" />
          <h2 className="text-base font-semibold">Studying</h2>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
          <p>
            This term is embedded systems in C on AVR microcontrollers, object-oriented programming
            and artificial intelligence. Digital design in VHDL on FPGAs comes next term, so I am
            getting ahead on it now, building on the VHDL I started over the summer.
          </p>
          <p>
            I lead weekly Peer Assisted Learning sessions in Python and electronics, serve as Treasurer
            of the Computing and Electronics Society and represent students as a Student Rep for my
            course and a School Rep.
          </p>
          <p>
            Competitive programming carries on alongside: NeetCode and LeetCode most weeks, Codeforces
            rounds when the timing works.
          </p>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <Wrench className="h-4 w-4 text-primary shrink-0" />
          <h2 className="text-base font-semibold">Building</h2>
        </div>
        <div className="space-y-4 text-sm text-muted-foreground">
          <div className="space-y-1">
            <p className="font-medium text-foreground">
              <Link href="/projects/lidarsat" className="hover:text-primary transition-colors">
                LidarSAT
              </Link>
            </p>
            <p className="leading-relaxed">
              GPS-denied drone navigation with a team of four: matching LiDAR height profiles from a drone against national terrain maps. This month is simulated flights in ArduPilot SITL and the first error measurements; I own the tooling, flight paths and the drone build.
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">
              <Link href="/projects/melophos" className="hover:text-primary transition-colors">
                MELOPHOS
              </Link>
            </p>
            <p className="leading-relaxed">
              Lights above the keys of any keyboard that show the next note, then score how it was played. The browser Studio already runs light-guided practice with a demo player; the first hub board and LED bars are next.
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">
              <Link href="/projects/vitafolio" className="hover:text-primary transition-colors">
                Vitafolio
              </Link>
            </p>
            <p className="leading-relaxed">
              My CV platform, now live with a CV checker, a student jobs board fed every night and a private application tracker. Polishing it with feedback from the first users.
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">
              <Link href="/projects/phaemos" className="hover:text-primary transition-colors">
                PHAEMOS
              </Link>
            </p>
            <p className="leading-relaxed">
              Predictive maintenance for machines. The anomaly models now raise alerts and maintenance tickets on their own and the dashboard has been redesigned; wiring the four physical sensor nodes is the current phase.
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">
              <Link href="/projects/avr-zac" className="hover:text-primary transition-colors">
                avr-zac
              </Link>
            </p>
            <p className="leading-relaxed">
              Bare metal AVR C on an ATmega644P, working through a structured curriculum from basic GPIO to a nine-mode state machine with interrupts, PWM, ADC and a Tetris melody. Each session is documented with notes and lab files.
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">
              <Link href="/projects/zacess" className="hover:text-primary transition-colors">
                Zacess
              </Link>
            </p>
            <p className="leading-relaxed">
              A free, open-source reader that turns slides, PDFs, handouts and web pages into notes in your own reading profile, now part of a family built on one contrast-checked palette: code themes in seven editor stores, terminal scenes, games and a profile tool. The browser version is open to try at{" "}
              <a href="https://app.zacess.com" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors">
                app.zacess.com
              </a>{" "}
              and the project is on{" "}
              <a href="https://zacess.com" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors">
                zacess.com
              </a>
              . Next are the apps, then lecture mode and study tools in the browser.
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">
              <Link href="/projects/footprints" className="hover:text-primary transition-colors">
                Footprints
              </Link>
            </p>
            <p className="leading-relaxed">
              A local record of what AI coding agents do on a machine: every file change, shell command
              and network call, with a diff and a one-step undo for each file change. Next is an
              automatic size budget and installing an agent&apos;s hooks after showing the change.
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">This site</p>
            <p className="leading-relaxed">
              A new{" "}
              <Link href="/experience" className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors">
                Experience
              </Link>{" "}
              page in four sections, the newsletter now sent from the site itself and{" "}
              <Link href="/stats" className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors">
                /stats
              </Link>{" "}
              counting public work only. The{" "}
              <Link href="/lab" className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors">
                lab terminal
              </Link>{" "}
              now runs zsh, bash, PowerShell and cmd, switches between the eight Zacess themes and
              has Zacess scenes and three of the games to try in the browser.
            </p>
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <Lightbulb className="h-4 w-4 text-primary shrink-0" />
          <h2 className="text-base font-semibold">Building next</h2>
        </div>
        <ul className="space-y-2 text-sm">
          {buildingNext.map((note) => (
            <li key={note.slug}>
              <Link href={`/notes/${note.slug}`} className="group inline-flex items-center gap-1.5 font-medium text-foreground hover:text-primary transition-colors">
                {note.title}
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Separator />

      <section className="space-y-3">
        <div className="flex items-center gap-2.5">
          <BookOpen className="h-4 w-4 text-primary shrink-0" />
          <h2 className="text-base font-semibold">Reading</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Dipping in and out of technical papers on retinoblastoma and ocular prosthetics. It is a
          personal research interest that has shaped a lot of how I think about accessible and
          bio-integrated technology.
          I keep a running log of books and content on the{" "}
          <Link href="/consumed" className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors">
            /consumed
          </Link>{" "}
          page.
        </p>
      </section>

      <Separator />

      <section className="space-y-3">
        <div className="flex items-center gap-2.5">
          <Code2 className="h-4 w-4 text-primary shrink-0" />
          <h2 className="text-base font-semibold">Thinking about</h2>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
          <p>
            How embedded AI at the edge differs in practice from what is taught in courses. Most
            ML curricula assume cloud inference. I am interested in what it takes to run useful
            models on microcontrollers with tight memory and power constraints.
          </p>
          <p>
            Applying for a year-long placement starting in 2027, with embedded, hardware and
            software teams alike. Roles with real engineering depth matter more to me than the name
            on the door. I go to industry events to meet the people doing that work.
          </p>
          <p>
            Being named a top 40 finalist for the Black Heritage Undergraduate of the Year award this
            year was a good reminder that the work is noticed beyond the code itself.
          </p>
        </div>
      </section>

      <Separator />

      <section className="space-y-3">
        <div className="flex items-center gap-2.5">
          <Dumbbell className="h-4 w-4 text-primary shrink-0" />
          <h2 className="text-base font-semibold">Outside of work</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Back at the gym consistently. Running more regularly too - short routes, building the
          habit. Hiking when I get the chance to get out of the city. Playing piano when I need to
          step away from screens. Getting better at cooking - less eating out, more experimenting
          in the kitchen. Cycling when the weather allows, which in London is actually more often
          than Birmingham.
        </p>
      </section>

      <Separator />

      <section className="space-y-3">
        <div className="flex items-center gap-2.5">
          <Headphones className="h-4 w-4 text-primary shrink-0" />
          <h2 className="text-base font-semibold">Listening</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Whatever Spotify decides I need that day. Heavy rotation of Afrobeats and Afropop at the moment. You can see what I am playing right now in the live status section above.
        </p>
      </section>

      <Separator />

      <p className="text-xs text-muted-foreground font-mono">
        Want to reach me?{" "}
        <Link href="/contact" className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4">
          Contact page
        </Link>{" "}
        or{" "}
        <a
          href="https://www.linkedin.com/in/isaacadjei"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
        >
          LinkedIn
          <ArrowUpRight className="h-3 w-3" />
        </a>
        .
      </p>
      <InspirationWidget />
    </div>
  )
}
