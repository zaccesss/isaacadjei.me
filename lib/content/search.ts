export function fieldScore(text: string, query: string): number {
  const t = text.toLowerCase()
  const q = query.toLowerCase()
  if (t === q) return 3
  if (t.startsWith(q)) return 2
  if (t.includes(q)) return 1
  return 0
}

export function relevanceScore(title: string, body: string, query: string): number {
  return fieldScore(title, query) * 3 + fieldScore(body, query)
}
