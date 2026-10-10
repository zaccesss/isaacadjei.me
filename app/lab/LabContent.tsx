"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "@/components/shared/MediaImage"
import { publications } from "@/data/respub"
import Link from "next/link"
import { useModKey } from "@/hooks/useModKey"
import BrailleDivider from "@/components/shared/marks/BrailleDivider"
import dynamic from "next/dynamic"
import s from "./terminal.module.css"

const PCBViewer = dynamic(() => import("@/components/lab/PCBViewer"), { ssr: false })

type WindowState = "normal" | "minimized" | "maximized" | "closed"
type LineType =
  | "system" | "cmd-echo" | "output" | "error" | "info" | "blank" | "success" | "cmd-list" | "kv" | "link"
  | "rule" | "banner" | "title" | "heading" | "pair" | "legend" | "swatch"
type Tone = "fg" | "bold" | "dim" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white"

interface Line {
  type: LineType
  text: string
  tone?: Tone
  bold?: boolean
}

const PROMPT_DIR = "isaacadjei.me/lab"
const PROMPT_BRANCH = "main"

export type LabData = {
  posts: { slug: string; tags: string[] }[]
  latestTils: { title: string; category: string; date: string }[]
  tilCount: number
}

const TYPE_LABEL: Record<string, string> = {
  blog: "blog",
  journal: "journal",
  research: "research",
  notes: "notes",
  report: "report",
  article: "article",
  resources: "resources",
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const pad2 = (n: number) => String(n).padStart(2, "0")

function bannerLines(name: string): Line[] {
  const d = new Date()
  const stamp = `${DAYS[d.getDay()]} ${pad2(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()}  ${pad2(d.getHours())}:${pad2(d.getMinutes())}`
  const rule = "-".repeat(45)
  return [
    { type: "blank", text: "" },
    { type: "rule", text: rule },
    { type: "banner", text: `  Welcome back, ${name}!`, tone: "cyan", bold: true },
    { type: "banner", text: "  web profile loaded", tone: "green" },
    { type: "banner", text: "  isaacadjei.me - zsh", tone: "magenta" },
    { type: "banner", text: `  ${stamp}`, tone: "yellow" },
    { type: "rule", text: rule },
    { type: "blank", text: "" },
  ]
}

const HINTS: Line[] = [
  { type: "output", text: "type 'help' for every command or 'cmds' for the cheat-sheet." },
  { type: "output", text: "type 'pages' to see every public page on this site." },
  { type: "output", text: "try: 'palette', 'git commit', 'ls', 'man', 'stack', 'faith'" },
  { type: "blank", text: "" },
]

const NAME_KEY = "lab-terminal-name"
const DEFAULT_NAME = "visitor"
const NAME_MAX = 24
let memoryName: string | null = null

function cleanName(raw: string): string {
  const kept = raw
    .replace(/[^\p{L}\p{N} '’-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, NAME_MAX)
    .trim()
  return kept || DEFAULT_NAME
}

function nameHandle(name: string): string {
  const handle = name
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
  return handle || DEFAULT_NAME
}

function loadName(): string | null {
  try {
    const stored = window.localStorage.getItem(NAME_KEY)
    if (stored) return cleanName(stored)
  } catch {
    // storage unavailable, fall through to the in-memory copy
  }
  return memoryName
}

function saveName(name: string) {
  memoryName = name
  try {
    window.localStorage.setItem(NAME_KEY, name)
  } catch {
    // the in-memory copy above still covers this visit
  }
}

const LOGIN_LINES: Line[] = [
  { type: "output", text: "login: what should I call you?" },
  { type: "info", text: `  type a name and press Enter (an empty line keeps ${DEFAULT_NAME})` },
]

function startupSteps(name: string): [Line, number][] {
  return [
    [{ type: "info", text: `setting up a terminal for ${name}...` }, 280],
    [{ type: "output", text: "loading palette... done" }, 200],
    [{ type: "output", text: "brewing coffee... done" }, 200],
    [{ type: "output", text: "loading profile... done" }, 200],
  ]
}

function introSteps(name: string): [Line, number][] {
  return [
    ...startupSteps(name),
    ...[...bannerLines(name), ...HINTS].map((line): [Line, number] => [line, 55]),
  ]
}

function withVisitor(lines: Line[], name: string): Line[] {
  return [...lines.slice(0, 2), { type: "kv", text: `  you       ${name}` }, ...lines.slice(2)]
}

const PALETTE: [string, string, string, Tone | "black"][] = [
  ["black", "#35424c", "#1f1f1f", "black"],
  ["red", "#ff0f00", "#b40b00", "red"],
  ["green", "#00ff2f", "#006813", "green"],
  ["yellow", "#fff500", "#735300", "yellow"],
  ["blue", "#8ac9ff", "#0059a5", "blue"],
  ["magenta", "#ff66ff", "#9f009f", "magenta"],
  ["cyan", "#6ff7ff", "#006369", "cyan"],
  ["white", "#f2f2f2", "#3c4650", "white"],
]

function paletteLines(): Line[] {
  const dark = typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  return [
    { type: "title", text: "High Contrast palette" },
    { type: "output", text: `  showing the ${dark ? "dark" : "light"} set. switch the site theme to see the other.` },
    { type: "output", text: "  normal ANSI colours, bold for emphasis, never the bright set." },
    { type: "blank", text: "" },
    { type: "kv", text: "  background  #000000 / #ffffff" },
    { type: "kv", text: "  foreground  #e0e0e0 / #1f1f1f" },
    { type: "kv", text: "  bold        #ededed / #121212" },
    { type: "kv", text: "  selection   #273d4c / #b3c9d8" },
    { type: "blank", text: "" },
    { type: "legend", text: "  colour      dark     light" },
    ...PALETTE.map(([name, d, l, tone]) => ({ type: "swatch" as const, text: `${name}|${d}|${l}|${tone}` })),
    { type: "blank", text: "" },
    { type: "output", text: "  dark is a vivid near-black base. light mirrors it at 7:1 contrast." },
  ]
}

const CMDS_LINES: Line[] = [
  { type: "title", text: "=== Lab commands (type cmds to see this again) ===" },
  { type: "legend", text: "" },
  { type: "blank", text: "" },
  { type: "heading", text: "NAVIGATION" },
  { type: "pair", text: "  about / projects / experience / skills  open a page" },
  { type: "pair", text: "  blog / til / notes / respub  writing and research" },
  { type: "pair", text: "  ls / pwd / pages  find your way round" },
  { type: "blank", text: "" },
  { type: "heading", text: "GIT" },
  { type: "pair", text: "  git status / git branch  repo state" },
  { type: "pair", text: "  git commit -m \"subject\"  commit, checked by the commit-msg hook" },
  { type: "pair", text: "  gs / gb / glog  the real aliases: status, branch and the log graph" },
  { type: "blank", text: "" },
  { type: "heading", text: "TMUX AND NEOVIM" },
  { type: "pair", text: "  tmux ls / tls  the running sessions" },
  { type: "pair", text: "  nvim [file] / vim  open README.md, about.md or tmux.conf read-only" },
  { type: "blank", text: "" },
  { type: "heading", text: "SHELL" },
  { type: "pair", text: "  ll / la  the long listing aliases" },
  { type: "pair", text: "  cls  clear and reprint the welcome banner" },
  { type: "pair", text: "  clear  clear the screen" },
  { type: "pair", text: "  palette  the terminal colours" },
  { type: "pair", text: "  echo [text]  echo it back" },
  { type: "blank", text: "" },
  { type: "heading", text: "LIVE" },
  { type: "pair", text: "  stats / streak / today  coding time" },
  { type: "pair", text: "  playing / lastgame / pushed  music, gaming and GitHub" },
  { type: "blank", text: "" },
  { type: "heading", text: "ABOUT" },
  { type: "pair", text: "  whoami / man / stack  who and what" },
  { type: "pair", text: "  name [new name]  change what the terminal calls you" },
  { type: "pair", text: "  help  every command" },
]

const DEMO_SUBJECT = "feat: rebuild the lab terminal with a phone layout, the real palette and a shell banner"
const SUBJECT_LIMIT = 72

function shortHash(text: string): string {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619)
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7)
}

function commitLines(args: string): Line[] {
  const m = args.match(/-m\s+(?:"([^"]*)"|'([^']*)'|(.+))/)
  const out: Line[] = []
  let msg = m ? (m[1] ?? m[2] ?? m[3] ?? "") : DEMO_SUBJECT
  if (!m) {
    out.push({ type: "info", text: "no -m given, so here is a subject that breaks the rules:" })
    out.push({ type: "output", text: `  git commit -m "${DEMO_SUBJECT}"` })
    out.push({ type: "blank", text: "" })
  }
  if (!msg.trim()) {
    return [...out, { type: "error", text: "Aborting commit due to empty commit message." }]
  }
  if (/[\u2011-\u2015\u2212]/.test(msg)) {
    msg = msg.replace(/[\u2011-\u2015\u2212]/g, "-")
    out.push({ type: "success", text: "Fixed: dash-like character(s) replaced with a plain hyphen." })
  }
  if (/[\u201C\u201D]/.test(msg)) {
    msg = msg.replace(/[\u201C\u201D]/g, '"')
    out.push({ type: "success", text: "Fixed: smart/curly double quote(s) replaced with a straight quote." })
  }
  if (/[\u2018\u2019]/.test(msg)) {
    msg = msg.replace(/[\u2018\u2019]/g, "'")
    out.push({ type: "success", text: "Fixed: smart/curly single quote(s) replaced with a straight quote." })
  }
  if (msg.includes("\u2026")) {
    msg = msg.replace(/\u2026/g, "...")
    out.push({ type: "success", text: "Fixed: ellipsis character replaced with three periods." })
  }
  const blocked: Line[] = []
  if (/,\s+and\s/.test(msg)) {
    blocked.push({ type: "error", text: "Error: Oxford comma found. Write 'x, y and z' with no comma before the last item." })
  }
  const subject = msg.split("\n")[0]
  if (!blocked.length && subject.length > SUBJECT_LIMIT) {
    blocked.push({ type: "error", text: `Error: commit subject line is ${subject.length} characters, over the ${SUBJECT_LIMIT}-character limit.` })
    blocked.push({ type: "error", text: "Keep the subject short and move detail to the commit body instead." })
  }
  if (blocked.length) {
    return [
      ...out,
      ...blocked,
      { type: "blank", text: "" },
      { type: "output", text: "  the commit-msg hook stopped this one. nothing was committed." },
      { type: "output", text: `  try: git commit -m "feat: add a phone layout to the lab"` },
    ]
  }
  return [
    ...out,
    { type: "success", text: `[${PROMPT_BRANCH} ${shortHash(msg)}] ${subject}` },
    { type: "output", text: " 1 file changed, 1 insertion(+)" },
    { type: "output", text: "  (nothing really changed. this terminal is a toy.)" },
  ]
}

function gitLines(raw: string): Line[] {
  const args = raw.trim().replace(/^git\s*/i, "")
  const sub = (args.split(/\s+/)[0] ?? "").toLowerCase()
  if (!sub) {
    return [
      { type: "output", text: "usage: git <command>" },
      { type: "output", text: "  this lab knows 'git status', 'git branch', 'git log' and 'git commit'." },
    ]
  }
  if (sub === "status") {
    return [
      { type: "output", text: `On branch ${PROMPT_BRANCH}` },
      { type: "output", text: `Your branch is up to date with 'origin/${PROMPT_BRANCH}'.` },
      { type: "blank", text: "" },
      { type: "output", text: "nothing to commit, working tree clean" },
    ]
  }
  if (sub === "branch") return [{ type: "success", text: `* ${PROMPT_BRANCH}` }]
  if (sub === "log") return LOG_LINES
  if (sub === "commit") return commitLines(args.slice(sub.length))
  return [{ type: "error", text: `git: '${sub}' is not a git command here. try 'git status' or 'git commit'.` }]
}

const LOG_LINES: Line[] = [
  { type: "success", text: `* 557ccb1 (HEAD -> ${PROMPT_BRANCH}, origin/${PROMPT_BRANCH}) feat: website links, light brand covers and final page polish` },
  { type: "output", text: "* d207705 docs: changelog for the second overhaul batch" },
  { type: "output", text: "* 4b3c6bb feat: consumed picks, covers, collections and embedded media" },
  { type: "output", text: "* 2f4e445 feat: filters, design pass, research page and richer writing" },
  { type: "info", text: "  (that is enough history for one screen)" },
]

const ALIASES: Record<string, string> = {
  gs: "git status",
  gb: "git branch",
  glog: "git log",
  ll: "ls",
  la: "ls",
  tls: "tmux ls",
  vi: "nvim",
  vim: "nvim",
}

const TMUX_SESSION = "lab"

function tmuxStamp(d: Date): string {
  return `${DAYS[d.getDay()]} ${MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2, " ")} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())} ${d.getFullYear()}`
}

function tmuxLines(raw: string, openedAt: Date): Line[] {
  const sub = raw.trim().split(/\s+/)[1]?.toLowerCase()
  if (sub === "ls" || sub === "list-sessions") {
    const earlier = (mins: number) => tmuxStamp(new Date(openedAt.getTime() - mins * 60_000))
    return [
      { type: "output", text: `${TMUX_SESSION}: 2 windows (created ${tmuxStamp(openedAt)}) (attached)` },
      { type: "output", text: `uni: 3 windows (created ${earlier(95)})` },
      { type: "output", text: `web: 2 windows (created ${earlier(240)})` },
    ]
  }
  return [
    { type: "error", text: "sessions should be nested with care, unset $TMUX to force" },
    { type: "output", text: "  try 'tmux ls' to see the running sessions" },
  ]
}

const NVIM_FILES: Record<string, { filetype: string; lines: string[] }> = {
  "README.md": {
    filetype: "markdown",
    lines: [
      "# isaacadjei.me",
      "",
      "My personal site: projects, writing, research and this lab.",
      "",
      "## Pages",
      "",
      "- /projects  things I built",
      "- /blog      things I write",
      "- /lab       this terminal and the PCB viewer",
      "- /contact   get in touch",
      "",
      "## Built with",
      "",
      "Next.js, React, TypeScript and Tailwind CSS on Vercel.",
      "",
      "## In here",
      "",
      "Type :q and press Enter to go back to the shell.",
    ],
  },
  "about.md": {
    filetype: "markdown",
    lines: [
      "# About",
      "",
      "Isaac Adjei (Zac), Electronic Engineering and CS student",
      "at Aston University.",
      "",
      "- based in Birmingham and London, UK",
      "- originally from Ghana",
      "- building at the intersection of hardware and software",
      "",
      "Say hello: contact@isaacadjei.me",
    ],
  },
  "tmux.conf": {
    filetype: "tmux",
    lines: [
      "set -g mouse on",
      "set -g base-index 1 # windows start at 1, not 0",
      "setw -g pane-base-index 1",
      "set -g renumber-windows on",
      "set -g escape-time 10 # near-zero delay after Esc, so it never lags in Neovim",
      "setw -g mode-keys vi",
      "",
      "# status bar: the terminal's own colours, high contrast in light and dark",
      "set -g status-style \"bg=default,fg=default\"",
      "set -g status-left \"#[bold]#S \"",
      "set -g status-right \"%Y-%m-%d %H:%M\"",
      "set -g window-status-current-style \"bold,reverse\"",
    ],
  },
}

interface EditorState {
  file: string
  filetype: string
  lines: string[]
  message: string
}

function openFile(arg: string): EditorState | null {
  const file = arg.trim() || "README.md"
  const hit = Object.keys(NVIM_FILES).find((k) => k.toLowerCase() === file.toLowerCase())
  if (!hit) return null
  const { filetype, lines } = NVIM_FILES[hit]
  return { file: hit, filetype, lines, message: `"${hit}" [readonly] ${lines.length}L` }
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
const isCoarsePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches

const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "A SQL query walks into a bar, walks up to two tables and asks: can I join you?",
  "Why did the developer quit his job? Because he didn't get arrays.",
  "There are 10 types of people in the world: those who understand binary and those who don't.",
  "Why do Java developers wear glasses? Because they don't C#.",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
  "I would tell you a UDP joke but you might not get it.",
  "Why was the JavaScript developer sad? Because he didn't know how to 'null' his feelings.",
]

const NAV_COMMANDS: Record<string, string> = {
  about: "https://www.isaacadjei.me/about",
  projects: "https://www.isaacadjei.me/projects",
  experience: "https://www.isaacadjei.me/experience",
  skills: "https://www.isaacadjei.me/skills",
  contact: "https://www.isaacadjei.me/contact",
  links: "https://www.isaacadjei.me/links",
  blog: "https://www.isaacadjei.me/blog",
  blogfeed: "https://www.isaacadjei.me/blog/feed.xml",
  til: "https://www.isaacadjei.me/til",
  tilfeed: "https://www.isaacadjei.me/til/feed.xml",
  notes: "https://www.isaacadjei.me/notes",
  respub: "https://www.isaacadjei.me/respub",
  newsletter: "https://www.isaacadjei.me/newsletter",
  newsletterfeed: "https://www.isaacadjei.me/newsletter/feed.xml",
  consumed: "https://www.isaacadjei.me/consumed",
  tags: "https://www.isaacadjei.me/tags",
  search: "https://www.isaacadjei.me/search",
  pages: "https://www.isaacadjei.me/all-pages",
  github: "https://github.com/zaccesss",
  linkedin: "https://www.linkedin.com/in/isaacadjei",
  cv: "https://www.isaacadjei.me/api/cv-pdf",
}

const MAIL_COMMANDS: Record<string, string> = {
  collaborate:
    "mailto:contact@isaacadjei.me?subject=Collaboration%20Opportunity&body=Hi%20Isaac%2C%0A%0AI%20would%20love%20to%20collaborate%20with%20you%20on...%0A%0ABest%2C",
  suggest:
    "mailto:contact@isaacadjei.me?subject=Blog%20Suggestion&body=Hi%20Isaac%2C%0A%0AI%20have%20an%20idea%20for%20your%20blog%3A%0A%0A-%20Topic%3A%0A-%20Why%20it%20would%20be%20useful%3A%0A%0AThanks%2C",
}

const COMMANDS: Record<string, (data: LabData) => Line[]> = {
  help: () => [
    { type: "info", text: "isaacadjei-lab - available commands" },
    { type: "blank", text: "" },
    { type: "info", text: "  navigate" },
    { type: "cmd-list", text: "  about        -  open about page" },
    { type: "cmd-list", text: "  projects     -  open projects page" },
    { type: "cmd-list", text: "  experience   -  open experience page" },
    { type: "cmd-list", text: "  skills       -  open skills page" },
    { type: "cmd-list", text: "  blog         -  open blog" },
    { type: "cmd-list", text: "  blogfeed     -  open blog RSS feed" },
    { type: "cmd-list", text: "  til          -  recent things I learned" },
    { type: "cmd-list", text: "  tilfeed      -  open TIL RSS feed" },
    { type: "cmd-list", text: "  notes        -  open notes" },
    { type: "cmd-list", text: "  respub       -  research and publications" },
    { type: "cmd-list", text: "  contact      -  open contact form" },
    { type: "cmd-list", text: "  links        -  open links page" },
    { type: "cmd-list", text: "  newsletter   -  open newsletter page" },
    { type: "cmd-list", text: "  newsletterfeed -  open newsletter RSS feed" },
    { type: "cmd-list", text: "  consumed      -  books, videos, podcasts and more" },
    { type: "cmd-list", text: "  tags         -  browse all topics" },
    { type: "cmd-list", text: "  search       -  search across everything" },
    { type: "cmd-list", text: "  pages        -  full directory of all public pages" },
    { type: "cmd-list", text: "  github       -  open GitHub profile" },
    { type: "cmd-list", text: "  linkedin     -  open LinkedIn profile" },
    { type: "blank", text: "" },
    { type: "info", text: "  writing" },
    { type: "cmd-list", text: "  posts        -  most read blog and TIL entries" },
    { type: "cmd-list", text: "  live         -  published posts" },
    { type: "cmd-list", text: "  topics       -  active tags" },
    { type: "blank", text: "" },
    { type: "info", text: "  explore" },
    { type: "cmd-list", text: "  ls           -  list site sections" },
    { type: "cmd-list", text: "  pwd          -  print working directory" },
    { type: "cmd-list", text: "  man          -  manual page for isaac" },
    { type: "cmd-list", text: "  stack        -  tech stack" },
    { type: "cmd-list", text: "  build        -  all active projects" },
    { type: "cmd-list", text: "  now          -  current main project" },
    { type: "cmd-list", text: "  future       -  upcoming projects" },
    { type: "cmd-list", text: "  grade        -  predicted degree classification" },
    { type: "cmd-list", text: "  uptime       -  how long this site has been live" },
    { type: "cmd-list", text: "  status       -  system status" },
    { type: "cmd-list", text: "  version      -  version info" },
    { type: "cmd-list", text: "  ping         -  ping isaacadjei.me" },
    { type: "cmd-list", text: "  rss          -  all RSS feeds" },
    { type: "cmd-list", text: "  date         -  current date" },
    { type: "cmd-list", text: "  time         -  current time" },
    { type: "cmd-list", text: "  echo [text]  -  echo something back" },
    { type: "blank", text: "" },
    { type: "info", text: "  coding stats  (live from database)" },
    { type: "cmd-list", text: "  stats        -  all-time coding overview" },
    { type: "cmd-list", text: "  streak       -  current coding streak" },
    { type: "cmd-list", text: "  today        -  coding hours in last 24h" },
    { type: "cmd-list", text: "  languages    -  top languages (30 days)" },
    { type: "cmd-list", text: "  vscode       -  editor breakdown" },
    { type: "cmd-list", text: "  os           -  operating system breakdown" },
    { type: "blank", text: "" },
    { type: "info", text: "  live" },
    { type: "cmd-list", text: "  playing      -  what I am listening to" },
    { type: "cmd-list", text: "  lastgame     -  last PS5 game" },
    { type: "cmd-list", text: "  pushed       -  last GitHub push" },
    { type: "blank", text: "" },
    { type: "info", text: "  connect" },
    { type: "cmd-list", text: "  collaborate  -  email for collaboration" },
    { type: "cmd-list", text: "  suggest      -  send a blog suggestion" },
    { type: "cmd-list", text: "  hire         -  why hire Isaac" },
    { type: "cmd-list", text: "  cv           -  download CV directly" },
    { type: "blank", text: "" },
    { type: "info", text: "  discover" },
    { type: "cmd-list", text: "  whoami       -  identity check" },
    { type: "cmd-list", text: "  name         -  change what I call you (also login)" },
    { type: "cmd-list", text: "  ghana        -  origin story" },
    { type: "cmd-list", text: "  faith        -  what drives it all" },
    { type: "cmd-list", text: "  dad          -  in memory" },
    { type: "cmd-list", text: "  music        -  what I listen to" },
    { type: "cmd-list", text: "  coffee       -  fuel of choice" },
    { type: "cmd-list", text: "  motto        -  quick motivation" },
    { type: "cmd-list", text: "  mottos       -  all site mottos explained" },
    { type: "cmd-list", text: "  joke         -  one for the road" },
    { type: "cmd-list", text: "  hack         -  do not" },
    { type: "cmd-list", text: "  decrypt      -  classified message" },
    { type: "cmd-list", text: "  matrix       -  go deeper" },
    { type: "cmd-list", text: "  make         -  compile isaac.exe" },
    { type: "cmd-list", text: "  sudo         -  definitely do not" },
    { type: "cmd-list", text: "  approach     -  my code philosophy" },
    { type: "cmd-list", text: "  zac          -  easter egg" },
    { type: "cmd-list", text: "  clear        -  clear terminal" },
    { type: "blank", text: "" },
    { type: "info", text: "shell (mirrors my real setup)" },
    { type: "cmd-list", text: "  cmds         -  the cheat-sheet" },
    { type: "cmd-list", text: "  cls          -  clear and reprint the banner" },
    { type: "cmd-list", text: "  palette      -  terminal colours" },
    { type: "cmd-list", text: "  git commit   -  try the commit-msg hook" },
    { type: "cmd-list", text: "  git status   -  repo state" },
  ],

  ls: () => [
    { type: "info", text: "isaacadjei.me - directory listing" },
    { type: "blank", text: "" },
    { type: "output", text: "  drwxr-xr-x  /about        who I am" },
    { type: "output", text: "  drwxr-xr-x  /projects     things I built" },
    { type: "output", text: "  drwxr-xr-x  /experience   where I have worked" },
    { type: "output", text: "  drwxr-xr-x  /skills       what I can do" },
    { type: "output", text: "  drwxr-xr-x  /blog         things I write" },
    { type: "output", text: "  drwxr-xr-x  /til          things I learn" },
    { type: "output", text: "  drwxr-xr-x  /notes        what I am thinking" },
    { type: "output", text: "  drwxr-xr-x  /respub       research and publications" },
    { type: "output", text: "  drwxr-xr-x  /contact      get in touch" },
    { type: "output", text: "  drwxr-xr-x  /newsletter   stay updated" },
    { type: "output", text: "  drwxr-xr-x  /lab          you are here" },
    { type: "output", text: "  drwxr-xr-x  /consumed     books, videos, podcasts and more" },
    { type: "output", text: "  drwxr-xr-x  /tags         browse all topics" },
    { type: "output", text: "  drwxr-xr-x  /search       search across everything" },
    { type: "output", text: "  drwxr-xr-x  /all-pages    every public page" },
  ],

  cmds: () => CMDS_LINES,
  palette: () => paletteLines(),

  pwd: () => [
    { type: "output", text: "/lab" },
  ],

  man: () => [
    { type: "info", text: "MANUAL PAGE - isaac(1)" },
    { type: "blank", text: "" },
    { type: "output", text: "  NAME" },
    { type: "output", text: "       isaac - electronic engineer and developer" },
    { type: "blank", text: "" },
    { type: "output", text: "  SYNOPSIS" },
    { type: "output", text: "       isaac [--build | --learn | --collaborate]" },
    { type: "blank", text: "" },
    { type: "output", text: "  DESCRIPTION" },
    { type: "output", text: "       Isaac Adjei (Zac) is an Electronic Engineering and" },
    { type: "output", text: "       Computer Science student at Aston University, Birmingham." },
    { type: "output", text: "       He works across bare-metal C, embedded systems, full-stack" },
    { type: "output", text: "       web and machine learning. He builds things that move from" },
    { type: "output", text: "       concept to code to real tangible output." },
    { type: "blank", text: "" },
    { type: "output", text: "  OPTIONS" },
    { type: "output", text: "       --build        currently building things that matter" },
    { type: "output", text: "       --learn        always learning something new" },
    { type: "output", text: "       --collaborate  open to internships and collaboration" },
    { type: "blank", text: "" },
    { type: "output", text: "  SEE ALSO" },
    { type: "output", text: "       projects(1), contact(1), blog(1)" },
    { type: "blank", text: "" },
    { type: "output", text: "  AUTHOR" },
    { type: "output", text: "       Isaac Adjei <contact@isaacadjei.me>" },
  ],

  stack: () => [
    { type: "info", text: "tech stack" },
    { type: "blank", text: "" },
    { type: "kv", text: "  Languages    C, C++, Python, JavaScript, TypeScript, Java" },
    { type: "kv", text: "  Embedded     AVR, Arduino, ESP32, STM32, ARM Cortex-M" },
    { type: "kv", text: "  Web          Next.js, React, FastAPI, PHP, MySQL" },
    { type: "kv", text: "  ML           Python, TensorFlow, PyTorch, scikit-learn" },
    { type: "kv", text: "  Tools        Git, Docker, Proteus, KiCad, MATLAB" },
    { type: "kv", text: "  Cloud        AWS (learning), Vercel, Railway" },
    { type: "kv", text: "  Learning     Rust, cyber security, cloud architecture" },
  ],

  build: () => [
    { type: "info", text: "currently building" },
    { type: "blank", text: "" },
    { type: "output", text: "  → LidarSAT" },
    { type: "output", text: "    GPS-denied drone navigation, team research" },
    { type: "blank", text: "" },
    { type: "output", text: "  → MELOPHOS" },
    { type: "output", text: "    lights above the keys that show the next note" },
    { type: "blank", text: "" },
    { type: "output", text: "  → Vitafolio" },
    { type: "output", text: "    every version of your CV, live" },
    { type: "blank", text: "" },
    { type: "output", text: "  → PHAEMOS" },
    { type: "output", text: "    predictive maintenance for machines" },
    { type: "blank", text: "" },
    { type: "output", text: "  → avr-zac" },
    { type: "output", text: "    bare metal AVR C on ATmega644P" },
    { type: "blank", text: "" },
    { type: "output", text: "  → this portfolio" },
    { type: "output", text: "    always improving, always shipping" },
  ],

  future: () => [
    { type: "info", text: "upcoming projects" },
    { type: "blank", text: "" },
    { type: "output", text: "  [ planned ]  World Cup 2026 AI Predictor" },
    { type: "output", text: "               ML model trained on all historical WC data" },
    { type: "output", text: "               group stage + knockout + winner predictions" },
    { type: "output", text: "               deployed as a public web app" },
    { type: "blank", text: "" },
    { type: "output", text: "  [ research ] Ocular Prosthetics and Health Technology" },
    { type: "output", text: "               deep research into retinoblastoma" },
    { type: "output", text: "               bio-integrated electronics and smart implants" },
    { type: "output", text: "               personal motivation drives this one" },
  ],

  version: () => [
    { type: "info", text: "isaacadjei-lab v1.0.0" },
    { type: "blank", text: "" },
    { type: "kv", text: "  built with   Next.js 16, TypeScript, Tailwind CSS" },
    { type: "kv", text: "  deployed on  Vercel" },
    { type: "kv", text: "  domain       isaacadjei.me" },
    { type: "kv", text: "  license      all rights reserved" },
  ],

  rss: () => [
    { type: "info", text: "RSS feeds - subscribe in your reader" },
    { type: "blank", text: "" },
    { type: "kv", text: "  blog        isaacadjei.me/blog/feed.xml" },
    { type: "kv", text: "  til         isaacadjei.me/til/feed.xml" },
    { type: "kv", text: "  newsletter  isaacadjei.me/newsletter/feed.xml" },
    { type: "blank", text: "" },
    { type: "output", text: "  run 'blogfeed', 'tilfeed' or 'newsletterfeed' to open a feed" },
  ],

  ping: () => [
    { type: "info", text: "PING isaacadjei.me" },
    { type: "blank", text: "" },
    { type: "output", text: "  64 bytes from isaacadjei.me: time=1ms ttl=64" },
    { type: "output", text: "  64 bytes from isaacadjei.me: time=1ms ttl=64" },
    { type: "output", text: "  64 bytes from isaacadjei.me: time=1ms ttl=64" },
    { type: "blank", text: "" },
    { type: "output", text: "  3 packets transmitted, 3 received, 0% packet loss" },
    { type: "success", text: "  site is live and responsive" },
  ],

  date: () => [
    { type: "kv", text: `  date      ${new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}` },
  ],

  time: () => [
    { type: "kv", text: `  time      ${new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })} (local)` },
  ],

  whoami: () => [
    { type: "info", text: "identity check" },
    { type: "blank", text: "" },
    { type: "kv", text: "  name      Isaac Adjei (Zac)" },
    { type: "kv", text: "  role      Electronic Engineering and CS student" },
    { type: "kv", text: "  location  Birmingham and London, UK" },
    { type: "kv", text: "  origin    Ghana" },
    { type: "kv", text: "  uni       Aston University" },
    { type: "kv", text: "  email     contact@isaacadjei.me" },
    { type: "kv", text: "  web       isaacadjei.me" },
    { type: "blank", text: "" },
    { type: "output", text: "  building at the intersection of hardware and software" },
  ],

  ghana: () => [
    { type: "info", text: "origin" },
    { type: "blank", text: "" },
    { type: "output", text: "  Ghana                         " },
    { type: "output", text: "  Adisadel College, Cape Coast  " },
    { type: "blank", text: "" },
    { type: "output", text: "  Vel Primus, Vel Cum Primis" },
    { type: "output", text: "  Either the first or with the first." },
    { type: "blank", text: "" },
    { type: "output", text: "  HVAC Technician · 2019-2021" },
    { type: "output", text: "  The place that shaped everything." },
  ],

  faith: () => [
    { type: "blank", text: "" },
    { type: "info", text: '  "Trust in the Lord with all your heart' },
    { type: "info", text: "   and lean not on your own understanding." },
    { type: "info", text: "   In all your ways submit to him," },
    { type: "info", text: '   and he will make your paths straight."' },
    { type: "blank", text: "" },
    { type: "output", text: "                                    Proverbs 3:5-6" },
    { type: "blank", text: "" },
    { type: "output", text: "  faith is not a footnote. it runs through everything." },
  ],

  dad: () => [
    { type: "blank", text: "" },
    { type: "info", text: "  in memory of my father." },
    { type: "blank", text: "" },
    { type: "output", text: "  mechanical and refrigeration engineer." },
    { type: "output", text: "  the man who showed me what it means" },
    { type: "output", text: "  to build things with your hands." },
    { type: "blank", text: "" },
    { type: "info", text: '  "Always strive to make things better."' },
    { type: "blank", text: "" },
    { type: "output", text: "  this terminal runs partly on his words." },
  ],

  music: () => [
    { type: "info", text: "currently listening to" },
    { type: "blank", text: "" },
    { type: "output", text: "  → Gospel and Contemporary Christian" },
    { type: "output", text: "  → Afrobeats and Highlife" },
    { type: "output", text: "  → Lo-fi for focus sessions" },
    { type: "output", text: "  → Piano (also playing, not just listening)" },
    { type: "blank", text: "" },
    { type: "output", text: '  "music is engineering for the ears."' },
  ],

  motto: () => [
    { type: "blank", text: "" },
    { type: "info", text: '  "The people who are crazy enough to think they' },
    { type: "info", text: '   can change the world are the ones who do."' },
    { type: "blank", text: "" },
    { type: "output", text: "                                        Steve Jobs" },
    { type: "blank", text: "" },
  ],

  joke: () => {
    const joke = JOKES[Math.floor(Math.random() * JOKES.length)]
    return [
      { type: "blank", text: "" },
      { type: "info", text: `  ${joke}` },
      { type: "blank", text: "" },
    ]
  },

  live: ({ posts: published }) => {
    return [
      { type: "info", text: `published now  (${published.length})` },
      { type: "blank", text: "" },
      ...published.map((p) => ({
        type: "output" as LineType,
        text: `  → /blog/${p.slug}`,
      })),
    ]
  },

  topics: ({ posts }) => {
    const tags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort((a, b) =>
      a.localeCompare(b)
    )
    return [
      { type: "info", text: `active tags  (${tags.length})` },
      { type: "blank", text: "" },
      { type: "output", text: `  ${tags.join("  ·  ")}` },
    ]
  },

  now: () => [
    { type: "info", text: "currently building" },
    { type: "blank", text: "" },
    { type: "output", text: "  → LidarSAT, MELOPHOS, Vitafolio and PHAEMOS" },
    { type: "output", text: "    PHAEMOS models now raise their own alerts and tickets" },
    { type: "link", text: "    github.com/phaemos/phaemos" },
    { type: "blank", text: "" },
    { type: "output", text: "  also run 'build' for all active projects" },
  ],

  grade: () => [
    { type: "info", text: "degree classification" },
    { type: "blank", text: "" },
    { type: "kv", text: "  institution   Aston University" },
    { type: "kv", text: "  programme     Electronic Engineering and Computer Science" },
    { type: "link", text: "  www.aston.ac.uk" },
    { type: "kv", text: "  predicted     First Class (>=70%)" },
    { type: "kv", text: "  trajectory    on track" },
    { type: "blank", text: "" },
    { type: "output", text: '  "Vel Primus, Vel Cum Primis"' },
    { type: "output", text: "   either the first or with the first." },
  ],

  uptime: () => {
    const launched = new Date("2026-04-10")
    const ms = Date.now() - launched.getTime()
    const days = Math.floor(ms / 86400000)
    const hours = Math.floor((ms % 86400000) / 3600000)
    return [
      { type: "info", text: "portfolio uptime" },
      { type: "blank", text: "" },
      { type: "kv", text: "  online since   10 Apr 2026" },
      { type: "kv", text: `  uptime         ${days} days, ${hours} hours` },
      { type: "kv", text: "  host           Vercel Edge Network" },
      { type: "kv", text: "  status         all systems operational" },
      { type: "blank", text: "" },
      { type: "success", text: "  site is live at isaacadjei.me" },
    ]
  },

  mottos: () => [
    { type: "info", text: "site mottos - scattered across isaacadjei.me" },
    { type: "blank", text: "" },
    { type: "kv", text: "  boot        $ while true; do learn && build && ship; done" },
    { type: "output", text: "               the dev lifecycle in an infinite loop, no exit condition" },
    { type: "blank", text: "" },
    { type: "kv", text: "  github      $ git push origin career --force" },
    { type: "output", text: "               overwrite self-doubt with output" },
    { type: "blank", text: "" },
    { type: "kv", text: "  coding      $ rm -rf impostor_syndrome && touch grass" },
    { type: "output", text: "               delete the inner critic, touch reality" },
    { type: "blank", text: "" },
    { type: "kv", text: "  internship  $ ssh placement@2027 -i private_key.pem" },
    { type: "output", text: "               connecting to the next chapter" },
    { type: "blank", text: "" },
    { type: "kv", text: "  approach    // $ nohup hustle && disown impostor_syndrome" },
    { type: "output", text: "               run hustle in the background, detach self-doubt" },
  ],

  hire: () => [
    { type: "info", text: "why hire Isaac" },
    { type: "blank", text: "" },
    { type: "output", text: "  → Electronic Engineering and Computer Science, Aston University" },
    { type: "output", text: "    predicted First Class" },
    { type: "blank", text: "" },
    { type: "output", text: "  → full stack: C, TypeScript, Python, Next.js, embedded systems" },
    { type: "output", text: "  → hardware: KiCad PCB design, AVR, ARM Cortex-M, ESP32" },
    { type: "output", text: "  → ML: TensorFlow, PyTorch, scikit-learn, anomaly detection" },
    { type: "blank", text: "" },
    { type: "output", text: "  → builds: PHAEMOS, MELOPHOS, Vitafolio, LidarSAT, git-unlocked" },
    { type: "output", text: "  → seeking a year-long placement from 2027" },
    { type: "blank", text: "" },
    { type: "kv", text: "  email    contact@isaacadjei.me" },
    { type: "kv", text: "  cv       run 'cv' to download" },
    { type: "kv", text: "  web      isaacadjei.me" },
  ],

  cv: () => [
    { type: "info", text: "downloading CV..." },
    { type: "blank", text: "" },
    { type: "output", text: "  opening isaacadjei.me/api/cv-pdf" },
    { type: "blank", text: "" },
    { type: "success", text: "  CV download started" },
  ],

  status: () => [
    { type: "info", text: "system status" },
    { type: "blank", text: "" },
    { type: "kv", text: "  isaacadjei-lab v1.0.0         running" },
    { type: "kv", text: "  portfolio                     live at isaacadjei.me" },
    { type: "kv", text: "  blog                          active" },
    { type: "kv", text: "  newsletter                    every couple of weeks" },
    { type: "kv", text: "  vitafolio                     live" },
    { type: "kv", text: "  phaemos and melophos          in progress" },
    { type: "blank", text: "" },
    { type: "success", text: "  all systems operational" },
    { type: "blank", text: "" },
    { type: "output", text: "  $ ssh placement@2027 -i private_key.pem" },
  ],

  approach: () => [
    { type: "info", text: "// my approach" },
    { type: "output", text: "  bool struggling = true;" },
    { type: "output", text: "  bool failing    = true;" },
    { type: "output", text: "  while (struggling || failing) {" },
    { type: "output", text: "      learn();      // grow from the struggle" },
    { type: "output", text: "      retry();      // push through failure" },
    { type: "output", text: "  }" },
    { type: "output", text: "  thrive();         // embrace growth" },
    { type: "output", text: "  succeed();        // achieve the goal" },
    { type: "output", text: '  printf("Mission accomplished.\\n");  // celebrate victory' },
  ],

  about: () => [
    { type: "info", text: "opening: isaacadjei.me/about" },
    { type: "output", text: "launching in new tab..." },
  ],
  projects: () => [
    { type: "info", text: "opening: isaacadjei.me/projects" },
    { type: "output", text: "launching in new tab..." },
  ],
  experience: () => [
    { type: "info", text: "opening: isaacadjei.me/experience" },
    { type: "output", text: "launching in new tab..." },
  ],
  skills: () => [
    { type: "info", text: "opening: isaacadjei.me/skills" },
    { type: "output", text: "launching in new tab..." },
  ],
  contact: () => [
    { type: "info", text: "opening: isaacadjei.me/contact" },
    { type: "output", text: "launching in new tab..." },
    { type: "output", text: "use the form for collaboration, research and project work" },
  ],
  links: () => [
    { type: "info", text: "opening: isaacadjei.me/links" },
    { type: "output", text: "launching in new tab..." },
  ],
  blog: () => [
    { type: "info", text: "opening: isaacadjei.me/blog" },
    { type: "output", text: "launching in new tab..." },
  ],
  blogfeed: () => [
    { type: "info", text: "opening: isaacadjei.me/blog/feed.xml" },
    { type: "output", text: "launching in new tab..." },
  ],
  tilfeed: () => [
    { type: "info", text: "opening: isaacadjei.me/til/feed.xml" },
    { type: "output", text: "launching in new tab..." },
  ],
  til: ({ latestTils: entries, tilCount }) => {
    return [
      { type: "info", text: `til - things I learned  (${tilCount} total)` },
      { type: "blank", text: "" },
      ...entries.map((e) => ({
        type: "output" as LineType,
        text: `  [${e.category}]  ${e.title}  · ${e.date}`,
      })),
      { type: "blank", text: "" },
      { type: "output", text: "  → isaacadjei.me/til" },
    ]
  },
  respub: () => [
    { type: "info", text: `research and publications  (${publications.length})` },
    { type: "blank", text: "" },
    ...publications.map((p) => ({
      type: "output" as LineType,
      text: `  [${p.year}]  ${p.title}  · ${p.venue}`,
    })),
    { type: "blank", text: "" },
    { type: "output", text: "  → isaacadjei.me/respub" },
  ],
  notes: () => [
    { type: "info", text: "opening: isaacadjei.me/notes" },
    { type: "output", text: "launching in new tab..." },
  ],
  newsletter: () => [
    { type: "info", text: "opening: isaacadjei.me/newsletter" },
    { type: "output", text: "launching in new tab..." },
  ],
  newsletterfeed: () => [
    { type: "info", text: "opening: isaacadjei.me/newsletter/feed.xml" },
    { type: "output", text: "launching in new tab..." },
  ],
  consumed: () => [
    { type: "info", text: "opening: isaacadjei.me/consumed" },
    { type: "output", text: "launching in new tab..." },
    { type: "output", text: "books, videos, podcasts, articles and resources" },
  ],
  pages: () => [
    { type: "info", text: "opening: isaacadjei.me/all-pages" },
    { type: "output", text: "launching in new tab..." },
    { type: "output", text: "every public page on this site in one place" },
  ],
  github: () => [
    { type: "info", text: "opening: github.com/zaccesss" },
    { type: "output", text: "launching in new tab..." },
  ],
  linkedin: () => [
    { type: "info", text: "opening: linkedin.com/in/isaacadjei" },
    { type: "output", text: "launching in new tab..." },
  ],
  collaborate: () => [
    { type: "info", text: "opening mail client" },
    { type: "output", text: "  to:      contact@isaacadjei.me" },
    { type: "output", text: "  subject: Collaboration Opportunity" },
  ],
  suggest: () => [
    { type: "info", text: "opening mail client" },
    { type: "output", text: "  to:      contact@isaacadjei.me" },
    { type: "output", text: "  subject: Blog Suggestion" },
  ],
}

type TheatricalStep = { line: Line; delay: number }
const THEATRICAL_COMMANDS: Record<string, TheatricalStep[]> = {
  hack: [
    { line: { type: "info",   text: "initiating sequence..." },                        delay: 0 },
    { line: { type: "output", text: "  > accessing mainframe..." },                    delay: 500 },
    { line: { type: "output", text: "  > bypassing firewall..." },                     delay: 1100 },
    { line: { type: "output", text: "  > decrypting vault..." },                       delay: 1800 },
    { line: { type: "blank",  text: "" },                                              delay: 2400 },
    { line: { type: "error",  text: "  ERROR 403: this terminal respects the law" },   delay: 2600 },
    { line: { type: "blank",  text: "" },                                              delay: 2600 },
    { line: { type: "output", text: "  nice try though." },                            delay: 2900 },
  ],

  coffee: [
    { line: { type: "info",    text: "brewing..." },                             delay: 0 },
    { line: { type: "blank",   text: "" },                                       delay: 300 },
    { line: { type: "output",  text: "  [          ] 0%" },                      delay: 400 },
    { line: { type: "output",  text: "  [==        ] 20%" },                     delay: 750 },
    { line: { type: "output",  text: "  [====      ] 40%" },                     delay: 1100 },
    { line: { type: "output",  text: "  [======    ] 60%" },                     delay: 1450 },
    { line: { type: "output",  text: "  [========  ] 80%" },                     delay: 1800 },
    { line: { type: "output",  text: "  [==========] 100%" },                    delay: 2150 },
    { line: { type: "blank",   text: "" },                                       delay: 2400 },
    { line: { type: "success", text: "  black coffee. no sugar. no milk." },     delay: 2600 },
    { line: { type: "output",  text: "  consistency fuel since 2019." },         delay: 2900 },
  ],

  decrypt: [
    { line: { type: "info",    text: "initiating decryption sequence..." },             delay: 0 },
    { line: { type: "blank",   text: "" },                                             delay: 300 },
    { line: { type: "output",  text: "  [###       ] decrypting block 1 of 3..." },    delay: 500 },
    { line: { type: "output",  text: "  [######    ] decrypting block 2 of 3..." },    delay: 1100 },
    { line: { type: "output",  text: "  [##########] decryption complete" },           delay: 1800 },
    { line: { type: "blank",   text: "" },                                             delay: 2100 },
    { line: { type: "success", text: "  ACCESS GRANTED" },                             delay: 2300 },
    { line: { type: "blank",   text: "" },                                             delay: 2500 },
    { line: { type: "info",    text: '  "build things that matter.' },                 delay: 2700 },
    { line: { type: "info",    text: '   everything else is noise."' },                delay: 3000 },
  ],

  matrix: [
    { line: { type: "system",  text: "01001000 01000101 01001100 01001100 01001111" }, delay: 0 },
    { line: { type: "system",  text: "01010000 01001000 01000001 01000101 01001101" }, delay: 300 },
    { line: { type: "system",  text: "01001111 01010011 00101011 00101011 01000011" }, delay: 600 },
    { line: { type: "blank",   text: "" },                                             delay: 900 },
    { line: { type: "success", text: "  wake up, Neo. the matrix has you." },          delay: 1100 },
    { line: { type: "blank",   text: "" },                                             delay: 1300 },
    { line: { type: "output",  text: "  jk. welcome to isaac's lab." },               delay: 1500 },
    { line: { type: "output",  text: "  you're already in the simulation." },          delay: 1800 },
  ],

  sudo: [
    { line: { type: "output",  text: "  [sudo] password for isaac:" },                delay: 0 },
    { line: { type: "output",  text: "  authenticating..." },                         delay: 800 },
    { line: { type: "blank",   text: "" },                                             delay: 1400 },
    { line: { type: "error",   text: "  sudo: permission denied" },                   delay: 1600 },
    { line: { type: "blank",   text: "" },                                             delay: 1600 },
    { line: { type: "output",  text: "  this terminal respects least privilege." },   delay: 1900 },
    { line: { type: "output",  text: "  nice try." },                                 delay: 2100 },
  ],

  zac: [
    { line: { type: "output",  text: "  scanning retina..." },                        delay: 0 },
    { line: { type: "output",  text: "  verifying identity..." },                     delay: 700 },
    { line: { type: "blank",   text: "" },                                             delay: 1300 },
    { line: { type: "success", text: "  ACCESS GRANTED." },                           delay: 1500 },
    { line: { type: "blank",   text: "" },                                             delay: 1700 },
    { line: { type: "output",  text: "  welcome to the inner circle." },              delay: 1900 },
    { line: { type: "output",  text: "  curiosity stat: +1" },                       delay: 2100 },
    { line: { type: "output",  text: "  perseverance stat: already maxed." },        delay: 2300 },
    { line: { type: "blank",   text: "" },                                             delay: 2500 },
    { line: { type: "output",  text: "  you found it. now go build something." },    delay: 2700 },
  ],

  make: [
    { line: { type: "info",    text: "building isaac..." },                            delay: 0 },
    { line: { type: "blank",   text: "" },                                             delay: 200 },
    { line: { type: "output",  text: "  CC     isaac.c -O2 -Wall" },                  delay: 350 },
    { line: { type: "output",  text: "  CC     curiosity.c -O2" },                    delay: 650 },
    { line: { type: "output",  text: "  CC     resilience.c -O2" },                   delay: 950 },
    { line: { type: "output",  text: "  LINK   isaac.o curiosity.o resilience.o" },   delay: 1350 },
    { line: { type: "output",  text: "  BUILD  isaac.exe" },                          delay: 1750 },
    { line: { type: "blank",   text: "" },                                             delay: 2100 },
    { line: { type: "output",  text: "  [##########] 100% build succeeded" },         delay: 2300 },
    { line: { type: "blank",   text: "" },                                             delay: 2600 },
    { line: { type: "success", text: "  ./isaac --mode=production --target=internship" }, delay: 2800 },
    { line: { type: "success", text: "  isaac deployed successfully." },               delay: 3100 },
  ],
}

function fmtSec(s: number): string {
  if (s < 60) return `${s}s`
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

function pctOf(part: number, total: number): string {
  if (total === 0) return "0%"
  return `${Math.round((part / total) * 100)}%`
}

const ASYNC_COMMANDS: Record<string, () => Promise<Line[]>> = {
  posts: async () => {
    const r = await fetch("/api/top-content")
    if (!r.ok) throw new Error("fetch failed")
    const d = await r.json() as {
      topBlog: { slug: string; reads: number; title: string }[]
      topTil: { slug: string; reads: number; title: string }[]
    }
    const lines: Line[] = [{ type: "info", text: "most read content" }, { type: "blank", text: "" }]
    if (d.topBlog.length > 0) {
      lines.push({ type: "info", text: "  blog posts" })
      for (const p of d.topBlog) {
        lines.push({ type: "output", text: `  [${p.reads} reads]  ${p.title}` })
      }
      lines.push({ type: "blank", text: "" })
    }
    if (d.topTil.length > 0) {
      lines.push({ type: "info", text: "  til entries" })
      for (const t of d.topTil) {
        lines.push({ type: "output", text: `  [${t.reads} reads]  ${t.title}` })
      }
      lines.push({ type: "blank", text: "" })
    }
    if (d.topBlog.length === 0 && d.topTil.length === 0) {
      lines.push({ type: "output", text: "  no read data yet - check back later" })
      lines.push({ type: "blank", text: "" })
    }
    lines.push({ type: "output", text: "  → isaacadjei.me/blog" })
    lines.push({ type: "output", text: "  → isaacadjei.me/til" })
    return lines
  },

  stats: async () => {
    const r = await fetch("/api/wakatime-stats?period=all")
    if (!r.ok) throw new Error("fetch failed")
    const d = await r.json() as {
      totalSeconds: number; dailyAvgSeconds: number; activeDays: number
      bestDaySeconds: number; bestDayDate: string; codingStreak: number
    }
    if (!("totalSeconds" in d)) throw new Error("invalid response")
    return [
      { type: "info", text: "coding stats - all time" },
      { type: "blank", text: "" },
      { type: "kv", text: `  total time    ${fmtSec(d.totalSeconds)}` },
      { type: "kv", text: `  daily avg     ${fmtSec(d.dailyAvgSeconds)}` },
      { type: "kv", text: `  active days   ${d.activeDays}` },
      { type: "kv", text: `  best day      ${fmtSec(d.bestDaySeconds)}${d.bestDayDate ? ` (${d.bestDayDate})` : ""}` },
      { type: "kv", text: `  streak        ${d.codingStreak} day${d.codingStreak !== 1 ? "s" : ""}` },
      { type: "blank", text: "" },
      { type: "output", text: "  run 'languages', 'vscode', 'os' for breakdowns" },
    ]
  },

  streak: async () => {
    const r = await fetch("/api/wakatime-stats?period=all")
    if (!r.ok) throw new Error("fetch failed")
    const d = await r.json() as { codingStreak: number; activeDays: number }
    if (!("codingStreak" in d)) throw new Error("invalid response")
    const active = d.codingStreak > 0
    return [
      { type: "info", text: "coding streak" },
      { type: "blank", text: "" },
      { type: "kv", text: `  current       ${d.codingStreak} day${d.codingStreak !== 1 ? "s" : ""}` },
      { type: "kv", text: `  status        ${active ? "active" : "build something today"}` },
      { type: "blank", text: "" },
      active
        ? { type: "success", text: "  keep shipping." }
        : { type: "output", text: "  streaks are rebuilt one commit at a time." },
    ]
  },

  today: async () => {
    const r = await fetch("/api/wakatime-stats?period=24h")
    if (!r.ok) throw new Error("fetch failed")
    const d = await r.json() as {
      totalSeconds: number
      languages: { name: string; total_seconds: number }[]
      projects: { name: string; total_seconds: number }[]
    }
    if (!("totalSeconds" in d)) throw new Error("invalid response")
    const topLang = d.languages?.[0]
    const topProj = d.projects?.[0]
    return [
      { type: "info", text: "coding today - last 24 hours" },
      { type: "blank", text: "" },
      { type: "kv", text: `  time coded    ${fmtSec(d.totalSeconds)}` },
      ...(topLang ? [{ type: "kv" as LineType, text: `  top language  ${topLang.name}  (${fmtSec(topLang.total_seconds)})` }] : []),
      ...(topProj ? [{ type: "kv" as LineType, text: `  top project   ${topProj.name}  (${fmtSec(topProj.total_seconds)})` }] : []),
      { type: "blank", text: "" },
      d.totalSeconds > 0
        ? { type: "success", text: "  coding today. good." }
        : { type: "output", text: "  no coding recorded yet today." },
    ]
  },

  languages: async () => {
    const r = await fetch("/api/wakatime-stats?period=30d")
    if (!r.ok) throw new Error("fetch failed")
    const d = await r.json() as {
      totalSeconds: number
      languages: { name: string; total_seconds: number }[]
    }
    if (!("languages" in d)) throw new Error("invalid response")
    const langs = d.languages.slice(0, 6)
    return [
      { type: "info", text: "top languages - last 30 days" },
      { type: "blank", text: "" },
      ...langs.map((l) => ({
        type: "kv" as LineType,
        text: `  ${l.name.padEnd(14)}  ${pctOf(l.total_seconds, d.totalSeconds).padStart(4)}  (${fmtSec(l.total_seconds)})`,
      })),
      { type: "blank", text: "" },
      { type: "output", text: "  run 'stats' for full coding overview" },
    ]
  },

  vscode: async () => {
    const r = await fetch("/api/wakatime-stats?period=all")
    if (!r.ok) throw new Error("fetch failed")
    const d = await r.json() as {
      totalSeconds: number
      editors: { name: string; total_seconds: number }[]
    }
    if (!("editors" in d)) throw new Error("invalid response")
    const editors = d.editors.slice(0, 5)
    return [
      { type: "info", text: "editor breakdown - all time" },
      { type: "blank", text: "" },
      ...editors.map((e) => ({
        type: "kv" as LineType,
        text: `  ${e.name.padEnd(14)}  ${pctOf(e.total_seconds, d.totalSeconds).padStart(4)}  (${fmtSec(e.total_seconds)})`,
      })),
    ]
  },

  os: async () => {
    const r = await fetch("/api/wakatime-stats?period=all")
    if (!r.ok) throw new Error("fetch failed")
    const d = await r.json() as {
      totalSeconds: number
      operatingSystems: { name: string; total_seconds: number }[]
    }
    if (!("totalSeconds" in d)) throw new Error("invalid response")
    const osList = (d.operatingSystems ?? []).slice(0, 5)
    const lines: Line[] = [
      { type: "info", text: "operating system - all time" },
      { type: "blank", text: "" },
    ]
    if (osList.length > 0) {
      for (const os of osList) {
        const pct = d.totalSeconds > 0 ? Math.round((os.total_seconds / d.totalSeconds) * 100) : 0
        lines.push({ type: "kv", text: `  ${os.name.padEnd(14)} ${fmtSec(os.total_seconds)}  (${pct}%)` })
      }
    } else {
      lines.push({ type: "kv", text: "  macOS         primary development environment" })
      lines.push({ type: "kv", text: "  Windows       Lenovo + gaming PC setup" })
      lines.push({ type: "kv", text: "  Linux         embedded and server work" })
    }
    lines.push({ type: "blank", text: "" })
    lines.push({ type: "output", text: `  total coding time: ${fmtSec(d.totalSeconds)}` })
    return lines
  },

  playing: async () => {
    const res = await fetch("/api/spotify")
    const d = await res.json() as {
      playing?: boolean; paused?: boolean; type?: string;
      track?: string; artist?: string;
      lastPlayed?: { track: string; artist: string; type: string } | null
    }
    if (d.playing || d.paused) {
      const label = d.type === "episode" ? "podcast" : "track"
      const state = d.playing ? "● now playing" : "❙❙ paused"
      return [
        { type: "info", text: `spotify - ${state}` },
        { type: "blank", text: "" },
        { type: "output", text: `  [${label}]  ${d.track}` },
        { type: "output", text: `  by  ${d.artist}` },
      ]
    }
    if (d.lastPlayed) {
      const label = d.lastPlayed.type === "episode" ? "podcast" : "track"
      return [
        { type: "info", text: "spotify - last played" },
        { type: "blank", text: "" },
        { type: "output", text: `  [${label}]  ${d.lastPlayed.track}` },
        { type: "output", text: `  by  ${d.lastPlayed.artist}` },
      ]
    }
    return [{ type: "output", text: "  nothing playing right now" }]
  },

  lastgame: async () => {
    const res = await fetch("/api/ps5")
    const d = await res.json() as {
      online?: boolean; game?: string | null; lastGame?: string | null; lastSeen?: string | null
    }
    const game = d.online ? d.game : (d.lastGame ?? null)
    if (!game) return [{ type: "output", text: "  no game data available" }]
    const state = d.online ? "● online now" : `last seen ${d.lastSeen ? new Date(d.lastSeen).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "recently"}`
    return [
      { type: "info", text: `ps5 - ${state}` },
      { type: "blank", text: "" },
      { type: "output", text: `  ${game}` },
    ]
  },

  pushed: async () => {
    const res = await fetch("/api/github-activity")
    const d = await res.json() as { repo?: string | null; relativeTime?: string | null }
    if (!d.repo) return [{ type: "output", text: "  no recent push found" }]
    return [
      { type: "info", text: "github - last push" },
      { type: "blank", text: "" },
      { type: "output", text: `  ${d.repo}` },
      { type: "output", text: `  ${d.relativeTime ?? "recently"}` },
    ]
  },
}

const TONE: Record<Tone | "black", string> = {
  fg: s.fg,
  bold: s.bold,
  dim: s.dim,
  red: s.red,
  green: s.green,
  yellow: s.yellow,
  blue: s.blue,
  magenta: s.magenta,
  cyan: s.cyan,
  white: s.white,
  black: s.black,
}

const LINE = `${s.line} leading-relaxed`

function splitPair(text: string): { indent: string; key: string; val: string } | null {
  const indent = text.slice(0, Math.max(0, text.search(/\S/)))
  const rest = text.trimStart()
  const idx = rest.search(/\s{2,}/)
  if (idx < 0) return null
  return { indent, key: rest.slice(0, idx), val: rest.slice(idx).trimStart() }
}

function PromptMeta() {
  return (
    <span aria-hidden="true">
      <span className={s.blue + " font-bold"}>{PROMPT_DIR}</span>
      <span className={s.fg}> on </span>
      <span className={s.cyan + " font-bold"}>{PROMPT_BRANCH}</span>
    </span>
  )
}

function renderLine(line: Line, i: number) {
  if (line.type === "blank") return <div key={i} className="h-2" />

  if (line.type === "rule") {
    return <div key={i} className={`${s.rule} ${s.fg} leading-relaxed`} aria-hidden="true">{line.text}</div>
  }

  if (line.type === "banner") {
    return (
      <div key={i} className={`${LINE} ${TONE[line.tone ?? "fg"]} ${line.bold ? "font-bold" : ""}`}>
        {line.text}
      </div>
    )
  }

  if (line.type === "title") {
    return <div key={i} className={`${LINE} ${s.cyan} font-bold`}>{line.text}</div>
  }

  if (line.type === "heading") {
    return <div key={i} className={`${LINE} ${s.magenta} font-bold`}>{line.text}</div>
  }

  if (line.type === "legend") {
    if (line.text) return <div key={i} className={`${LINE} ${s.white} font-bold`}>{line.text}</div>
    return (
      <div key={i} className={LINE}>
        {"  "}
        <span className={s.magenta}>magenta = category</span>
        {"   "}
        <span className={s.cyan}>cyan = commands</span>
        {"   "}
        <span className={s.white}>white = descriptions</span>
      </div>
    )
  }

  if (line.type === "swatch") {
    const [name, dark, light, tone] = line.text.split("|")
    return (
      <div key={i} className={LINE}>
        {"  "}
        <span className={s.swatch} style={{ background: `var(--t-${tone})` }} aria-hidden="true" />
        {" "}
        <span className={`${TONE[tone as Tone | "black"] ?? s.fg} font-bold`}>{name.padEnd(9)}</span>
        <span className={s.fg}>{dark}</span>
        {"  "}
        <span className={s.fg}>{light}</span>
      </div>
    )
  }

  if (line.type === "link") {
    const url = line.text.trim()
    const href = url.startsWith("http") ? url : `https://${url}`
    return (
      <a
        key={i}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`block pl-4 py-0.5 ${LINE} ${s.link}`}
      >
        {url}
      </a>
    )
  }

  if (line.type === "cmd-echo") {
    return (
      <div key={i} className={`${LINE} mt-1`}>
        <PromptMeta />
        <br aria-hidden="true" />
        <span className={`${s.green} font-bold`} aria-hidden="true">{"> "}</span>
        <span className="sr-only">command: </span>
        <span className={s.bold}>{line.text}</span>
      </div>
    )
  }

  if (line.type === "kv" || line.type === "pair") {
    const parts = splitPair(line.text)
    if (parts) {
      return (
        <div key={i} className={LINE}>
          {parts.indent}
          <span className={s.cyan}>{parts.key}</span>
          {"  "}
          <span className={line.type === "kv" ? s.yellow : s.white}>{parts.val}</span>
        </div>
      )
    }
    return <div key={i} className={`${LINE} ${s.yellow}`}>{line.text}</div>
  }

  if (line.type === "cmd-list") {
    const match = line.text.match(/^(\s*)(\S+(?: \S+)?)(\s+-\s+)(.*)$/)
    if (match) {
      return (
        <div key={i} className={LINE}>
          {match[1]}
          <span className={`${s.green} font-bold`}>{match[2]}</span>
          <span className={s.dim}>{match[3]}</span>
          <span className={s.white}>{match[4]}</span>
        </div>
      )
    }
  }

  const cls =
    line.type === "system"
      ? s.white
      : line.type === "info"
        ? s.cyan
        : line.type === "error"
          ? s.red
          : line.type === "success"
            ? `${s.green} font-bold`
            : s.fg

  const parts = line.text.split(/(→|● live|'[a-z-]+(?: [a-z-]+)?')/)
  return (
    <div key={i} className={`${LINE} ${cls}`}>
      {parts.map((part, j) =>
        part === "→" ? (
          <span key={j} className={s.cyan}>{"→"}</span>
        ) : part === "● live" ? (
          <span key={j} className={s.green}>{"● live"}</span>
        ) : part.length > 2 && part.startsWith("'") && part.endsWith("'") ? (
          <span key={j} className={`${s.green} font-bold`}>{part.slice(1, -1)}</span>
        ) : (
          <span key={j}>{part}</span>
        )
      )}
    </div>
  )
}

const EDITOR_HELP = "Type :q and press Enter to return to the shell. Escape also returns."

function NvimView({ editor, heightClass }: { editor: EditorState; heightClass: string }) {
  const filler = Math.max(0, 18 - editor.lines.length)
  return (
    <div
      role="region"
      aria-label={`nvim: ${editor.file}, read-only`}
      className={`flex flex-col pt-2 ${heightClass}`}
    >
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-1 sm:px-2">
        {editor.lines.map((text, n) => (
          <div key={n} className={`${LINE} flex`}>
            <span className={`${s.white} shrink-0 w-[6ch] pr-[1ch] ${n === 0 ? `text-left ${s.yellow} font-bold` : "text-right"}`} aria-hidden="true">
              {n === 0 ? 1 : n}
            </span>
            <span className={`${n === 0 ? s.cursorLine : ""} ${text.startsWith("#") ? `${s.magenta} font-bold` : s.fg} flex-1 min-w-0`}>
              {text || " "}
            </span>
          </div>
        ))}
        {Array.from({ length: filler }, (_, n) => (
          <div key={`f${n}`} className={`${LINE} ${s.blue}`} aria-hidden="true">
            ~
          </div>
        ))}
      </div>
      <div className={`${s.nvimStatus} flex items-stretch text-xs leading-6 shrink-0`} aria-hidden="true">
        <span className={`${s.nvimMode} px-2 font-bold`}>NORMAL</span>
        <span className={`${s.nvimB} px-2`}>{PROMPT_BRANCH}</span>
        <span className="px-2 flex-1 min-w-0 truncate">{editor.file} [-]</span>
        <span className="px-2 hidden sm:inline">utf-8  unix  {editor.filetype}</span>
        <span className={`${s.nvimB} px-2`}>Top</span>
        <span className={`${s.nvimMode} px-2 font-bold`}>1:1</span>
      </div>
      <div className={`${LINE} ${editor.message.startsWith("E") ? s.red : s.fg} shrink-0 px-1 sm:px-2`}>{editor.message}</div>
    </div>
  )
}

function TmuxBar({ window, clock }: { window: string; clock: string | null }) {
  return (
    <div className={`${s.tmux} flex items-center justify-between gap-2 px-2 text-xs leading-6 shrink-0`} aria-hidden="true">
      <span className="truncate min-w-0">
        <span className="font-bold">{TMUX_SESSION}</span>{" "}
        <span className={`${s.tmuxCurrent} font-bold`}>{`1:${window}*`}</span>{" "}
        <span>2:zsh-</span>
      </span>
      <span className="shrink-0">{clock ?? ""}</span>
    </div>
  )
}

export default function LabPage({ data }: { data: LabData }) {
  const [lines, setLines] = useState<Line[]>([])
  const [phase, setPhase] = useState<"start" | "login" | "intro" | "ready">("start")
  const [name, setName] = useState(DEFAULT_NAME)
  const booted = phase === "login" || phase === "ready"
  const asking = phase === "login"
  const [inputVal, setInputVal] = useState("")
  const [editor, setEditor] = useState<EditorState | null>(null)
  const [srStatus, setSrStatus] = useState("")
  const [clock, setClock] = useState<string | null>(null)
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const [winState, setWinState] = useState<WindowState>("normal")
  const inputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const promptRef = useRef<HTMLFormElement>(null)
  const { modLabel } = useModKey()

  useEffect(() => {
    const t = setTimeout(() => {
      const stored = loadName()
      if (stored) {
        setName(stored)
        setPhase("intro")
      } else {
        setLines(LOGIN_LINES)
        setPhase("login")
      }
    }, 0)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (phase !== "intro") return
    const steps = introSteps(name)
    const timers: ReturnType<typeof setTimeout>[] = []
    if (prefersReducedMotion()) {
      timers.push(
        setTimeout(() => {
          setLines((prev) => [...prev, ...steps.map(([line]) => line)])
          setPhase("ready")
        }, 0)
      )
    } else {
      let at = 0
      for (const [line, pause] of steps) {
        timers.push(setTimeout(() => setLines((prev) => [...prev, line]), at))
        at += pause
      }
      timers.push(setTimeout(() => setPhase("ready"), at))
    }
    return () => timers.forEach(clearTimeout)
  }, [phase, name])

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      setClock(`${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`)
    }
    const first = setTimeout(tick, 0)
    const timer = setInterval(tick, 15_000)
    return () => {
      clearTimeout(first)
      clearInterval(timer)
    }
  }, [])

  const closeEditor = () => {
    setEditor(null)
    setInputVal("")
    setSrStatus("Closed nvim. Back in the shell.")
  }

  const editorCommand = (raw: string) => {
    const c = raw.trim()
    setInputVal("")
    if (/^:(q|q!|wq|wq!|x|x!|qa|qa!)$/.test(c)) {
      closeEditor()
      return
    }
    let message: string
    if (/^:w/.test(c)) message = "E45: 'readonly' option is set (add ! to override)"
    else if (/^[iaoIAOs]$/.test(c)) message = "E21: Cannot make changes, 'modifiable' is off"
    else if (c.startsWith(":")) message = `E492: Not an editor command: ${c.slice(1)}`
    else message = "type :q and press Enter to quit"
    setEditor((prev) => (prev ? { ...prev, message } : prev))
    setSrStatus(message)
  }

  const submitName = (raw: string) => {
    const chosen = cleanName(raw)
    saveName(chosen)
    setName(chosen)
    setInputVal("")
    setLines((prev) => [...prev, { type: "output", text: `login: ${chosen}` }])
    setPhase("intro")
  }

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [lines])

  useEffect(() => {
    if (booted && inputRef.current && !isCoarsePointer()) {
      inputRef.current.focus({ preventScroll: true })
    }
  }, [booted])

  useEffect(() => {
    const vv = typeof window !== "undefined" ? window.visualViewport : null
    if (!vv) return
    const onResize = () => {
      if (document.activeElement === inputRef.current) {
        promptRef.current?.scrollIntoView({ block: "nearest" })
      }
    }
    vv.addEventListener("resize", onResize)
    return () => vv.removeEventListener("resize", onResize)
  }, [])

  const execCommand = useCallback((raw: string) => {
    const typed = raw.trim()
    const first = (typed.split(/\s+/)[0] ?? "").toLowerCase()
    const trimmed = ALIASES[first] ? ALIASES[first] + typed.slice(first.length) : typed
    const cmd = trimmed.toLowerCase()

    if (!cmd) {
      setLines((prev) => [...prev, { type: "blank", text: "" }])
      return
    }

    setCmdHistory((prev) => [typed, ...prev])
    setHistIdx(-1)
    setInputVal("")

    if (cmd === "clear") {
      setLines([])
      return
    }

    if (cmd === "cls") {
      setLines(bannerLines(name))
      return
    }

    const nameCmd = /^(name|login)(?:\s+(.*))?$/i.exec(trimmed)
    if (nameCmd) {
      if (nameCmd[2]?.trim()) {
        const chosen = cleanName(nameCmd[2])
        saveName(chosen)
        setName(chosen)
        setLines((prev) => [
          ...prev,
          { type: "cmd-echo", text: typed },
          { type: "output", text: `  you are now ${chosen}` },
          ...bannerLines(chosen),
        ])
      } else {
        setLines((prev) => [...prev, { type: "cmd-echo", text: typed }, ...LOGIN_LINES])
        setPhase("login")
      }
      return
    }

    if (cmd === "tmux" || cmd.startsWith("tmux ")) {
      setLines((prev) => [
        ...prev,
        { type: "cmd-echo", text: typed },
        ...tmuxLines(trimmed, new Date(performance.timeOrigin)),
        { type: "blank", text: "" },
      ])
      return
    }

    if (cmd === "nvim" || cmd.startsWith("nvim ")) {
      const opened = openFile(trimmed.slice(4))
      if (!opened) {
        setLines((prev) => [
          ...prev,
          { type: "cmd-echo", text: typed },
          { type: "error", text: `nvim: no file called '${trimmed.slice(5).trim()}' in this lab` },
          { type: "output", text: `  try: ${Object.keys(NVIM_FILES).join(", ")}` },
          { type: "blank", text: "" },
        ])
        return
      }
      setLines((prev) => [...prev, { type: "cmd-echo", text: typed }])
      setEditor(opened)
      setSrStatus(`Opened ${opened.file} in nvim, read-only. ${EDITOR_HELP}`)
      return
    }

    if (cmd === "git" || cmd.startsWith("git ")) {
      setLines((prev) => [...prev, { type: "cmd-echo", text: typed }, ...gitLines(trimmed), { type: "blank", text: "" }])
      return
    }

    if (cmd.startsWith("echo ")) {
      setLines((prev) => [
        ...prev,
        { type: "cmd-echo", text: typed },
        { type: "output", text: `  ${trimmed.slice(5)}` },
        { type: "blank", text: "" },
      ])
      return
    }

    if (THEATRICAL_COMMANDS[cmd]) {
      const steps = THEATRICAL_COMMANDS[cmd]
      if (prefersReducedMotion()) {
        setLines((prev) => [
          ...prev,
          { type: "cmd-echo", text: typed },
          ...steps.map((st) => st.line),
          { type: "blank", text: "" },
        ])
        return
      }
      setLines((prev) => [...prev, { type: "cmd-echo", text: typed }])
      const maxDelay = Math.max(...steps.map((st) => st.delay))
      steps.forEach(({ line, delay }) => {
        setTimeout(() => setLines((prev) => [...prev, line]), delay)
      })
      setTimeout(() => setLines((prev) => [...prev, { type: "blank", text: "" }]), maxDelay + 150)
      return
    }

    if (ASYNC_COMMANDS[cmd]) {
      setLines((prev) => [
        ...prev,
        { type: "cmd-echo", text: typed },
        { type: "info", text: "  fetching..." },
        { type: "blank", text: "" },
      ])
      ASYNC_COMMANDS[cmd]()
        .then((output) => {
          setLines((prev) => [...prev.slice(0, -2), ...output, { type: "blank", text: "" }])
        })
        .catch(() => {
          setLines((prev) => [
            ...prev.slice(0, -2),
            { type: "error", text: "  fetch failed - check your connection" },
            { type: "blank", text: "" },
          ])
        })
      return
    }

    const output: Line[] = COMMANDS[cmd]
      ? cmd === "whoami"
        ? withVisitor(COMMANDS[cmd](data), name)
        : COMMANDS[cmd](data)
      : [
          { type: "error", text: `zsh: command not found: ${cmd}` },
          { type: "output", text: "  type 'help' to see available commands" },
        ]

    const redirectUrl = NAV_COMMANDS[cmd]
    if (redirectUrl) window.open(redirectUrl, "_blank", "noopener,noreferrer")

    const mailUrl = MAIL_COMMANDS[cmd]
    if (mailUrl) window.open(mailUrl, "_blank", "noopener,noreferrer")

    setLines((prev) => [
      ...prev,
      { type: "cmd-echo", text: typed },
      ...output,
      { type: "blank", text: "" },
    ])
  }, [data, name])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      const idx = Math.min(histIdx + 1, cmdHistory.length - 1)
      setHistIdx(idx)
      if (cmdHistory[idx] !== undefined) setInputVal(cmdHistory[idx])
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      const idx = Math.max(histIdx - 1, -1)
      setHistIdx(idx)
      setInputVal(idx === -1 ? "" : cmdHistory[idx])
    }
  }

  const isMaximized = winState === "maximized"
  const isMinimized = winState === "minimized"
  const isClosed = winState === "closed"

  return (
    <div className="container max-w-3xl max-sm:px-4 py-24 space-y-8">
      {!isMaximized && !isClosed && (
        <>
          <div className="text-center space-y-1">
            <p className="font-mono text-sm font-semibold tracking-widest uppercase text-yellow-500">
              ⚠️ lab // work in progress ⚠️
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              terminal, PCB viewer and hardware · more experiments incoming
            </p>
          </div>
          <div className="flex justify-center">
            <div className="rounded-lg border border-border/60 overflow-hidden">
              <Image
                src="/Media/giphy.gif"
                alt="Under construction"
                width={320}
                height={180}
                className="w-full max-w-[320px] h-auto object-cover"
                sizes="(max-width: 640px) 100vw, 320px"
                priority
                unoptimized
              />
            </div>
          </div>
        </>
      )}

      {!isClosed ? (
        <section
          aria-label="Interactive terminal"
          onKeyDown={(e) => {
            if (e.key === "Escape" && editor) {
              e.preventDefault()
              closeEditor()
            }
          }}
          className={`${s.term} font-mono text-[13px] min-w-0 ${
            isMaximized
              ? "fixed top-16 inset-x-0 bottom-0 z-50 flex flex-col mt-0!"
              : "rounded-lg border overflow-hidden shadow-xl"
          }`}
        >
          <div className={`${s.chrome} flex items-center justify-between gap-2 px-2 sm:px-3 py-1 border-b shrink-0`}>
            <div className="flex items-center shrink-0">
              <button
                type="button"
                title="Close terminal"
                aria-label="Close terminal"
                onClick={() => setWinState("closed")}
                className="grid place-items-center h-7 w-7 cursor-pointer"
              >
                <span className="h-3 w-3 rounded-full" style={{ background: "var(--t-red)" }} />
              </button>
              <button
                type="button"
                title="Minimise terminal"
                aria-label={isMinimized ? "Restore terminal" : "Minimise terminal"}
                onClick={() => setWinState(isMinimized ? "normal" : "minimized")}
                className="grid place-items-center h-7 w-7 cursor-pointer"
              >
                <span className="h-3 w-3 rounded-full" style={{ background: "var(--t-yellow)" }} />
              </button>
              <button
                type="button"
                title="Maximise terminal"
                aria-label={isMaximized ? "Restore terminal size" : "Maximise terminal"}
                onClick={() => setWinState(isMaximized ? "normal" : "maximized")}
                className="grid place-items-center h-7 w-7 cursor-pointer"
              >
                <span className="h-3 w-3 rounded-full" style={{ background: "var(--t-green)" }} />
              </button>
            </div>
            <span className="text-xs truncate min-w-0" aria-hidden="true">
              {nameHandle(name)}@isaacadjei.me - zsh<span className="hidden sm:inline"> - 80x24</span>
            </span>
            <span className="w-7 sm:w-21 shrink-0" />
          </div>

          {!isMinimized && (
            <div className={`${s.body} flex flex-col min-h-0 ${isMaximized ? "flex-1" : ""}`}>
              {editor ? (
                <NvimView editor={editor} heightClass={isMaximized ? "flex-1 min-h-0" : "h-[52svh] max-h-[420px] min-h-[260px] sm:h-[440px] sm:max-h-none"} />
              ) : (
                <div
                  ref={bodyRef}
                  role="log"
                  aria-label="Terminal output"
                  aria-live="polite"
                  aria-relevant="additions"
                  onClick={() => {
                    if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true })
                  }}
                  className={`px-3 sm:px-5 pt-3 sm:pt-4 pb-1 overflow-y-auto overflow-x-hidden overscroll-contain cursor-text select-text ${
                    isMaximized ? "flex-1 min-h-0" : "h-[52svh] max-h-[420px] min-h-[260px] sm:h-[440px] sm:max-h-none"
                  }`}
                >
                  {lines.map((line, i) => renderLine(line, i))}
                </div>
              )}
              <p className="sr-only" aria-live="polite">
                {srStatus}
              </p>

              {booted && (
                <form
                  ref={promptRef}
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (asking) submitName(inputVal)
                    else if (editor) editorCommand(inputVal)
                    else execCommand(inputVal)
                  }}
                  className="px-3 sm:px-5 pt-1 pb-2 shrink-0"
                >
                  {!asking && !editor && (
                    <div className="leading-relaxed">
                      <PromptMeta />
                    </div>
                  )}
                  <div className={`${s.promptRow} flex items-center min-h-11`}>
                    <span className={`${asking ? s.cyan : s.green} font-bold shrink-0 whitespace-pre`} aria-hidden="true">
                      {asking ? "login: " : editor ? "" : "> "}
                    </span>
                    <label htmlFor="lab-terminal-input" className="sr-only">
                      {asking
                        ? `Your name. Type what this terminal should call you and press Enter. Leave it empty to stay as ${DEFAULT_NAME}.`
                        : editor
                          ? `Neovim command line for ${editor.file}, read-only. ${EDITOR_HELP}`
                          : "Terminal command. Type a command such as help and press Enter."}
                    </label>
                    <input
                      id="lab-terminal-input"
                      ref={inputRef}
                      type="text"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (!asking && !editor) onKeyDown(e)
                      }}
                      maxLength={asking ? 64 : undefined}
                      onFocus={() => {
                        setTimeout(() => promptRef.current?.scrollIntoView({ block: "nearest" }), 300)
                      }}
                      enterKeyHint={asking ? "done" : "go"}
                      autoCapitalize={asking ? "words" : "none"}
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      className={`${s.input} flex-1 min-w-0 h-11 p-0 border-0 text-base sm:text-[13px] outline-hidden`}
                    />
                  </div>
                </form>
              )}
              <TmuxBar window={editor ? "nvim" : "zsh"} clock={clock} />
            </div>
          )}
        </section>
      ) : (
        <div className="flex justify-center py-4">
          <button
            type="button"
            onClick={() => setWinState("normal")}
            className="font-mono text-xs text-muted-foreground hover:text-foreground border border-border rounded px-4 py-2 min-h-11 transition-colors"
          >
            restore terminal ↩
          </button>
        </div>
      )}

      {!isMaximized && <PCBViewer />}

      {!isMaximized && (
        <p className="text-center text-xs text-muted-foreground font-mono">
          GitHub, coding, music and gaming stats moved to{" "}
          <Link href="/stats" className="text-primary hover:underline">
            /stats
          </Link>
        </p>
      )}

      {!isMaximized && <BrailleDivider className="max-w-md mx-auto pt-2" />}

      {!isMaximized && (
        <p className="text-center text-xs text-muted-foreground font-mono">
          use{" "}
          <kbd suppressHydrationWarning className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px]">
            {modLabel}
          </kbd>{" "}
          +{" "}
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px]">I</kbd>{" "}
          to navigate the site
        </p>
      )}
    </div>
  )
}
