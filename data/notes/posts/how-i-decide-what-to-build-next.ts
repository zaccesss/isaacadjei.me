import type { NotePost } from "../index"

const post: NotePost = {
  slug: "how-i-decide-what-to-build-next",
  title: "How I decide what to build next",
  date: "2026-07-17",
  description:
    "I have more ideas than time. The few questions I ask before any idea gets real hours.",
  tags: ["Projects", "Planning", "Engineering"],
  published: true,
  content: [
    { type: "p", text: "I keep a list of project ideas and it only ever grows. Most of them will never be built. That is fine. What matters is choosing well when I do start something, because a project I abandon halfway costs more than it teaches." },
    { type: "h2", text: "The questions I ask" },
    { type: "ol", items: ["Will it teach me something I cannot learn by reading? Building is slow, so it should earn its time with lessons I cannot get another way.", "Does it solve a problem I actually have? I stick with projects I use myself, because I notice when they break.", "Can I describe a first version I could finish in a few weeks? If the smallest useful version is huge, the idea needs more thought first.", "Would I be happy to write about it? If I would not want to explain it publicly, I probably do not understand why I want to build it."] },
    { type: "h2", text: "What usually wins" },
    { type: "p", text: "The ideas that survive tend to sit where hardware and software meet. That is where I learn the most and where my two interests stop competing for my time and start helping each other." },
    { type: "p", text: "The list keeps growing, but now most of it waits without guilt." },
  ],
}

export default post
