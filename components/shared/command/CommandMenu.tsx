"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Accessibility,
  Copyright,
  Scale,
  Home, User, Briefcase, Code, Mail, Cpu, BookOpen, Link2, NotebookPen,
  FlaskConical, Terminal, Clock, Wrench, Download, Info, ScrollText, Trophy, LayoutList, Shield, Rss,
  GraduationCap, Lightbulb, Tag, SearchIcon, Activity, BarChart3,
  HeartHandshake, Users, LifeBuoy, GitPullRequest, BookUser, CalendarDays,
} from "lucide-react"
import { DialogTitle } from "@/components/ui/dialog"
import { useModKey } from "@/hooks/useModKey"

export default function CommandMenu() {
  const [open, setOpen] = useState(false)
  const [typed, setTyped] = useState("")
  const router = useRouter()
  const pathname = usePathname()
  const { shortcut } = useModKey()
  const shiftShortcut = (key: string) => `⇧ + ${key}`

  useEffect(() => {
    if (pathname === "/maintenance") return
    const down = (e: KeyboardEvent) => {
      if (e.key === "i" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
        return
      }
      if (!open) return

      const open_ = (path: string) => {
        setOpen(false)
        if (path.startsWith("https://")) window.open(path, "_blank", "noopener,noreferrer")
        else router.push(path)
      }
      const key = e.key.toLowerCase()
      if (e.shiftKey && !e.metaKey && !e.ctrlKey) {
        if ((document.activeElement as HTMLInputElement)?.value) return
        const shiftShortcuts: Record<string, string> = {
          r: "/research",
          p: "/publications",
          o: "/open-source",
          i: "/install",
          n: "/now",
          l: "/lab",
          s: "/stats",
          u: "/uses",
          c: "/consumed",
          g: "/guestbook",
          f: "/friends",
          h: "/hall-of-fame",
          q: "/search",
          t: "/tags",
          k: "/colophon",
          v: "/changelog",
          a: "/accessibility",
          m: "https://status.isaacadjei.me",
          y: "/privacy",
          x: "/security-policy",
          d: "/disclaimer",
          w: "/copyright",
          e: "/code-of-conduct",
          j: "/ai-policy",
          b: "/contribute",
          z: "/support",
        }
        if (shiftShortcuts[key]) {
          e.preventDefault()
          open_(shiftShortcuts[key])
        }
        return
      }

      if (!(e.metaKey || e.ctrlKey)) return
      const shortcuts: Record<string, string> = {
        d: "/all-pages",
        h: "/",
        a: "/about",
        e: "/experience",
        p: "/projects",
        s: "/skills",
        c: "/contact",
        j: "/book",
        l: "/links",
        b: "/blog",
        y: "/til",
        k: "/notes",
        u: "/newsletter",
        f: "/feeds",
      }
      if (shortcuts[key]) {
        e.preventDefault()
        open_(shortcuts[key])
      }
    }
    document.addEventListener("keydown", down)
    const openFromButton = () => setOpen(true)
    window.addEventListener("open-command-menu", openFromButton)
    return () => {
      document.removeEventListener("keydown", down)
      window.removeEventListener("open-command-menu", openFromButton)
    }
  }, [open, router, pathname])

  const go = (path: string) => {
    setOpen(false)
    setTyped("")
    router.push(path)
  }

  const goExternal = (url: string) => {
    setOpen(false)
    window.open(url, "_blank", "noopener,noreferrer")
  }

  if (pathname === "/maintenance") return null

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="px-4 pt-4 pb-0 text-base font-semibold text-center">
        Quick Navigation
      </DialogTitle>
      <CommandInput placeholder="Type a command or search..." value={typed} onValueChange={setTyped} />
      <CommandList>
        <CommandEmpty>No pages match. Press Enter to search the site.</CommandEmpty>

        {typed.trim() && (
          <CommandGroup heading="Search">
            <CommandItem forceMount value={`search the site ${typed}`} onSelect={() => go(`/search?q=${encodeURIComponent(typed.trim())}`)}>
              <SearchIcon className="mr-2 h-4 w-4" />
              Search the site for &ldquo;{typed.trim()}&rdquo;
            </CommandItem>
          </CommandGroup>
        )}

        <CommandGroup heading="Start here">
          <CommandItem value="all pages directory site map" onSelect={() => go("/all-pages")}>
            <LayoutList className="mr-2 h-4 w-4" />
            All Pages
            <CommandShortcut>{shortcut("D")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="home" onSelect={() => go("/")}>
            <Home className="mr-2 h-4 w-4" />
            Home
            <CommandShortcut>{shortcut("H")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="about" onSelect={() => go("/about")}>
            <User className="mr-2 h-4 w-4" />
            About
            <CommandShortcut>{shortcut("A")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="experience" onSelect={() => go("/experience")}>
            <Briefcase className="mr-2 h-4 w-4" />
            Experience
            <CommandShortcut>{shortcut("E")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="projects" onSelect={() => go("/projects")}>
            <Code className="mr-2 h-4 w-4" />
            Projects
            <CommandShortcut>{shortcut("P")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="skills" onSelect={() => go("/skills")}>
            <Cpu className="mr-2 h-4 w-4" />
            Skills
            <CommandShortcut>{shortcut("S")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="contact" onSelect={() => go("/contact")}>
            <Mail className="mr-2 h-4 w-4" />
            Contact
            <CommandShortcut>{shortcut("C")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="book a call meeting video chat schedule calendar" onSelect={() => go("/book")}>
            <CalendarDays className="mr-2 h-4 w-4" />
            Book a Call
            <CommandShortcut>{shortcut("J")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="links socials" onSelect={() => go("/links")}>
            <Link2 className="mr-2 h-4 w-4" />
            Links
            <CommandShortcut>{shortcut("L")}</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Writing">
          <CommandItem value="blog posts writing" onSelect={() => go("/blog")}>
            <BookOpen className="mr-2 h-4 w-4" />
            Blog
            <CommandShortcut>{shortcut("B")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="til today i learned notes short snippets discoveries" onSelect={() => go("/til")}>
            <Lightbulb className="mr-2 h-4 w-4" />
            TIL
            <CommandShortcut>{shortcut("Y")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="notes thinking" onSelect={() => go("/notes")}>
            <NotebookPen className="mr-2 h-4 w-4" />
            Notes
            <CommandShortcut>{shortcut("K")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="newsletter subscribe issues" onSelect={() => go("/newsletter#subscribe")}>
            <Rss className="mr-2 h-4 w-4" />
            Newsletter
            <CommandShortcut>{shortcut("U")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="rss feeds subscribe reader blog til notes newsletter" onSelect={() => go("/feeds")}>
            <Rss className="mr-2 h-4 w-4" />
            RSS Feeds
            <CommandShortcut>{shortcut("F")}</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Work">
          <CommandItem value="research current work questions methods key papers interests" onSelect={() => go("/research")}>
            <FlaskConical className="mr-2 h-4 w-4" />
            Research
            <CommandShortcut>{shiftShortcut("R")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="publications academic papers citable zenodo orcid doi" onSelect={() => go("/publications")}>
            <GraduationCap className="mr-2 h-4 w-4" />
            Publications
            <CommandShortcut>{shiftShortcut("P")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="open source contributions pull requests projects merged" onSelect={() => go("/open-source")}>
            <GitPullRequest className="mr-2 h-4 w-4" />
            Open Source
            <CommandShortcut>{shiftShortcut("O")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="install tools homebrew winget cargo extensions themes download" onSelect={() => go("/install")}>
            <Download className="mr-2 h-4 w-4" />
            Install
            <CommandShortcut>{shiftShortcut("I")}</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Explore">
          <CommandItem value="now what I am doing currently" onSelect={() => go("/now")}>
            <Clock className="mr-2 h-4 w-4" />
            Now
            <CommandShortcut>{shiftShortcut("N")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="lab experiments" onSelect={() => go("/lab")}>
            <Terminal className="mr-2 h-4 w-4" />
            Lab
            <CommandShortcut>{shiftShortcut("L")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="stats github coding music applications gaming" onSelect={() => go("/stats")}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Stats
            <CommandShortcut>{shiftShortcut("S")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="uses hardware software tools setup gear" onSelect={() => go("/uses")}>
            <Wrench className="mr-2 h-4 w-4" />
            Uses
            <CommandShortcut>{shiftShortcut("U")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="consumed reading watching listening books youtube podcasts media" onSelect={() => go("/consumed")}>
            <BookOpen className="mr-2 h-4 w-4" />
            Consumed
            <CommandShortcut>{shiftShortcut("C")}</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Community">
          <CommandItem value="guestbook visitors messages sign" onSelect={() => go("/guestbook")}>
            <BookUser className="mr-2 h-4 w-4" />
            Guestbook
            <CommandShortcut>{shiftShortcut("G")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="friends personal websites people webring" onSelect={() => go("/friends")}>
            <Users className="mr-2 h-4 w-4" />
            Friends
            <CommandShortcut>{shiftShortcut("F")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="hall of fame acknowledgements security researchers" onSelect={() => go("/hall-of-fame")}>
            <Trophy className="mr-2 h-4 w-4" />
            Hall of Fame
            <CommandShortcut>{shiftShortcut("H")}</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Find things">
          <CommandItem value="search find blog til newsletter" onSelect={() => go("/search")}>
            <SearchIcon className="mr-2 h-4 w-4" />
            Search
            <CommandShortcut>{shiftShortcut("Q")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="tags topics categories browse" onSelect={() => go("/tags")}>
            <Tag className="mr-2 h-4 w-4" />
            Tags
            <CommandShortcut>{shiftShortcut("T")}</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="About the site">
          <CommandItem value="colophon how the site is built stack tech" onSelect={() => go("/colophon")}>
            <Info className="mr-2 h-4 w-4" />
            Colophon
            <CommandShortcut>{shiftShortcut("K")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="changelog updates history releases versions" onSelect={() => go("/changelog")}>
            <ScrollText className="mr-2 h-4 w-4" />
            Changelog
            <CommandShortcut>{shiftShortcut("V")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="accessibility statement screen reader keyboard contrast motion barrier" onSelect={() => go("/accessibility")}>
            <Accessibility className="mr-2 h-4 w-4" />
            Accessibility
            <CommandShortcut>{shiftShortcut("A")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="status uptime monitoring health system incidents" onSelect={() => goExternal("https://status.isaacadjei.me")}>
            <Activity className="mr-2 h-4 w-4" />
            Status
            <CommandShortcut>{shiftShortcut("M")}</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Policies and help">
          <CommandItem value="privacy policy data" onSelect={() => go("/privacy")}>
            <Shield className="mr-2 h-4 w-4" />
            Privacy Policy
            <CommandShortcut>{shiftShortcut("Y")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="security policy vulnerability disclosure responsible" onSelect={() => go("/security-policy")}>
            <Shield className="mr-2 h-4 w-4" />
            Security Policy
            <CommandShortcut>{shiftShortcut("X")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="disclaimer views advice accuracy liability" onSelect={() => go("/disclaimer")}>
            <Scale className="mr-2 h-4 w-4" />
            Disclaimer
            <CommandShortcut>{shiftShortcut("D")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="copyright licence trade marks third party credits" onSelect={() => go("/copyright")}>
            <Copyright className="mr-2 h-4 w-4" />
            Copyright
            <CommandShortcut>{shiftShortcut("W")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="code of conduct community standards contributor covenant" onSelect={() => go("/code-of-conduct")}>
            <Users className="mr-2 h-4 w-4" />
            Code of Conduct
            <CommandShortcut>{shiftShortcut("E")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="ai policy contributions artificial intelligence rules" onSelect={() => go("/ai-policy")}>
            <ScrollText className="mr-2 h-4 w-4" />
            AI Policy
            <CommandShortcut>{shiftShortcut("J")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="contribute contributing guide bug pull request idea hardware software" onSelect={() => go("/contribute")}>
            <HeartHandshake className="mr-2 h-4 w-4" />
            Contributing
            <CommandShortcut>{shiftShortcut("B")}</CommandShortcut>
          </CommandItem>
          <CommandItem value="support help get in touch questions email" onSelect={() => go("/support")}>
            <LifeBuoy className="mr-2 h-4 w-4" />
            Support
            <CommandShortcut>{shiftShortcut("Z")}</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
