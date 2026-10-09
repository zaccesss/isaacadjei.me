import type { Metadata } from "next"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Code2, Server, Palette, Cpu, Layers, ArrowUpRight, FileCode2, Accessibility } from "lucide-react"

export const metadata: Metadata = {
  title: "Colophon",
  description: "How isaacadjei.me is built - the stack, the decisions and the details.",
  alternates: {
    canonical: "https://www.isaacadjei.me/colophon",
  },
  openGraph: {
    images: ["/api/og?title=Colophon&description=How%20isaacadjei%2Eme%20is%20built%20-%20the%20stack%2C%20the%20decisions%20and%20the%20details%2E"],
  },
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
    >
      {children}
    </a>
  )
}

type ColophonItem = { name: string; detail: React.ReactNode }

const sections: { icon: React.ComponentType<{ className?: string }>; heading: string; items: ColophonItem[] }[] = [
  {
    icon: Code2,
    heading: "Frontend",
    items: [
      {
        name: "Next.js 16 and React 19 (App Router)",
        detail: <>The entire site is a <A href="https://nextjs.org">Next.js</A> application - a framework that handles both the user-facing pages and the server-side logic in one codebase. I use the App Router, which lets me choose on a per-page basis whether content is built on the server (faster initial load, better for SEO) or in the browser (needed for anything interactive like the live status widget). Most pages are server-rendered and sent to you pre-built. Underneath it is <A href="https://react.dev">React</A> 19.</>,
      },
      {
        name: "TypeScript 6",
        detail: <><A href="https://www.typescriptlang.org">TypeScript</A> is JavaScript with a strict type system layered on top. Every piece of data in this site has a defined shape - blog posts, project entries, API responses, all of it. This means the editor can catch mistakes before the code even runs, which matters when a lot of things are interconnected. Strict mode throughout with no exceptions.</>,
      },
      {
        name: "Tailwind CSS 4",
        detail: <><A href="https://tailwindcss.com">Tailwind CSS</A> is a utility-first CSS framework - instead of writing separate stylesheet files, styles are applied directly as class names in the HTML. It keeps styling co-located with the component it applies to, which makes maintenance straightforward. I combine it with <A href="https://ui.shadcn.com">shadcn/ui</A> (see below) for more complex interactive components.</>,
      },
      {
        name: "shadcn/ui",
        detail: <><A href="https://ui.shadcn.com">shadcn/ui</A> is a collection of pre-built, accessible UI components that I own the code for - dialogs, dropdowns, tooltips, badges, the command palette. Unlike a traditional component library where you import a package you cannot change, shadcn/ui components live directly in the codebase and can be modified freely. Built on <A href="https://www.radix-ui.com">Radix UI</A> primitives, which handles the tricky accessibility behaviour (keyboard navigation, focus trapping, ARIA attributes).</>,
      },
      {
        name: "Framer Motion",
        detail: <><A href="https://motion.dev">Framer Motion</A> is used sparingly for the entrance animations on the homepage hero section. The staggered fade-in as the page loads is handled here. I deliberately keep motion minimal on the rest of the site - animation should enhance content, not compete with it.</>,
      },
      {
        name: "Lucide React and React Icons",
        detail: <>All icons across the site. <A href="https://lucide.dev">Lucide React</A> for UI icons (arrows, checks, chevrons, status indicators and so on). <A href="https://react-icons.github.io/react-icons/">React Icons</A> for brand logos where Lucide does not have an official one - GitHub, LinkedIn, Spotify, Discord and similar.</>,
      },
      {
        name: "Geist",
        detail: <><A href="https://vercel.com/font">Geist</A> is the typeface designed by Vercel and used across this site. Geist Sans for all body text, headings and UI labels - clean and highly legible at any size. Geist Mono for timestamps, file paths, code snippets and technical labels where fixed-width spacing matters. Both come from the geist package and are self-hosted through Next.js font optimisation, so they are never fetched from an external CDN and the text does not jump when they arrive.</>,
      },
      {
        name: "next-themes",
        detail: <><A href="https://github.com/pacocoursey/next-themes">next-themes</A> manages the light and dark mode toggle. It stores your preference in localStorage so the site remembers which theme you chose across visits. On a first visit it follows your device setting rather than picking a theme for you. No flash of the wrong theme on page load.</>,
      },
      {
        name: "The colour system",
        detail: "Every colour on the site is a CSS custom property: background, foreground, card, muted, border, the blue primary and the focus ring. The light set lives on :root and the dark set on a .dark class that next-themes adds to the page, so a component never hard-codes a colour and switching theme is just a different set of values. Both themes keep body text at high contrast against its background and the muted grey is chosen so secondary text still reads comfortably.",
      },
      {
        name: "Recharts and react-three-fiber",
        detail: <>The charts on /lab and the stats pages are drawn with <A href="https://recharts.org">Recharts</A>. The 3D board on /lab uses <A href="https://r3f.docs.pmnd.rs">react-three-fiber</A> with helpers from <A href="https://github.com/pmndrs/drei">drei</A>, both loaded only on the page that needs them.</>,
      },
      {
        name: "Giscus",
        detail: <>The comment system on blog posts, powered by <A href="https://giscus.app">Giscus</A> and backed by <A href="https://docs.github.com/en/discussions">GitHub Discussions</A>. When you leave a comment it is stored as a GitHub Discussion on the public repo - no separate database, no third-party ad-funded platform. Giscus loads the discussion thread for each post by matching the page URL to a discussion. You need a GitHub account to comment. The widget respects the site theme and switches between light and dark automatically.</>,
      },
    ],
  },
  {
    icon: Server,
    heading: "Backend and data",
    items: [
      {
        name: "Vercel",
        detail: <><A href="https://vercel.com">Vercel</A> is where the site is hosted and deployed. Every time a change is merged to the main branch on GitHub, Vercel automatically builds and deploys the new version within about a minute. Preview deployments are also created for every pull request so changes can be reviewed at a live URL before they go public. The domain and SSL certificate are managed here too.</>,
      },
      {
        name: "Upstash Redis",
        detail: <>Redis is a data store that keeps everything in memory rather than on disk, which makes reads and writes extremely fast. I use <A href="https://upstash.com">Upstash</A>&apos;s serverless version for anything that changes frequently and needs to be retrieved quickly: live device status from the daemons, the last Spotify track I played (a fallback shown when nothing is on), blog post reaction counts and rate limiting on the contact form. Redis is not a traditional database - it is a short-term, high-speed cache.</>,
      },
      {
        name: "Next.js API routes",
        detail: <>All the server-side logic lives in route handlers inside the <A href="https://nextjs.org">Next.js</A> app. When the live status widget asks &apos;is the PS5 online?&apos;, it is calling one of these routes, which in turn reads from Redis. The Spotify now-playing card, the GitHub activity strip, the contact form submission, blog reactions - each is a separate server-side function that runs on demand. None of this logic runs in your browser.</>,
      },
      {
        name: "Content data",
        detail: <>All content on this site is stored as typed TypeScript files. Blog posts live in data/blog/, TIL entries in data/til/, project listings in data/projects.ts, research publications in data/respub/ and consumed media in per-category files under data/consumed/ (videos, podcasts, books, music, articles, resources, others and themed collections). There is no external CMS, no database and no third-party content API. Everything is written directly as code, versioned in Git alongside everything else and renders instantly with no database round-trip. Blog posts and TIL entries share the same block-based structure: each is an array of explicitly typed blocks (heading, paragraph, list, code, image, quote, callout, table, diagram, video, embed) rendered by a shared component. This gives complete control over how every element looks with full type safety throughout.</>,
      },
      {
        name: "Atom feeds",
        detail: <>Every section has an Atom 1.0 feed, which any RSS or Atom reader understands: blog posts at <A href="/blog/feed.xml">/blog/feed.xml</A>, TIL entries at <A href="/til/feed.xml">/til/feed.xml</A>, notes at <A href="/notes/feed.xml">/notes/feed.xml</A>, newsletter issues at <A href="/newsletter/feed.xml">/newsletter/feed.xml</A> and everything together at <A href="/feed.xml">/feed.xml</A>. All of them are listed on <A href="/feeds">/feeds</A>. Open a feed in a browser and you get a designed page with colour-coded labels, tags and covers; a feed reader gets the XML. Append ?raw to any feed URL to see the XML yourself.</>,
      },
      {
        name: "Resend",
        detail: <>Email delivery for the contact form, handled by <A href="https://resend.com">Resend</A>. When you submit a message, the name, email and content are sent to a server-side route which calls the Resend API to forward it to my inbox. Nothing is stored in a database - the email is sent and that is it. Submissions are also rate-limited via Redis to prevent the form being used for spam.</>,
      },
      {
        name: "Newsletter",
        detail: <>The newsletter is part of this site. Each issue is a file in the repository with a short letter. The site gathers the posts, TILs and notes from the weeks before underneath it. Signing up sends a confirmation link first, then <A href="https://resend.com">Resend</A> keeps the subscriber list, sends each issue as a broadcast on the morning of its date and handles one-click unsubscribes.</>,
      },
      {
        name: "GitHub Actions",
        detail: <><A href="https://github.com/features/actions">GitHub Actions</A> runs automated workflows whenever code changes. They type check, lint and build every change, scan every push for leaked secrets and handle jobs such as publishing the public copy of the site after each deploy. Nothing reaches the live site without passing them first.</>,
      },
      {
        name: "Cloudflare Turnstile",
        detail: <><A href="https://www.cloudflare.com/products/turnstile/">Cloudflare Turnstile</A> is the bot protection on the contact form. Unlike traditional CAPTCHAs that make you identify traffic lights or buses, Turnstile works silently in the background and only challenges when it suspects bot activity. Server-side verification happens before any email is sent - if the Turnstile check fails, the request is rejected. Free tier, no tracking pixels, no fingerprinting.</>,
      },
    ],
  },
  {
    icon: Palette,
    heading: "Design decisions",
    items: [
      {
        name: "Your device decides first",
        detail: "On a first visit the site follows your device's light or dark setting, so it never fights the rest of your screen. The toggle cycles light, dark and system and remembers your choice from then on. Both themes use the same component code; only the CSS custom property values change between them. The toggle crossfades every colour over 100ms to avoid a jarring flash.",
      },
      {
        name: "No animations on scroll",
        detail: "Scroll-triggered animations - things that fade or slide in as you scroll down - are deliberately avoided on most pages. They add visual noise, can cause nausea for users sensitive to motion and make the page feel slower even when it is not. Entrance animations are limited to the homepage hero. Everything else just loads.",
      },
      {
        name: "No city, ever",
        detail: "The live status widget shows my current country and timezone but never the city. The Mac daemon has access to GPS-level location via CoreLocationCLI but deliberately only passes the country code to Redis. This is a hard privacy line - knowing I am in the UK is useful context for the clock; knowing I am in a specific neighbourhood is not.",
      },
      {
        name: "Structured data, not markdown",
        detail: "Most developer sites use MDX: markdown files with embedded React components. I went a different route: each blog post and TIL entry is a typed TypeScript object with a content array of explicit block types (heading, paragraph, code, list, quote, image, callout, table, diagram, video, embed). A shared block renderer turns these into HTML. The trade-off is more verbose authoring, but the payoff is full control over how every element renders, no MDX compilation step and complete type safety throughout. Because both blog posts and TIL entries use the same block types, the renderer is shared between them.",
      },
      {
        name: "Tags, chips and labels",
        detail: "There is one tag style across the public site and no pill-shaped capsules. A tag is a small square-cornered chip with a soft fill, no outline and a muted # in front, so it reads as quiet metadata rather than a button. Plain items such as skills use the same chip without the #. Categories and post types (Blog, Embedded, IoT) are not chips at all: they are small uppercase words, different from tags by shape and case as well as colour. Each type keeps its own hue so a list reads at a glance, but the word always carries the meaning, so colour is never the only signal. Every label clears 4.5:1 in both themes.",
      },
      {
        name: "Filters and pages that live in the URL",
        detail: "Every public list (blog, notes, projects, TIL, newsletter and each Consumed page) shares one set of controls: a search box, a Filters button and the active filters shown as removable chips with a live result count. The panel is a popover on larger screens and a bottom sheet on phones; it traps focus while open and Escape closes it. Search, filters, sort and page are kept in the URL query, so Back, Forward, a refresh and a shared link all restore exactly the same view. One panel session adds a single history entry so Back undoes it in one step. The pager is shared too: Previous and Next with text labels, the first and last page with a window around the current one, a \"Showing 13 to 24 of 61\" line and an optional per page picker. On phones the numbers collapse to \"Page 3 of 12\" and every target is at least 44px.",
      },
      {
        name: "Command palette",
        detail: <>Cmd+I (or Ctrl+I on Windows) opens a site-wide command palette powered by <A href="https://github.com/pacocoursey/cmdk">cmdk</A>. You can jump to any page, search projects, toggle the theme and more without touching the mouse. The shortcut is I for Isaac rather than K (the more common convention) - a small personal touch.</>,
      },
      {
        name: "Share feature",
        detail: "Projects and blog posts have a share button. On desktop it copies the page URL to the clipboard and shows a brief confirmation. On mobile it opens the native share sheet so you can send the link through any app. The button is deliberately only present on shareable content pages, not on utility pages like Skills or About.",
      },
      {
        name: "Responsive but desktop-first content",
        detail: "The site is fully responsive and works on any screen size, but the richer content - live status cards, the lab terminal, project galleries - is designed with a larger screen in mind. A slim dismissible banner appears on narrow screens to set that expectation. The banner text is foreground-coloured (not grey) so it is actually readable.",
      },
      {
        name: "Google Analytics (GA4)",
        detail: <>Privacy-conscious page-view analytics via <A href="https://marketingplatform.google.com/about/analytics/">Google Analytics</A>. Fully anonymised - no individual visitor is identified or tracked across other websites. I can see which pages are read most and which content is landing well, which helps me decide what to write next. Nothing personal is collected.</>,
      },
    ],
  },
  {
    icon: FileCode2,
    heading: "Content rendering",
    items: [
      {
        name: "Code blocks with Shiki",
        detail: <>Code is highlighted on the server by <A href="https://shiki.style">Shiki</A>, so it arrives as coloured HTML and no grammar ships to your browser. The colours are <A href="https://code.visualstudio.com">VS Code</A>&apos;s Light Modern and Dark Modern themes, with the few token colours that fell below <A href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html">WCAG AA</A> (4.5:1) on those backgrounds nudged until they pass. Both palettes are in the page at once and CSS picks one from the site theme, so switching theme recolours code instantly with no flash. Around 37 languages are supported, from C, C++, Rust and Python to VHDL, Verilog, SystemVerilog, assembly, Bash, PowerShell, SQL, PHP, Blade and LaTeX, with common short names (ts, sh, py, yml) mapped to the right grammar. Every block has a header with its language and a Copy button whose screen reader label names the language and announces when it has copied.</>,
      },
      {
        name: "Callouts",
        detail: "Posts, write-ups and TIL entries can carry five kinds of labelled callout: Note, Tip, Important, Warning and Caution. Each pairs an icon with its label word and a coloured edge on a soft tint, so the meaning never rests on colour alone. Light mode uses deeper shades so the label clears 6:1 on its tint and dark mode uses brighter ones that clear 5:1.",
      },
      {
        name: "Diagrams with Mermaid",
        detail: <>Flowcharts, sequence, class, state, entity relationship, Gantt and architecture diagrams are written as text and drawn by <A href="https://mermaid.js.org">Mermaid</A>. It is a large library, so it only loads when a diagram first appears on screen. Diagrams redraw when the theme changes so their colours follow light and dark. They run in strict mode so a label can never execute script or HTML.</>,
      },
      {
        name: "Demo clips",
        detail: "Short screen recordings are H.264 MP4 files, which play in every modern browser, each with a WebP poster frame. A clip never autoplays: it shows the still until you press play, loads nothing until then and has an accessible label describing what it shows. That also means it respects reduced motion without any extra setting.",
      },
      {
        name: "Images",
        detail: "Images are stored as WebP and served through Next.js image optimisation, which sends AVIF or WebP depending on what your browser accepts and sizes each one for your screen. Where a project has a light and a dark screenshot, both are in the page and CSS shows the one that matches the site theme, so the cover follows the theme instantly and a screen reader hears its alt text only once. Every image has alt text.",
      },
    ],
  },
  {
    icon: Accessibility,
    heading: "Accessibility",
    items: [
      {
        name: "Reduced motion",
        detail: "If your device asks for reduced motion, the things that move stop moving: the lab terminal prints its output at once instead of line by line, the typing motto, header, favicon and page entrance animations stand still and the pager jumps to the top of a list rather than scrolling smoothly. Clips never autoplay in the first place.",
      },
      {
        name: "Focus rings",
        detail: "Buttons, pager links, filter controls and copy buttons show a clear focus ring in the primary colour when you reach them with the keyboard, offset from the element so it never blends into its border. Mouse clicks do not trigger it, so it only appears when it is actually useful. A Skip to content link is the first thing the keyboard reaches on every page.",
      },
      {
        name: "Screen reader labels",
        detail: "Icon-only controls carry a label that says what they do, decorative icons are hidden from screen readers and changes such as a copied citation or code block are announced through polite live regions. Each pager is a named navigation landmark, so it is clear which list it belongs to. The current page is marked for assistive technology.",
      },
      {
        name: "Contrast and colour",
        detail: <>Body text, labels, tags, callouts and code colours are all checked against <A href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html">WCAG AA</A> in both themes. Colour is never the only signal: tags have a # marker, categories are words, statuses pair a dot with a word and callouts pair an icon with a label. I have monocular vision, so contrast and predictable layouts are practical needs for me rather than polish.</>,
      },
    ],
  },
  {
    icon: Layers,
    heading: "Notable pages and features",
    items: [
      {
        name: "/lab - interactive terminal, GitHub stats, live coding stats, top picks, PCB viewer, gaming panel",
        detail: "An in-browser terminal with 30+ commands spanning navigation, content, live stats and personality. Its colours are the same high-contrast palette I use in my real terminal: a white background in light mode and a vivid near-black set in dark mode, normal ANSI colours with bold for emphasis and never the bright variants. Several commands animate theatrically line by line; under reduced motion they print all at once. The coding stats panel has a period selector, stat cards, daily trend line, 7x24 interactive heatmap with the peak coding hour below it, charts and an hour-of-day bar chart. The PCB viewer loads the actual 3D mesh of the audio amplifier board (real GLB model via react-three-fiber and drei) with angle presets, wireframe mode, auto-rotate and a grid; below it are drag-to-orbit copper layer renders, a front/back photo flip card of the built board, an assembled board photo and the full circuit schematic - the latter two open fullscreen in a lightbox on click. The gaming panel shows PS5 and Gaming PC status side by side - game cover art as a banner, online or last-seen badge and CPU plus GPU utilisation bars when the PC is active. The top picks panel has three tabs: Tracks shows a ranked list with duration bars and a listening-era chart grouped by release decade; Artists shows a ranked list with genre tags, a mainstream-vs-underground scatter (your rank against each artist's follower count) and follower bars; Genres shows a rank-weighted genre donut with a breakdown. Genres come from Last.fm (Spotify retired its artist genre data in 2025).",
      },
      {
        name: "/blog - block-based post renderer",
        detail: "Blog posts are authored as typed TypeScript objects rather than markdown files. A shared block renderer handles every block type: headings, paragraphs, code with syntax highlighting, numbered and bulleted lists, pull quotes, images with captions and reference links (numbered superscript links that compile into a references section at the bottom). Each post also has an emoji reaction bar backed by Redis. The listing page uses the shared search, filter panel and pager, with post types (Blog, Journal, Research, Notes, Report, Article, Resources) as one of the filters.",
      },
      {
        name: "Diagrams, tables, callouts and clips",
        detail: "The same block renderer draws diagrams, real tables, labelled callouts and short screen recordings. Each of these has its own entry under Content rendering below.",
      },
      {
        name: "/projects - full write-ups",
        detail: "Every project has a cover, a gallery, short clips and a full write-up built from the same blocks as the blog, plus the team on group projects and a references list. Projects are ordered by hand and paginated twelve to a page.",
      },
      {
        name: "/til - Today I Learned",
        detail: <>Short, structured notes on things I discover while working. Each entry has a category, date, a lead paragraph and optional detail blocks using the same typed block system as blog posts, so a TIL entry can contain syntax-highlighted code examples, section headings, note callouts, embeds and source links. The listing page uses the shared search, filter panel and pager, with categories derived from the entries actually present (no empty categories ever appear). Each entry has its own permalink at /til/[slug] where the full detail, tags and prev/next navigation are shown. There is a subscribe-in-your-reader RSS feed at <A href="/til/feed.xml">/til/feed.xml</A>. Entries span a wide range: embedded systems and firmware, algorithms and data structures, TypeScript and Next.js, Linux internals, Git internals, security concepts, hardware design, music and piano practice, fitness, Ghanaian cooking and culture and faith.</>,
      },
      {
        name: "/respub - research and publications",
        detail: <>A catalogue of formal research outputs: citable papers, technical notes and open-source curricula. Each entry links directly to its record on <A href="https://zenodo.org">Zenodo</A>, <A href="https://orcid.org">ORCID</A> or the relevant platform so it can be found, cited or built on. The page also shows profile links across academic networks (<A href="https://orcid.org">ORCID</A>, <A href="https://scholar.google.com">Google Scholar</A>, <A href="https://zenodo.org">Zenodo</A>, <A href="https://www.researchgate.net">ResearchGate</A>, <A href="https://www.academia.edu">Academia.edu</A>) in a single row. Each publication has a one-click copy for its citation in BibTeX and APA, confirmed through a polite live region so a screen reader hears it without losing focus. Detail pages carry the <A href="https://scholar.google.com/intl/en/scholar/inclusion.html">Google Scholar citation meta tags</A> (title, authors, date, DOI, publisher and PDF) so indexers can pick a paper up correctly, plus live view and download counts from the <A href="https://developers.zenodo.org">Zenodo API</A>, fetched on the server and cached for a day. If Zenodo is slow or down the counts simply do not show, rather than a broken figure. Research lines show their stage as a dot and a word (In simulation, Hardware phase, Live), so the word carries the meaning. Data lives in data/respub/ alongside the other content files. No external academic CMS.</>,
      },
      {
        name: "/links - social hub",
        detail: <>A single page linking out to every platform I am active on: <A href="https://github.com/zaccesss">GitHub</A>, <A href="https://linkedin.com">LinkedIn</A>, <A href="https://open.spotify.com">Spotify</A>, <A href="https://youtube.com">YouTube</A>, <A href="https://orcid.org">ORCID</A>, <A href="https://www.goodreads.com">Goodreads</A>, <A href="https://www.chess.com">Chess.com</A> and more. Each platform has its icon and a short description of what you will find there. The page also embeds a live Spotify now-playing card so you can see what is on while you browse. All link data lives in data/links.ts alongside the other content files.</>,
      },
      {
        name: "/consumed - media tracking",
        detail: <>A public log of everything watched, listened to and read across the year, split into dedicated subpages: Videos, Podcasts, Books, Music, Articles, Resources and Others, plus themed collections. The hub opens with the year in numbers, a Start here set of the strongest picks and the collections. An entry can link to the projects and posts it led to. Each subpage uses the shared search, filter panel and pager. Every card has a picture: book covers come from the <A href="https://openlibrary.org/dev/docs/api/covers">Open Library Covers API</A> by ISBN, videos use their YouTube thumbnail and articles and resources show the page&apos;s own preview image. A missing or broken image swaps to a quiet tile with the site&apos;s icon and name, never a broken image icon. All data lives in per-category TypeScript files under data/consumed/ - same versioned-in-Git approach as the rest of the site. The main /consumed page shows all categories at once in a tabbed view; each tab navigates to its dedicated subpage. Video entries support both single videos and playlists via inline YouTube embeds. Audio entries embed Spotify via the Spotify oEmbed API.</>,
      },
      {
        name: "/contact - contact form",
        detail: <>The contact form at <A href="/contact">/contact</A> uses <A href="https://resend.com">Resend</A> for email delivery and <A href="https://www.cloudflare.com/products/turnstile/">Cloudflare Turnstile</A> for silent bot protection. Submissions are rate-limited via Redis. Nothing is stored - the message goes straight to my inbox and that is it. You can also reach me directly at <A href="mailto:contact@isaacadjei.me">contact@isaacadjei.me</A>.</>,
      },
      {
        name: "/changelog - public release history",
        detail: "Every meaningful change to the site is logged here as a versioned entry. Updated manually in CHANGELOG.md and rendered as a timeline. It is a habit I picked up from open-source projects and I find it useful for tracking how the site has evolved over time.",
      },
      {
        name: "OG image generation",
        detail: <>Every page has a dynamically generated Open Graph image at /api/og. When you share a link on Twitter, LinkedIn, iMessage or any platform that shows a preview card, the image is generated on the fly using <A href="https://vercel.com/docs/functions/og-image-generation">Vercel&apos;s @vercel/og</A> library. It renders the page title and description as a styled card using the Geist font. This is why shared links look intentional rather than blank.</>,
      },
    ],
  },
  {
    icon: Cpu,
    heading: "The live status system",
    items: [
      {
        name: "How it works",
        detail: <>The live status widget on /now, the homepage and /lab shows real data from my devices in near real-time. Background services (daemons) run on each machine and push data to <A href="https://upstash.com">Upstash Redis</A> every 60 to 120 seconds. The site reads them back through short-lived cached endpoints when you load the page, so however many people are viewing, the data is fetched once and shared rather than re-read per visitor. If a device goes offline, Redis keys expire after a short window and the card shows the last known state with a timestamp.</>,
      },
      {
        name: "MacBook daemon",
        detail: <>A Python script managed by launchd on macOS. It runs in the background at all times and writes to Redis every 120 seconds: battery percentage, charging state, local timezone and current weather. Weather comes from <A href="https://open-meteo.com">Open-Meteo</A>, a free European meteorological API with no API key required that uses the ECMWF model - more accurate for UK weather than most commercial alternatives. Location is determined via <A href="https://github.com/fulldecent/corelocationcli">CoreLocationCLI</A> (GPS-level accuracy) and the timezone is derived straight from those coordinates with <A href="https://pypi.org/project/timezonefinder/">timezonefinder</A> so the clock follows the exact zone even in countries that span several; <A href="https://ipinfo.io">ipinfo.io</A> is the fallback for both. Only the country code and timezone are stored - the city is deliberately excluded for privacy.</>,
      },
      {
        name: "Lenovo and Gaming PC daemons",
        detail: <>Python scripts managed by <A href="https://nssm.cc">NSSM (Non-Sucking Service Manager)</A> as proper Windows services - they start on boot, restart on crash and run without a visible terminal. The Gaming PC daemon also reads GPU utilisation via <A href="https://pypi.org/project/pynvml/">pynvml</A> (NVIDIA&apos;s Python library) and detects the currently running game through five escalating tiers: a hardcoded map of known games, the <A href="https://developer.valvesoftware.com/wiki/Steam_Web_API">Steam Web API</A>, Epic Games local manifest files, EA App manifest files and finally process-name fuzzy matching against <A href="https://www.igdb.com">IGDB</A>&apos;s game database. Cover art is fetched from IGDB on first detection and cached for the session. The card it feeds mirrors the PS5 one: CPU and GPU as small live graphs built from the polls, the current game while I play and the last game I played once the PC goes offline.</>,
      },
      {
        name: "Spotify",
        detail: <>A Next.js API route fetches the currently playing track from the <A href="https://developer.spotify.com/documentation/web-api">Spotify Web API</A> on demand. The OAuth access token (which expires every hour) is refreshed server-side and held in memory and the now-playing response is cached at the CDN edge for a few seconds so that however many tabs are open, Spotify is polled at most once every few seconds per region rather than once per tab - and Redis is not touched on this path at all. Spotify retired its audio-features and audio-analysis APIs in November 2024, so the visualiser no longer tries to react to the sound - instead it extracts the dominant colours from the album art and renders a sine wave above a bouncy equaliser, both tinted from the cover, on a device-pixel-ratio canvas animated on delta-time and tuned for light and dark mode. Bar peaks darken as they rise like a real meter and the wave swings wider and darkens in step with the bar beneath each point. Genre tags come from <A href="https://www.last.fm/api">Last.fm</A> (Spotify retired artist genres in 2025). The progress bar ticks every second client-side. The widgets poll two small edge-cached endpoints - a fast Spotify one (refreshed every few seconds, so song changes appear in near-realtime) and a combined snapshot for the devices, GitHub and Discord - and pause while the browser tab is hidden, so many open tabs share one cached response instead of each holding a connection open. When nothing is playing, the last played track is shown in a greyed-out state from a separate Redis key.</>,
      },
      {
        name: "PS5",
        detail: <>A <A href="https://workers.cloudflare.com">Cloudflare Worker</A> runs every 2 minutes and polls the <A href="https://www.playstation.com">PlayStation Network</A> presence API using a custom OAuth v2 flow written from scratch - no third-party libraries. Sony&apos;s session cookie (NPSSO) is exchanged for a short-lived access token and a long-lived refresh token on first run. The refresh token is stored in <A href="https://developers.cloudflare.com/kv/">Cloudflare Workers KV</A> and rotated on each use, so the session stays valid for around 60 days before needing a new NPSSO. Game cover art is fetched from <A href="https://www.igdb.com">IGDB</A> on each run. The result (online status, game name, cover art, last seen timestamp) is written to Upstash Redis.</>,
      },
      {
        name: "Discord",
        detail: <>The Discord presence card uses <A href="https://github.com/Phineas/lanyard">Lanyard</A>, a free open-source API that exposes Discord rich presence data for opted-in users. It shows online status (online, idle, do not disturb, offline), current activity (game being played, VS Code workspace, Spotify playback via Discord) and elapsed time. On /now the card always shows, even offline. On /notes it only appears when I am online. Multiple simultaneous activities stack with type labels.</>,
      },
      {
        name: "GitHub activity",
        detail: <>The GitHub strip uses the <A href="https://docs.github.com/en/rest">GitHub REST API</A> to show the last repository I pushed to and when. It is fetched server-side and cached in Redis for 5 minutes. My profile repo is excluded so the strip always shows real project activity rather than profile README updates.</>,
      },
    ],
  },
]

