"use client"

import ReactECharts from "echarts-for-react"
import type { ComponentProps } from "react"
import { useMediaQuery } from "@/hooks/useMediaQuery"

export default function EChart({ option, ...rest }: ComponentProps<typeof ReactECharts>) {
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)")
  const motion = reduce ? { animation: false } : { animationDuration: 0, animationDurationUpdate: 250, animationEasingUpdate: "cubicOut" }
  return <ReactECharts option={{ ...option, ...motion }} {...rest} />
}
