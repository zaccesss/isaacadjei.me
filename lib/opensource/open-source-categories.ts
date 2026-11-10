export const CATEGORY_ORDER = [
  "Linux kernel and embedded",
  "Drones and robotics",
  "Infrastructure and CI",
  "Security and privacy",
  "Developer tools and docs",
] as const

export const LAST_CATEGORY = "My own tools and themes"
export const UNCATEGORISED = "Other"

export const KNOWN_CATEGORIES: string[] = [...CATEGORY_ORDER, LAST_CATEGORY]

export function categoryRank(name: string): [number, string] {
  const fixed = (CATEGORY_ORDER as readonly string[]).indexOf(name)
  if (fixed >= 0) return [fixed, ""]
  if (name === LAST_CATEGORY) return [CATEGORY_ORDER.length + 3, ""]
  if (name === UNCATEGORISED) return [CATEGORY_ORDER.length + 2, ""]
  return [CATEGORY_ORDER.length + 1, name.toLowerCase()]
}

export function compareCategories(a: string, b: string): number {
  const [ra, na] = categoryRank(a)
  const [rb, nb] = categoryRank(b)
  return ra - rb || na.localeCompare(nb)
}
