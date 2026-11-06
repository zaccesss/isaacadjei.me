export type LineType =
  | "system" | "cmd-echo" | "output" | "error" | "info" | "blank" | "success" | "cmd-list" | "kv" | "link"
  | "rule" | "banner" | "title" | "heading" | "pair" | "legend" | "swatch"

export type Tone = "fg" | "bold" | "dim" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white"

export type ShellId = "zsh" | "bash" | "pwsh" | "cmd"

export interface Line {
  type: LineType
  text: string
  tone?: Tone
  bold?: boolean
  shell?: ShellId
  user?: string
}
