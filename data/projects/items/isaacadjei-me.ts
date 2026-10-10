import type { Project } from "../index"

const _isaacadjei_me: Project = {
    id: "isaacadjei-me",
    title: "isaacadjei.me: This Site",
    description:
      "My personal site on the Next.js App Router: projects, a blog, TIL entries, notes, a consumed log, an interactive Lab terminal, live status cards, public stats, a newsletter, a guestbook, search and a keyboard command menu.",
    longDescription:
      "isaacadjei.me is where all of my work lives in one place. It is a single Next.js 16 App Router application in TypeScript with React 19 and Tailwind CSS 4, deployed on Vercel behind Cloudflare. The public side carries my projects, a blog, Today I Learned entries, notes, research and publications, a monthly log of what I read, watched and listened to, a now page, a uses page, a newsletter and a guestbook.\n\nIt is also a place to show live data. The Lab has an interactive terminal, a PCB viewer and live cards for what I am listening to on Spotify, what I am playing and what I am coding. The public stats section turns my GitHub, coding, music, gaming and writing history into charts, publishing only data that is already public or a fully anonymised aggregate. A private area sits behind sign-in and is not part of this write-up.\n\nAccessibility is a first-class requirement rather than polish: a real heading outline on every page, a skip link, a theme that follows the system, motion that stops for reduced motion, labelled icon buttons and a command menu that reaches every page from the keyboard.",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "Radix UI",
      "Framer Motion",
      "Supabase",
      "PostgreSQL",
      "Upstash Redis",
      "Vercel",
      "Cloudflare",
      "Cloudflare Workers",
      "Recharts",
      "MapLibre GL",
      "three.js",
      "Resend",
      "Sentry",
      "Vitest",
      "GitHub Actions",
    ],
    category: "web",
    featured: false,
    images: [
      "/images/projects/isaacadjei-me/home-dark.webp",
      "/images/projects/isaacadjei-me/home-light.webp",
      "/images/projects/isaacadjei-me/projects-light.webp",
      "/images/projects/isaacadjei-me/projects-audio-amplifier-dark.webp",
      "/images/projects/isaacadjei-me/blog-light.webp",
      "/images/projects/isaacadjei-me/til-dark.webp",
      "/images/projects/isaacadjei-me/lab-dark.webp",
      "/images/projects/isaacadjei-me/stats-light.webp",
      "/images/projects/isaacadjei-me/consumed-light.webp",
      "/images/projects/isaacadjei-me/now-light.webp",
      "/images/projects/isaacadjei-me/guestbook-dark.webp",
      "/images/projects/isaacadjei-me/search-dark.webp",
      "/images/projects/isaacadjei-me/uses-light.webp",
      "/images/projects/isaacadjei-me/colophon-dark.webp",
      "/images/projects/isaacadjei-me/about-light.webp",
      "/images/projects/isaacadjei-me/experience-dark.webp",
      "/images/projects/isaacadjei-me/links-light.webp",
    ],
    github: "https://github.com/zaccesss/isaacadjei.me",
    getInvolved: {},
    demo: "https://isaacadjei.me",
    date: "2026",
    highlights: [
      "One Next.js 16 App Router app in TypeScript, deployed on Vercel behind Cloudflare, with content as typed TypeScript files rather than a CMS",
      "Live status cards for Spotify, gaming and coding, fed by Upstash Redis, a Cloudflare Worker and small device scripts, with every Redis use failing open",
      "Public stats for GitHub, coding, music, gaming and writing, built from one cached aggregate so a visit runs no function",
      "An interactive Lab terminal, full-text search across every content type and a command menu on Ctrl+I or Cmd+I",
      "Blog, TIL, notes, a consumed log, a newsletter that lives on the site, Atom feeds and a moderated guestbook",
      "A skip link, one heading outline per page, labelled icon buttons and motion that respects reduced motion",
    ],
    cover: "/images/projects/isaacadjei-me/cover.webp",
    order: 7,
    status: "live",
    links: [
      { label: "Live site", url: "https://isaacadjei.me" },
      { label: "Colophon", url: "https://isaacadjei.me/colophon" },
      { label: "Accessibility statement", url: "https://isaacadjei.me/accessibility" },
      { label: "Changelog", url: "https://isaacadjei.me/changelog" },
    ],
    sections: [
      { type: "h2", text: "What it is" },
      {
        type: "p",
        text: "I wanted one site that could hold everything I make, from a PCB to a blog post. I also wanted to keep adding to it without fighting it. Every page is built from data I control, so a new project, post or TIL entry is one typed file and a pull request. The public code is published as a separate showcase repository after every production deploy.",
      },
      {
        type: "clip",
        src: "/videos/projects/isaacadjei-me/tour.mp4",
        poster: "/videos/projects/isaacadjei-me/tour.webp",
        alt: "A tour of the home page: the hero, the About section, featured projects, featured posts with their covers, recent newsletter issues, Today I Learned and the latest notes",
        caption: "A short tour of the site",
      },
      { type: "h2", text: "Content as code" },
      {
        type: "p",
        text: "Blog posts, TIL entries, notes, projects and publications are one TypeScript file per entry, indexed by each folder's index file. A post is a list of typed content blocks (paragraphs, headings, code, tables, Mermaid diagrams, clips and callouts), so the same renderer draws a blog post and a project page like this one. Type checking catches a broken entry before it ships. The CV is a single YAML file that drives the CV page and its downloads.",
      },
      {
        type: "clip",
        src: "/videos/projects/isaacadjei-me/projects.mp4",
        poster: "/videos/projects/isaacadjei-me/projects.webp",
        alt: "The projects grid with its category filters and the audio amplifier first, then its project page with the overview, the signal chain diagram and the measured frequency response chart",
        caption: "The projects grid and a project page",
      },
      {
        type: "clip",
        src: "/videos/projects/isaacadjei-me/writing.mp4",
        poster: "/videos/projects/isaacadjei-me/writing.webp",
        alt: "The Writing page with its filters and post covers, a post opened with its cover, then the Notes list and a note scrolled to its previous and next links",
        caption: "Writing, a post and the notes",
      },
      { type: "h2", text: "How the data flows" },
      {
        type: "diagram",
        code: `flowchart LR
    Files["TypeScript and YAML<br/>data files"] --> Build["Next.js build<br/>on Vercel"]
    Build --> Pages["Static and cached pages"]
    Visitor["Visitor"] --> CF["Cloudflare<br/>DNS, CDN, Turnstile"]
    CF --> Pages
    CF --> API["Route handlers"]
    API --> Redis[("Upstash Redis<br/>live status, rate limits")]
    API --> SB[("Supabase<br/>PostgreSQL")]
    Worker["Cloudflare Worker<br/>console presence"] --> Redis
    Devices["Device scripts"] --> Redis
    Crons["Vercel crons"] --> API
    Jobs["Scheduled sync jobs"] --> SB
    SB --> Stats["Public stats aggregate<br/>rebuilt hourly"]
    Stats --> Pages`,
        caption: "Content is built from files, while live and historical data come from Redis and Supabase",
      },
      {
        type: "p",
        text: "Supabase holds the history behind the stats pages, accessed only on the server. Upstash Redis holds the short-lived live status payloads, the rate limits and the maintenance flag. Every Redis call fails open, so a Redis outage never breaks a public page. Vercel crons handle daily syncs and content revalidation, while heavier scheduled jobs run on GitHub Actions and write to the same database. Cloudflare sits in front for DNS, caching rules and Turnstile on the contact form and guestbook.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Vercel and GitHub cron run in UTC and ignore British Summer Time. Every time-pinned job is registered twice, one hour apart. The route only acts when it is really the right hour in London. A small ledger table stops a job firing twice in one window.",
      },
      { type: "h2", text: "The Lab and live status" },
      {
        type: "p",
        text: "The Lab is a playground: a terminal that answers commands such as about, projects, blog and help, an interactive PCB viewer and live panels for coding time and music. The live cards show what is playing on Spotify, what is running on my PlayStation and gaming PC and what I am coding. A Lanyard socket pushes the moment a Spotify track changes, so the now playing card updates almost at once, with a slower poll kept as a safety net.",
      },
      {
        type: "clip",
        src: "/videos/projects/isaacadjei-me/lab.mp4",
        poster: "/videos/projects/isaacadjei-me/lab.webp",
        alt: "Commands such as whoami, stack, projects and now are typed into the Lab terminal and answered, with the 3D audio amplifier PCB model below",
        caption: "The Lab terminal in the light theme",
      },
      {
        type: "clip",
        src: "/videos/projects/isaacadjei-me/lab-dark.mp4",
        poster: "/videos/projects/isaacadjei-me/lab-dark.webp",
        alt: "The same Lab terminal session and PCB model in the dark theme",
        caption: "The Lab terminal in the dark theme",
      },
      {
        type: "clip",
        src: "/videos/projects/isaacadjei-me/live.mp4",
        poster: "/videos/projects/isaacadjei-me/live.webp",
        alt: "The now page with its local time and live cards for music, devices and coding, then the stats hub and the consumed log",
        caption: "The now page, public stats and the consumed log in the light theme",
      },
      {
        type: "clip",
        src: "/videos/projects/isaacadjei-me/live-dark.mp4",
        poster: "/videos/projects/isaacadjei-me/live-dark.webp",
        alt: "The now page, stats and consumed log in the dark theme",
        caption: "The same pages in the dark theme",
      },
      { type: "h2", text: "Public stats" },
      {
        type: "p",
        text: "The stats section has a page each for GitHub contributions, coding time, music, gaming, writing and applications. Each page publishes only data that is already public or a fully anonymised aggregate. Applications show counts by city on a map, never a company, role or date. Every stats page reads one cached aggregate with an hourly rebuild, so a visit runs no function and a traffic spike costs nothing.",
      },
      {
        type: "image",
        src: "/images/projects/isaacadjei-me/stats-light.webp",
        alt: "The public stats hub with headline numbers and weekly comparison charts",
        caption: "The stats hub",
      },
      { type: "h2", text: "Finding things" },
      {
        type: "p",
        text: "Search covers the blog, TIL, projects, publications, notes, the newsletter and the consumed log. The command menu opens with Ctrl+I or Cmd+I and reaches every page from the keyboard, with shortcuts for navigation and a theme toggle. Anything typed there can also search the whole site. An All Pages directory lists every public page in plain text for anyone who prefers it.",
      },
      {
        type: "clip",
        src: "/videos/projects/isaacadjei-me/command.mp4",
        poster: "/videos/projects/isaacadjei-me/command.webp",
        alt: "On the home page the command menu opens with a keyboard shortcut, uses is typed into the search and the Uses page opens",
        caption: "The command menu opens with Cmd+I on a Mac or Ctrl+I elsewhere and jumps to any page",
      },
      { type: "h2", text: "Community pages" },
      {
        type: "p",
        text: "The guestbook takes messages behind the same spam protection as the contact form and shows each one only after I approve it. The now page follows the nownownow idea of saying what I am focused on at the moment. The newsletter is part of the site rather than a separate platform. Every other week a letter gathers what I published since the last one with a short note from me. In the weeks between, a short Outside issue covers one thing beyond my own work. Each issue is a file in the repository: it goes live at midnight on its date and is emailed through Resend that morning, once, to subscribers who confirmed by email. Issues have their own pages with reactions and comments, plus a feed.",
      },
      { type: "h2", text: "Accessibility" },
      {
        type: "p",
        text: "Accessibility matters to me personally, so contrast and predictable layouts are practical needs rather than polish. Every page declares its language and has one heading outline. A skip link is the first thing the keyboard reaches. The theme follows the system setting with a toggle in the header. Animation in the header, the favicon and the typing motto stops when the system asks for reduced motion. Link text says where a link goes, images carry alt text and colour never carries a meaning on its own.",
      },
      {
        type: "clip",
        src: "/videos/projects/isaacadjei-me/theme.mp4",
        poster: "/videos/projects/isaacadjei-me/theme.webp",
        alt: "The home page switching from light to dark as a circle spreads out from the theme toggle, then back to light further down the page",
        caption: "The theme switch, which is instant when reduced motion is on",
      },
      { type: "h2", text: "Engineering notes" },
      {
        type: "ul",
        items: [
          "A strict content security policy is set in the Next.js config, with permanent redirects for every renamed route",
          "Middleware stays at the edge and only checks for a cookie, so public pages never need the auth secret",
          "Sentry loads on the Node runtime only, because the edge SDK is larger than Vercel's edge function limit",
          "CDN cache headers are set explicitly because Next.js strips s-maxage from dynamic route handlers",
          "Every change goes through an issue, a branch, a pull request with CI and a squash merge, recorded in a public changelog",
        ],
      },
    ],
    references: [
      { title: "Next.js documentation", url: "https://nextjs.org/docs", note: "The App Router framework the site is built on" },
      { title: "nownownow.com", url: "https://nownownow.com/about", note: "The idea behind the now page" },
      { title: "Web Content Accessibility Guidelines (WCAG) 2.2", url: "https://www.w3.org/TR/WCAG22/", note: "The accessibility standard the site is built against" },
    ],
  }

export default _isaacadjei_me
