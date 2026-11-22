"use client"

import { useState } from "react"
import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ShareButtonProps {
  title: string
  url?: string
  label?: string
}

export default function ShareButton({ title, url, label }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const [failed, setFailed] = useState(false)

  async function handleShare() {
    const shareUrl = url ?? window.location.href
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl })
      } catch {
        // user cancelled the share sheet - not an error
      }
      return
    }
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setFailed(true)
      window.setTimeout(() => setFailed(false), 2000)
    }
  }

  if (label) {
    return (
      <Button variant="outline" className="min-h-11 gap-2" onClick={handleShare}>
        <Share2 className="h-4 w-4" aria-hidden="true" />
        <span aria-live="polite">{copied ? "Link copied" : failed ? "Copy failed" : label}</span>
      </Button>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0" onClick={handleShare} aria-label="Share this page">
            {copied ? (
              <span className="text-xs font-medium">Copied!</span>
            ) : failed ? (
              <span className="text-xs font-medium text-destructive">Copy failed</span>
            ) : (
              <Share2 className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Share this page</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
