"use client"

import Link from "next/link"
import { useState, type ComponentProps } from "react"

export default function IntentLink({ prefetch, onMouseEnter, onFocus, onTouchStart, ...rest }: ComponentProps<typeof Link>) {
  const [intent, setIntent] = useState(false)
  const value = prefetch === false ? false : intent ? (prefetch ?? null) : false
  return (
    <Link
      {...rest}
      prefetch={value}
      onMouseEnter={(e) => {
        setIntent(true)
        onMouseEnter?.(e)
      }}
      onFocus={(e) => {
        setIntent(true)
        onFocus?.(e)
      }}
      onTouchStart={(e) => {
        setIntent(true)
        onTouchStart?.(e)
      }}
    />
  )
}
