"use client"

import { useEffect, useRef, useState } from "react"
import manifest from "@/data/projects/zacess/studio-manifest.json"
import type { Recording } from "./scenes"
import type { Line } from "./types"
import s from "../terminal.module.css"

const PLAYABLE = new Set(["merge-gates", "termle", "trace"])

export const GAMES: { id: string; name: string; summary: string; playable: boolean }[] = manifest.catalogue.games.map((g) => ({
  id: g.id,
  name: g.name,
  summary: g.description.replace(/\.\s*$/, ""),
  playable: PLAYABLE.has(g.id),
}))

export const GAME_RECORDINGS: Recording[] = GAMES.filter((g) => !g.playable).map((g) => ({
  source: "games",
  id: g.id,
  name: g.name,
  description: g.summary,
  group: "game",
}))

export const INSTALL_LINES = ["cargo install --locked zacess-games", "brew install zacesshq/tap/zacess-games"]

export function findGame(raw: string): number {
  const key = raw.trim().toLowerCase().replace(/\s+/g, "-")
  if (!key) return -1
  const exact = GAMES.findIndex((g) => g.id === key)
  return exact >= 0 ? exact : GAMES.findIndex((g) => g.id.startsWith(key))
}

export function gamesListLines(): Line[] {
  return [
    { type: "title", text: "Zacess Games" },
    { type: "output", text: "  [here] plays in this browser. [watch] plays a recording in your chosen theme." },
    { type: "blank", text: "" },
    ...GAMES.map((g): Line => ({ type: "pair", text: `  ${g.playable ? "[here] " : "[watch]"} ${g.id}  ${g.summary}` })),
    { type: "blank", text: "" },
    { type: "output", text: "  type 'zacess-games' for the menu or 'zacess-games termle' for one game." },
    { type: "output", text: `  to play them all, the full program: ${INSTALL_LINES[0]}` },
    { type: "output", text: `  or with Homebrew: ${INSTALL_LINES[1]}` },
  ]
}

function rnd(seed: number): [number, number] {
  let t = (seed + 0x6d2b79f5) >>> 0
  const next = t
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return [((t ^ (t >>> 14)) >>> 0) / 4294967296, next]
}

const BTN = `${s.chip} min-h-11 min-w-11 px-2 rounded text-xs`

function GameFrame({
  title,
  status,
  help,
  showHelp,
  paused,
  keys,
  said,
  children,
  buttons,
}: {
  title: string
  status: string
  help: string[]
  showHelp: boolean
  paused: boolean
  keys: string
  said: string
  children: React.ReactNode
  buttons: React.ReactNode
}) {
  return (
    <>
      <div className={`${s.nvimStatus} flex items-stretch text-xs leading-6 shrink-0`}>
        <span className={`${s.nvimMode} px-2 font-bold`}>{title}</span>
        <span className="px-2 flex-1 min-w-0 truncate">{status}</span>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 sm:px-3 pt-2">
        {showHelp ? (
          <div>
            <p className={`${s.cyan} font-bold`}>How to play {title}</p>
            {help.map((h, i) => (
              <p key={i} className={`${s.line} ${s.fg} leading-relaxed`}>
                {h}
              </p>
            ))}
            <p className={`${s.line} ${s.white} leading-relaxed mt-2`}>Press ? again to go back to the game.</p>
          </div>
        ) : paused ? (
          <p className={`${s.yellow} font-bold`}>PAUSED. Press Space to carry on.</p>
        ) : (
          children
        )}
      </div>
      <p className={`${s.line} ${s.white} text-xs leading-relaxed px-2 sm:px-3 shrink-0`}>{keys}</p>
      <div className="flex flex-wrap gap-1 px-2 sm:px-3 pt-1 shrink-0">{buttons}</div>
      <p className="sr-only" aria-live="polite">
        {said}
      </p>
    </>
  )
}

const TERMS: [string, string][] = [
  ["component", "RESISTOR"], ["component", "DIODE"], ["component", "INDUCTOR"], ["component", "RELAY"],
  ["component", "THERMISTOR"], ["digital logic", "LATCH"], ["digital logic", "ADDER"], ["digital logic", "CLOCK"],
  ["digital logic", "ENCODER"], ["digital logic", "BUFFER"], ["microcontrollers", "TIMER"], ["microcontrollers", "REGISTER"],
  ["microcontrollers", "WATCHDOG"], ["microcontrollers", "EEPROM"], ["microcontrollers", "FIRMWARE"], ["signals", "SAMPLE"],
  ["signals", "FILTER"], ["signals", "NOISE"], ["circuits", "VOLTAGE"], ["circuits", "CURRENT"], ["circuits", "GROUND"],
  ["programming", "POINTER"], ["programming", "BOOLEAN"], ["programming", "COMPILER"], ["programming", "LAMBDA"],
  ["programming", "STRUCT"], ["programming", "ARRAY"], ["programming", "TUPLE"], ["programming", "SCOPE"],
  ["version control", "COMMIT"], ["version control", "BRANCH"], ["version control", "REBASE"], ["version control", "MERGE"],
]

const TRIES = 6
const TERMLE_KEY = "lab-termle"

type Mark = "=" | "◂" | "▸" | "·"

