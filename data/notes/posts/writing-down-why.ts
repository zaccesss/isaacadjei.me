import type { NotePost } from "../index"

const post: NotePost = {
  slug: "writing-down-why",
  title: "Writing down why",
  date: "2026-08-14",
  description:
    "Code records what a system does. The reasons behind it disappear unless someone writes them down. How I keep short decision notes for my projects.",
  tags: ["Engineering", "Writing", "Documentation"],
  published: true,
  content: [
    { type: "p", text: "When I come back to a project after a few months, the code tells me what it does. It almost never tells me why. Why this microcontroller and not that one, why this threshold, why a library was removed. Those reasons are exactly what I need before changing anything. They are also exactly what I forget." },
    { type: "h2", text: "A short note per decision" },
    { type: "p", text: "So I keep decision notes. Each one is short and answers three questions: what I decided, what else I considered and what would make me change my mind. It takes five minutes when the decision is fresh and saves hours later." },
    { type: "h2", text: "Why the last question matters most" },
    { type: "p", text: "Writing down what would change my mind is the part I value most. A decision made under one set of constraints can be wrong under another. When I reread a note and see that the constraint has gone, I know I can change the decision with confidence instead of guessing." },
    { type: "p", text: "It also makes the projects easier to share. Anyone reading the notes can follow the reasoning, not just the result." },
  ],
}

export default post
