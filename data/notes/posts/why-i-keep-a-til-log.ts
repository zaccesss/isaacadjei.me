import type { NotePost } from "../index"

const post: NotePost = {
  slug: "why-i-keep-a-til-log",
  title: "Why I keep a TIL log",
  date: "2026-05-22",
  description:
    "A small habit that started this month: writing down one thing I learned, the day I learned it. Why it works better than notes I mean to tidy up later.",
  tags: ["Learning", "Writing", "Habits"],
  published: true,
  content: [
    { type: "p", text: "This month I started keeping a Today I Learned log on this site. Each entry is one thing: a fact, a trick or a mistake I will not make twice. Some are a sentence long. A few run to a paragraph and a code block. None of them is meant to be a polished article." },
    { type: "h2", text: "The problem it solves" },
    { type: "p", text: "I learn small things all the time and forget most of them within a week. I used to save links and screenshots with the plan of turning them into proper notes one day. That day never came. The pile became something I avoided opening." },
    { type: "p", text: "A TIL entry fixes that by being small enough to write straight away. If it takes more than a few minutes, it is probably a blog post instead. I note it as an idea rather than forcing it." },
    { type: "h2", text: "What I have noticed so far" },
    { type: "ul", items: ["Writing a thing down in my own words is the moment I find out whether I actually understood it.", "A public log keeps me honest. I check a fact before I post it in a way I never did for private notes.", "The entries are already useful to me. I have searched my own TILs more than once to find a command I knew I had written down."] },
    { type: "p", text: "It is a small habit, but it has changed how I learn. I pay a little more attention because I know I might write it up." },
  ],
}

export default post
