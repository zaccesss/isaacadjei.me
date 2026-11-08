import type { CSSProperties } from "react"
import type { Line, Tone } from "./types"

export interface ZacessTheme {
  id: string
  short: string
  name: string
  appearance: "light" | "dark"
  bg: string
  fg: string
  surface: string
  border: string
  selection: string
  muted: string
  line: string
  ansi: [string, string, string, string, string, string, string, string]
}

export const ZACESS_THEMES: ZacessTheme[] = [
  {
    id: "light", short: "light", name: "Zacess Light", appearance: "light",
    bg: "#ffffff", fg: "#111111", surface: "#f4f4f4", border: "#707070", selection: "#9bc3ff", muted: "#424242", line: "#f4f4f4",
    ansi: ["#111111", "#ca010e", "#01751c", "#885a00", "#005fcc", "#b301ae", "#026f6f", "#484848"],
  },
  {
    id: "dark", short: "dark", name: "Zacess Dark", appearance: "dark",
    bg: "#121212", fg: "#f5f5f5", surface: "#1a1a1a", border: "#7a7a7a", selection: "#004769", muted: "#c8c8c8", line: "#2f2f2f",
    ansi: ["#a3a3a3", "#ffa79b", "#1bdb41", "#f0b40b", "#90c1ff", "#f7a0f1", "#37d2cf", "#e6e6e6"],
  },
  {
    id: "yellow-on-black", short: "yellow", name: "Zacess Yellow on Black", appearance: "dark",
    bg: "#000000", fg: "#ffeb3b", surface: "#000000", border: "#7a7a7a", selection: "#024b4e", muted: "#e6e6e6", line: "#262626",
    ansi: ["#a3a3a3", "#ffa79b", "#01dc3f", "#edb618", "#90c1ff", "#fd9cf8", "#1fd3d3", "#d9d9d9"],
  },
  {
    id: "cream", short: "cream", name: "Zacess Cream", appearance: "light",
    bg: "#fdf6e3", fg: "#000000", surface: "#f2efe9", border: "#6e6555", selection: "#c8a9ff", muted: "#3f382c", line: "#f2efe9",
    ansi: ["#000000", "#c1000a", "#016f1b", "#815601", "#015ac2", "#a901a6", "#016969", "#434343"],
  },
  {
    id: "high-contrast-dark", short: "hc-dark", name: "Zacess High Contrast Dark", appearance: "dark",
    bg: "#000000", fg: "#ffffff", surface: "#000000", border: "#a6a6a6", selection: "#6501ae", muted: "#e0e0e0", line: "#262626",
    ansi: ["#b3b3b3", "#ff9e94", "#26f444", "#f5c400", "#8fd0ff", "#f2a6ff", "#00f4e0", "#e0e0e0"],
  },
  {
    id: "high-contrast-light", short: "hc-light", name: "Zacess High Contrast Light", appearance: "light",
    bg: "#ffffff", fg: "#000000", surface: "#f7f7f7", border: "#262626", selection: "#00d3d0", muted: "#2e2e2e", line: "#c3e5fe",
    ansi: ["#000000", "#ca0000", "#017424", "#875b00", "#005bdc", "#b400ac", "#006f6e", "#3d3d3d"],
  },
  {
    id: "deep-contrast-dark", short: "deep-dark", name: "Zacess Deep Contrast Dark", appearance: "dark",
    bg: "#000000", fg: "#ffffff", surface: "#000000", border: "#00ffff", selection: "#720072", muted: "#b3b3b3", line: "#262626",
    ansi: ["#b8b8b8", "#ff5f5f", "#00cd00", "#cdcd00", "#8888ff", "#ff2aff", "#00cdcd", "#e5e5e5"],
  },
  {
    id: "deep-contrast-light", short: "deep-light", name: "Zacess Deep Contrast Light", appearance: "light",
    bg: "#ffffff", fg: "#000000", surface: "#ffffff", border: "#0f4a85", selection: "#ffbcfa", muted: "#4d4d4d", line: "#ffffff",
    ansi: ["#000000", "#ca0000", "#00892e", "#ad6500", "#0040ff", "#cd01cd", "#016e78", "#595959"],
  },
  {
    id: "warm-dark", short: "warm-dark", name: "Zacess Warm Dark", appearance: "dark",
    bg: "#211b17", fg: "#e5d5b6", surface: "#1a1512", border: "#988c7e", selection: "#2c465c", muted: "#cabca9", line: "#36322d",
    ansi: ["#ada398", "#fc9a8d", "#a2be6f", "#e4b35b", "#88b9e3", "#dfa1ca", "#73c2b8", "#cbc1b1"],
  },
  {
    id: "warm-light", short: "warm-light", name: "Zacess Warm Light", appearance: "light",
    bg: "#f4ead5", fg: "#342410", surface: "#ece1ca", border: "#7e6f5f", selection: "#a0d2fe", muted: "#483b2c", line: "#d0cec0",
    ansi: ["#342410", "#8c1a16", "#275200", "#6a4603", "#014b79", "#742c60", "#05514d", "#574e44"],
  },
]