export default function ColophonPage() {
  return (
    <div className="container max-w-2xl py-24 space-y-14">
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Colophon</h1>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">
          How this site is built. I like sites that are open about their stack and decisions,
          so here is mine.
        </p>
        <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground flex-wrap">
          <span>
            Source:{" "}
            <a
              href="https://github.com/zaccesss/isaacadjei.me"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4 inline-flex items-center gap-0.5"
            >
              GitHub
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </span>
          <span>
            Deployed on{" "}
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4 inline-flex items-center gap-0.5"
            >
              Vercel
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </span>
          <span>
            DNS via{" "}
            <a
              href="https://cloudflare.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4 inline-flex items-center gap-0.5"
            >
              Cloudflare
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </span>
        </div>
      </section>

      {sections.map(({ icon: Icon, heading, items }, si) => (
        <div key={heading}>
          {si > 0 && <Separator className="mb-14" />}
          <section className="space-y-5">
            <div className="flex items-center gap-2.5">
              <Icon className="h-4 w-4 text-primary shrink-0" />
              <h2 className="text-base font-semibold">{heading}</h2>
            </div>
            <ul className="space-y-5">
              {items.map(({ name, detail }) => (
                <li key={name} className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{name}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{detail}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      ))}

      <Separator />

      <p className="text-xs text-muted-foreground font-mono leading-relaxed">
        Something interesting or something broken?{" "}
        <Link
          href="/contact"
          className="text-foreground hover:text-primary transition-colors underline underline-offset-4"
        >
          Let me know.
        </Link>
      </p>
    </div>
  )
}
