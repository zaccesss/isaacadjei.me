import type { NotePost } from "../index"

const post: NotePost = {
  slug: "the-tools-i-plan-with",
  title: "The tools I plan with",
  date: "2026-11-20",
  description:
    "A calendar for time, Notion for plans and briefs, Obsidian for study notes, GitHub issues and Linear for project work plus Zotero for papers. What each one is for and where the lines between them sit.",
  tags: ["Planning", "Tools", "Productivity"],
  published: true,
  content: [
    {
      type: "p",
      text: "A few weeks ago I wrote about [how I organise a week](/notes/how-i-organise-a-week). The structure matters more than the software, but the software still has to stay out of the way. Over time I have settled on a small set of tools, each with one clear job. The rule that holds it together is simple: every kind of information has exactly one home.",
    },
    { type: "h2", text: "The calendar: time" },
    {
      type: "p",
      text: "The calendar only holds things that happen at a time: lectures, labs, my PAL session, meetings and the blocks of focused work I plan on Sunday. If something does not have a time, it does not go in the calendar. Mixing tasks into it was the fastest way I found to stop trusting it.",
    },
    { type: "h2", text: "Notion: plans and briefs" },
    {
      type: "p",
      text: "[Notion](https://www.notion.com/) holds anything that is a plan or a record but not code: meeting notes, research threads, project briefs and learning logs. My weekly review lives there too, as a simple page with the same four questions each week. Its databases are useful for lists that need a status, like a reading list or a set of ideas waiting for time.",
    },
    { type: "h2", text: "Obsidian: study notes" },
    {
      type: "p",
      text: "Lecture and revision notes go in [Obsidian](https://obsidian.md/). The notes are plain Markdown files on my own machine, which I like for two reasons. They will open in anything for as long as I need them and linking notes to each other is effortless. A note on op-amps links to the one on feedback, which links to the amplifier circuits from the lab and over a term those links build into something closer to understanding than a pile of separate pages.",
    },
    { type: "h2", text: "GitHub issues and Linear: project work" },
    {
      type: "p",
      text: "Anything to do with code or hardware lives next to the project. My own repos run on GitHub issues and pull requests: every real change starts as an issue, goes through a branch and a reviewed pull request and ends with a changelog entry. That sounds heavy for solo work, but it means the history of every decision is written down where the code is.",
    },
    {
      type: "p",
      text: "For planning across a longer stretch, I use [Linear](https://linear.app/). Its cycles are fixed windows that start and end on schedule whatever ships, which suits a term far better than release-based planning. When a cycle ends, unfinished work rolls over and I can see honestly how much I took on compared with how much I finished.",
    },
    { type: "h2", text: "Zotero: papers and references" },
    {
      type: "p",
      text: "Research papers, datasheets and references for reports go into [Zotero](https://www.zotero.org/). The LidarSAT project and the research notes on this site both depend on sources I need to find again months later and Zotero handles citations for reports so I never retype a reference by hand.",
    },
    { type: "h2", text: "What I deliberately do not use" },
    {
      type: "ul",
      items: [
        "A separate to-do app. Tasks live with their context: project tasks in issues, study tasks in the weekly review, admin in the calendar if it has a time.",
        "Sticky notes on the desktop. They pile up and never get reviewed.",
        "Anything that only works on one device. I switch between a MacBook and Windows machines, so every tool has to follow me.",
      ],
    },
    {
      type: "table",
      headers: ["Kind of information", "Home"],
      rows: [
        ["Something at a fixed time", "Calendar"],
        ["Plans, briefs, meeting notes, weekly review", "Notion"],
        ["Lecture and revision notes", "Obsidian"],
        ["Project tasks and decisions", "GitHub issues"],
        ["Longer-range project planning", "Linear cycles"],
        ["Papers, datasheets and citations", "Zotero"],
      ],
      caption: "One home for each kind of information",
    },
    {
      type: "callout",
      tone: "tip",
      text: "If you are building your own setup, start by deciding where each kind of information lives before choosing any app. The tools are interchangeable. The boundaries are what make it work.",
    },
    {
      type: "p",
      text: "The full list of hardware and software I use day to day, including the editors and terminal setup, is on the [uses page](/uses).",
    },
  ],
}

export default post
