import type { NotePost } from "../index"

const post: NotePost = {
  slug: "getting-ready-for-a-new-term",
  title: "Getting ready for a new term",
  date: "2026-09-11",
  description:
    "The week before term starts is the best time to set up the structure that will carry me through it. What I do before the first lecture.",
  tags: ["University", "Planning", "Productivity"],
  published: true,
  content: [
    { type: "p", text: "The week before a new term is quiet and full of good intentions. I have learned to use it for setup rather than hoping the structure will appear once things are busy. It never does." },
    { type: "h2", text: "Before the first lecture" },
    { type: "ul", items: ["Put every fixed commitment into the calendar first: lectures, labs and any regular sessions I lead.", "Make a folder for each module with the same layout, so I never have to think about where something goes.", "Read each module's outline and note the assessment dates in one place.", "Check my tools work: editor, toolchains for the lab boards and backups."] },
    { type: "h2", text: "Deciding what can wait" },
    { type: "p", text: "Term always brings more opportunities than time. Before it starts I decide which projects carry on during term and which pause until the next break. Making that call early means I do not have to make it again every week under pressure." },
    { type: "h2", text: "Looking back at the summer" },
    { type: "p", text: "In June I wrote down what I wanted from the summer. The honest answer is that most of it happened: the write-ups got done and the fundamentals got real time. Not everything was finished, but far more than in any summer before." },
  ],
}

export default post
