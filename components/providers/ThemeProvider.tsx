"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { MotionConfig } from "framer-motion"
import { IconContext } from "react-icons"

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const icons = React.useMemo(() => ({ attr: { "aria-hidden": "true" as const } }), [])
  return (
    <NextThemesProvider {...props}>
      <IconContext.Provider value={icons}>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </IconContext.Provider>
    </NextThemesProvider>
  )
}