export const DEFAULT_THEME = "default"
export const THEME_KEY = "lab-terminal-theme"

export function findTheme(raw: string): ZacessTheme | "default" | null {
  const key = raw.toLowerCase().replace(/^zacess[\s-]*/, "").trim().replace(/\s+/g, "-")
  if (!key) return null
  if (key === "default" || key === "site") return "default"
  return (
    ZACESS_THEMES.find((t) => t.id === key || t.short === key || t.name.toLowerCase().replace(/^zacess /, "").replace(/\s+/g, "-") === key) ??
    null
  )
}

export function themeById(id: string | null): ZacessTheme | null {
  return ZACESS_THEMES.find((t) => t.id === id) ?? null
}

export function themeStyle(theme: ZacessTheme | null): CSSProperties | undefined {
  if (!theme) return undefined
  const [black, red, green, yellow, blue, magenta, cyan, white] = theme.ansi
  return {
    "--t-bg": theme.bg,
    "--t-fg": theme.fg,
    "--t-bold": theme.fg,
    "--t-cursor": theme.fg,
    "--t-sel-bg": theme.selection,
    "--t-sel-fg": theme.fg,
    "--t-black": black,
    "--t-red": red,
    "--t-green": green,
    "--t-yellow": yellow,
    "--t-blue": blue,
    "--t-magenta": magenta,
    "--t-cyan": cyan,
    "--t-white": white,
    "--t-dim": theme.muted,
    "--t-chrome": theme.surface,
    "--t-border": theme.border,
    "--t-panel": theme.selection,
    "--t-panel-fg": theme.fg,
    "--t-line": theme.line,
  } as CSSProperties
}

export function loadTheme(): string {
  try {
    const stored = window.localStorage.getItem(THEME_KEY)
    if (stored && themeById(stored)) return stored
  } catch {
    // storage blocked: the site palette is the safe fallback
  }
  return DEFAULT_THEME
}

export function saveTheme(id: string) {
  try {
    window.localStorage.setItem(THEME_KEY, id)
  } catch {
    // the choice still lasts the visit in component state
  }
}

const TONE_NAMES: (Tone | "black")[] = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"]

export function themeListLines(current: string): Line[] {
  const mark = (id: string) => (id === current ? "*" : " ")
  const now = (id: string) => (id === current ? " (current)" : "")
  return [
    { type: "title", text: "Zacess themes" },
    { type: "output", text: "  type 'theme <name>' to switch. a full name, an id or a short name all work." },
    { type: "blank", text: "" },
    { type: "pair", text: `  ${mark("default")} default            the site palette, follows light or dark mode${now("default")}` },
    ...ZACESS_THEMES.map((t): Line => ({
      type: "pair",
      text: `  ${mark(t.id)} ${t.short.padEnd(18)} ${t.name}, ${t.fg} on ${t.bg}${now(t.id)}`,
    })),
    { type: "blank", text: "" },
    { type: "output", text: "  every text colour keeps 4.5:1 or better on its background." },
  ]
}

export function themePaletteLines(theme: ZacessTheme): Line[] {
  return [
    { type: "title", text: `${theme.name} palette` },
    { type: "output", text: `  a ${theme.appearance} theme. type 'theme default' to go back to the site palette.` },
    { type: "blank", text: "" },
    { type: "kv", text: `  background  ${theme.bg}` },
    { type: "kv", text: `  foreground  ${theme.fg}` },
    { type: "kv", text: `  selection   ${theme.selection}` },
    { type: "blank", text: "" },
    { type: "legend", text: "  colour      hex" },
    ...TONE_NAMES.map((tone, i): Line => ({ type: "swatch", text: `${tone}|${theme.ansi[i]}||${tone}` })),
  ]
}
