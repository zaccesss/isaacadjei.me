const AI_CLIENT = /claude|codex|copilot|gemini|opencode|\bamp\b|unknown editor/i

export function isAiClient(name: string): boolean {
  return AI_CLIENT.test(name)
}

const VS_CODE_FORKS = new Set(["vs code", "visual studio code", "cursor", "antigravity", "antigravity ide"])

export function publicEditorName(name: string): string {
  return VS_CODE_FORKS.has(name.trim().toLowerCase()) ? "VS Code" : name
}

type Slice = { name: string; total_seconds: number }
type CodingDay = {
  total_seconds: number
  editors?: Slice[] | null
  languages?: Slice[] | null
  projects?: Slice[] | null
  operating_systems?: Slice[] | null
  hours?: number[] | null
}

export function humanCodingDay<T extends CodingDay>(day: T): T {
  const editors = day.editors ?? []
  const ai = editors.filter((e) => isAiClient(e.name)).reduce((a, e) => a + e.total_seconds, 0)
  if (ai <= 0 || day.total_seconds <= 0) return day
  const human = Math.max(0, day.total_seconds - ai)
  const share = human / day.total_seconds
  const scale = (list?: Slice[] | null) =>
    list?.map((x) => ({ ...x, total_seconds: x.total_seconds * share })).filter((x) => x.total_seconds > 0) ?? list
  return {
    ...day,
    total_seconds: human,
    editors: editors.filter((e) => !isAiClient(e.name)),
    languages: scale(day.languages),
    projects: scale(day.projects),
    operating_systems: scale(day.operating_systems),
    hours: day.hours?.map((h) => (h ?? 0) * share) ?? day.hours,
  }
}

const SITE_REPOSITORY = process.env.VERCEL_GIT_REPO_SLUG
const PUBLIC_PROJECTS = new Set([
  "DG1AID-Labs", "astoncv", "avr-zac", "code-of-conduct", "competitive-programming",
  "competitive-programming-templates", "contribute", "dotfiles", "email-setup-kit", "git-hooks",
  "git-practice-lab", "git-unlocked", "isaac-adjei-automations", "isaac-adjei-portfolio-discussions",
  "isaacadjei.me", "latex-cv", "linux-bootstrap", "mac-bootstrap", "melophos", "neopixel-led-cube", "phaemos",
  "py-video", "security-policy", "two-stage-audio-amplifier", "vitafolio", "vscode-config", "windows-bootstrap",
  "zaccesss", "zacess", "zacess-pages",
])

export function publicProjectName(name: string): string | null {
  if (SITE_REPOSITORY && name === SITE_REPOSITORY) return "isaacadjei.me"
  return PUBLIC_PROJECTS.has(name) ? name : null
}

const MACHINE_ALIASES: Record<string, string> = {
  "zaccess-mbk.local": "ZACCESS-MBK",
  "mac.home": "ZACCESS-MBK",
  "isaacs-macbook-air.local": "ZACCESS-MBK",
}

export function machineName(name: string): string {
  return MACHINE_ALIASES[name.trim().toLowerCase()] ?? name
}

export function languageName(name: string): string {
  return name === "Text" ? "Plain text" : name
}

const DEPENDENCY_PARENTS: Record<string, string> = { link: "next", server: "next" }
const OWN_FILES = new Set(["index"])

export function dependencyName(name: string): string | null {
  if (OWN_FILES.has(name)) return null
  return DEPENDENCY_PARENTS[name] ?? name
}
