import { createHash } from "node:crypto"

export function diagramImagePath(code: string): string {
  return `/images/newsletter/diagrams/${createHash("sha256").update(code).digest("hex").slice(0, 10)}.png`
}
