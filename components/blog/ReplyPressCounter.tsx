"use client"

import { useEffect } from "react"
import { opensLink, replyNetworkOf, replyPage } from "@/lib/content/reply-presses"
import { asksNotToBeCounted } from "@/lib/content/no-count"

export default function ReplyPressCounter() {
  useEffect(() => {
    const onPress = (event: MouseEvent) => {
      if (!opensLink(event.type, event.button)) return
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null
      const network = link ? replyNetworkOf(link.getAttribute("href") ?? "") : null
      if (!network || !replyPage(window.location.pathname)) return
      if (asksNotToBeCounted(document.cookie)) return
      const payload = JSON.stringify({ path: window.location.pathname, network })
      if (navigator.sendBeacon) navigator.sendBeacon("/api/reply-press", new Blob([payload], { type: "application/json" }))
      else fetch("/api/reply-press", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true }).catch(() => undefined)
    }
    document.addEventListener("click", onPress)
    document.addEventListener("auxclick", onPress)
    return () => {
      document.removeEventListener("click", onPress)
      document.removeEventListener("auxclick", onPress)
    }
  }, [])
  return null
}
