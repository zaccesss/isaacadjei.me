const LABELS: Record<string, string> = {
  c: "C", h: "C", cpp: "C++", "c++": "C++", cc: "C++", hpp: "C++", python: "Python", py: "Python", rust: "Rust",
  rs: "Rust", typescript: "TypeScript", ts: "TypeScript", tsx: "TSX", javascript: "JavaScript", js: "JavaScript",
  jsx: "JSX", bash: "Bash", sh: "Bash", shell: "Bash", zsh: "Bash", console: "Bash", powershell: "PowerShell",
  ps1: "PowerShell", pwsh: "PowerShell", sql: "SQL", yaml: "YAML", yml: "YAML", json: "JSON", php: "PHP",
  blade: "Blade", vhdl: "VHDL", verilog: "Verilog", v: "Verilog", systemverilog: "SystemVerilog",
  "system-verilog": "SystemVerilog", sv: "SystemVerilog", ini: "INI", conf: "INI", cfg: "INI", toml: "TOML",
  diff: "Diff", css: "CSS", html: "HTML", xml: "XML", markdown: "Markdown", md: "Markdown", latex: "LaTeX",
  tex: "LaTeX", bibtex: "BibTeX", java: "Java", go: "Go", kotlin: "Kotlin", swift: "Swift", csharp: "C#",
  cs: "C#", dockerfile: "Dockerfile", make: "Makefile", makefile: "Makefile", cmake: "CMake", lua: "Lua",
  asm: "Assembly", text: "Text", txt: "Text", plaintext: "Text",
}

export function codeLabel(lang: string | undefined): string {
  const key = (lang ?? "").trim().toLowerCase()
  if (!key) return "Text"
  return LABELS[key] ?? key.toUpperCase()
}
