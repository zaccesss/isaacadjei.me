import type { Metadata } from "next"
import Link from "next/link"
import { education } from "@/data/education"
import { societies, isSocietyRoleVisible } from "@/data/societies"
import { Separator } from "@/components/ui/separator"
import ApproachAnimation from "@/components/shared/ApproachAnimation"
import {
  GraduationCap,
  Users,
  Heart,
  Sparkles,
  Languages,
  HandHeart,
  Trophy,
  Quote,
  HeartHandshake,
} from "lucide-react"
import { CHIP_CLASS } from "@/components/shared/Tag"

export const revalidate = 86400

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about Isaac Adjei - his story, education and involvement.",
  alternates: {
    canonical: "https://www.isaacadjei.me/about",
  },
  openGraph: {
    images: ["/api/og?title=About%20Isaac%20Adjei&description=Learn%20more%20about%20Isaac%20Adjei%20-%20his%20story%2C%20education%20and%20involvement%2E"],
  },
}

const interestGroups = [
  { title: "Engineering", items: ["Embedded systems and firmware", "PCB and circuit design", "IoT and predictive maintenance", "Drones and robotics", "Digital design and FPGAs"] },
  { title: "Software", items: ["Full-stack web apps", "Developer tooling and automation", "Open source", "Cyber security", "Cloud and DevOps"] },
  { title: "Data and AI", items: ["Machine learning", "Anomaly detection", "Data visualisation", "Computer vision"] },
  { title: "People and impact", items: ["Accessible technology", "Health tech and bionic vision", "Peer teaching", "Music technology"] },
]

const hobbies = [
  "Piano",
  "Music",
  "Gaming on PS5 and PC",
  "Gym and fitness",
  "Cycling",
  "Ghanaian cooking",
  "Reading",
  "Journaling",
  "Travel",
  "Competitive programming",
  "Online courses",
]

const causes = [
  { name: "Education", how: "Running peer learning sessions and writing free course material such as git-unlocked." },
  { name: "Accessible technology", how: "Building interfaces with strong contrast, keyboard use and reduced motion from the start." },
  { name: "Health", how: "Following health tech and bionic vision research and volunteering with Cancer Research UK." },
  { name: "Science and technology", how: "Sharing what I build and learn openly through projects, notes and TIL posts." },
  { name: "Open source", how: "Publishing my projects, tools and configs under open licences." },
  { name: "Diversity and inclusion", how: "Taking part in Black heritage and African-Caribbean communities in tech and at university." },
  { name: "Economic empowerment", how: "Helping students find placements and jobs, including a free CV tool and student jobs board." },
  { name: "Environment", how: "Predictive maintenance that keeps machines running longer and wastes less." },
  { name: "Faith", how: "The foundation for how I work and treat people." },
]

const languages = [
  { name: "English", level: "Full professional proficiency" },
  { name: "Twi & Ga", level: "Native proficiency" },
  { name: "French & Spanish", level: "Elementary proficiency" },
]

