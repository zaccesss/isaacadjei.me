const NAMED_EDITORS = new Set([
  "vs code", "visual studio", "intellij idea", "webstorm", "pycharm", "clion", "rider", "goland",
  "phpstorm", "rustrover", "datagrip", "android studio", "xcode", "neovim", "vim", "emacs",
  "sublime text", "zed", "eclipse", "arduino", "atom",
])

export function publicEditorName(name: string): string {
  return NAMED_EDITORS.has(name.trim().toLowerCase()) ? name : "VS Code"
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
