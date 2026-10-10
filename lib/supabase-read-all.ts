import { supabase } from "@/lib/supabase"

export async function readAll<T>(table: string, columns: string, since: { column: string; value: string }): Promise<T[]> {
  const { count } = await supabase.from(table).select("*", { count: "exact", head: true }).gte(since.column, since.value)
  const pages = Math.max(1, Math.ceil((count ?? 0) / 1000))
  const parts = await Promise.all(
    Array.from({ length: pages }, (_, i) =>
      supabase.from(table).select(columns).gte(since.column, since.value).order(since.column, { ascending: true }).range(i * 1000, i * 1000 + 999),
    ),
  )
  return parts.flatMap((p) => (p.data as T[] | null) ?? [])
}
