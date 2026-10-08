"use client"
import { useSyncExternalStore } from "react"
import Link from "next/link"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type PaginationProps = {
  page: number
  totalPages: number
  onChange?: (page: number) => void
  baseHref?: string
  totalItems?: number
  pageSize?: number
  itemLabel?: string
  className?: string
  pageSizeOptions?: number[]
  onPageSizeChange?: (size: number) => void
  scrollTargetId?: string
  label?: string
}

const BASE =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border text-sm font-medium transition-colors sm:min-h-9 sm:min-w-9 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
const IDLE = "border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground"
const CURRENT = "border-2 border-primary bg-primary font-bold text-primary-foreground underline underline-offset-4"

function pageWindow(page: number, total: number): (number | "gap")[] {
  const keep = new Set([1, total, page - 1, page, page + 1].filter((p) => p >= 1 && p <= total))
  const sorted = [...keep].sort((a, b) => a - b)
  const out: (number | "gap")[] = []
  sorted.forEach((p, i) => {
    const prev = sorted[i - 1]
    if (prev !== undefined && p - prev === 2) out.push(prev + 1)
    else if (prev !== undefined && p - prev > 2) out.push("gap")
    out.push(p)
  })
  return out
}

function scrollToList(id?: string) {
  if (!id) return
  requestAnimationFrame(() => {
    const el = document.getElementById(id)
    if (!el) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })
  })
}

export function Pagination({
  page,
  totalPages,
  onChange,
  baseHref,
  totalItems,
  pageSize,
  itemLabel = "items",
  className,
  pageSizeOptions,
  onPageSizeChange,
  scrollTargetId,
  label,
}: PaginationProps) {
  const picker = pageSizeOptions && onPageSizeChange && totalItems !== undefined && totalItems > Math.min(...pageSizeOptions)
  if (totalPages <= 1 && !picker) return null

  const clamp = (p: number) => Math.min(totalPages, Math.max(1, p))
  const hrefFor = baseHref ? (p: number) => `${baseHref}${baseHref.includes("?") ? "&" : "?"}page=${p}` : null
  const go = (p: number) => {
    onChange?.(clamp(p))
    scrollToList(scrollTargetId)
  }

  const step = (key: string, to: number, disabled: boolean, text: string, icon: React.ReactNode, iconFirst: boolean) => {
    const content = iconFirst ? <>{icon}<span>{text}</span></> : <><span>{text}</span>{icon}</>
    const cls = cn(BASE, IDLE, "gap-1 px-3")
    if (disabled) {
      return <span key={key} className={cn(cls, "pointer-events-none opacity-40")} aria-disabled="true">{content}</span>
    }
    return hrefFor ? (
      <Link key={key} href={hrefFor(clamp(to))} className={cls} rel={key}>{content}</Link>
    ) : (
      <button key={key} type="button" onClick={() => go(to)} className={cls}>{content}</button>
    )
  }

  const num = (p: number) => {
    const current = p === page
    const cls = cn(BASE, "px-2", current ? CURRENT : IDLE)
    const aria = { "aria-current": current ? ("page" as const) : undefined, "aria-label": `Page ${p}` }
    return hrefFor ? (
      <Link key={p} href={hrefFor(p)} className={cls} {...aria}>{p}</Link>
    ) : (
      <button key={p} type="button" onClick={() => go(p)} className={cls} {...aria}>{p}</button>
    )
  }

  const from = totalItems !== undefined && pageSize !== undefined ? Math.min(totalItems, (page - 1) * pageSize + 1) : 0
  const to = totalItems !== undefined && pageSize !== undefined ? Math.min(page * pageSize, totalItems) : 0

  return (
    <nav aria-label={label ?? `${itemLabel.charAt(0).toUpperCase()}${itemLabel.slice(1)} pages`} className={cn("flex flex-col items-center gap-3", className)}>
      {totalPages > 1 && (
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-center">
          {step("prev", page - 1, page === 1, "Previous", <ChevronLeft className="h-4 w-4" aria-hidden="true" />, true)}
          <ul className="hidden items-center gap-1 sm:flex">
            {pageWindow(page, totalPages).map((p, i) => (
              <li key={p === "gap" ? `gap-${i}` : p}>
                {p === "gap" ? <span className="px-1 text-sm text-muted-foreground" aria-hidden="true">…</span> : num(p)}
              </li>
            ))}
          </ul>
          <p className="text-sm font-medium sm:hidden">
            Page {page} of {totalPages}
          </p>
          {step("next", page + 1, page === totalPages, "Next", <ChevronRight className="h-4 w-4" aria-hidden="true" />, false)}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {totalItems !== undefined && pageSize !== undefined && totalItems > 0 && (
          <p>
            Showing {from.toLocaleString("en-GB")} to {to.toLocaleString("en-GB")} of {totalItems.toLocaleString("en-GB")} {itemLabel}
          </p>
        )}
        {picker && (
          <label className="inline-flex items-center gap-2">
            Per page
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value))
                scrollToList(scrollTargetId)
              }}
              className="h-11 appearance-none rounded-md border border-border bg-background pl-2.5 pr-7 text-xs text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary sm:h-8"
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none -ml-6 h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          </label>
        )}
      </div>
    </nav>
  )
}

const PAGE_SIZE_EVENT = "pagesizechange"
const memory = new Map<string, string>()

function subscribePageSize(onChange: () => void) {
  window.addEventListener("storage", onChange)
  window.addEventListener(PAGE_SIZE_EVENT, onChange)
  return () => {
    window.removeEventListener("storage", onChange)
    window.removeEventListener(PAGE_SIZE_EVENT, onChange)
  }
}

export function usePageSize(storageKey: string, options: number[], fallback = options[0]): [number, (size: number) => void] {
  const key = `page-size:${storageKey}`
  const stored = useSyncExternalStore(
    subscribePageSize,
    () => {
      try {
        return window.localStorage.getItem(key) ?? memory.get(key) ?? null
      } catch {
        return memory.get(key) ?? null
      }
    },
    () => null,
  )
  const parsed = Number(stored)
  const size = options.includes(parsed) ? parsed : fallback
  const setSize = (next: number) => {
    memory.set(key, String(next))
    try {
      window.localStorage.setItem(key, String(next))
    } catch {
      // storage is blocked, so the in-memory copy above carries the choice for this visit
    }
    window.dispatchEvent(new Event(PAGE_SIZE_EVENT))
  }
  return [size, setSize]
}
