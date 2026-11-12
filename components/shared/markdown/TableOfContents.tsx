"use client"

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react"
import { List, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  TOC_ACTIVE_LINE,
  activeHeadingIndex,
  scrollTopToReveal,
  tocEntries,
  type TocHeading,
  type TocSection,
} from "@/lib/content/toc"

export type { TocHeading }

interface TableOfContentsProps {
  headings: TocHeading[]
  sections?: TocSection[]
}

const NO_SECTIONS: TocSection[] = []

const LABEL = "Table of contents"

function revealCurrent(list: HTMLElement | null) {
  if (!list || list.scrollHeight <= list.clientHeight) return
  const entry = list.querySelector<HTMLElement>('[aria-current="location"]')
  if (!entry) return
  const top = entry.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop
  const title = list.querySelector<HTMLElement>("[data-toc-title]")?.offsetHeight ?? 0
  list.scrollTop = scrollTopToReveal(top - title, entry.offsetHeight + title, list.scrollTop, list.clientHeight)
}

const SIDE_MIN_HEIGHT = 132

function fitSideList(list: HTMLElement | null) {
  const cell = list?.parentElement
  if (!list || !cell || list.offsetParent === null) return
  const pinTop = parseFloat(getComputedStyle(list).top) || 0
  const room = cell.getBoundingClientRect().bottom - pinTop
  const cap = window.innerHeight - pinTop - 24
  const next = room < cap ? `${Math.max(SIDE_MIN_HEIGHT, Math.floor(room))}px` : ""
  if (list.style.maxHeight === next) return
  list.style.maxHeight = next
  revealCurrent(list)
}

export default function TableOfContents({ headings, sections = NO_SECTIONS }: TableOfContentsProps) {
  const [active, setActive] = useState("")
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const wrapRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const sideRef = useRef<HTMLElement>(null)
  const entryList = useMemo(() => tocEntries(headings, sections), [headings, sections])
  const show = entryList.length > 0

  useEffect(() => {
    if (!show) return
    let frame = 0
    const measure = () => {
      const els = entryList.map((h) => document.getElementById(h.id))
      const tops = els.map((el) => (el ? el.getBoundingClientRect().top : Number.POSITIVE_INFINITY))
      const atPageEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
      const i = activeHeadingIndex(tops, TOC_ACTIVE_LINE, atPageEnd, window.innerHeight)
      setActive(i < 0 ? "" : entryList[i].id)
      fitSideList(sideRef.current)
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [entryList, show])

  useEffect(() => {
    revealCurrent(sideRef.current)
  }, [active])

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false)
    if (returnFocus) buttonRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    revealCurrent(panel)
    const target =
      panel?.querySelector<HTMLElement>('[aria-current="location"]') ?? panel?.querySelector<HTMLElement>("a")
    target?.focus({ preventScroll: true })
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true)
    }
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close(false)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointer)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointer)
    }
  }, [open, close])

  if (!show) return null

  const jump = (id: string) => {
    const box = document.getElementById(id)
    const el = box && !/^H[1-6]$/.test(box.tagName) ? (box.querySelector<HTMLElement>("h2, h3") ?? box) : box
    if (el) {
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1")
      el.focus({ preventScroll: true })
      if (el !== box) requestAnimationFrame(() => el.focus({ preventScroll: true }))
    }
    setActive(id)
    setOpen(false)
  }

  const entries = (large: boolean) => (
    <ul className={large ? "space-y-0.5" : undefined}>
      {entryList.map((h) => {
        const current = active === h.id
        return (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              aria-current={current ? "location" : undefined}
              onClick={() => jump(h.id)}
              className={cn(
                large
                  ? cn("text-base py-1.5 leading-snug flex min-h-11 items-center border-l-[3px]", h.level === 3 ? "pl-7" : "pl-3")
                  : "text-[0.875rem] py-1.5 leading-tight block",
                "pr-2 hover:underline underline-offset-4 motion-safe:transition-colors",
                "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary",
                current
                  ? cn("font-semibold text-foreground", large && "border-primary")
                  : cn(
                      "font-normal hover:text-foreground",
                      large ? "border-transparent text-foreground/80 hover:border-foreground/40" : "text-muted-foreground",
                    ),
              )}
            >
              {large ? (
                h.text
              ) : (
                <span className={cn("block border-l-2", h.level === 3 ? "pl-6" : "pl-3", current ? "border-primary" : "border-transparent")}>
                  {h.text}
                </span>
              )}
            </a>
          </li>
        )
      })}
    </ul>
  )

  return (
    <>
      <div
        ref={wrapRef}
        className="lg:hidden print:hidden"
        onBlur={(e) => {
          const next = e.relatedTarget as Node | null
          if (open && next && !e.currentTarget.contains(next)) close(false)
        }}
      >
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 inline-flex min-h-11 min-w-11 items-center gap-2 rounded-full border-2 border-foreground bg-background px-4 text-sm font-semibold text-foreground shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {open ? <X className="h-4 w-4" aria-hidden="true" /> : <List className="h-4 w-4" aria-hidden="true" />}
          Contents
        </button>
        <nav
          ref={panelRef}
          id={panelId}
          hidden={!open}
          aria-label={LABEL}
          className="fixed bottom-[calc(max(1rem,env(safe-area-inset-bottom))+3.5rem)] right-4 z-40 max-h-[calc(100dvh-10rem)] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-xl border-2 border-foreground bg-background p-3 shadow-xl"
        >
          {entries(true)}
        </nav>
      </div>

      <nav
        ref={sideRef}
        aria-label={LABEL}
        className="hidden lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1 lg:block lg:max-h-[calc(100dvh-7.5rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain"
      >
        <p data-toc-title className="sticky top-0 z-10 bg-background pb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">Contents</p>
        {entries(false)}
      </nav>
    </>
  )
}
