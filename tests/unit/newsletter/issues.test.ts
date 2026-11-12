import { describe, expect, it } from "vitest"
import { allIssues, issueLabel } from "@/data/newsletter"
import { LEGACY_SLUGS, newsletterRedirects } from "@/data/newsletter/legacy-slugs.mjs"
import { RHYTHM_START, slotKind, slotsBetween } from "@/data/newsletter/schedule"
import { toListing } from "@/lib/newsletter/newsletter"
import nextConfig from "@/next.config.mjs"

const issues = allIssues()
const HORIZON = "2027-02-28"

const LEGACY_CUT_OFF = "2026-11-13"

const FIXED: Record<string, string> = {
  "issue-00-hello": "2026-04-30",
  "issue-01-from-a-sensor-to-a-platform": "2026-05-15",
  "outside-01-global-accessibility-awareness-day": "2026-05-22",
  "midweek-01-africa-day-oau": "2026-05-27",
  "issue-02-fpgas-and-bionic-eyes": "2026-05-29",
  "outside-02-nasa-moon-base-missions": "2026-06-05",
  "midweek-02-world-cup-2026-48-teams": "2026-06-10",
  "issue-03-uart-from-scratch": "2026-06-12",
  "outside-03-linux-7-1": "2026-06-19",
  "midweek-03-sleep-memory-exams": "2026-06-24",
  "issue-04-a-room-full-of-possibility": "2026-06-26",
  "outside-04-rubin-begins-lsst": "2026-07-03",
  "midweek-04-ghana-republic-day": "2026-07-08",
  "issue-05-my-setup-and-dma": "2026-07-10",
  "outside-05-rust-1-97": "2026-07-17",
  "midweek-05-when-the-sahara-was-green": "2026-07-22",
  "issue-06-interrupts-and-websockets": "2026-07-24",
  "outside-06-robotic-satellite-servicing": "2026-07-31",
  "midweek-06-afrobeats-goes-global": "2026-08-05",
  "issue-07-decisions-behind-phaemos": "2026-08-07",
  "outside-07-hybrid-electric-flight-utah": "2026-08-14",
  "midweek-07-two-hour-marathon": "2026-08-19",
  "issue-08-datasheets-and-a-new-country": "2026-08-21",
  "outside-08-hot-chips-risc-v": "2026-08-28",
  "midweek-08-why-we-procrastinate": "2026-09-02",
  "issue-09-types-in-python": "2026-09-04",
  "outside-09-roman-space-telescope-launch": "2026-09-11",
  "midweek-09-akosombo-dam-lake-volta": "2026-09-16",
  "issue-10-learning-to-code": "2026-09-18",
  "outside-10-flex-and-sentinel-3c": "2026-09-25",
  "midweek-10-black-history-month-uk": "2026-09-30",
  "issue-11-choosing-hard-things": "2026-10-02",
  "outside-11-python-3-15": "2026-10-09",
  "midweek-11-galamsey-ghana-rivers": "2026-10-14",
  "issue-12-welcome-to-the-newsletter": "2026-10-16",
  "issue-12-1-calibrated-alerts-and-a-new-paper": "2026-10-16",
  "outside-12-bell-x-1-sound-barrier": "2026-10-23",
  "midweek-12-chelsea-clean-sheet": "2026-10-28",
  "issue-13-transistors-and-telescopes": "2026-10-30",
  "outside-13-silicon-photonics-reliability-standard": "2026-11-06",
  "midweek-13-penalty-shootout-pressure": "2026-11-11",
}

describe("labels", () => {
  it("is the kind alone, with no number", () => {
    expect(issueLabel({ kind: "letter" })).toBe("Letter")
    expect(issueLabel({})).toBe("Letter")
    expect(issueLabel({ kind: "midweek" })).toBe("Midweek")
    expect(issueLabel({ kind: "outside" })).toBe("Outside")
    for (const i of issues) expect(issueLabel(i)).not.toMatch(/\d/)
  })

  it("leaves a list able to tell two issues of a kind apart by date", () => {
    const seen = new Set(issues.map((i) => `${issueLabel(i)} ${i.date} ${i.title}`))
    expect(seen.size).toBe(issues.length)
  })
})

