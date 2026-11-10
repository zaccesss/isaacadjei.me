import { bundledThemes, createHighlighter, type BundledLanguage, type Highlighter, type ThemeRegistrationRaw } from "shiki"

export const CODE_BG_DARK = "#1F1F1F"
export const CODE_BG_LIGHT = "#FFFFFF"

const DARK_FIXES: Record<string, string> = {
  "#000080": "#569CD6", // markdown header: 1.03:1, now matches the Dark+ heading blue (5.59:1)
  "#646695": "#8486C0", // regex constants: 3.04:1 -> 4.83:1
  "#808080": "#949494", // tag punctuation: 4.17:1 -> 5.43:1
}
const LIGHT_FIXES: Record<string, string> = {
  "#D16969": "#B54848", // regex group punctuation: 3.54:1 -> 5.27:1
}

function adapt(base: ThemeRegistrationRaw, name: string, bg: string, fg: string, fixes: Record<string, string>): ThemeRegistrationRaw {
  return {
    ...base,
    name,
    colors: { ...base.colors, "editor.background": bg, "editor.foreground": fg },
    tokenColors: (base.tokenColors ?? []).map((rule) => {
      const colour = rule.settings?.foreground
      const fixed = colour ? fixes[colour.toUpperCase()] : undefined
      return fixed ? { ...rule, settings: { ...rule.settings, foreground: fixed } } : rule
    }),
  }
}

const LANGS: BundledLanguage[] = [
  "c", "cpp", "python", "rust", "typescript", "tsx", "javascript", "jsx", "bash", "powershell", "sql", "yaml",
  "json", "php", "blade", "vhdl", "verilog", "system-verilog", "ini", "toml", "diff", "css", "html", "markdown",
  "latex", "bibtex", "java", "go", "kotlin", "swift", "csharp", "dockerfile", "make", "cmake", "lua", "asm", "xml",
]

const ALIASES: Record<string, string> = {
  ts: "typescript", js: "javascript", sh: "bash", shell: "bash", zsh: "bash", console: "bash", ps1: "powershell",
  pwsh: "powershell", py: "python", rs: "rust", yml: "yaml", "c++": "cpp", cc: "cpp", h: "c", hpp: "cpp",
  md: "markdown", tex: "latex", sv: "system-verilog", v: "verilog", conf: "ini", cfg: "ini", cs: "csharp",
  dockerfile: "dockerfile", makefile: "make",
}

export function normaliseLang(lang: string | undefined): string {
  const key = (lang ?? "").trim().toLowerCase()
  if (!key || key === "text" || key === "plaintext" || key === "txt") return "text"
  const id = ALIASES[key] ?? key
  return (LANGS as string[]).includes(id) ? id : "text"
}

let highlighter: Promise<Highlighter> | null = null
function getHighlighter(): Promise<Highlighter> {
  highlighter ??= (async () => {
    const [dark, light] = await Promise.all([bundledThemes["dark-plus"](), bundledThemes["light-plus"]()])
    return createHighlighter({
      themes: [
        adapt(dark.default as ThemeRegistrationRaw, "dark-modern", CODE_BG_DARK, "#CCCCCC", DARK_FIXES),
        adapt(light.default as ThemeRegistrationRaw, "light-modern", CODE_BG_LIGHT, "#3B3B3B", LIGHT_FIXES),
      ],
      langs: LANGS,
    })
  })()
  return highlighter
}

export async function highlightCode(code: string, lang: string | undefined): Promise<string> {
  const hl = await getHighlighter()
  return hl.codeToHtml(code, {
    lang: normaliseLang(lang),
    themes: { light: "light-modern", dark: "dark-modern" },
    defaultColor: false,
  })
}

export async function highlightBlocks<T>(
  blocks: readonly T[] | undefined,
  pick: (block: T) => { code: string; lang?: string } | null,
): Promise<Record<number, string>> {
  const out: Record<number, string> = {}
  if (!blocks) return out
  await Promise.all(
    blocks.map(async (block, i) => {
      const hit = pick(block)
      if (hit) out[i] = await highlightCode(hit.code, hit.lang)
    }),
  )
  return out
}
