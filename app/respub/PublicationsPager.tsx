"use client"

import { Children, Suspense, type ReactNode } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

function View({ perPage, page, children }: { perPage: number; page: number; children: ReactNode }) {
  const items = Children.toArray(children)
  const totalPages = Math.max(1, Math.ceil(items.length / perPage))
  const currentPage = Math.max(1, Math.min(page, totalPages))
  const step = "inline-flex items-center justify-center h-8 w-8 rounded-md border text-sm hover:bg-muted transition-colors"

  return (
    <>
      <div className="space-y-6">
        {items.map((item, i) => (
          <div key={i} className={Math.floor(i / perPage) + 1 === currentPage ? "" : "hidden"}>
            {item}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-2">
          {currentPage > 1 && <Link href={`?page=${currentPage - 1}`} className={step}>‹</Link>}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`?page=${p}`}
              className={cn("inline-flex items-center justify-center h-8 w-8 rounded-md border text-sm transition-colors", p === currentPage ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted")}
            >
              {p}
            </Link>
          ))}
          {currentPage < totalPages && <Link href={`?page=${currentPage + 1}`} className={step}>›</Link>}
        </div>
      )}
    </>
  )
}

function FromQuery(props: { perPage: number; children: ReactNode }) {
  const requested = parseInt(useSearchParams().get("page") ?? "1", 10)
  return <View {...props} page={Number.isNaN(requested) ? 1 : requested} />
}

export default function PublicationsPager(props: { perPage: number; children: ReactNode }) {
  return (
    <Suspense fallback={<View {...props} page={1} />}>
      <FromQuery {...props} />
    </Suspense>
  )
}
