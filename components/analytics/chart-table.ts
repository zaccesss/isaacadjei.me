import type { ChartTable } from "./ChartFrame"

type Cell = string | number
const plain = (v: number) => v.toLocaleString("en-GB", { maximumFractionDigits: 1 })

export function tableOf<T extends Record<string, unknown>>(
  rows: T[],
  columns: [string, string],
  { key = "value", name = "name", format = plain }: { key?: string; name?: string; format?: (v: number) => string } = {},
): ChartTable {
  return { columns, rows: rows.map((r) => [String(r[name] ?? ""), format(Number(r[key] ?? 0))]) }
}

export function seriesTable<T extends Record<string, unknown>>(
  rows: T[],
  first: string,
  series: { key: string; name: string }[],
  { x = "name", format = plain }: { x?: string; format?: (v: number) => string } = {},
): ChartTable {
  return { columns: [first, ...series.map((s) => s.name)], rows: rows.map((r) => [String(r[x] ?? ""), ...series.map((s) => format(Number(r[s.key] ?? 0)))] as Cell[]) }
}

export function hoursTable(values: number[], column: string, format: (v: number) => string = plain): ChartTable {
  return { columns: ["Hour", column], rows: values.map((v, h) => [`${String(h).padStart(2, "0")}:00`, format(v)]) }
}
