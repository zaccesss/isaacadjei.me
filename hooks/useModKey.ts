"use client"

import { useSyncExternalStore } from "react"

function subscribe() {
  return () => {}
}

function getSnapshot() {
  return (
    navigator.platform.toUpperCase().includes("MAC") ||
    /macintosh|mac os x/i.test(navigator.userAgent)
  )
}

function getServerSnapshot() {
  return false
}

export function useModKey() {
  const isMac = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const modLabel = isMac ? "⌘" : "Ctrl"
  const shortcut = (key: string) => `${isMac ? "⌘" : "Ctrl"} + ${key}`

  return { isMac, modLabel, shortcut }
}
