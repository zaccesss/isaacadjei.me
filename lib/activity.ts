import { supabase } from "@/lib/supabase"

export async function recordActivity(action: string, detail?: string): Promise<void> {
  try {
    const { error } = await supabase.from("activity_log").insert({ action, detail: detail ?? null })
    if (error) console.error("[activity_log]", error.message, error.details)
  } catch (e) {
    console.error("[activity_log]", e)
  }
}
