const AI_CLIENT = /claude|codex|copilot|gemini|opencode|\bamp\b|unknown editor/i

export function isAiClient(name: string): boolean {
  return AI_CLIENT.test(name)
}

const NON_CODING_APP = /discord|slack|whatsapp|telegram|signal|zoom|teams|imessage|^messages$|facetime|chrome|safari|firefox|edge|^arc$|brave|spotify|^mail$|outlook/i

export function isNonCodingApp(name: string): boolean {
  return NON_CODING_APP.test(name.trim())
}

const VS_CODE_FORKS = new Set(["vs code", "visual studio code", "cursor", "antigravity", "antigravity ide"])

export function publicEditorName(name: string): string {
  return isAiClient(name) || VS_CODE_FORKS.has(name.trim().toLowerCase()) ? "VS Code" : name
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

export function publicCodingDay<T extends CodingDay>(day: T): T {
  const editors = day.editors ?? []
  const other = editors.filter((e) => isNonCodingApp(e.name)).reduce((a, e) => a + e.total_seconds, 0)
  const systems = (day.operating_systems ?? []).filter((o) => o.name !== "Unknown OS")
  if (other <= 0 || day.total_seconds <= 0) return { ...day, operating_systems: day.operating_systems && systems }
  const coding = Math.max(0, day.total_seconds - other)
  const share = coding / day.total_seconds
  const scale = (list?: Slice[] | null) =>
    list?.map((x) => ({ ...x, total_seconds: x.total_seconds * share })).filter((x) => x.total_seconds > 0) ?? list
  return {
    ...day,
    total_seconds: coding,
    editors: editors.filter((e) => !isNonCodingApp(e.name)),
    languages: scale(day.languages),
    projects: scale(day.projects),
    operating_systems: scale(day.operating_systems && systems),
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

const MACBOOK = /^(mac|mac\.home|mac\.localdomain|mac\.campus\.aston\.ac\.uk|isaacs-macbook-air\.local|zaccess-mbk\.local)$/i

export function machineName(name: string): string {
  return MACBOOK.test(name.trim()) ? "ZACCESS-MBK" : name
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
