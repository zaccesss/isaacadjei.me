import { publicProjectName } from "@/lib/wakatime-editors"

export interface PublicActivity {
  type: number
  name: string
  details?: string
  state?: string
  timestamps?: { start?: number; end?: number }
  assets?: { large_image?: string; large_text?: string; small_image?: string; small_text?: string }
  application_id?: string
}

const AI_TOOL = /claude|chatgpt|openai|codex|copilot|gemini|perplexity|devin|\bagents?\b|dotagents|cloud-kit/i
const CODING_APP = /code|cursor|zed|vim|intellij|pycharm|webstorm|clion|rider|goland|eclipse|xcode|antigravity|sublime|android studio/i

function namesPublicProject(text: string): boolean {
  return text.split(/[\s/\\:()[\],|]+/).some((word) => word.length > 2 && publicProjectName(word) === word)
}

export function publicActivities(activities: PublicActivity[]): PublicActivity[] {
  return activities
    .filter((a) => !(a.type === 2 && /spotify/i.test(a.name)))
    .filter((a) => a.type === 4 || !AI_TOOL.test(a.name))
    .map((a) => {
      if (a.type === 4 || !CODING_APP.test(a.name)) return a
      const text = [a.details, a.state, a.assets?.large_text, a.assets?.small_text].filter(Boolean).join(" ")
      if (!AI_TOOL.test(text) && namesPublicProject(text)) return a
      return {
        ...a,
        details: "Working on a private project",
        state: undefined,
        assets: a.assets && { large_image: a.assets.large_image, small_image: a.assets.small_image },
      }
    })
}
