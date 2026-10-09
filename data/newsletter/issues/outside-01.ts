import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "outside",
  number: 1,
  slug: "outside-01-global-accessibility-awareness-day",
  title: "Fifteen years of Global Accessibility Awareness Day",
  subtitle: "A day that started as one developer's blog post turned fifteen this week.",
  tags: ["Accessibility", "Web", "Design"],
  date: "2026-05-22",
  published: true,
  intro: [
    { type: "p", text: "Thursday 21 May 2026 marked the 15th [Global Accessibility Awareness Day](https://accessibility.day/), better known as GAAD. It falls on the third Thursday of May every year and asks people who build digital products to spend at least part of the day thinking about how disabled people use them." },
    { type: "p", text: "It began with a single blog post. In November 2011 Joe Devon, a web developer in Los Angeles, wrote a challenge asking how many developers knew what the JAWS screen reader was. He pointed out that people happily test a site in several browsers but rarely check it in a screen reader. Jennison Asuncion, an accessibility professional in Toronto, found the post through a tweet and the two set up the first GAAD together." },
    { type: "h2", text: "Why it matters to engineers" },
    { type: "p", text: "The original question still lands. Accessibility is usually lost at the build stage rather than the design stage: a button with no label, a status shown only by colour, a chart that only makes sense if you can see it. None of these are hard to fix, but they are easy to miss if nobody on the team ever turns on a screen reader or tries the keyboard alone. Universities and companies around the world ran sessions this year on exactly that kind of practical skill." },
    { type: "p", text: "With monocular vision, contrast and predictable layouts are practical needs for me rather than polish, so this one is personal. The habit worth stealing from GAAD is small and repeatable: before shipping a page or a dashboard, tab through it with no mouse and check that every state has a signal other than colour." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[Global Accessibility Awareness Day](https://accessibility.day/)",
        "[About GAAD and how it started](https://accessibility.day/about/)",
        "[GAAD Foundation](https://gaad.foundation/)",
      ],
    },
  ],
}

export default issue