export function markGuess(guess: string, answer: string): Mark[] {
  const n = answer.length
  const marks: Mark[] = Array.from({ length: n }, () => "·")
  const left: Record<string, number> = {}
  for (let i = 0; i < n; i++) {
    if (guess[i] === answer[i]) marks[i] = "="
    else left[answer[i]] = (left[answer[i]] ?? 0) + 1
  }
  for (let i = 0; i < n; i++) {
    const g = guess[i]
    if (marks[i] === "=" || !left[g]) continue
    let best = -1
    for (let j = 0; j < n; j++) {
      if (answer[j] === g && guess[j] !== answer[j] && (best < 0 || Math.abs(j - i) < Math.abs(best - i))) best = j
    }
    marks[i] = best < i ? "◂" : "▸"
    left[g] -= 1
  }
  return marks
}

const MARK_WORD: Record<Mark, string> = { "=": "in place", "◂": "elsewhere to the left", "▸": "elsewhere to the right", "·": "not used again" }
const MARK_TONE: Record<Mark, string> = { "=": `${s.green} font-bold`, "◂": `${s.yellow} font-bold`, "▸": `${s.yellow} font-bold`, "·": s.dim }

type TermleSave = { day: number; streak: number; lastWin: number }

function readTermle(): TermleSave {
  try {
    const raw = window.localStorage.getItem(TERMLE_KEY)
    if (raw) return JSON.parse(raw) as TermleSave
  } catch {
    // a fresh record below
  }
  return { day: -1, streak: 0, lastWin: -2 }
}

function writeTermle(save: TermleSave) {
  try {
    window.localStorage.setItem(TERMLE_KEY, JSON.stringify(save))
  } catch {
    // the streak only lasts the visit without storage
  }
}

type TermleRound = { category: string; term: string; daily: boolean }
type TermleState = {
  round: TermleRound
  guesses: { word: string; marks: Mark[] }[]
  revealed: number | null
  done: "won" | "lost" | null
  score: number
  streak: number
  seed: number
}

function practiceRound(seed: number, not: string): [TermleRound, number] {
  let [r, next] = rnd(seed)
  let pick = TERMS[Math.floor(r * TERMS.length)]
  if (pick[1] === not) {
    ;[r, next] = rnd(next)
    pick = TERMS[(Math.floor(r * (TERMS.length - 1)) + 1 + TERMS.indexOf(pick)) % TERMS.length]
  }
  return [{ category: pick[0], term: pick[1], daily: false }, next]
}

