// the addresses newsletter issues had before they lost their kind and number, each mapped to the address the issue has
// now. An old address redirects to the new one for good, so a key here is never edited or removed. A null target goes
// to the newsletter page. Only an issue that has been public under an old address belongs here. This file has no
// imports so that next.config.mjs can read it.

/** @type {Record<string, string | null>} */
export const LEGACY_SLUGS = {
  "issue-00-hello": "who-i-am-and-why-i-am-writing",
  "issue-01-from-a-sensor-to-a-platform": "phaemos-astoncv-and-a-first-look-at-analytics",
  "outside-01-global-accessibility-awareness-day": "fifteen-years-of-global-accessibility-awareness-day",
  "midweek-01-africa-day-oau": "africa-day-and-the-birth-of-african-unity",
  "issue-02-fpgas-and-bionic-eyes": "fpgas-bionic-eyes-and-a-new-til-habit",
  "outside-02-nasa-moon-base-missions": "nasa-names-its-first-moon-base-missions",
  "midweek-02-world-cup-2026-48-teams": "the-first-world-cup-with-48-teams",
  "issue-03-uart-from-scratch": "uart-from-scratch-and-five-small-lessons",
  "outside-03-linux-7-1": "linux-7-1-arrives-with-a-rewritten-ntfs-driver",
  "midweek-03-sleep-memory-exams": "sleep-memory-and-exam-season",
  "issue-04-a-room-full-of-possibility": "a-room-full-of-possibility",
  "outside-04-rubin-begins-lsst": "rubin-observatory-starts-its-sky-survey",
  "midweek-04-ghana-republic-day": "ghana-becomes-a-republic",
  "issue-05-my-setup-and-dma": "my-setup-and-moving-data-without-the-cpu",
  "outside-05-rust-1-97": "rust-1-97-adds-bit-tricks-for-embedded-code",
  "midweek-05-when-the-sahara-was-green": "when-the-sahara-was-green",
  "issue-06-interrupts-and-websockets": "interrupts-websockets-and-choosing-what-to-build",
  "outside-06-robotic-satellite-servicing": "a-robot-mechanic-heads-for-geosynchronous-orbit",
  "midweek-06-afrobeats-goes-global": "how-afrobeats-went-global",
  "issue-07-decisions-behind-phaemos": "the-decisions-behind-phaemos-and-writing-clearly",
  "outside-07-hybrid-electric-flight-utah": "a-hybrid-electric-aircraft-flies-across-utah",
  "midweek-07-two-hour-marathon": "how-close-is-the-two-hour-marathon",
  "issue-08-datasheets-and-a-new-country": "datasheets-decision-notes-and-a-new-country",
  "outside-08-hot-chips-risc-v": "risc-v-takes-a-full-tutorial-day-at-hot-chips",
  "midweek-08-why-we-procrastinate": "why-we-procrastinate",
  "issue-09-types-in-python": "types-in-python-and-six-small-lessons",
  "outside-09-roman-space-telescope-launch": "the-roman-space-telescope-is-on-its-way",
  "midweek-09-akosombo-dam-lake-volta": "akosombo-and-the-worlds-largest-artificial-lake",
  "issue-10-learning-to-code": "learning-to-code-and-getting-ready-for-term",
  "outside-10-flex-and-sentinel-3c": "flex-launches-to-watch-plants-glow-from-orbit",
  "midweek-10-black-history-month-uk": "black-history-month-in-the-uk",
  "issue-11-choosing-hard-things": "choosing-hard-things-and-one-command-for-any-machine",
  "outside-11-python-3-15": "python-3-15-brings-lazy-imports-and-utf-8-by-default",
  "midweek-11-galamsey-ghana-rivers": "galamsey-and-the-rivers-of-ghana",
  "issue-12-welcome-to-the-newsletter": "welcome-to-the-newsletter",
  "issue-12-1-calibrated-alerts-and-a-new-paper": "calibrated-alerts-a-database-move-and-a-new-paper",
  "outside-12-bell-x-1-sound-barrier": "the-day-the-bell-x-1-broke-the-sound-barrier",
  "midweek-12-chelsea-clean-sheet": "chelseas-long-wait-for-a-clean-sheet-is-over",
  "issue-13-transistors-and-telescopes": "transistors-telescopes-gps-and-git-hooks",
  "outside-13-silicon-photonics-reliability-standard": "silicon-photonics-gets-its-first-reliability-standard",
  "midweek-13-penalty-shootout-pressure": "why-penalty-shoot-outs-are-a-test-of-nerve",
  "issue-14-safety-and-seven-languages": "software-safety-seven-languages-and-placement-season",
}

// the permanent redirects for next.config.mjs, one per old address
/** @returns {{ source: string, destination: string, permanent: true }[]} */
export function newsletterRedirects() {
  return Object.entries(LEGACY_SLUGS).map(([from, to]) => ({
    source: `/newsletter/${from}`,
    destination: to ? `/newsletter/${to}` : "/newsletter",
    permanent: true,
  }))
}
