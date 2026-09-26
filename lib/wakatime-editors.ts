const NAMED_EDITORS = new Set([
  "vs code", "visual studio", "intellij idea", "webstorm", "pycharm", "clion", "rider", "goland",
  "phpstorm", "rustrover", "datagrip", "android studio", "xcode", "neovim", "vim", "emacs",
  "sublime text", "zed", "eclipse", "arduino", "atom",
])

export function publicEditorName(name: string): string {
  return NAMED_EDITORS.has(name.trim().toLowerCase()) ? name : "VS Code"
}
