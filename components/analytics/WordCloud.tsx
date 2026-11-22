"use client"

import { useCallback, useMemo, useState } from "react"
import { Wordcloud } from "@visx/wordcloud"
import EmptyState from "@/components/shared/EmptyState"
import { CHART_COLOURS } from "@/lib/ui/chart-palette"

interface WordDatum {
  text: string
  value: number
}

const fontScale = (words: WordDatum[]) => {
  const max = Math.max(...words.map((w) => w.value), 1)
  const min = Math.min(...words.map((w) => w.value), 0)
  return (datum: WordDatum) => {
    const t = max === min ? 1 : (datum.value - min) / (max - min)
    return 14 + t * 32
  }
}

export function WordCloud({
  words,
  height = 260,
  valueLabel = "plays",
}: {
  words: WordDatum[]
  height?: number
  valueLabel?: string
}) {
  const [width, setWidth] = useState(600)
  const [family, setFamily] = useState("sans-serif")
  const fontSize = useMemo(() => fontScale(words), [words])
  const valueByText = useMemo(() => new Map(words.map((w) => [w.text, w.value])), [words])
  const measure = useCallback((el: HTMLDivElement | null) => {
    if (!el) return
    setWidth(el.clientWidth)
    setFamily(getComputedStyle(el).fontFamily || "sans-serif")
    const ro = new ResizeObserver(() => setWidth(el.clientWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  if (!words.length) return <EmptyState title="Nothing to show yet" description="Words appear here once there is data for this period." className="py-8" />

  const sorted = [...words].sort((a, b) => b.value - a.value)
  return (
    <div className="relative">
      <div ref={measure} aria-hidden="true" className="flex w-full min-w-0 items-center justify-center overflow-hidden" style={{ height }}>
        <Wordcloud words={words} width={width} height={height} fontSize={fontSize} font={family} padding={3} spiral="archimedean" rotate={0} random={() => 0.5}>
          {(cloudWords) =>
            cloudWords.map((w, i) => (
              <text
                key={w.text}
                textAnchor="middle"
                transform={`translate(${w.x}, ${w.y})`}
                fontSize={w.size}
                fontFamily={w.font}
                fontWeight={i < 3 ? 600 : 500}
                style={{ fill: CHART_COLOURS[i % CHART_COLOURS.length] }}
              >
                <title>{`${w.text}: ${(valueByText.get(w.text ?? "") ?? 0).toLocaleString("en-GB")} ${valueLabel}`}</title>
                {w.text}
              </text>
            ))
          }
        </Wordcloud>
      </div>
      <ol className="sr-only">
        {sorted.map((w) => <li key={w.text}>{`${w.text}: ${w.value.toLocaleString("en-GB")} ${valueLabel}`}</li>)}
      </ol>
    </div>
  )
}
