import type { Line, ShellId } from "./types"
import type { ZacessTheme } from "./themes"

export const SHELL_KEY = "lab-terminal-shell"
export const SHELL_IDS: ShellId[] = ["zsh", "bash", "pwsh", "cmd"]

export const SHELL_TITLE: Record<ShellId, string> = {
  zsh: "zsh",
  bash: "bash",
  pwsh: "pwsh",
  cmd: "cmd",
}

export function shellFromName(raw: string): ShellId | null {
  const name = raw.trim().toLowerCase().replace(/^\/(usr\/local\/)?bin\//, "").replace(/\.exe$/, "")
  if (name === "zsh") return "zsh"
  if (name === "bash" || name === "sh") return "bash"
  if (name === "pwsh" || name === "powershell") return "pwsh"
  if (name === "cmd") return "cmd"
  return null
}

export function loadShell(): ShellId | null {
  try {
    const stored = window.localStorage.getItem(SHELL_KEY)
    return stored ? shellFromName(stored) : null
  } catch {
    return null
  }
}

export function saveShell(shell: ShellId) {
  try {
    window.localStorage.setItem(SHELL_KEY, shell)
  } catch {
    // the shell still lasts the visit in component state
  }
}

export function windowsPath(user: string): string {
  return `C:\\Users\\${user}\\lab`
}

export const PROFILE_FILE = "Microsoft.PowerShell_profile.ps1"

export function profilePath(user: string): string {
  return `C:\\Users\\${user}\\Documents\\PowerShell\\${PROFILE_FILE}`
}

export function promptText(shell: ShellId, user: string): string {
  if (shell === "bash") return `${user}@isaacadjei:~/lab$ `
  if (shell === "pwsh") return `PS ${windowsPath(user)}> `
  if (shell === "cmd") return `${windowsPath(user)}>`
  return "> "
}

export const SHELL_ALIASES: Record<ShellId, Record<string, string>> = {
  zsh: {},
  bash: {},
  pwsh: {
    "get-childitem": "ls",
    gci: "ls",
    dir: "ls",
    "get-content": "cat",
    gc: "cat",
    type: "cat",
    "clear-host": "clear",
    cls: "clear",
    "get-help": "help",
    "set-location": "cd",
    sl: "cd",
    chdir: "cd",
    "get-location": "pwd",
    gl: "pwd",
    "write-output": "echo",
    write: "echo",
    "write-host": "echo",
    "get-date": "date",
    notepad: "nano",
    "get-command": "cmds",
    gcm: "cmds",
  },
  cmd: {
    dir: "ls",
    type: "cat",
    cls: "clear",
    chdir: "cd",
    edit: "nano",
    notepad: "nano",
  },
}

export function notFoundLines(shell: ShellId, word: string): Line[] {
  if (shell === "bash") {
    return [
      { type: "error", text: `bash: ${word}: command not found` },
      { type: "output", text: "  type 'help' to see available commands" },
    ]
  }
  if (shell === "pwsh") {
    return [
      { type: "error", text: `${word}: The term '${word}' is not recognised as a cmdlet, function or program.` },
      { type: "output", text: "  type 'Get-Help' or 'help' to see available commands" },
    ]
  }
  if (shell === "cmd") {
    return [
      { type: "error", text: `'${word}' is not recognised as a command or batch file.` },
      { type: "output", text: "  type 'help' to see available commands" },
    ]
  }
  return [
    { type: "error", text: `zsh: command not found: ${word}` },
    { type: "output", text: "  type 'help' to see available commands" },
  ]
}

export function fileMissingLines(shell: ShellId, file: string): Line[] {
  if (shell === "pwsh") return [{ type: "error", text: `Get-Content: Cannot find path '${file}' because it does not exist.` }]
  if (shell === "cmd") return [{ type: "error", text: "The system cannot find the file specified." }]
  return [{ type: "error", text: `cat: ${file}: No such file or directory` }]
}

export function shellStartLines(shell: ShellId, parent: ShellId | null): Line[] {
  const back = parent ? ` or 'exit' to go back to ${parent}` : ""
  if (shell === "pwsh") {
    return [
      { type: "output", text: "PowerShell 7.5.0" },
      { type: "info", text: `  type 'Get-Help' for this shell's commands${back}.` },
    ]
  }
  if (shell === "cmd") {
    return [
      { type: "output", text: "isaacadjei.me Command Prompt [Version 10.0.lab]" },
      { type: "info", text: `  type 'help' for this shell's commands${back}.` },
    ]
  }
  if (shell === "bash") {
    return [
      { type: "output", text: "GNU bash, version 5.2" },
      { type: "info", text: `  type 'help' for this shell's commands${back}.` },
    ]
  }
  return [{ type: "info", text: `zsh 5.9: type 'help' for every command${back}.` }]
}

const COMMON_EXTRAS: Line[] = [
  { type: "pair", text: "  zsh / bash / pwsh / cmd  start that shell inside this one" },
  { type: "pair", text: "  exit  leave the current shell for the one before" },
  { type: "pair", text: "  chsh -s <shell>  change the login shell this lab opens with" },
  { type: "pair", text: "  theme list / theme <name>  switch between the eight Zacess themes" },
  { type: "pair", text: "  zacess-scenes [list | name]  a calm animated scene" },
  { type: "pair", text: "  zacess-games [list | name]  small terminal games" },
]

export function shellHelpLines(shell: ShellId): Line[] {
  const head: Line = { type: "info", text: `${SHELL_TITLE[shell]} - this shell's spellings` }
  let own: Line[]
  if (shell === "pwsh") {
    own = [
      { type: "pair", text: "  Get-ChildItem  gci, dir, ls: list site sections and files" },
      { type: "pair", text: "  Get-Content <file>  gc, cat, type: print a file" },
      { type: "pair", text: "  Clear-Host  cls, clear: clear the screen" },
      { type: "pair", text: "  Get-Help  help: this list" },
      { type: "pair", text: "  Set-Location  cd, sl: change directory" },
      { type: "pair", text: "  Get-Location  pwd, gl: where you are" },
      { type: "pair", text: "  Write-Output <text>  echo, write: print text" },
      { type: "pair", text: "  Get-Date  date: today's date" },
      { type: "pair", text: "  $PROFILE  the profile path; Get-Content $PROFILE prints it" },
      { type: "pair", text: "  notepad <file>  nano: open a file read-only" },
    ]
  } else if (shell === "cmd") {
    own = [
      { type: "pair", text: "  dir  list site sections and files" },
      { type: "pair", text: "  type <file>  print a file" },
      { type: "pair", text: "  cls  clear the screen" },
      { type: "pair", text: "  help  this list" },
      { type: "pair", text: "  cd  print or change the directory" },
      { type: "pair", text: "  echo <text>  print text; echo alone says whether echo is on" },
      { type: "pair", text: "  ver  the version of this prompt" },
      { type: "pair", text: "  edit <file>  open a file read-only (nano works too)" },
    ]
  } else {
    own = [
      { type: "pair", text: "  ls / ll / la  list site sections and files" },
      { type: "pair", text: `  cat <file>  print a file, such as ~/.${shell}rc` },
      { type: "pair", text: "  clear / cls  clear the screen (cls reprints the banner)" },
      { type: "pair", text: "  help  this list" },
      { type: "pair", text: "  cd / pwd  where you are" },
      { type: "pair", text: "  echo <text>  print text; echo $SHELL names this shell" },
      { type: "pair", text: "  nvim <file> / nano <file>  open a file read-only" },
    ]
  }
  return [head, { type: "blank", text: "" }, ...own, { type: "blank", text: "" }, ...COMMON_EXTRAS, { type: "blank", text: "" }]
}

export function rcFiles(user: string, theme: ZacessTheme | null): Record<string, { filetype: string; lines: string[] }> {
  const themeLine = (assign: (id: string) => string, comment: string) =>
    theme ? [assign(theme.id)] : [`${comment} ZACESS_THEME unset: the lab follows the site's light or dark mode`]
  return {
    ".zshrc": {
      filetype: "zsh",
      lines: [
        `# ~/.zshrc for ${user} on isaacadjei.me`,
        "export EDITOR=\"nvim\"",
        ...themeLine((id) => `export ZACESS_THEME="${id}"`, "#"),
        "",
        "# history that lasts between sessions",
        "HISTSIZE=10000",
        "SAVEHIST=10000",
        "setopt share_history hist_ignore_dups",
        "",
        "# the short aliases this lab answers too",
        "alias gs=\"git status\"",
        "alias gb=\"git branch\"",
        "alias glog=\"git log --oneline --graph --decorate --all\"",
        "alias ll=\"ls -l\"",
        "alias la=\"ls -la\"",
        "alias tls=\"tmux ls\"",
        "alias vim=\"nvim\"",
        "",
        "# directory and branch, then > on the next line",
        "eval \"$(starship init zsh)\"",
      ],
    },
    ".bashrc": {
      filetype: "bash",
      lines: [
        `# ~/.bashrc for ${user} on isaacadjei.me`,
        "export EDITOR=\"nvim\"",
        ...themeLine((id) => `export ZACESS_THEME="${id}"`, "#"),
        "",
        "HISTSIZE=10000",
        "HISTCONTROL=ignoredups",
        "shopt -s histappend",
        "",
        "alias gs=\"git status\"",
        "alias gb=\"git branch\"",
        "alias ll=\"ls -l\"",
        "alias vim=\"nvim\"",
        "",
        "# user@host:directory$ like a fresh install",
        "PS1='\\u@\\h:\\w\\$ '",
      ],
    },
    [PROFILE_FILE]: {
      filetype: "ps1",
      lines: [
        `# ${PROFILE_FILE} for ${user}`,
        "$env:EDITOR = \"nvim\"",
        ...themeLine((id) => `$env:ZACESS_THEME = "${id}"`, "#"),
        "",
        "Set-PSReadLineOption -EditMode Emacs -HistoryNoDuplicates",
        "Set-Alias -Name vim -Value nvim",
        "",
        "function gs { git status }",
        "function gb { git branch }",
        "",
        "# PS C:\\path> like the default prompt",
        "function prompt { \"PS $($executionContext.SessionState.Path.CurrentLocation)> \" }",
      ],
    },
  }
}

export function normaliseFileArg(raw: string): string {
  const arg = raw.trim().replace(/^["']|["']$/g, "")
  if (/^\$profile$/i.test(arg)) return PROFILE_FILE
  return arg
    .replace(/^~[\\/]/, "")
    .replace(/^\.[\\/]/, "")
    .replace(/^c:\\users\\[^\\]+\\documents\\powershell\\/i, "")
}
