export function stripHtmlTags(str: string): string {
  let out = ""
  let inTag = false
  for (const ch of str) {
    if (ch === "<") inTag = true
    else if (ch === ">") inTag = false
    else if (!inTag) out += ch
  }
  return out.trim()
}
