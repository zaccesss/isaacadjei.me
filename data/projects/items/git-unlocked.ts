import type { Project } from "../index"

const _git_unlocked: Project = {
    id: "git-unlocked",
    title: "git-unlocked",
    description:
      "A free, open source course that takes anyone from absolute zero to professional-level Git across every major platform, with Windows, Mac and Linux covered side by side.",
    longDescription:
      "git-unlocked is a free, community-built course that takes someone who has never heard of version control all the way to using Git, GitHub, GitLab and the other major platforms confidently in a real team. It is 182 files across 12 sections covering Git itself, GitHub, GitLab, Bitbucket, Azure DevOps, Gitea, Forgejo and Codeberg. Every file is tagged beginner, intermediate or advanced and shows commands for Windows, Mac and Linux side by side, so every reader knows where they stand.\n\nI built it after watching people at university struggle not with the ideas behind version control but with how scattered the documentation is. Every platform has its own docs, every tutorial starts somewhere different and almost none of them cover what to do when things go wrong. git-unlocked is the single resource I wished had existed: opinionated, progressive, honest about the hard parts and free with no paywall or account.\n\nThe course is released under CC BY-SA 4.0 so educators and self-taught learners can reuse, fork and extend it. Markdown lint and link checks run in CI on every push, a first-contribution sandbox lets anyone make their first open source pull request in under ten minutes and the project is archived on Zenodo with a permanent DOI.",
    technologies: [
      "Git",
      "GitHub",
      "GitLab",
      "Bitbucket",
      "Azure DevOps",
      "Markdown",
      "GitHub Actions",
      "Open Source",
    ],
    category: "academic",
    featured: false,
    cover: "/images/projects/git-unlocked/cover.webp",
    order: 12,
    status: "live",
    images: [
      "/images/projects/git-unlocked/github-logo-3d.webp",
      "/images/projects/git-unlocked/git_unlocked_banner.svg",
      "/images/projects/git-unlocked/octocat-laptop.webp",
      "/images/projects/git-unlocked/octocat-groot.webp",
      "/images/projects/git-unlocked/octocat-closeup.webp",
    ],
    github: "https://github.com/zaccesss/git-unlocked",
    getInvolved: { discussions: true },
    date: "2026",
    highlights: [
      "182 files across 12 sections: Git, GitHub, GitLab, Bitbucket, Azure DevOps, Gitea, Forgejo and Codeberg",
      "Every file tagged beginner, intermediate or advanced, with Windows, Mac and Linux commands side by side",
      "Real-world section on GitOps with Argo CD and Flux, monorepos with Nx and Turborepo and recovering from force pushes and leaked secrets",
      "Security reference covering gitleaks, TruffleHog, push protection, commit signing and SLSA supply chain levels",
      "IDE section for VS Code, JetBrains, Neovim, Zed and more and a terminal section for lazygit, delta, fzf, bat and tig",
      "First-contribution sandbox, a 120+ link resource index and markdownlint plus link checks in CI on every push",
    ],
    links: [
      { label: "Zenodo DOI: 10.5281/zenodo.20694984", url: "https://doi.org/10.5281/zenodo.20694984" },
      { label: "Start the course", url: "https://github.com/zaccesss/git-unlocked/blob/main/00-welcome/README.md" },
      { label: "First-contribution sandbox", url: "https://github.com/zaccesss/git-unlocked/blob/main/11-first-contribution/README.md" },
      { label: "Changelog", url: "https://github.com/zaccesss/git-unlocked/blob/main/CHANGELOG.md" },
    ],
    sections: [
      { type: "h2", text: "What is in the course" },
      {
        type: "p",
        text: "The course is split into twelve numbered sections. Each one opens with an overview file that gives its own table of contents and reading order, so a reader can start at the top and work down or jump straight to the platform they use at work.",
      },
      {
        type: "table",
        headers: ["#", "Section", "Files", "What is inside"],
        rows: [
          ["00", "welcome", "1", "What the course is"],
          ["01", "introduction", "3", "Concepts, setup and how to navigate"],
          ["02", "git", "29", "Everything from git init to internals, bisect, worktrees and signing"],
          ["03", "github", "28", "The full GitHub platform, from accounts to Actions, rulesets and security"],
          ["04", "gitlab", "16", "The full GitLab platform"],
          ["05", "other-platforms", "62", "Bitbucket, Azure DevOps, Gitea, Forgejo and Codeberg"],
          ["06", "ides-and-editors", "14", "VS Code, JetBrains, Neovim, Zed and more"],
          ["07", "terminal", "14", "Shell setup, lazygit, delta, fzf, bat, tig and more"],
          ["08", "real-world", "8", "Open source contribution, teams, GitOps, monorepos and disaster recovery"],
          ["09", "reference", "4", "Cheatsheet, glossary, common mistakes and security"],
          ["10", "resources", "1", "120+ curated books, videos, tools and communities"],
          ["11", "first-contribution", "2", "A sandbox for a first open source pull request"],
        ],
        caption: "The twelve sections, 182 files in total",
      },
      { type: "h2", text: "How a reader moves through it" },
      {
        type: "p",
        text: "I designed it as three paths rather than one long read. A beginner starts with what version control is and how to set up, learns core Git and then picks a platform. Intermediate readers go deeper into workflows, rebasing and platform features. The advanced material covers internals, large repositories, monorepos, GitOps and recovering from disasters.",
      },
      {
        type: "diagram",
        code: `flowchart TD
    W["00 welcome and<br/>01 introduction"] --> G["02 git<br/>core concepts to internals"]
    G --> P{"Which platform?"}
    P --> GH["03 github"]
    P --> GL["04 gitlab"]
    P --> OP["05 other platforms<br/>Bitbucket, Azure DevOps,<br/>Gitea, Forgejo, Codeberg"]
    GH --> T["06 editors and<br/>07 terminal tools"]
    GL --> T
    OP --> T
    T --> RW["08 real world<br/>teams, GitOps, monorepos,<br/>disaster recovery"]
    RW --> FC["11 first contribution<br/>open a real pull request"]
    REF["09 reference and<br/>10 resources"] -.-> G
    REF -.-> RW`,
        caption: "The suggested route through the course, with the reference sections alongside",
      },
      { type: "h2", text: "Writing for every platform at once" },
      {
        type: "p",
        text: "The hardest rule to keep was that nothing is assumed and nothing is skipped. A command that differs between operating systems is shown three times with Windows, Mac and Linux labels. One that is identical appears once without labels, so the page does not triple in length for no reason. The same discipline applies across platforms: the comparison files set GitHub, GitLab and the rest side by side so a reader moving jobs can map what they already know onto the new tool.",
      },
      {
        type: "p",
        text: "The real-world section is the part most tutorials leave out. It covers contributing to open source, working in a team, GitOps with Argo CD and Flux, monorepo patterns with Nx and Turborepo, migrating between platforms and recovering from disasters such as a force push over someone else's work or a secret committed by mistake. The security reference covers secret scanning with gitleaks and TruffleHog, push protection, commit signing with GPG and SSH and supply chain integrity with SLSA.",
      },
      { type: "h2", text: "The first-contribution sandbox" },
      {
        type: "p",
        text: "Section 11 is a safe place to make a first pull request. The reader forks the repository, clones it, creates a branch, adds their name to a list, commits, pushes and opens a pull request, which is the same workflow used on large open source projects. Contributors are listed in a hall of fame.",
      },
      {
        type: "diagram",
        code: `sequenceDiagram
    participant R as Reader
    participant F as Their fork
    participant U as git-unlocked
    participant CI as CI checks
    R->>F: fork and clone
    R->>R: create a branch and add their name
    R->>F: commit and push
    R->>U: open a pull request
    U->>CI: markdownlint and link check
    CI-->>U: results on the pull request
    U-->>R: review and merge`,
        caption: "The workflow the sandbox walks through",
      },
      { type: "h2", text: "Keeping 182 files healthy" },
      {
        type: "p",
        text: "A course this size goes stale quietly, so the checks are automated. One GitHub Actions workflow runs markdownlint-cli2 across every file and another runs the lychee link checker, both with read-only permissions. The link checker has caught real rot: hosts that restructured their docs, demo servers that drop out from CI runners and redirects that loop. The changelog follows Keep a Changelog with semantic versions, so a patch release means fixes and a minor release means new material.",
      },
      {
        type: "p",
        text: "The project also carries a contributing guide, a code of conduct, a security policy, a roadmap, YAML issue forms and a citation file. It moved from the MIT licence to CC BY-SA 4.0, which suits written course material better: anyone can share and adapt it as long as they credit it and keep it under the same licence.",
      },
    ],
    references: [
      { title: "Pro Git, 2nd edition (Scott Chacon and Ben Straub)", url: "https://git-scm.com/book/en/v2", note: "The free book the Git section cites most often" },
      { title: "Git reference documentation", url: "https://git-scm.com/docs", note: "The official command reference the course points to" },
      { title: "GitHub Docs", url: "https://docs.github.com/en", note: "Primary source for the GitHub section" },
      { title: "First Contributions", url: "https://github.com/firstcontributions/first-contributions", note: "The well-known first pull request project, linked from section 11" },
      { title: "lychee link checker action", url: "https://github.com/lycheeverse/lychee-action", note: "Runs the link check in CI" },
      { title: "markdownlint-cli2", url: "https://github.com/DavidAnson/markdownlint-cli2", note: "Runs the Markdown style check in CI" },
      { title: "Creative Commons Attribution-ShareAlike 4.0", url: "https://creativecommons.org/licenses/by-sa/4.0/", note: "The course's licence" },
    ],
  }

export default _git_unlocked
