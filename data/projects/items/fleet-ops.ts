import type { Project } from "../index"

const IMG = "/images/projects/fleet-ops"
const REPO = "https://github.com/zaccesss/fleet-ops"

const _fleetOps: Project = {
    id: "fleet-ops",
    title: "fleet-ops: GitHub Fleet Automation",
    description:
      "Four systems that run a fleet of GitHub repositories on their own: a scheduler that keeps jobs on UK time, governance for branches and Dependabot, a GitLab mirror and a backup of issues and pull requests.",
    longDescription:
      "fleet-ops runs a fleet of GitHub repositories without anyone tidying them by hand. A scheduler starts every job at its real UK time, across clock changes and missed ticks. Governance deletes merged branches, merges Dependabot updates its policy allows, syncs labels, prunes stale branches and reports settings drift. A mirror copies every repository to GitLab and a backup saves issues, pull requests, comments and releases as JSON.\n\nI look after more than 130 repositories across my own account and three organisations, so doing this by hand stopped being possible a long time ago. The hard part is doing it safely on free tiers. Every job mints its own short-lived GitHub App token with only the permissions it needs, every request is verified before it is read and the nightly sweep stays inside the 50 subrequests a free Cloudflare Worker may make.\n\nIt is two Cloudflare Workers in TypeScript and two Python services, with 157 tests that never touch a real API. Version 1.0.0 came out on 27 November 2026, built in seven pull requests that each added one part. Version 1.1.0 followed the same day with full documentation and a CI pipeline that also publishes the runner image to GitHub Container Registry.",
    technologies: [
      "TypeScript",
      "Cloudflare Workers",
      "Python",
      "GitHub Apps",
      "GraphQL",
      "GitLab",
      "GitHub Actions",
      "Docker",
      "vitest",
      "pytest",
    ],
    category: "software",
    featured: false,
    cover: `${IMG}/repository.webp`,
    order: 10,
    status: "completed",
    images: [`${IMG}/repository.webp`, `${IMG}/ci-runs.webp`],
    github: REPO,
    date: "2026",
    highlights: [
      "Four systems in one repository: a UK-time scheduler, repository governance, a GitLab mirror and a metadata backup",
      "A scheduler that starts each job once per local day, tested through both 2026 clock changes, a skipped tick and an outage longer than its 90 minute window",
      "A Dependabot policy written as pure functions: patch and minor merge, major only for GitHub Actions and a lookalike branch from anyone else is refused",
      "Every job mints its own one-hour GitHub App token, limited to the permissions it needs and, for a webhook, to one repository",
      "A nightly sweep that reads 25 repositories per GraphQL request and spends at most 40 writes, inside the free plan's 50 subrequests",
      "Tokens passed to git through environment variables, so they never appear in a URL, a process list or a log",
      "157 tests with coverage gates on two Node and two Python versions, plus Biome, strict mypy, CodeQL, dependency review and a real git run on every pull request",
      "A release workflow that checks every version against the tag and publishes the runner image to GitHub Container Registry with provenance and an SBOM",
    ],
    releaseRepos: [{ name: "fleet-ops", repo: "zaccesss/fleet-ops" }],
    links: [
      { label: "Architecture", url: `${REPO}/blob/main/docs/architecture.md` },
      { label: "Decision records", url: `${REPO}/tree/main/docs/decisions` },
      { label: "Changelog", url: `${REPO}/blob/main/CHANGELOG.md` },
      { label: "Releases", url: `${REPO}/releases` },
    ],
    sections: [
      { type: "h2", text: "Why I built it" },
      {
        type: "p",
        text: "Every repository needs the same small jobs: delete merged branches, merge safe dependency updates, keep labels and settings the same, copy the code somewhere other than GitHub and keep the issues and pull requests if GitHub ever loses them. Across more than 130 repositories those jobs never end, so I wanted them done on a schedule, the same way every time, with nothing holding more access than it needs.",
      },
      {
        type: "p",
        text: "Free tiers shaped most of the design. A free Cloudflare Worker may make 50 subrequests per run and GitHub bills every private Actions job at a minute or more. Those limits are written down as decision records in the repository, because they explain choices that would otherwise look odd.",
      },
      { type: "h2", text: "How it fits together" },
      {
        type: "diagram",
        code: `flowchart TB
    W["Webhooks"] --> G["Governance"]
    N["Daily cron"] --> G
    C["/fleet in Discord"] --> G
    G --> GH[("GitHub repos")]
    G -- "signed call" --> S["Scheduler"]
    T["Cron every 15 min"] --> S
    S -- "signed call" --> R["Container"]
    S -- "dispatch" --> A["Actions"]
    R --> M["Mirror"]
    A --> M
    A --> B["Backup"]
    M --> GL[("GitLab")]
    B --> D[("Data repo")]`,
        caption: "The scheduler starts the mirror and the backup. Governance answers webhooks, runs the nightly sweep and takes slash commands",
      },
      {
        type: "table",
        headers: ["System", "Runs on", "What it does"],
        rows: [
          ["Scheduler", "Cloudflare Workers and KV", "Starts every job at its UK time. Container jobs fall back to GitHub Actions when the runner is down"],
          ["Governance", "Cloudflare Workers", "Deletes merged branches, arms auto-merge on safe Dependabot updates, syncs labels, prunes stale branches and reports drift"],
          ["Mirror", "A container or GitHub Actions", "Copies every repository to GitLab with LFS objects, branches and tags. Private ones stay private"],
          ["Backup", "GitHub Actions", "Exports issues, pull requests, comments and releases as JSON, fetching only what changed"],
        ],
        caption: "The four systems",
      },
      { type: "h2", text: "Keeping time across clock changes" },
      {
        type: "p",
        text: "GitHub's own schedule runs in UTC and is often late, so a job meant for 23:00 in the UK lands an hour out for half the year. The scheduler wakes every 15 minutes, works out UK wall-clock time and starts a job at the first tick at or after its time, once per local day. The window is 90 minutes because in March a 01:00 job is first seen at 02:00, a full hour late. In October the repeated hour finds the job already done. The tests walk real tick sequences through both 2026 changes.",
      },
      { type: "h2", text: "Least privilege" },
      {
        type: "p",
        text: "The only standing secret is the App's private key. Each job mints a token that lasts an hour and holds only what that job uses: a branch delete gets contents write on one repository and nothing else. Governance never asks for administration write, so its drift audit can report a wrong setting but cannot change one. GitHub webhooks are checked by HMAC, Discord requests by Ed25519 and calls between the workers by a timestamped HMAC that refuses anything more than five minutes old.",
      },
      {
        type: "image",
        src: `${IMG}/ci-runs.webp`,
        alt: "The GitHub Actions page for the CI workflow of fleet-ops, listing seven pull request runs with green ticks, from feat: add the shared core package through feat: add the UK-time scheduler, feat: add repository governance, feat: add the GitLab mirror and feat: add the metadata backup and the docs to fix: keep error detail out of webhook responses, each taking between 12 and 28 seconds.",
        caption: "One pull request per part, each checked by CI before it merged",
      },
      { type: "h2", text: "Testing without touching a real API" },
      {
        type: "p",
        text: "Every network call goes through a fake that records what was sent and fails loudly on anything unexpected. That covers 108 TypeScript tests and 49 Python tests. CI fails if coverage drops below its thresholds. The one place a fake was not enough is git itself, so a test runs the real git binary against local bare repositories and proves that GitHub's pull request refs never reach the mirror and that a deleted branch is pruned. CodeQL found one real issue after 1.0.0, a webhook that echoed an error message to its caller. Version 1.0.1 fixed it the same day.",
      },
    ],
}

export default _fleetOps
