const LINES = [
  "// my approach",
  "bool struggling = true;",
  "bool failing    = true;",
  "while (struggling || failing) {",
  "    learn();      // grow from the struggle",
  "    retry();      // push through failure",
  "}",
  "thrive();         // embrace growth",
  "succeed();        // achieve the goal",
  'printf("Mission accomplished.\\n");  // celebrate victory',
  "// $ nohup hustle && disown impostor_syndrome",
]

function tokenise(line: string): { text: string; cls: string }[] {
  if (line.startsWith("// $")) {
    return [{ text: line, cls: "text-primary font-semibold" }]
  }
  if (line.startsWith("//")) {
    return [{ text: line, cls: "text-[var(--tok-comment)]" }]
  }

  const tokens: { text: string; cls: string }[] = []
  let remaining = line

  while (remaining.length > 0) {
    const commentIdx = remaining.indexOf("//")
    const strIdx = remaining.indexOf('"')

    if (commentIdx !== -1 && (strIdx === -1 || commentIdx < strIdx)) {
      if (commentIdx > 0) tokens.push(...tokenisePart(remaining.slice(0, commentIdx)))
      tokens.push({ text: remaining.slice(commentIdx), cls: "text-[var(--tok-comment)]" })
      break
    }

    if (strIdx !== -1) {
      if (strIdx > 0) tokens.push(...tokenisePart(remaining.slice(0, strIdx)))
      const endStr = remaining.indexOf('"', strIdx + 1)
      if (endStr !== -1) {
        tokens.push(...tokeniseString(remaining.slice(strIdx, endStr + 1)))
        remaining = remaining.slice(endStr + 1)
      } else {
        tokens.push(...tokeniseString(remaining))
        break
      }
      continue
    }

    tokens.push(...tokenisePart(remaining))
    break
  }

  return tokens
}

function tokeniseString(text: string): { text: string; cls: string }[] {
  return text
    .split(/(\\.)/)
    .filter(Boolean)
    .map((part) => ({ text: part, cls: part.startsWith("\\") ? "text-[var(--tok-escape)]" : "text-[var(--tok-string)]" }))
}

function tokenisePart(text: string): { text: string; cls: string }[] {
  const CONTROL = /\b(while)\b/g
  const KEYWORDS = /\b(true|false|bool)\b/g
  const FUNCTIONS = /\b(learn|retry|thrive|succeed|printf)\b/g

  const parts: { text: string; cls: string }[] = []
  let last = 0
  const matches: { index: number; length: number; cls: string }[] = []

  let m: RegExpExecArray | null
  CONTROL.lastIndex = 0
  while ((m = CONTROL.exec(text)) !== null)
    matches.push({ index: m.index, length: m[0].length, cls: "text-[var(--tok-control)]" })
  KEYWORDS.lastIndex = 0
  while ((m = KEYWORDS.exec(text)) !== null)
    matches.push({ index: m.index, length: m[0].length, cls: "text-[var(--tok-keyword)]" })
  FUNCTIONS.lastIndex = 0
  while ((m = FUNCTIONS.exec(text)) !== null)
    if (!matches.some((x) => x.index === m!.index))
      matches.push({ index: m.index, length: m[0].length, cls: "text-[var(--tok-function)]" })

  matches.sort((a, b) => a.index - b.index)
  for (const match of matches) {
    if (match.index > last) parts.push({ text: text.slice(last, match.index), cls: "text-[var(--tok-plain)]" })
    parts.push({ text: text.slice(match.index, match.index + match.length), cls: match.cls })
    last = match.index + match.length
  }
  if (last < text.length) parts.push({ text: text.slice(last), cls: "text-[var(--tok-plain)]" })
  return parts
}

export default function ApproachAnimation() {
  return (
    <figure className="code-frame code-tokens overflow-hidden rounded-xl border border-border" aria-label="My approach - a code philosophy, written in C">
      <figcaption className="code-frame-header border-b border-border px-4 py-1.5 font-mono text-xs font-semibold tracking-wide">
        C
      </figcaption>
      <pre className="p-5 overflow-x-auto font-mono text-xs leading-relaxed">
        <code>
          {LINES.map((line, i) => (
            <span key={i} className="block">
              {tokenise(line).map((t, j) => (
                <span key={j} className={t.cls}>{t.text}</span>
              ))}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  )
}
