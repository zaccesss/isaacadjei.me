"use client"

import { useEffect, useRef, useState } from "react"
import { BookOpen, Headphones, Tv2 } from "lucide-react"
import { siteHost, siteIconUrl } from "@/data/consumed/types"
import { cn } from "@/lib/utils"

type Kind = "cover" | "thumb" | "preview"

export function ConsumedImage({
  src,
  alt,
  kind,
  sourceUrl,
  className,
}: {
  src?: string
  alt: string
  kind: Kind
  sourceUrl?: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  const ref = useRef<HTMLImageElement>(null)
  useEffect(() => {
    const img = ref.current
    if (img && img.complete && img.naturalWidth === 0) setFailed(true)
  }, [])
  const shape = kind === "cover" ? "aspect-[2/3]" : "aspect-video"
  const showImage = src && !failed

  return (
    <div className={cn("relative overflow-hidden bg-muted", shape, className)}>
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className={cn("absolute inset-0 h-full w-full", kind === "preview" ? "object-contain" : "object-cover")}
        />
      ) : (
        <FallbackTile kind={kind} sourceUrl={sourceUrl} alt={alt} />
      )}
    </div>
  )
}

function FallbackTile({ kind, sourceUrl, alt }: { kind: Kind; sourceUrl?: string; alt: string }) {
  const Icon = kind === "cover" ? BookOpen : kind === "thumb" ? Tv2 : Headphones
  return (
    <div role="img" aria-label={alt} className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center">
      {sourceUrl ? (
        <>
          <SiteIcon url={sourceUrl} size={32} />
          <span className="text-xs font-medium text-muted-foreground break-all">{siteHost(sourceUrl)}</span>
        </>
      ) : (
        <>
          <Icon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
          <span className="text-xs font-medium text-muted-foreground line-clamp-3">{alt}</span>
        </>
      )}
    </div>
  )
}

export function SiteIcon({ url, size = 16, className }: { url: string; size?: number; className?: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={siteIconUrl(url)}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn("shrink-0 rounded-sm", className)}
    />
  )
}
