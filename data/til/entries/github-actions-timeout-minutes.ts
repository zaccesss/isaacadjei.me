import type { TILEntry } from "../index"

const _github_actions_timeout_minutes: TILEntry = {
    id: "github-actions-timeout-minutes",
    title: "GitHub Actions jobs run for up to six hours unless timeout-minutes is set",
    date: "2026-10-08",
    category: "DevOps",
    published: true,
    body: "[`jobs.<job_id>.timeout-minutes`](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax) defaults to 360, so a job stuck on a hung network call keeps its runner for six hours before GitHub cancels it. On a private repository every one of those minutes is billed. Setting a limit a little above the job's normal run time turns a silent hang into a quick, visible failure. Steps accept the same key, which is useful for the one step that talks to the network. The CV PDF job on this site runs with 15 minutes for the job and 5 for its apt step.",
    detail: [
      {
        type: "code",
        lang: "yaml",
        code: `jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 15        # normal run is about 6 minutes
    steps:
      - uses: actions/checkout@v5
      - name: Install system packages
        timeout-minutes: 5     # the step most likely to hang
        run: sudo apt-get -o Acquire::Retries=3 update`,
        caption: "A job limit plus a tighter limit on the risky step",
      },
      {
        type: "note",
        text: "Step limits are whole minutes only: fractional values are rejected. A job limit higher than the runner's own execution limit is capped at that limit.",
      },
    ],
    tags: ["GitHub Actions", "CI", "DevOps"],
    source: { label: "GitHub Docs: workflow syntax, timeout-minutes", url: "https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax" },
    project: { name: "isaacadjei.me", url: "https://isaacadjei.me", slug: "isaacadjei-me" },
  }

export default _github_actions_timeout_minutes