function Termle({ seed, today, onBack }: { seed: number; today: number; onBack: () => void }) {
  const dailyIdx = (today * 7) % TERMS.length
  const daily = TERMS[dailyIdx]
  const [state, setState] = useState<TermleState>(() => ({
    round: { category: daily[0], term: daily[1], daily: true },
    guesses: [],
    revealed: null,
    done: null,
    score: 0,
    streak: 0,
    seed,
  }))
  const [typed, setTyped] = useState("")
  const [help, setHelp] = useState(false)
  const [paused, setPaused] = useState(false)
  const [said, setSaid] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const { round, guesses, revealed, done } = state
  const n = round.term.length
  const triesLeft = TRIES - guesses.length - (revealed === null ? 0 : 1)

  useEffect(() => {
    const t = setTimeout(() => {
      const save = readTermle()
      const [category, term] = TERMS[dailyIdx]
      if (save.day === today) {
        const [r, next] = practiceRound(seed, term)
        setState((prev) => ({ ...prev, round: r, seed: next, streak: save.streak }))
        setSaid(`Today's term is done. A practice term: ${r.category}, ${r.term.length} letters.`)
      } else {
        setState((prev) => ({ ...prev, streak: save.lastWin >= today - 1 ? save.streak : 0 }))
        setSaid(`Termle. Category ${category}, ${term.length} letters. Six tries.`)
      }
      inputRef.current?.focus({ preventScroll: true })
    }, 0)
    return () => clearTimeout(t)
  }, [today, dailyIdx, seed])

  const finishDaily = (won: boolean) => {
    const save = readTermle()
    const streak = won ? (save.lastWin === today - 1 ? save.streak + 1 : 1) : 0
    writeTermle({ day: today, streak, lastWin: won ? today : save.lastWin })
    return streak
  }

  const submit = () => {
    if (done) {
      const [r, next] = practiceRound(state.seed, round.term)
      setState((prev) => ({ ...prev, round: r, seed: next, guesses: [], revealed: null, done: null }))
      setTyped("")
      setSaid(`A practice term: ${r.category}, ${r.term.length} letters.`)
      return
    }
    if (typed.length !== n) {
      setSaid(`The term has ${n} letters. This guess has ${typed.length}.`)
      return
    }
    const marks = markGuess(typed, round.term)
    const won = marks.every((m) => m === "=")
    const used = guesses.length + 1 + (revealed === null ? 0 : 1)
    const lost = !won && used >= TRIES
    const spoken = typed
      .split("")
      .map((ch, i) => `${ch} ${MARK_WORD[marks[i]]}`)
      .join(", ")
    let streak = state.streak
    if ((won || lost) && round.daily) streak = finishDaily(won)
    const gain = won ? 100 * (TRIES - used) + 100 : 0
    setState((prev) => ({
      ...prev,
      guesses: [...prev.guesses, { word: typed, marks }],
      done: won ? "won" : lost ? "lost" : null,
      score: prev.score + gain,
      streak,
    }))
    setTyped("")
    setSaid(
      `Guess ${guesses.length + 1}: ${spoken}.` +
        (won ? ` Solved for ${gain} points. Press Enter for a practice term.` : "") +
        (lost ? ` Out of tries. The term was ${round.term}. Press Enter for a practice term.` : ""),
    )
  }

  const reveal = () => {
    if (done || revealed !== null) {
      setSaid(done ? "This round is over." : "A letter has already been revealed this round.")
      return
    }
    if (triesLeft <= 1) {
      setSaid("Revealing now would use the last try.")
      return
    }
    const solved = new Set<number>()
    for (const g of guesses) g.marks.forEach((m, i) => m === "=" && solved.add(i))
    const pos = Array.from({ length: n }, (_, i) => i).find((i) => !solved.has(i)) ?? 0
    setState((prev) => ({ ...prev, revealed: pos }))
    setSaid(`Letter ${pos + 1} is ${round.term[pos]}. That cost one try.`)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "?" || e.key === "F1") {
      setHelp((h) => !h)
    } else if (e.key === "Escape") {
      onBack()
    } else if (e.key === " ") {
      setPaused((p) => !p)
      setSaid(paused ? "Carrying on." : "Paused.")
    } else if (paused || help) {
      if (e.key !== "Tab") e.preventDefault()
      return
    } else if (e.key === "Enter") {
      submit()
    } else if (e.key === "Tab" && !e.shiftKey) {
      reveal()
    } else {
      return
    }
    e.preventDefault()
    e.stopPropagation()
  }

  const rows = Array.from({ length: TRIES }, (_, i) => guesses[i] ?? null)
  const cell = (ch: string) => ` ${ch} `

  return (
    <GameFrame
      title="Termle"
      status={`${round.daily ? "daily" : "practice"}  ${round.category}  ${n} letters  tries left ${Math.max(0, triesLeft)}  score ${state.score}  streak ${state.streak}`}
      help={[
        "Guess the term in six tries. The category is the clue and the board shows how many letters it has.",
        "Type a guess of that length and press Enter. Each letter is marked:",
        "  =  in the right place",
        "  ◂ or ▸  the term has it somewhere else, pointing to the nearest place it belongs",
        "  ·  the term does not use it again",
        "Once a round, Tab reveals one letter for the cost of one try.",
        "100 points for each try left when you solve it, plus 100. The daily term builds a streak on days in a row.",
      ]}
      showHelp={help}
      paused={paused}
      keys="letters type  Enter guess  Tab reveal  ? help  Space pause  Esc menu"
      said={said}
      buttons={
        <>
          <button type="button" className={BTN} onClick={submit}>
            Enter guess
          </button>
          <button type="button" className={BTN} onClick={reveal}>
            Tab reveal
          </button>
          <button type="button" className={BTN} onClick={() => setHelp((h) => !h)} aria-pressed={help}>
            ? help
          </button>
          <button type="button" className={BTN} onClick={onBack}>
            Esc menu
          </button>
        </>
      }
    >
      <div aria-hidden="true" className="whitespace-pre leading-relaxed">
        {rows.map((g, i) => {
          const live = !g && i === guesses.length && !done
          const letters = g ? g.word : live ? typed.padEnd(n, "_") : "_".repeat(n)
          return (
            <div key={i} className="mb-1">
              <div className={g || live ? s.bold : s.dim}>{letters.split("").map(cell).join("")}</div>
              {g && (
                <div>
                  {g.marks.map((m, j) => (
                    <span key={j} className={MARK_TONE[m]}>
                      {cell(m)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      {revealed !== null && (
        <p className={`${s.cyan} leading-relaxed`}>
          letter {revealed + 1} is {round.term[revealed]}
        </p>
      )}
      {done === "won" && <p className={`${s.green} font-bold leading-relaxed`}>solved. Enter for a practice term.</p>}
      {done === "lost" && (
        <p className={`${s.red} font-bold leading-relaxed`}>out of tries: the term was {round.term}. Enter for a practice term.</p>
      )}
      <label className="flex items-center gap-2 min-h-11 mt-1">
        <span className={`${s.green} font-bold`} aria-hidden="true">
          guess&gt;
        </span>
        <span className="sr-only">
          Termle guess, {n} letters, category {round.category}. Enter to guess, Tab to reveal a letter, question mark for help, Escape for the menu.
        </span>
        <input
          ref={inputRef}
          value={typed}
          onChange={(e) => setTyped(e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, n))}
          onKeyDown={onKeyDown}
          autoCapitalize="characters"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          className={`${s.input} flex-1 min-w-0 h-11 text-base sm:text-[13px] outline-hidden uppercase`}
        />
      </label>
    </GameFrame>
  )
}

type Gate = "AND" | "OR" | "XOR" | "NAND" | "NOR" | "XNOR"
const GATES: Gate[] = ["AND", "OR", "XOR", "NAND", "NOR", "XNOR"]
const SIZE = 4
const PUSHES = 10

function applyGate(g: Gate, a: number, b: number): number {
  const v = g === "AND" ? a & b : g === "OR" ? a | b : g === "XOR" ? a ^ b : g === "NAND" ? ~(a & b) : g === "NOR" ? ~(a | b) : ~(a ^ b)
  return v & 15
}

const bits = (v: number) => v.toString(2).padStart(4, "0")

type Tile = { v: number; merges: number } | null
type MergeState = {
  board: Tile[][]
  gates: Gate[]
  target: number
  pushes: number
  faults: number
  score: number
  sent: number
  seed: number
  over: boolean
}

function spawn(board: Tile[][], seed: number, avoid: number): number {
  const empty: [number, number][] = []
  board.forEach((row, r) => row.forEach((t, c) => !t && empty.push([r, c])))
  if (!empty.length) return seed
  let [x, next] = rnd(seed)
  const [r, c] = empty[Math.floor(x * empty.length)]
  ;[x, next] = rnd(next)
  let v = 1 + Math.floor(x * 15)
  if (v === avoid) v = (v % 15) + 1
  board[r][c] = { v, merges: 0 }
  return next
}

function newMerge(seed0: number): MergeState {
  let seed = seed0
  let x: number
  ;[x, seed] = rnd(seed)
  const target = 1 + Math.floor(x * 15)
  const board: Tile[][] = Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => null as Tile))
  for (let i = 0; i < 5; i++) seed = spawn(board, seed, target)
  const gates: Gate[] = []
  for (let i = 0; i < 4; i++) {
    ;[x, seed] = rnd(seed)
    gates.push(GATES[Math.floor(x * GATES.length)])
  }
  return { board, gates, target, pushes: PUSHES, faults: 0, score: 0, sent: 0, seed, over: false }
}

const ARROW_KEYS: Record<string, Dir> = {
  ArrowUp: "up", k: "up", ArrowDown: "down", j: "down", ArrowLeft: "left", h: "left", ArrowRight: "right", l: "right",
}

const DIRS = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
} as const
type Dir = keyof typeof DIRS

function MergeGates({ seed, onBack }: { seed: number; onBack: () => void }) {
  const [game, setGame] = useState<MergeState>(() => newMerge(seed))
  const [cur, setCur] = useState({ r: 0, c: 0 })
  const [grabbed, setGrabbed] = useState(false)
  const [help, setHelp] = useState(false)
  const [paused, setPaused] = useState(false)
  const [said, setSaid] = useState("")
  const regionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    regionRef.current?.focus({ preventScroll: true })
  }, [])

  const tileAt = (r: number, c: number) => game.board[r][c]

  const move = (d: Dir) => {
    const [dr, dc] = DIRS[d]
    const r = Math.max(0, Math.min(SIZE - 1, cur.r + dr))
    const c = Math.max(0, Math.min(SIZE - 1, cur.c + dc))
    setCur({ r, c })
    const t = tileAt(r, c)
    setSaid(`Row ${r + 1}, column ${c + 1}: ${t ? `tile ${bits(t.v).split("").join(" ")}` : "empty"}.`)
  }

  const push = (d: Dir) => {
    setGrabbed(false)
    if (game.over) return
    const tile = tileAt(cur.r, cur.c)
    if (!tile) {
      setSaid("There is no tile under the cursor.")
      return
    }
    const [dr, dc] = DIRS[d]
    const board = game.board.map((row) => row.slice())
    let r = cur.r
    let c = cur.c
    let note = ""
    let merged = false
    for (;;) {
      const nr = r + dr
      const nc = c + dc
      if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) break
      const other = board[nr][nc]
      if (other) {
        const gate = game.gates[0]
        const v = applyGate(gate, tile.v, other.v)
        board[nr][nc] = { v, merges: tile.merges + other.merges + 1 }
        board[cur.r][cur.c] = null
        note = `${gate} merged ${bits(tile.v)} and ${bits(other.v)} into ${bits(v)}.`
        r = nr
        c = nc
        merged = true
        break
      }
      r = nr
      c = nc
    }
    if (!merged && r === cur.r && c === cur.c) {
      setSaid("It cannot move that way.")
      return
    }
    if (!merged) {
      board[r][c] = tile
      board[cur.r][cur.c] = null
      note = `Slid ${d} to row ${r + 1}, column ${c + 1}.`
    }
    let seedNow = game.seed
    let x: number
    ;[x, seedNow] = rnd(seedNow)
    const gates = [...game.gates.slice(1), GATES[Math.floor(x * GATES.length)]]
    let { target, pushes, faults, score, sent } = game
    let hr = -1
    let hc = -1
    for (let rr = 0; rr < SIZE; rr++) {
      for (let cc = 0; cc < SIZE; cc++) {
        const t = board[rr][cc]
        if (t && t.v === target && (hr < 0 || (rr === r && cc === c))) {
          hr = rr
          hc = cc
        }
      }
    }
    const t = hr >= 0 ? board[hr][hc] : null
    if (t) {
      const gain = 100 + 50 * t.merges
      board[hr][hc] = null
      score += gain
      sent += 1
      ;[x, seedNow] = rnd(seedNow)
      target = 1 + Math.floor(x * 15)
      pushes = PUSHES
      note += ` Sent out ${bits(t.v)} for ${gain} points. New target ${bits(target)}.`
    } else {
      pushes -= 1
      if (pushes <= 0) {
        faults += 1
        ;[x, seedNow] = rnd(seedNow)
        target = 1 + Math.floor(x * 15)
        pushes = PUSHES
        note += ` Out of pushes: fault ${faults} of 3. New target ${bits(target)}.`
      }
    }
    seedNow = spawn(board, seedNow, target)
    const over = faults >= 3
    if (over) note += ` Game over with ${score} points. Press R to play again.`
    setGame({ board, gates, target, pushes, faults, score, sent, seed: seedNow, over })
    setCur({ r, c })
    setSaid(note)
  }

  const restart = () => {
    setGame((g) => newMerge(g.seed))
    setCur({ r: 0, c: 0 })
    setSaid("A new game.")
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const k = e.key
    const lower = k.length === 1 ? k.toLowerCase() : k
    if (k === "?") setHelp((h) => !h)
    else if (k === "q" || k === "Q" || k === "Escape") onBack()
    else if (k === " ") {
      setPaused((p) => !p)
      setSaid(paused ? "Carrying on." : "Paused.")
    } else if (paused || help) {
      return
    } else if (ARROW_KEYS[k]) {
      if (grabbed) push(ARROW_KEYS[k])
      else move(ARROW_KEYS[k])
    } else if (lower === "w") push("up")
    else if (lower === "a") push("left")
    else if (lower === "s") push("down")
    else if (lower === "d") push("right")
    else if (k === "Enter") {
      setGrabbed((g) => !g)
      setSaid(grabbed ? "Let go." : "Grabbed. The next arrow pushes the tile.")
    } else if (lower === "r") restart()
    else return
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div ref={regionRef} role="application" tabIndex={0} onKeyDown={onKeyDown} className={`${s.viewRegion} flex flex-col flex-1 min-h-0`} aria-label="Merge Gates board. Arrows move the cursor, W A S D push, question mark for help, q for the menu.">
      <GameFrame
        title="Merge Gates"
        status={`target ${bits(game.target)}  pushes ${game.pushes}  faults ${game.faults}/3  score ${game.score}`}
        help={[
          "Make a tile equal the target output, as often as you can.",
          "Every tile holds four bits. Choose a tile with the cursor and push it one way: it slides until it meets a wall or another tile.",
          "When it meets a tile the two combine through the gate at the front of the track, bit by bit, into one tile.",
          "Every push moves the track on by one gate and a new tile arrives.",
          "A tile equal to the target is sent out: 100 points plus 50 for every merge that went into it.",
          "Each target allows 10 pushes. Missing one is a fault and the game ends at the third.",
        ]}
        showHelp={help}
        paused={paused}
        keys="arrows or hjkl move  WASD push  Enter grab  ? help  Space pause  r restart  q menu"
        said={said}
        buttons={
          <>
            {(["up", "left", "down", "right"] as Dir[]).map((d) => (
              <button key={`m${d}`} type="button" className={BTN} onClick={() => move(d)} aria-label={`Move cursor ${d}`}>
                {{ up: "↑", left: "←", down: "↓", right: "→" }[d]}
              </button>
            ))}
            {(["up", "left", "down", "right"] as Dir[]).map((d) => (
              <button key={`p${d}`} type="button" className={BTN} onClick={() => push(d)}>
                push {{ up: "W", left: "A", down: "S", right: "D" }[d]}
              </button>
            ))}
            <button type="button" className={BTN} onClick={() => setHelp((h) => !h)} aria-pressed={help}>
              ? help
            </button>
            <button type="button" className={BTN} onClick={onBack}>
              q menu
            </button>
          </>
        }
      >
        <div aria-hidden="true" className="whitespace-pre leading-relaxed">
          <div>
            <span className={s.cyan}>target </span>
            <span className={`${s.green} font-bold`}>{bits(game.target)}</span>
          </div>
          <div>
            <span className={s.cyan}>gates  </span>
            {game.gates.map((g, i) => (
              <span key={i} className={i === 0 ? `${s.yellow} font-bold` : s.fg}>
                {i === 0 ? `[${g}]` : ` > ${g}`}
              </span>
            ))}
            <span className={s.dim}>  (front first)</span>
          </div>
          <div className="h-2" />
          {game.board.map((row, r) => (
            <div key={r}>
              {row.map((t, c) => {
                const here = cur.r === r && cur.c === c
                const label = t ? bits(t.v) : "····"
                const wrapL = here ? (grabbed ? "»" : "[") : " "
                const wrapR = here ? (grabbed ? "«" : "]") : " "
                return (
                  <span key={c} className={here ? `${s.tmuxCurrent} font-bold` : t ? (t.v === game.target ? `${s.green} font-bold` : s.fg) : s.dim}>
                    {`${wrapL}${label}${wrapR}`}
                    {c < SIZE - 1 ? <span className={s.fg}> </span> : null}
                  </span>
                )
              })}
            </div>
          ))}
          {game.over && <div className={`${s.red} font-bold mt-2`}>three faults: game over. r plays again.</div>}
        </div>
      </GameFrame>
    </div>
  )
}

type TraceLevel = { name: string; note: string; budget: number; map: string[] }

const TRACE_LEVELS: TraceLevel[] = [
  { name: "first light", note: "Run wire from the source to all three nodes.", budget: 10, map: ["S...o", ".##..", "o...o"] },
  {
    name: "crossing",
    note: "A via lets one wire run straight across another. The bottom node only takes wire moving down.",
    budget: 14,
    map: ["..o..", ".....", "S.+.o", ".....", "..v.."],
  },
  { name: "the long way", note: "Go round the walls. The top left node only takes wire moving left.", budget: 20, map: ["<....o", ".####.", "..S...", ".####.", "o....o"] },
]

type Pos = { r: number; c: number }
type TraceState = {
  level: number
  wires: Record<string, string>
  vias: Record<string, { h: boolean; v: boolean }>
  lit: string[]
  pen: Pos
  lastDir: Dir | null
  used: number
  score: number
}

const key = (p: Pos) => `${p.r},${p.c}`
const DIR_LETTER: Record<Dir, string> = { up: "U", down: "D", left: "L", right: "R" }
const OPP: Record<Dir, Dir> = { up: "down", down: "up", left: "right", right: "left" }
const ARROW_DIR: Record<string, Dir> = { "^": "up", v: "down", "<": "left", ">": "right" }

function findSource(level: number): Pos {
  const map = TRACE_LEVELS[level].map
  for (let r = 0; r < map.length; r++) {
    const c = map[r].indexOf("S")
    if (c >= 0) return { r, c }
  }
  return { r: 0, c: 0 }
}

function freshTrace(level: number, score: number): TraceState {
  return { level, wires: {}, vias: {}, lit: [], pen: findSource(level), lastDir: null, used: 0, score }
}

function wireGlyph(dirs: string): string {
  const has = (d: string) => dirs.includes(d)
  const u = has("U"), d = has("D"), l = has("L"), r = has("R")
  if (u && d && l && r) return "┼"
  if (u && d && r) return "├"
  if (u && d && l) return "┤"
  if (l && r && d) return "┬"
  if (l && r && u) return "┴"
  if (d && r) return "┌"
  if (d && l) return "┐"
  if (u && r) return "└"
  if (u && l) return "┘"
  if (u || d) return "│"
  return "─"
}

function Trace({ onBack }: { onBack: () => void }) {
  const [st, setSt] = useState<TraceState>(() => freshTrace(0, 0))
  const [history, setHistory] = useState<TraceState[]>([])
  const [help, setHelp] = useState(false)
  const [paused, setPaused] = useState(false)
  const [said, setSaid] = useState("")
  const regionRef = useRef<HTMLDivElement>(null)
  const level = TRACE_LEVELS[st.level]
  const map = level.map
  const nodes: string[] = []
  map.forEach((row, r) => row.split("").forEach((ch, c) => (ch === "o" || ARROW_DIR[ch]) && nodes.push(`${r},${c}`)))
  const won = nodes.every((n) => st.lit.includes(n))
  const last = st.level === TRACE_LEVELS.length - 1

  useEffect(() => {
    regionRef.current?.focus({ preventScroll: true })
  }, [])

  const at = (p: Pos) => map[p.r]?.[p.c]

  const lay = (d: Dir) => {
    if (won) {
      setSaid("Every node is lit. Press Enter for the next level.")
      return
    }
    const [dr, dc] = DIRS[d]
    const to = { r: st.pen.r + dr, c: st.pen.c + dc }
    const ch = at(to)
    const fromCh = at(st.pen)
    if (!ch || ch === "#") {
      setSaid(ch ? "A wall is in the way." : "That is the edge of the board.")
      return
    }
    if (fromCh === "+" && st.lastDir && d !== st.lastDir) {
      setSaid("On a via the wire has to carry straight on.")
      return
    }
    if (st.used >= level.budget) {
      setSaid("Out of wire. Undo with u or restart with r.")
      return
    }
    const k = key(to)
    const horizontal = d === "left" || d === "right"
    if (ch === "+") {
      const via = st.vias[k] ?? { h: false, v: false }
      if (horizontal ? via.h : via.v) {
        setSaid("That via already carries a wire this way.")
        return
      }
    } else if (ch === "S" || st.lit.includes(k) || (ch === "." && st.wires[k])) {
      setSaid("That cell already has wire.")
      return
    }
    if (ARROW_DIR[ch] && ARROW_DIR[ch] !== d) {
      setSaid(`That node only takes wire moving ${ARROW_DIR[ch]}.`)
      return
    }
    setHistory((h) => [...h, st])
    const wires = { ...st.wires }
    const vias = { ...st.vias }
    const fk = key(st.pen)
    wires[fk] = (wires[fk] ?? "") + DIR_LETTER[d]
    wires[k] = (wires[k] ?? "") + DIR_LETTER[OPP[d]]
    if (ch === "+") {
      const via = vias[k] ?? { h: false, v: false }
      vias[k] = horizontal ? { ...via, h: true } : { ...via, v: true }
    }
    const lights = ch === "o" || !!ARROW_DIR[ch]
    const lit = lights ? [...st.lit, k] : st.lit
    const used = st.used + 1
    const allLit = nodes.every((n) => lit.includes(n))
    const gain = allLit ? 100 + 10 * (level.budget - used) : 0
    setSt({ ...st, wires, vias, lit, pen: to, lastDir: d, used, score: st.score + gain })
    setSaid(
      `Wire ${d}.` +
        (lights ? " Node lit." : ch === "+" ? " Across the via." : "") +
        (allLit ? ` Every node lit for ${gain} points. ${last ? "That was the last level." : "Enter for the next level."}` : ` ${level.budget - used} wire left.`),
    )
  }

  const nextPoint = () => {
    if (won) {
      if (last) {
        setSaid(`All levels done with ${st.score} points. q for the menu.`)
        return
      }
      setHistory([])
      setSt(freshTrace(st.level + 1, st.score))
      setSaid(`Level ${st.level + 2}: ${TRACE_LEVELS[st.level + 1].name}. ${TRACE_LEVELS[st.level + 1].note}`)
      return
    }
    const points = [key(findSource(st.level)), ...st.lit]
    const i = points.indexOf(key(st.pen))
    const [r, c] = points[(i + 1) % points.length].split(",").map(Number)
    setSt({ ...st, pen: { r, c }, lastDir: null })
    setSaid(`Pen at row ${r + 1}, column ${c + 1}, ${at({ r, c }) === "S" ? "the source" : "a lit node"}.`)
  }

  const undo = () => {
    const prev = history[history.length - 1]
    if (!prev) {
      setSaid("Nothing to undo.")
      return
    }
    setHistory((h) => h.slice(0, -1))
    setSt(prev)
    setSaid("Undone.")
  }

  const restart = () => {
    setHistory([])
    setSt((cur) => freshTrace(cur.level, cur.score))
    setSaid(`Level ${st.level + 1} restarted.`)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const k = e.key
    if (k === "?") setHelp((h) => !h)
    else if (k === "q" || k === "Q" || k === "Escape") onBack()
    else if (k === " ") {
      setPaused((p) => !p)
      setSaid(paused ? "Carrying on." : "Paused.")
    } else if (paused || help) return
    else if (ARROW_KEYS[k]) lay(ARROW_KEYS[k])
    else if ((k === "Tab" && !e.shiftKey) || k === "Enter") nextPoint()
    else if (k === "u" || k === "U" || k === "Backspace") undo()
    else if (k === "r" || k === "R") restart()
    else return
    e.preventDefault()
    e.stopPropagation()
  }

  const glyph = (r: number, c: number): [string, string, string] => {
    const ch = map[r][c]
    const k = `${r},${c}`
    const wire = st.wires[k] ?? ""
    const lit = st.lit.includes(k)
    const right = wire.includes("R") ? "─" : " "
    if (ch === "S") return ["◆", `${s.yellow} font-bold`, right]
    if (ch === "#") return ["█", s.dim, " "]
    if (ch === "o") return [lit ? "●" : "○", lit ? `${s.green} font-bold` : s.white, right]
    if (ARROW_DIR[ch]) {
      const glyphs: Record<string, [string, string]> = { "^": ["△", "▲"], v: ["▽", "▼"], "<": ["◁", "◀"], ">": ["▷", "▶"] }
      return [glyphs[ch][lit ? 1 : 0], lit ? `${s.green} font-bold` : s.white, right]
    }
    if (ch === "+") {
      const via = st.vias[k]
      return [via && (via.h || via.v) ? "╋" : "┼", via && (via.h || via.v) ? `${s.cyan} font-bold` : s.dim, right]
    }
    if (wire) return [wireGlyph(wire), `${s.cyan} font-bold`, right]
    return ["·", s.dim, " "]
  }

  return (
    <div ref={regionRef} role="application" tabIndex={0} onKeyDown={onKeyDown} className={`${s.viewRegion} flex flex-col flex-1 min-h-0`} aria-label={`Trace, level ${st.level + 1}: ${level.name}. ${level.note} Arrows lay wire, Tab moves the pen, u undoes, question mark for help, q for the menu.`}>
      <GameFrame
        title="Trace"
        status={`level ${st.level + 1}/${TRACE_LEVELS.length} ${level.name}  lit ${st.lit.length}/${nodes.length}  wire ${level.budget - st.used} left  score ${st.score}`}
        help={[
          "Light every node by running wire to it from the source (◆).",
          "The pen starts at the source. Each arrow lays one cell of wire from the pen.",
          "Entering a node lights it (○ becomes ●). A lit node is a junction: Tab moves the pen to the next lit point so a new wire can branch from it.",
          "Wires never cross or share a cell, except on a via (┼), where one wire may run straight across another.",
          "Arrow nodes (△ ▽ ◁ ▷) only take wire arriving the way they point.",
          "Each level has a wire budget. 100 points for each circuit lit, plus 10 for each cell of wire left. There is no way to lose.",
        ]}
        showHelp={help}
        paused={paused}
        keys="arrows or hjkl lay wire  Tab next point  u undo  r restart  ? help  q menu"
        said={said}
        buttons={
          <>
            {(["up", "left", "down", "right"] as Dir[]).map((d) => (
              <button key={d} type="button" className={BTN} onClick={() => lay(d)} aria-label={`Lay wire ${d}`}>
                {{ up: "↑", left: "←", down: "↓", right: "→" }[d]}
              </button>
            ))}
            <button type="button" className={BTN} onClick={nextPoint}>
              {won ? "Enter next level" : "Tab next point"}
            </button>
            <button type="button" className={BTN} onClick={undo}>
              u undo
            </button>
            <button type="button" className={BTN} onClick={restart}>
              r restart
            </button>
            <button type="button" className={BTN} onClick={() => setHelp((h) => !h)} aria-pressed={help}>
              ? help
            </button>
            <button type="button" className={BTN} onClick={onBack}>
              q menu
            </button>
          </>
        }
      >
        <p className={`${s.line} ${s.white} leading-relaxed`}>{level.note}</p>
        <div aria-hidden="true" className="whitespace-pre leading-relaxed mt-2 text-base">
          {map.map((row, r) => (
            <div key={r}>
              {row.split("").map((_, c) => {
                const [g, cls, after] = glyph(r, c)
                const pen = st.pen.r === r && st.pen.c === c
                return (
                  <span key={c}>
                    <span className={pen ? `${s.tmuxCurrent} font-bold` : cls}>{g}</span>
                    <span className={s.cyan}>{after}</span>
                  </span>
                )
              })}
            </div>
          ))}
        </div>
        {won && (
          <p className={`${s.green} font-bold leading-relaxed mt-2`}>
            every node lit. {last ? "that was the last level." : "Enter for the next level."}
          </p>
        )}
      </GameFrame>
    </div>
  )
}

export function GamesView({
  start,
  seed,
  today,
  heightClass,
  onExit,
  onWatch,
}: {
  start: number
  seed: number
  today: number
  heightClass: string
  onExit: (message: string) => void
  onWatch: (id: string) => void
}) {
  const [open, setOpen] = useState<string | null>(start >= 0 && GAMES[start].playable ? GAMES[start].id : null)
  const [focus, setFocus] = useState(Math.max(0, start))
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) itemRefs.current[focus]?.focus({ preventScroll: false })
    // focus follows the highlighted game only when the menu is showing
  }, [open, focus])

  const back = () => setOpen(null)

  if (open === "termle")
    return (
      <div className={`flex flex-col pt-1 ${heightClass}`} role="region" aria-label="Termle">
        <Termle seed={seed} today={today} onBack={back} />
      </div>
    )
  if (open === "merge-gates")
    return (
      <div className={`flex flex-col pt-1 ${heightClass}`} role="region" aria-label="Merge Gates">
        <MergeGates seed={seed} onBack={back} />
      </div>
    )
  if (open === "trace")
    return (
      <div className={`flex flex-col pt-1 ${heightClass}`} role="region" aria-label="Trace">
        <Trace onBack={back} />
      </div>
    )

  const chosen = GAMES[focus]
  const onKeyDown = (e: React.KeyboardEvent) => {
    const k = e.key
    if (k === "ArrowDown" || k === "j") setFocus((f) => (f + 1) % GAMES.length)
    else if (k === "ArrowUp" || k === "k") setFocus((f) => (f - 1 + GAMES.length) % GAMES.length)
    else if (k === "Home") setFocus(0)
    else if (k === "End") setFocus(GAMES.length - 1)
    else if (k === "q" || k === "Q" || k === "Escape") onExit("Closed zacess-games.")
    else return
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div ref={menuRef} role="region" aria-label="Zacess Games menu" onKeyDown={onKeyDown} className={`flex flex-col pt-1 ${heightClass}`}>
      <div className={`${s.nvimStatus} flex items-stretch text-xs leading-6 shrink-0`}>
        <span className={`${s.nvimMode} px-2 font-bold`}>GAMES</span>
        <span className="px-2 flex-1 min-w-0 truncate">arrows choose  Enter plays  q leaves</span>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 sm:px-3 pt-2">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-2" aria-label="Games">
          {GAMES.map((g, i) => (
            <li key={g.id}>
              <button
                ref={(el) => {
                  itemRefs.current[i] = el
                }}
                type="button"
                tabIndex={i === focus ? 0 : -1}
                onFocus={() => setFocus(i)}
                onClick={() => (g.playable ? setOpen(g.id) : onWatch(g.id))}
                aria-describedby="zacess-game-detail"
                className={`${s.menuItem} w-full min-h-11 px-2 text-left`}
              >
                <span aria-hidden="true">{i === focus ? "> " : "  "}</span>
                <span className="font-bold">{g.name}</span>
                <span className={s.white}>{g.playable ? "  [here]" : "  [watch]"}</span>
              </button>
            </li>
          ))}
        </ul>
        <div id="zacess-game-detail" className={`${s.line} leading-relaxed mt-3`}>
          <p className={`${s.cyan} font-bold`}>{chosen.name}</p>
          <p className={s.fg}>{chosen.summary}.</p>
          {chosen.playable ? (
            <p className={s.green}>plays here: press Enter.</p>
          ) : (
            <>
              <p className={s.green}>a recording plays here: press Enter.</p>
              <p className={s.yellow}>to play it, the full terminal app:</p>
              <p className={s.fg}>  {INSTALL_LINES[0]}</p>
              <p className={s.fg}>  {INSTALL_LINES[1]}</p>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-1 px-2 sm:px-3 pt-1 shrink-0">
        <button type="button" className={BTN} onClick={() => onExit("Closed zacess-games.")}>
          q leave
        </button>
      </div>
    </div>
  )
}
