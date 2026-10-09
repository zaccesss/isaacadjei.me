import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  number: 8,
  slug: "issue-08-datasheets-and-a-new-country",
  title: "Datasheets, decision notes and a new country",
  subtitle: "The skill nobody teaches, what nobody tells international students about UK engineering, why I write down why and six small lessons.",
  tags: ["Embedded", "Hardware", "Electronics", "International", "Personal", "Career"],
  date: "2026-08-21",
  published: true,
  intro: [
    { type: "p", text: "Two of the posts this fortnight are things I wish someone had handed me earlier. One is about reading the documents every component comes with and the other is about arriving in a new country to study engineering." },
    { type: "h2", text: "What I wrote" },
    { type: "p", text: "[Reading Datasheets](/blog/reading-datasheets) is about the skill nobody teaches. It shows how to start from the description and block diagram, then work through pin configuration, electrical characteristics, register descriptions and timing diagrams. It also covers errata sheets, silicon revisions and a worked register example. Once you can navigate a datasheet you no longer depend on someone else having written a tutorial." },
    { type: "p", text: "[Navigating UK Engineering as an International Student](/blog/international-student-engineering-uk) is the practical and personal side of moving from Ghana in April 2022 with a General Arts background. It covers the academic entry routes, the visa and immigration layer, the gap in academic culture, what actually helped and the reality of the graduate job market. It ends with a few words for whoever is in the middle of it right now." },
    { type: "h2", text: "From the notebook" },
    { type: "p", text: "[Writing down why](/notes/writing-down-why) explains my short decision notes. Code records what a system does but the reasons disappear. Each note answers what I decided, what else I considered and what would make me change my mind. That last question is the one I value most." },
    { type: "h2", text: "Small things I learned" },
    {
      type: "ul",
      items: [
        "[GPIO open-drain mode](/til/gpio-open-drain-wired-and) gives you wired-AND without any extra logic, which is exactly how I2C shares its lines.",
        "[CPython compiles to bytecode](/til/python-bytecode-cpython) before running it. The GIL then lets only one thread run that bytecode at a time.",
        "[How a text message travels](/til/how-text-messages-work) through three separate network systems, including the 1970s SS7 network.",
        "[Format string exploits in a CTF](/til/format-string-exploit-ctf) turn one careless printf into a read and write of arbitrary memory.",
        "[Bypass capacitors](/til/bypass-capacitor-placement) only work when they sit right next to the power pins.",
        "[strace](/til/strace-system-calls) shows every system call a program makes, even when you have no source code.",
      ],
    },
  ],
}

export default issue
