import type { BlogPost } from "../index"

const _monorepo_read_only_split_repos: BlogPost = {
    slug: "monorepo-read-only-split-repos",
    title: "Open Source as an Organisation: A Monorepo With Read-Only Split Repos",
    date: "2026-10-20",
    type: "blog",
    cover_image: "/images/blog/covers/monorepo-read-only-split-repos.webp",
    cover_credit: "Photo: USGS EROS Data Center, public domain, via Wikimedia Commons",
    cover_alt: "False-colour satellite view of the Lena River Delta in Siberia, where one wide river fans out into hundreds of smaller channels",
    projectSlug: "melophos",
    description:
      "How MELOPHOS keeps every component in one repository for reviews while publishing each folder as its own read-only repository with real history, using git subtree split and one GitHub Actions workflow.",
    tags: ["Open Source", "Git", "GitHub", "Software Engineering"],
    published: true,
    content: [
      {
        type: "p",
        text: "[MELOPHOS](https://melophos.com) has firmware, a [Rust](https://www.rust-lang.org) scoring engine, [KiCad](https://www.kicad.org) hardware, a [FastAPI](https://fastapi.tiangolo.com) server, a browser Studio, a Python client, instrument profiles and docs. That is eight components with different languages, licences and audiences. The question every multi-part open source project hits early is whether they live in one repository or eight. I chose both: one monorepo where all the work happens and eight read-only copies that are published automatically. [PHAEMOS](https://phaemos.com) uses the same pattern. This post explains why and exactly how it works.",
      },
      {
        type: "h2",
        text: "The case for one repository",
      },
      {
        type: "p",
        text: "Most real changes in MELOPHOS cross components. Adding a field to the protocol means the hub firmware sends it, the server stores it and the Studio shows it. In separate repositories that is three pull requests that must merge in the right order, with a window where the versions disagree. In a monorepo it is one pull request, one review and one set of checks that prove the pieces still fit together.",
      },
      {
        type: "h2",
        text: "The case for separate repositories",
      },
      {
        type: "p",
        text: "Separate repositories serve the people who only care about one piece. Someone building their own LED bars wants the hardware files without cloning a web app. Someone adding a guitar profile wants a small repository with a clear README. Separate repositories also let each component carry its own licence cleanly: the software is [AGPL-3.0-or-later](https://www.gnu.org/licenses/agpl-3.0.html) and the hardware is [CERN-OHL-S-2.0](https://cern-ohl.web.cern.ch).",
      },
      {
        type: "table",
        headers: ["", "Monorepo only", "Separate repos only", "Monorepo + read-only copies"],
        rows: [
          ["Cross-component change", "One PR", "Several PRs in order", "One PR"],
          ["Browse one component", "Whole tree", "Small and focused", "Small and focused"],
          ["Per-component licence", "Folder-level only", "Clean", "Clean"],
          ["Where contributions go", "One place", "Many places", "One place"],
          ["Extra machinery", "None", "Version coordination", "One publish workflow"],
        ],
        caption: "The trade-off that led to publishing read-only copies.",
      },
      {
        type: "h2",
        text: "How publishing works",
      },
      {
        type: "p",
        text: "[git subtree split](https://github.com/git/git/blob/master/contrib/subtree/git-subtree.adoc) takes a folder and builds a new line of history containing only the commits that touched it, with that folder's contents moved to the root. Every commit keeps its message and date. The result can be pushed to another repository as if the folder had always been a project of its own.",
      },
      {
        type: "diagram",
        code: `flowchart LR
    PR["Pull request<br/>reviewed and merged"] --> M["melophos/melophos<br/>main"]
    M --> W["Publish workflow<br/>one job per folder"]
    W --> F["melophos/firmware"]
    W --> H["melophos/hardware"]
    W --> C["melophos/core"]
    W --> S["melophos/server"]
    W --> O["...and four more"]`,
        caption: "Every merge to main republishes each component folder to its own repository.",
      },
      {
        type: "p",
        text: "The workflow runs on every push to main. A [matrix](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/run-job-variations) gives each folder its own job, so a failure publishing one component does not block the others.",
      },
      {
        type: "code",
        lang: "yaml",
        text: `on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: publish-components
  cancel-in-progress: false

jobs:
  publish:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        folder: [firmware, hardware, core, server, studio, client, profiles, docs]
    steps:
      - uses: actions/checkout@v4
        with:
          ref: main          # the latest main, never a stale pushed commit
          fetch-depth: 0     # subtree split needs the full history
      - name: Split and push
        env:
          FOLDER: \${{ matrix.folder }}
        run: |
          git subtree split --prefix="$FOLDER" --branch "publish-$FOLDER"
          git push "https://x-access-token:\${SPLIT_TOKEN}@github.com/melophos/\${FOLDER}.git" "publish-$FOLDER:main"`,
      },
      {
        type: "p",
        text: "That is simplified from the real file, which pins actions to commit hashes and checks the publishing token exists before doing anything. Three details are worth copying.",
      },
      {
        type: "h3",
        text: "Determinism keeps every push a fast-forward",
      },
      {
        type: "p",
        text: "subtree split produces the same commit hashes for the same input history. So the second publish is the first publish plus new commits on top and the push is a fast-forward. No force push is ever needed, which means the copies never rewrite history under anyone who cloned them. The real workflow also credits each commit in the copies to the project's automation account. That rewrite is deterministic too, so it keeps the fast-forward property.",
      },
      {
        type: "h3",
        text: "Check out main, not the triggering commit",
      },
      {
        type: "p",
        text: "If two merges land close together, the first workflow run might start after the second merge. Checking out the pushed commit would then publish older history and the push would be rejected or, worse, look like it went backwards. Checking out the latest main means any run publishes the newest state. The [concurrency group](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency) stops two runs pushing at once and cancel-in-progress is false so a run is never killed half way through a push.",
      },
      {
        type: "h3",
        text: "Make the copies genuinely read-only",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Anything committed to a copy would be overwritten by the next publish. So issues are turned off in the copies and pull requests opened there are closed with a pointer back to the monorepo. Every README in a copy says where to contribute in its first lines.",
      },
      {
        type: "h2",
        text: "What it costs",
      },
      {
        type: "ul",
        items: [
          "A token with write access to the copies, stored as a repository secret. If it is missing the workflow writes a note to the job summary and publishes nothing rather than failing loudly on every merge.",
          "Full clones in CI, since subtree split walks the whole history. For a young project that takes seconds. A very large history would need caching or a dedicated tool.",
          "Discipline about folder boundaries. A component folder has to be self-contained: its own README, licence and build files, because that folder becomes the root of a repository.",
        ],
      },
      {
        type: "h2",
        text: "Would I do it again?",
      },
      {
        type: "p",
        text: "Yes, for any project where changes regularly cross components and people want to consume the parts separately. For a single library it is pointless overhead. The thing I underestimated was the organisational side. An organisation with nine repositories needs its own profile, a default set of community files in its .github repository and labels that make sense across components. The automation is one workflow. Making the organisation feel coherent to a visitor took longer than writing it. The project itself, from the LED bars to the Studio, is on the [MELOPHOS project page](/projects/melophos).",
      },
      {
        type: "h2",
        text: "Further reading",
      },
      {
        type: "ol-links",
        items: [
          { text: "MELOPHOS project site: the monorepo and its published components", url: "https://melophos.com" },
          { text: "melophos/firmware: one of the read-only copies, with its own history", url: "https://github.com/melophos/firmware" },
          { text: "melophos/melophos: the monorepo, including docs/repositories.md", url: "https://github.com/melophos/melophos" },
          { text: "git-subtree documentation in the Git source tree", url: "https://github.com/git/git/blob/master/contrib/subtree/git-subtree.adoc" },
          { text: "monorepo.tools: a neutral overview of monorepo trade-offs and tooling", url: "https://monorepo.tools/" },
          { text: "PHAEMOS project site: the same pattern for an IoT platform", url: "https://phaemos.com" },
          { text: "GitHub Docs: running job variations with a matrix", url: "https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/run-job-variations" },
        ],
      },
      {
        type: "h2",
        text: "Watch or listen",
      },
      {
        type: "spotify",
        episodeId: "3Opj64PyBWoAtXDruSSZWE",
        title: "Fireship: Monorepos, how the pros scale huge software projects",
      },
    ],
  }

export default _monorepo_read_only_split_repos
