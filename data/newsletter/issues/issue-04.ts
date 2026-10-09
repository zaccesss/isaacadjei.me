import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  number: 4,
  slug: "issue-04-a-room-full-of-possibility",
  title: "A room full of possibility and a year to look back on",
  subtitle: "Sky's Black Heritage celebration day, a birthday reflection, the event loop, RTOS basics, contributing to open source and a summer plan.",
  tags: ["Personal", "Sky", "RTOS", "JavaScript", "Open Source", "Embedded"],
  date: "2026-06-26",
  published: true,
  intro: [
    { type: "p", text: "This was the fullest fortnight yet. It held a celebration day I will remember for a long time, another birthday and three technical posts I had been wanting to write for months." },
    { type: "h2", text: "Two personal posts" },
    { type: "p", text: "I was a finalist for the Black Heritage Undergraduate of the Year award and [wrote about the Sky celebration day](/blog/sky-black-heritage-celebration-day). It was planned for Sky's campus in Osterley but a red weather warning moved it online at the last minute. It still meant a great deal. The post covers the award, what a technology career at Sky looks like and why representation matters. The short version is in [a TIL about a room full of people who look like you](/til/sky-celebration-day)." },
    { type: "p", text: "[Another Year, Another Lesson](/blog/another-year-another-lesson) is my birthday reflection: the people I owe thanks to, what the year actually built, my late father's words to always strive to make things better, what my constraints have taught me, piano and faith. [The TIL version](/til/birthday-reflection-2026) is the same gratitude in a paragraph." },
    { type: "h2", text: "What I wrote on the technical side" },
    { type: "p", text: "[JavaScript's Event Loop Without the Metaphors](/blog/javascript-event-loop) explains the real mechanism: the call stack, the task queue, the microtask queue, where async and await fit and why requestAnimationFrame is neither. [What an RTOS Actually Does](/blog/rtos-fundamentals) shows why a super-loop breaks down and how FreeRTOS schedules tasks with timing guarantees, covering queues, stack sizing, task notifications and tickless idle. [How to Contribute to Open Source](/blog/open-source-contributing) is a practical guide to finding a project, reading a codebase before touching it, making a first pull request and handling review, drawn from building a 217-topic Git course." },
    { type: "h2", text: "From the notebook" },
    { type: "p", text: "[What I want from this summer](/notes/what-i-want-from-this-summer) sets out the plan for the long weeks ahead: finish and write up the projects that already work, starting with PHAEMOS. The other aim is to go deeper on serial protocols, DMA, interrupts and scheduling. Just as important is what I am leaving out, which is anything big and new." },
    { type: "h2", text: "Small things I learned" },
    {
      type: "ul",
      items: [
        "[The Feynman technique](/til/feynman-technique): if you cannot explain it simply, you have found the gap in what you know.",
        "[TypeScript's satisfies operator](/til/typescript-satisfies) checks a type without widening it.",
        "[git bisect run](/til/git-bisect-run) hands the bug hunt to a script instead of answering good or bad by hand.",
        "[animation-fill-mode: both](/til/css-animation-fill-mode) keeps an element in its animated state before and after the animation.",
        "[AMD's Developer Cloud](/til/amd-developer-cloud) offers paid access to MI300X GPUs with ROCm already set up.",
        "[TLS 1.3](/til/tls-1-3-vs-1-2) finishes its handshake in one round trip instead of two.",
      ],
    },
  ],
}

export default issue
