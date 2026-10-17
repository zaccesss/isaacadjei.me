import type { NewsletterIssueFile } from "../index"
import type { ContentBlock } from "@/data/blog"
import { zacessLaunch } from "../../blog/posts/building-zacess-a-reader-that-respects-the-file.ts"

const zacess: ContentBlock[] = zacessLaunch.map((b): ContentBlock =>
  b.type === "clip"
    ? { type: "image", src: b.poster, alt: b.alt, caption: `${b.caption ?? ""}. The clip plays in the blog post.` }
    : b,
)

const issue: NewsletterIssueFile = {
  number: 12,
  slug: "issue-12-welcome-to-the-newsletter",
  title: "Welcome to the newsletter",
  subtitle: "The first emailed issue, in two parts. This one: Zacess is open to try with matching code themes, plus accessibility, a terminal palette and an invitation from Sky.",
  tags: ["Accessibility", "Zacess", "Code themes", "Dotfiles", "Sky"],
  date: "2026-10-16",
  published: true,
  skip: [
    "blog:alerts-that-do-not-cry-wolf",
    "blog:calibrating-anomaly-scores",
    "blog:ariane-5-flight-501-overflow",
    "blog:moving-a-production-database-to-tidb",
    "til:github-actions-timeout-minutes",
    "til:postgres-now-transaction-time",
    "til:isolation-forest-offset",
    "til:sqlalchemy-identity-not-null",
  ],
  skipWorth: true,
  skipMidweek: true,
  intro: [
    { type: "p", text: "This is the first issue to arrive by email, so welcome. The newsletter lives on [my own site](/newsletter), next to the blog, TILs and notes it collects. Every issue has its own page with reactions and comments. The archive goes back to May if you want to catch up. The format is simple: a short letter from me, then everything I published since the last issue. The first fortnight was too much for one email, so today comes in two parts. This one leads with Zacess. [Issue 12.1](/newsletter/issue-12-1-calibrated-alerts-and-a-new-paper), sent at the same time, carries the engineering posts and a new paper." },
    { type: "h2", text: "Zacess is open to try" },
    { type: "p", text: `This is the same text as [the blog post](/blog/building-zacess-a-reader-that-respects-the-file), where the demo clips play and the read aloud one has sound.` },
    ...zacess,
    { type: "h2", text: "What I wrote" },
    { type: "p", text: "[Accessibility as a Default, Not a Feature](/blog/accessibility-as-a-default-wcag-2-2) is what building Vitafolio to WCAG 2.2 AA actually involved: contrast in two themes, an alternative to every drag, sign-in without memory tests and structure a screen reader can follow. The core idea is to treat an accessibility problem as a bug. [One Palette, Eight Terminals](/blog/one-palette-eight-terminals) applies the same thinking to my own tools. One JSON file and a small Python script generate high contrast light and dark themes for eight terminals, with CI refusing any colour that drops below the contrast floor." },
    { type: "p", text: "Sky got back in touch after the Black Heritage Undergraduate of the Year celebration and [invited me to a Black History Month screening of Animol](/blog/sky-animol-screening-invite), with a live Q&A and networking." },
    { type: "h2", text: "From the notebook" },
    { type: "p", text: "[How I organise a week](/notes/how-i-organise-a-week) is the structure that stops lectures, labs, the PAL session I lead, two elected roles and several projects from fighting each other. The problem is rarely time. It is switching. [My reading list for the autumn term](/notes/reading-list-autumn-term) is the plan for books between now and Christmas, from Code by Charles Petzold and FPGAs to machine learning, security, faith, music and one novel I should have read years ago." },
    { type: "h2", text: "Small things I learned" },
    {
      type: "ul",
      items: [
        "[WCAG AAA contrast](/til/wcag-aaa-contrast-7-to-1) is 7:1 for normal text and 4.5:1 for large text.",
        "[git turns colour off in pipes](/til/git-colour-off-in-pipes), which is why the same command suddenly looks plain.",
      ],
    },
  ],
}

export default issue
