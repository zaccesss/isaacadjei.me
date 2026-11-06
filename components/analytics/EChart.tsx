"use client"

import ReactECharts from "echarts-for-react"
import type { ComponentProps } from "react"
import { useMediaQuery } from "@/hooks/useMediaQuery"

export default function EChart({ option, ...rest }: ComponentProps<typeof ReactECharts>) {
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)")
  return <ReactECharts option={reduce ? { ...option, animation: false } : option} {...rest} />
}
