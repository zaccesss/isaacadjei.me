"use client"
import { useEffect, useId, useRef, useState } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { CHIP_CLASS } from "@/components/shared/Tag"
import { SORT_LABELS, type ListQuery, type SortKey } from "@/components/shared/useListQuery"

export interface FilterOption {
  value: string
  label: string
  count?: number
}

export interface FilterGroup {
  key: string
  label: string
  kind: "single" | "multi"
  options: FilterOption[]
  chips?: boolean
}

interface ListControlsProps {
  query: ListQuery
  groups: FilterGroup[]
  sortOptions?: SortKey[]
  searchPlaceholder: string
  searchLabel: string
  resultCount: number
  itemLabel: { one: string; many: string }
  className?: string
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

const SEARCHABLE_AFTER = 8

export default function ListControls({
  query,
  groups,
  sortOptions = ["newest", "oldest", "az", "za"],
  searchPlaceholder,
  searchLabel,
  resultCount,
  itemLabel,
  className,
}: ListControlsProps) {
  const [open, setOpen] = useState(false)
  const [optionSearch, setOptionSearch] = useState<Record<string, string>>({})
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const pushedThisOpen = useRef(false)
  const baseId = useId()
  const panelId = `${baseId}-filters`
  const headingId = `${baseId}-filters-heading`

  const visibleGroups = groups.filter((g) => g.options.length > 1)
  const defaultSort = sortOptions[0]

  const activeChips = visibleGroups.flatMap((g) =>
    query.getAll(g.key).map((value) => ({
      group: g,
      value,
      label: g.options.find((o) => o.value === value)?.label ?? value,
    })),
  )
  const sortActive = query.sort !== defaultSort && sortOptions.includes(query.sort)
  const activeCount = activeChips.length + (sortActive ? 1 : 0)

  function close(returnFocus = true) {
    setOpen(false)
    if (returnFocus) buttonRef.current?.focus()
  }

  function openPanel() {
    pushedThisOpen.current = false
    setOpen(true)
  }

  function apply(changes: Record<string, string | string[] | null>) {
    query.update(changes, { replace: open && pushedThisOpen.current })
    if (open) pushedThisOpen.current = true
  }

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    panel?.scrollIntoView({ block: "nearest" })
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true })
    const narrow = window.matchMedia("(max-width: 639px)").matches
    const previous = document.body.style.overflow
    if (narrow) document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  function onPanelKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.stopPropagation()
      close()
      return
    }
    if (e.key !== "Tab" || !panelRef.current) return
    const items = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null)
    if (items.length === 0) return
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const countText = `${resultCount} ${resultCount === 1 ? itemLabel.one : itemLabel.many}`

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative flex items-stretch gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            aria-label={searchLabel}
            placeholder={searchPlaceholder}
            value={query.search}
            onChange={(e) => query.setSearch(e.target.value)}
            className="h-11 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 sm:h-10"
          />
        </div>
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-haspopup="dialog"
          onClick={() => (open ? close() : openPanel())}
          className={cn(
            "inline-flex h-11 shrink-0 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors sm:h-10",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
            activeCount > 0 ? "border-primary text-foreground" : "border-border text-foreground hover:border-foreground/40",
          )}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters
          {activeCount > 0 && (
            <span className="rounded-full bg-primary px-1.5 text-xs font-semibold leading-5 text-primary-foreground">
              {activeCount}
              <span className="sr-only"> active</span>
            </span>
          )}
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40 bg-black/50 sm:bg-transparent" aria-hidden="true" onClick={() => close(false)} />
            <div
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-modal="true"
              aria-labelledby={headingId}
              onKeyDown={onPanelKeyDown}
              className={cn(
                "fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl border border-border bg-background p-5 shadow-xl",
                "sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-full sm:mt-2 sm:max-h-[70vh] sm:w-88 sm:rounded-xl sm:p-4",
                "motion-safe:animate-in motion-safe:fade-in",
              )}
            >
              <div className="mb-4 flex items-center justify-between gap-2">
                <h2 id={headingId} className="text-base font-semibold">Filters</h2>
                <button
                  type="button"
                  onClick={() => close()}
                  aria-label="Close filters"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground sm:h-8 sm:w-8"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="space-y-5">
                {visibleGroups.map((g) => {
                  const selected = query.getAll(g.key)
                  const filterText = (optionSearch[g.key] ?? "").toLowerCase().trim()
                  const searchable = g.kind === "multi" && g.options.length > SEARCHABLE_AFTER
                  const shown = filterText ? g.options.filter((o) => o.label.toLowerCase().includes(filterText)) : g.options
                  const name = `${baseId}-${g.key}`
                  return (
                    <fieldset key={g.key} className="space-y-2">
                      <legend className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">{g.label}</legend>
                      {searchable && (
                        <input
                          type="search"
                          aria-label={`Search ${g.label.toLowerCase()}`}
                          placeholder={`Search ${g.label.toLowerCase()}…`}
                          value={optionSearch[g.key] ?? ""}
                          onChange={(e) => setOptionSearch((s) => ({ ...s, [g.key]: e.target.value }))}
                          className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 sm:h-9"
                        />
                      )}
                      <div className={cn("space-y-0.5", g.kind === "multi" && "max-h-56 overflow-y-auto pr-1")}>
                        {g.kind === "single" && (
                          <OptionRow
                            type="radio"
                            name={name}
                            label="Any"
                            checked={selected.length === 0}
                            onChange={() => apply({ [g.key]: null })}
                          />
                        )}
                        {shown.map((o) => (
                          <OptionRow
                            key={o.value}
                            type={g.kind === "single" ? "radio" : "checkbox"}
                            name={name}
                            label={o.label}
                            count={o.count}
                            chip={g.chips}
                            checked={selected.includes(o.value)}
                            onChange={(checked) => {
                              if (g.kind === "single") apply({ [g.key]: o.value })
                              else apply({ [g.key]: checked ? [...selected, o.value] : selected.filter((v) => v !== o.value) })
                            }}
                          />
                        ))}
                        {shown.length === 0 && <p className="py-2 text-sm text-muted-foreground">No {g.label.toLowerCase()} match.</p>}
                      </div>
                    </fieldset>
                  )
                })}

                {sortOptions.length > 1 && (
                  <fieldset className="space-y-2">
                    <legend className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">Sort</legend>
                    <div className="space-y-0.5">
                      {sortOptions.map((s) => (
                        <OptionRow
                          key={s}
                          type="radio"
                          name={`${baseId}-sort`}
                          label={SORT_LABELS[s]}
                          checked={query.sort === s}
                          onChange={() => apply({ sort: s === defaultSort ? null : s })}
                        />
                      ))}
                    </div>
                  </fieldset>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => query.clearAll(visibleGroups.map((g) => g.key))}
                  className="min-h-11 text-sm font-medium text-primary underline underline-offset-2 sm:min-h-8"
                >
                  Clear all
                </button>
                <button
                  type="button"
                  onClick={() => close()}
                  className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:min-h-9"
                >
                  Show {countText}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Active filters">
          {activeChips.map(({ group, value, label }) => (
            <button
              key={`${group.key}-${value}`}
              type="button"
              onClick={() =>
                query.update({ [group.key]: query.getAll(group.key).filter((v) => v !== value) })
              }
              aria-label={`Remove ${group.label.toLowerCase()} filter ${label}`}
              className={cn(CHIP_CLASS, "min-h-11 gap-1 border border-border hover:border-primary focus-visible:outline-2 focus-visible:outline-primary sm:min-h-0")}
            >
              <span className="text-muted-foreground">{group.label}:</span> {label}
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          ))}
          {sortActive && (
            <button
              type="button"
              onClick={() => query.update({ sort: null }, { keepPage: true })}
              aria-label={`Remove sort ${SORT_LABELS[query.sort]}`}
              className={cn(CHIP_CLASS, "min-h-11 gap-1 border border-border hover:border-primary focus-visible:outline-2 focus-visible:outline-primary sm:min-h-0")}
            >
              <span className="text-muted-foreground">Sort:</span> {SORT_LABELS[query.sort]}
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            onClick={() => query.clearAll(visibleGroups.map((g) => g.key))}
            className="min-h-11 px-1 text-xs font-medium text-primary underline underline-offset-2 sm:min-h-0"
          >
            Clear all
          </button>
        </div>
      )}

      <p className="font-mono text-xs text-muted-foreground" aria-live="polite" aria-atomic="true">
        {countText}
      </p>
    </div>
  )
}

interface OptionRowProps {
  type: "radio" | "checkbox"
  name: string
  label: string
  count?: number
  chip?: boolean
  checked: boolean
  onChange: (checked: boolean) => void
}

function OptionRow({ type, name, label, count, chip, checked, onChange }: OptionRowProps) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-2 text-sm hover:bg-muted/60 sm:min-h-8">
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 shrink-0 accent-primary"
      />
      <span className="flex-1">
        <span className={cn(chip && CHIP_CLASS, checked && "font-semibold")}>{label}</span>
      </span>
      {count !== undefined && <span className="font-mono text-xs text-muted-foreground">{count}</span>}
    </label>
  )
}
