import { describe, expect, it } from "vitest"
import { sessionMinutes, summarise, type GameSessionRow } from "@/lib/gaming"

const row = (over: Partial<GameSessionRow>): GameSessionRow => ({
  id: "1",
  device: "ps5",
  game: "Game A",
  game_image: null,
  started_at: "2026-09-21T10:00:00Z",
  last_seen: "2026-09-21T11:00:00Z",
  ended_at: "2026-09-21T11:00:00Z",
  samples: 0,
  cpu_sum: 0,
  gpu_sum: 0,
  peak_cpu: null,
  peak_gpu: null,
  ...over,
})

describe("sessionMinutes", () => {
  it("adds one poll interval to the measured span", () => {
    expect(sessionMinutes(row({}))).toBe(62)
  })
  it("never reports less than one poll", () => {
    expect(sessionMinutes(row({ ended_at: "2026-09-21T10:00:00Z" }))).toBe(2)
  })
  it("uses last_seen for a session still open", () => {
    expect(sessionMinutes(row({ ended_at: null, last_seen: "2026-09-21T10:30:00Z" }))).toBe(32)
  })
})

describe("summarise", () => {
  it("handles no data", () => {
    const s = summarise([], [])
    expect(s.sessions).toBe(0)
    expect(s.totalHours).toBe(0)
  })
  it("totals hours and splits by device", () => {
    const s = summarise([row({}), row({ id: "2", device: "pc", game: "Game B" })], [])
    expect(s.sessions).toBe(2)
    expect(s.games).toBe(2)
    expect(s.totalHours).toBe(2.1)
    expect(s.byDevice.map((d) => d.name).sort()).toEqual(["Gaming PC", "PS5"])
  })
  it("credits genre hours to every genre of a game", () => {
    const s = summarise([row({})], [], [{ game: "Game A", genres: ["RPG", "Action"] }])
    expect(s.genres.map((g) => g.name).sort()).toEqual(["Action", "RPG"])
    expect(s.genres.every((g) => g.basis === "tracked")).toBe(true)
  })
  it("falls back to lifetime playtime for genres when nothing is tracked", () => {
    const s = summarise([], [{ platform: "ps5", game: "Game A", minutes: 120, last_played: null }], [{ game: "Game A", genres: ["RPG"] }])
    expect(s.genres[0]).toMatchObject({ name: "RPG", basis: "lifetime" })
  })
})