describe("slugs and ids", () => {
  it("gives every issue a unique slug and a unique id", () => {
    expect(new Set(issues.map((i) => i.slug)).size).toBe(issues.length)
    expect(new Set(issues.map((i) => i.id)).size).toBe(issues.length)
  })

  it("keeps kinds and issue numbers out of the address", () => {
    for (const i of issues) {
      expect(i.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
      expect(i.slug).not.toMatch(/^(issue|letter|midweek|outside)-/)
      expect(i.slug).not.toMatch(/^\d/)
      expect(i.slug).not.toMatch(/-\d+$/)
      expect(i.slug.length).toBeLessThanOrEqual(60)
    }
  })

  it("never reuses an old address as a new one", () => {
    for (const i of issues) expect(Object.keys(LEGACY_SLUGS)).not.toContain(i.slug)
  })

  it("keeps the id and the date of every issue that has gone out", () => {
    const byId = new Map(issues.map((i) => [i.id, i]))
    for (const [id, date] of Object.entries(FIXED)) {
      expect(byId.get(id)?.date, id).toBe(date)
      expect(byId.get(id)?.published, id).toBe(true)
    }
    expect(issues.filter((i) => i.date < LEGACY_CUT_OFF).length).toBe(Object.keys(FIXED).length)
  })

  it("moves nothing dated before the rhythm began on to another date", () => {
    for (const i of issues.filter((x) => x.date >= LEGACY_CUT_OFF && x.date < RHYTHM_START)) expect(i.date).toBe(LEGACY_CUT_OFF)
  })
})

describe("redirects", () => {
  const redirects = newsletterRedirects()
  const live = new Set(issues.filter((i) => i.published).map((i) => `/newsletter/${i.slug}`))

  const byId = new Map(issues.map((i) => [i.id, i]))

  it("has an old address for every issue that was public under one", () => {
    for (const i of issues.filter((x) => x.date <= LEGACY_CUT_OFF)) {
      expect(i.id, i.id).not.toBe(i.slug)
      expect(LEGACY_SLUGS[i.id], i.id).toBe(i.published ? i.slug : null)
    }
  })

  it("lists every issue that has gone out", () => {
    for (const id of Object.keys(FIXED)) expect(Object.keys(LEGACY_SLUGS), id).toContain(id)
    expect(Object.keys(LEGACY_SLUGS).length).toBe(Object.keys(FIXED).length + 1)
  })

  it("lists no issue dated after the cut-off", () => {
    const targets = new Set(Object.values(LEGACY_SLUGS))
    for (const i of issues.filter((x) => x.date > LEGACY_CUT_OFF)) {
      expect(i.id in LEGACY_SLUGS, i.date).toBe(false)
      expect(targets.has(i.slug), i.date).toBe(false)
    }
    for (const old of Object.keys(LEGACY_SLUGS)) {
      const issue = byId.get(old)
      if (issue) expect(issue.date <= LEGACY_CUT_OFF, old).toBe(true)
    }
  })

  it("refuses a made-up issue dated after the cut-off", () => {
    const allowed = (issue: { date: string }) => issue.date <= LEGACY_CUT_OFF
    expect(allowed({ date: "2026-11-13" })).toBe(true)
    expect(allowed({ date: "2026-11-14" })).toBe(false)
  })

  it("sends every old address to a page that exists, permanently", () => {
    expect(redirects.length).toBe(Object.keys(LEGACY_SLUGS).length)
    for (const r of redirects) {
      expect(r.permanent).toBe(true)
      expect(r.source).toMatch(/^\/newsletter\/[a-z0-9-]+$/)
      expect(live.has(r.source), r.source).toBe(false)
      const issue = byId.get(r.source.slice("/newsletter/".length))
      if (issue) expect(r.destination, r.source).toBe(issue.published ? `/newsletter/${issue.slug}` : "/newsletter")
    }
  })

  it("sends an issue taken off the site to the newsletter page", () => {
    for (const i of issues.filter((x) => !x.published && x.date <= LEGACY_CUT_OFF)) {
      expect(redirects.find((r) => r.source === `/newsletter/${i.id}`)?.destination).toBe("/newsletter")
    }
  })

  it("is wired into the site config", async () => {
    const configured = await nextConfig.redirects!()
    for (const r of redirects) expect(configured).toContainEqual(r)
  })

  it("covers the addresses as they were before the change", () => {
    expect(LEGACY_SLUGS["issue-12-welcome-to-the-newsletter"]).toBe("welcome-to-the-newsletter")
    expect(LEGACY_SLUGS["issue-12-1-calibrated-alerts-and-a-new-paper"]).toBe("calibrated-alerts-a-database-move-and-a-new-paper")
    expect(LEGACY_SLUGS["midweek-13-penalty-shootout-pressure"]).toBe("why-penalty-shoot-outs-are-a-test-of-nerve")
    expect(LEGACY_SLUGS["outside-01-global-accessibility-awareness-day"]).toBe("fifteen-years-of-global-accessibility-awareness-day")
  })
})

describe("the feed", () => {
  it("keeps the entry id an issue was first published under and links to the new address", () => {
    for (const i of issues) {
      const listing = toListing(i)
      expect(listing.id).toBe(i.id)
      expect(listing.webUrl).toBe(`https://isaacadjei.me/newsletter/${i.id}`)
      expect(listing.href).toBe(`/newsletter/${i.slug}`)
    }
    const welcome = toListing(issues.find((i) => i.slug === "welcome-to-the-newsletter")!)
    expect(welcome.webUrl).toBe("https://isaacadjei.me/newsletter/issue-12-welcome-to-the-newsletter")
  })
})

describe("the Wednesday and Friday rhythm", () => {
  const scheduled = issues.filter((i) => i.published && i.date >= RHYTHM_START)
  const weekday = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay()
  const weekOf = (date: string) => {
    const t = Date.parse(`${date}T00:00:00Z`)
    return new Date(t - ((weekday(date) + 6) % 7) * 86_400_000).toISOString().slice(0, 10)
  }

  it("takes turns on Wednesdays and puts a letter on every second Friday", () => {
    const slots = slotsBetween(RHYTHM_START, HORIZON)
    const wednesdays = slots.filter((s) => s.kind !== "letter")
    const letters = slots.filter((s) => s.kind === "letter")
    expect(slots[0]).toEqual({ date: "2026-11-18", kind: "outside" })
    expect(slots[1]).toEqual({ date: "2026-11-25", kind: "midweek" })
    expect(slots[2]).toEqual({ date: "2026-11-27", kind: "letter" })
    expect(slots[3]).toEqual({ date: "2026-12-02", kind: "outside" })
    expect(slotKind("2026-11-20")).toBeNull()
    expect(slotKind("2026-12-04")).toBeNull()
    for (let n = 1; n < letters.length; n++) expect((Date.parse(letters[n].date) - Date.parse(letters[n - 1].date)) / 86_400_000).toBe(14)
    for (const s of slots) expect(weekday(s.date)).toBe(s.kind === "letter" ? 5 : 3)
    for (let n = 1; n < wednesdays.length; n++) expect(wednesdays[n].kind).not.toBe(wednesdays[n - 1].kind)
    expect(wednesdays.length).toBe(15)
    expect(letters.map((s) => s.date)).toEqual(["2026-11-27", "2026-12-11", "2026-12-25", "2027-01-08", "2027-01-22", "2027-02-05", "2027-02-19"])
  })

  it("follows on from the Midweek issue of Wednesday 11 November 2026", () => {
    expect(issues.find((i) => i.date === "2026-11-11")?.kind).toBe("midweek")
    expect(slotKind("2026-11-18")).toBe("outside")
    expect(slotKind("2026-11-11")).toBeNull()
    expect(slotKind("2026-11-19")).toBeNull()
  })

  it("puts every issue from 16 November 2026 on the slot for its kind", () => {
    for (const i of scheduled) {
      expect(i.date <= HORIZON, i.id).toBe(true)
      expect(slotKind(i.date), `${i.id} on ${i.date}`).toBe(i.kind ?? "letter")
    }
  })

  it("has at most one Wednesday issue and one Friday letter a week", () => {
    const weeks = new Map<string, string[]>()
    for (const i of scheduled) weeks.set(weekOf(i.date), [...(weeks.get(weekOf(i.date)) ?? []), i.kind ?? "letter"])
    for (const [week, kinds] of weeks) {
      expect(kinds.filter((k) => k === "letter").length, week).toBeLessThanOrEqual(1)
      expect(kinds.filter((k) => k !== "letter").length, week).toBeLessThanOrEqual(1)
    }
    expect(new Set(scheduled.map((i) => i.date)).size).toBe(scheduled.length)
  })

  it("alternates the Wednesday kinds issue by issue", () => {
    const wednesdays = scheduled.filter((i) => (i.kind ?? "letter") !== "letter")
    for (let n = 1; n < wednesdays.length; n++) {
      const weeksApart = (Date.parse(wednesdays[n].date) - Date.parse(wednesdays[n - 1].date)) / (7 * 86_400_000)
      expect(wednesdays[n].kind === wednesdays[n - 1].kind, wednesdays[n].id).toBe(weeksApart % 2 === 0)
    }
  })
})
