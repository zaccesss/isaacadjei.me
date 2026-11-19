export const FINISHED_DEADLINE_STATUSES = ["submitted", "graded", "done"] as const

export const FINISHED_DEADLINE_IN = `(${FINISHED_DEADLINE_STATUSES.map((s) => `"${s}"`).join(",")})`

export function isDeadlineFinished(status: string | null | undefined): boolean {
  return (FINISHED_DEADLINE_STATUSES as readonly string[]).includes(status ?? "")
}
