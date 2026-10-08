"use client"

import { useEffect, useRef, useState } from "react"

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

type Phase = "typing" | "holding" | "clearing" | "pausing"

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
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [phase, setPhase] = useState<Phase>("pausing")
  const [reduced, setReduced] = useState(false)

  const lineIdxRef = useRef(0)
  const charIdxRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function clearTimers() {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timerRef.current) clearTimeout(timerRef.current)
    }

    function startTyping() {
      clearTimers()
      lineIdxRef.current = 0
      charIdxRef.current = 0
      setDisplayedLines([])
      setPhase("typing")

      intervalRef.current = setInterval(() => {
        const li = lineIdxRef.current
        const ci = charIdxRef.current

        if (li >= LINES.length) {
          clearInterval(intervalRef.current!)
          setPhase("holding")
          timerRef.current = setTimeout(() => {
            setPhase("clearing")
            setDisplayedLines([])
            timerRef.current = setTimeout(startTyping, 500)
          }, 2500)
          return
        }

        const text = LINES[li].slice(0, ci + 1)
        setDisplayedLines((prev) => {
          const next = [...prev]
          next[li] = text
          return next
        })

        if (ci + 1 >= LINES[li].length) {
          lineIdxRef.current = li + 1
          charIdxRef.current = 0
        } else {
          charIdxRef.current = ci + 1
        }
      }, 60)
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timerRef.current = setTimeout(() => {
        setReduced(true)
        setDisplayedLines(LINES)
        setPhase("holding")
      }, 0)
      return clearTimers
    }

    timerRef.current = setTimeout(startTyping, 500)
    return clearTimers
  }, [])

  const isCursorVisible = !reduced && (phase === "typing" || phase === "holding")

  return (
    <figure className="code-frame code-tokens overflow-hidden rounded-xl border border-border" aria-label="My approach - a code philosophy, written in C">
      <figcaption className="code-frame-header border-b border-border px-4 py-1.5 font-mono text-xs font-semibold tracking-wide">
        C
      </figcaption>
      <pre className="sr-only">{LINES.join("\n")}</pre>
      <div className="p-5 overflow-x-auto h-[200px] sm:h-[260px] overflow-y-hidden" aria-hidden="true">
      <div className="font-mono text-xs leading-relaxed">
        {displayedLines.map((line, i) => {
          const isLast = i === displayedLines.length - 1
          const tokens = tokenise(line)
          return (
            <div key={i}>
              {tokens.map((t, j) => (
                <span key={j} className={t.cls}>{t.text}</span>
              ))}
              {isLast && isCursorVisible && (
                <span
                  className="inline-block w-[0.55em] h-[1em] bg-current ml-px align-middle animate-[blink_0.7s_step-end_infinite]"
                  aria-hidden="true"
                />
              )}
            </div>
          )
        })}
        {displayedLines.length === 0 && (
          <span className="text-transparent select-none">{" "}</span>
        )}
      </div>
      </div>
    </figure>
  )
}
