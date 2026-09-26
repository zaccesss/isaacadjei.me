"use client"

import { useMemo, useState } from "react"
import { Wordcloud } from "@visx/wordcloud"
import { DEFAULT_CHART_COLOURS } from "./charts"

interface WordDatum {
  text: string
  value: number
}

const fontScale = (words: WordDatum[]) => {
  const max = Math.max(...words.map((w) => w.value), 1)
  const min = Math.min(...words.map((w) => w.value), 0)
  return (datum: WordDatum) => {
    const t = max === min ? 1 : (datum.value - min) / (max - min)
    return 12 + t * 34
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
  const fontSize = useMemo(() => fontScale(words), [words])
  const valueByText = useMemo(() => new Map(words.map((w) => [w.text, w.value])), [words])

  if (!words.length) {
    return <p className="text-xs text-muted-foreground">No data for this period.</p>
  }

  return (
    <div
      ref={(el) => {
        if (el) setWidth(el.clientWidth)
      }}
      className="w-full flex items-center justify-center"
      style={{ height }}
    >
      <Wordcloud
        words={words}
        width={width}
        height={height}
        fontSize={fontSize}
        font="inherit"
        padding={2}
        spiral="archimedean"
        rotate={0}
        random={() => 0.5}
      >
        {(cloudWords) =>
          cloudWords.map((w, i) => (
            <text
              key={w.text}
              textAnchor="middle"
              transform={`translate(${w.x}, ${w.y})`}
              fontSize={w.size}
              fontFamily={w.font}
              fill={DEFAULT_CHART_COLOURS[i % DEFAULT_CHART_COLOURS.length]}
            >
              <title>{`${w.text}: ${valueByText.get(w.text ?? "") ?? 0} ${valueLabel}`}</title>
              {w.text}
            </text>
          ))
        }
      </Wordcloud>
    </div>
  )
}