export default function AboutPage() {
  return (
    <div className="container max-w-4xl py-24 space-y-12">
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <h1 className="text-4xl font-bold tracking-tight">About Me</h1>
        </div>
        <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
          <p>
            I am Isaac Adjei. Most people know me as Zac. I am an Electronic Engineering and
            Computer Science student at Aston University, Birmingham, working towards a First Class
            degree. My goal is to build at the intersection of intelligent software and efficient
            hardware, creating systems that solve real problems for real people.
          </p>
          <p>
            I grew up in Ghana, attending Adisadel College in Cape Coast, a school guided by the
            motto &ldquo;Vel Primus, Vel Cum Primis&rdquo; (Either the first or with the first).
            It instilled in me resilience, discipline and a standard of excellence that still shape
            everything I do. I was an active member of the Robotics Club, Scripture Union, PENSA
            and the Debate Society. I lost sight in my right eye at age two due to retinoblastoma
            and have lived with monocular vision my entire life. Rather than limiting me, it
            sharpened my focus and shaped a deep commitment to accessible technology, building
            systems that genuinely serve all users.
          </p>
          <p>
            My late father was a mechanical and refrigeration engineer. During school vacations I
            accompanied him on site and watched engineering come to life in his hands. He always
            said: &ldquo;Always strive to make things better.&rdquo; Between 2019 and 2021 I
            worked as a Junior Apprentice HVAC Technician in Accra, servicing and installing over
            50 air conditioning units in the field. In 2022 I relocated to the UK and after two
            months on a business course at Stanmore College I knew engineering was where I belonged.
            I approached the college, sat the necessary entry exams and transferred onto the
            engineering programme, graduating with D*DD in the Pearson BTEC Level 3 National
            Extended Diploma in Engineering and being recognised as Best and Most Hardworking
            Student in my cohort.
          </p>
          <p>
            At Aston I lead weekly Peer Assisted Learning sessions in Python and electronics, serve
            as Treasurer of the{" "}
            <a href="https://www.astonsu.com/society/electronicssociety/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Computing and Electronics Society</a>{" "}
            and represent my course as a Student Representative. I am a Student Member of the{" "}
            <a href="https://www.theiet.org" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">IET</a> and a member of the{" "}
            <a href="https://www.astonsu.com/society/afrocaribbean/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Aston African-Caribbean Society</a>.
            Outside lectures I founded{" "}
            <a href="https://phaemos.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">PHAEMOS</a> and{" "}
            <a href="https://melophos.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">MELOPHOS</a>, run{" "}
            <a href="https://vitafolio.isaacadjei.me" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Vitafolio</a> and work on{" "}
            <Link href="/projects/lidarsat" className="text-primary hover:underline">LidarSAT</Link> with a research team. In 2026 I was shortlisted as a Top 40 Finalist for the Black
            Heritage Undergraduate of the Year Award, run by TargetJobs and Sky to recognise
            high-achieving undergraduates across the UK. Beyond university I have gained experience
            in different sectors: internships at the Ghana High Commission London as a Consular
            Intern and an Admin and Estates Intern, virtual engineering programmes with British
            Airways and Yunex Traffic and between 2022 and 2025, while studying full-time, working
            as a Waiter and Food Runner at Casa do Frango Piccadilly.
          </p>
          <p>
            Technically I work across the full stack: bare-metal C and C++ on microcontrollers, PCB
            design in KiCad and Proteus, Rust at the edge, full-stack web with Next.js, TypeScript
            and Laravel and Python-based machine learning with scikit-learn, TensorFlow and PyTorch.
            I am also expanding into Java, cloud computing, cyber security and game development. My
            projects include{" "}
            <Link href="/projects/vitafolio" className="text-primary hover:underline">Vitafolio</Link>{" "}
            (a live app for building and sharing every version of a CV),{" "}
            <Link href="/projects/phaemos" className="text-primary hover:underline">PHAEMOS</Link>{" "}
            (an open predictive maintenance platform with sensor nodes, a Rust gateway and per-machine
            anomaly models),{" "}
            <Link href="/projects/melophos" className="text-primary hover:underline">MELOPHOS</Link>{" "}
            (light-guided instrument learning on any keyboard),{" "}
            <Link href="/projects/lidarsat" className="text-primary hover:underline">LidarSAT</Link>{" "}
            (team research on GPS-denied drone navigation), a two-stage audio amplifier PCB built from
            scratch, a 4x4x4 NeoPixel LED Cube, avr-zac (bare-metal C on an ATmega644P), this site
            itself, an open-source Git course with over 200 structured topic files and Zaccess, an
            accessibility tool that converts lecture slides and textbook pages into high-contrast
            readable notes using OCR and text-to-speech.
          </p>
        </div>
        <ApproachAnimation />
      </section>

      <Separator />

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Education</h2>
        </div>
        <div className="space-y-8">
          {education.map((edu) => (
            <div key={edu.id} className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div>
                  <h3 className="text-xl font-semibold">
                    {edu.url ? (
                      <a href={edu.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary underline-offset-4 hover:underline">
                        {edu.institution}
                      </a>
                    ) : (
                      edu.institution
                    )}
                  </h3>
                  <p className="text-muted-foreground">
                    {edu.degree}
                    {edu.field ? `, ${edu.field}` : ""}
                  </p>
                  {edu.grade && <p className="text-sm text-primary font-medium">{edu.grade}</p>}
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              {edu.description && <p className="text-muted-foreground">{edu.description}</p>}
              {edu.modules && edu.modules.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {edu.modules.map((mod) => (
                    <span key={mod} className={CHIP_CLASS}>
                      {mod}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Separator />

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Societies & Memberships</h2>
        </div>
        <div className="space-y-6">
          {societies.map((soc) => {
            const roles = soc.roles.filter(isSocietyRoleVisible)
            if (roles.length > 1) {
              const since = roles[0].period.split(" - ")[0]
              return (
                <div key={soc.name} className="space-y-3">
                  <div>
                    <h3 className="font-semibold">{soc.url ? (
                      <a href={soc.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary underline-offset-4 hover:underline">
                        {soc.name}
                      </a>
                    ) : (
                      soc.name
                    )}</h3>
                    <p className="text-sm text-muted-foreground">{roles.length} roles · {since} - Present</p>
                  </div>
                  <ol className="relative space-y-3 border-l border-border pl-5">
                    {[...roles].reverse().map((r) => (
                      <li key={r.role} className="relative">
                        <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" aria-hidden="true" />
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <p className="text-sm text-primary font-medium">{r.role}</p>
                          <span className="text-sm text-muted-foreground whitespace-nowrap">{r.period}</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <p className="text-sm text-muted-foreground">{soc.description}</p>
                </div>
              )
            }
            return (
              <div key={soc.name} className="space-y-1">
                <h3 className="font-semibold">{soc.url ? (
                      <a href={soc.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary underline-offset-4 hover:underline">
                        {soc.name}
                      </a>
                    ) : (
                      soc.name
                    )}</h3>
                {roles.map((r) => (
                  <div key={r.role} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <p className="text-sm text-primary font-medium">{r.role}</p>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">{r.period}</span>
                  </div>
                ))}
                <p className="text-sm text-muted-foreground">{soc.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      <Separator />

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <HandHeart className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Volunteering</h2>
        </div>
        <div className="space-y-6">
          <div className="space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <h3 className="font-semibold">Student Judge</h3>
                <p className="text-sm text-primary font-medium">
                  <a href="https://www.targetjobsawards.co.uk/" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
                    targetjobs UK: National Emerging Talent Awards 2026
                  </a>
                </p>
              </div>
              <span className="text-sm text-muted-foreground whitespace-nowrap">Feb 2026</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Selected to evaluate employer submissions for the Best Placement or Internship
              Programme category. Assessed programme design, recruitment strategy, inclusivity and
              student experience, providing detailed qualitative feedback and numerical scoring.
              Commended for a timely, thorough and high-quality approach.
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <h3 className="font-semibold">Fundraising Volunteer</h3>
                <p className="text-sm text-primary font-medium">
                  <a href="https://www.cancerresearchuk.org/get-involved/find-an-event/10days-5k-challenge" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
                    Cancer Research UK: 10 Days of 5K Challenge
                  </a>
                </p>
              </div>
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Feb 2026 - Mar 2026
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Participated in the Cancer Research UK 10 Days of 5K Challenge to support life-saving
              cancer research. Completed 10 x 5 km runs (more than 50 km total) across March,
              demonstrating consistency and discipline. Set up and managed an online fundraising
              page, contributing to a wider campaign that raised over £797,424.64, with an
              additional £159,224.14 through Gift Aid. Raised funds through outreach and personal
              network engagement while promoting awareness of cancer research initiatives.
            </p>
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Awards & Honours</h2>
        </div>
        <div className="space-y-6">
          <div className="space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <h3 className="font-semibold">
                  <a href="https://www.undergraduateoftheyear.com/awards/black-heritage" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
                    Top 40 Finalist: Black Heritage Undergraduate of the Year Award 2026
                  </a>
                </h3>
                <p className="text-sm text-primary font-medium">
                  <Link href="/blog/sky-black-heritage-celebration-day" className="hover:underline underline-offset-4">
                    TargetJobs &amp; Sky · read about the day
                  </Link>
                </p>
              </div>
              <span className="text-sm text-muted-foreground whitespace-nowrap">Mar 2026</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Selected as one of the Top 40 finalists nationwide for the Black Heritage Undergraduate
              of the Year Award 2026, a programme run by TargetJobs and Sky recognising
              high-achieving students across the UK for leadership, impact and potential. Progressed
              through the application and video interview stages and was invited to attend the
              finalist Celebration Day at Sky&apos;s Osterley campus.
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <h3 className="font-semibold">Best and Most Hardworking Student</h3>
                <p className="text-sm text-primary font-medium">
                  <a href="https://www.stanmore.ac.uk" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
                    Stanmore College, London
                  </a>
                </p>
              </div>
              <span className="text-sm text-muted-foreground whitespace-nowrap">Jun 2024</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Recognised as the best and most hardworking student at Stanmore College during the
              Pearson{" "}
              <a href="https://qualifications.pearson.com/en/qualifications/btec-nationals/engineering-2016.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4">
                BTEC Level 3 National Extended Diploma in Engineering
              </a>
              , graduating with D*DD
              (Distinction*, Distinction, Distinction).
            </p>
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Quote className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Recommendations</h2>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/30 px-6 py-5 space-y-3">
          <p className="text-muted-foreground leading-relaxed italic">
            &ldquo;Isaac recently completed a set of student judging for us at targetjobs for the
            prestigious National Graduate Recruitment Awards. He completed this task in a timely
            manner and to a high quality and we are very thankful that Isaac volunteered his time.
            Isaac proved to be efficient and self-motivated, with a thorough approach to the
            assigned work. I would highly recommend Isaac for any future roles and
            opportunities.&rdquo;
          </p>
          <div>
            <p className="font-semibold text-sm">Imogen Carter</p>
            <p className="text-xs text-muted-foreground">
              Events and Marketing Administrator, Group GTI · March 2026
            </p>
            <a
              href="https://www.linkedin.com/in/isaacadjei"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
            >
              View on LinkedIn
            </a>
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Languages className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">
            Languages{" "}
            <span className="text-base font-normal text-muted-foreground">(spoken & written)</span>
          </h2>
        </div>
        <div className="space-y-3">
          {languages.map((lang) => (
            <div key={lang.name} className="flex items-center justify-between max-w-sm">
              <span className="font-medium">{lang.name}</span>
              <span className="text-sm text-muted-foreground">{lang.level}</span>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Heart className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Interests</h2>
        </div>
        <dl className="grid gap-4 sm:grid-cols-2">
          {interestGroups.map((g) => (
            <div key={g.title} className="rounded-lg border border-border/60 p-4">
              <dt className="text-sm font-semibold">{g.title}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{g.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Separator />

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Outside Engineering</h2>
        </div>
        <p className="text-muted-foreground">
          Outside engineering I play piano, game on PS5 and PC, stay active at the gym, cycle, cook
          Ghanaian food, journal and travel whenever I get the chance. I am a big believer in continuous learning - I regularly work
          through online courses on platforms like Coursera, build personal projects and read widely
          across tech, business and history. For me, growth is not occasional - it&apos;s an active
          lifestyle.
        </p>
        <p className="text-sm text-muted-foreground">{hobbies.join(" · ")}</p>
      </section>

      <Separator />

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <HeartHandshake className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Causes</h2>
        </div>
        <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {causes.map((c) => (
            <div key={c.name}>
              <dt className="text-sm font-semibold">{c.name}</dt>
              <dd className="text-sm text-muted-foreground">{c.how}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
