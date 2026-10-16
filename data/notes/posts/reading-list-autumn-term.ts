import type { NotePost } from "../index"

const post: NotePost = {
  slug: "reading-list-autumn-term",
  title: "My reading list for the autumn term",
  date: "2026-10-16",
  description:
    "The books I am working through this term: FPGAs, embedded design, machine learning, security, faith, music and one novel I should have read years ago. Why each one is on the list.",
  tags: ["Reading", "Books", "Learning"],
  published: true,
  content: [
    {
      type: "p",
      text: "I keep a running list of what I read on the [Consumed](/consumed) page, but that list only shows a book once I have finished it. This note is the plan instead: what I want to get through between now and Christmas and why each one earned its place. A term is short, so the list is deliberately a mix of books that support the course and projects plus a few that have nothing to do with engineering at all.",
    },
    { type: "h2", text: "For the hardware" },
    {
      type: "p",
      text: "Code by Charles Petzold is the one I started at the very beginning of October. It builds a computer up from Morse code and relays to a working processor and the [second edition's companion site](https://www.codehiddenlanguage.com/) has interactive circuits for each chapter. It is the most readable explanation of why logic gates add up to a computer that I have come across and it pairs well with digital design lectures.",
    },
    {
      type: "p",
      text: "[Getting Started with FPGAs](https://nostarch.com/gettingstartedwithfpgas) by Russell Merrick is next. FPGA development was one of my summer goals and I want a book that treats Verilog and VHDL side by side and actually explains timing and synthesis rather than only syntax. If it goes well, it feeds straight into the hardware side of MELOPHOS.",
    },
    {
      type: "p",
      text: "Making Embedded Systems by Elecia White covers the firmware patterns I keep reinventing badly: state machines, interrupts, power and how to debug something that has no screen. After a summer of bare metal AVR work in avr-zac and with the PHAEMOS sensor nodes coming up, it feels like the right moment.",
    },
    { type: "h2", text: "For software and security" },
    {
      type: "p",
      text: "Hands-On Machine Learning by Aurelien Geron is on the list because PHAEMOS uses per-node anomaly models and LidarSAT compares a classic matcher with a learned one. I understand the ideas, but I want the practical side to be solid and every chapter ends in notebooks I can run.",
    },
    {
      type: "p",
      text: "[Hacking: The Art of Exploitation](https://nostarch.com/hacking2.htm) by Jon Erickson is for the end of term. It teaches C, assembly and memory layout by breaking things, which is the best argument I know for writing careful C in the first place.",
    },
    { type: "h2", text: "Outside engineering" },
    {
      type: "p",
      text: "Things Fall Apart by Chinua Achebe is the novel. I grew up in Ghana and it is a book I have heard about my whole life without sitting down to read properly. It is short, so there is no excuse.",
    },
    {
      type: "p",
      text: "Mere Christianity by C.S. Lewis is for my faith. I like that it reasons carefully from first principles rather than assuming agreement and I want to read it slowly rather than rush it.",
    },
    {
      type: "p",
      text: "Effortless Mastery by Kenny Werner is the music book. I play piano, including in church and the book is about fear and playing from a relaxed place rather than about technique. That is the part of playing I most need to work on.",
    },
    { type: "h2", text: "How I read with a busy term" },
    {
      type: "ul",
      items: [
        "Two books on the go at most: one technical and one not.",
        "Technical books get a notebook beside them. If I cannot explain a chapter back in a few lines, I reread it.",
        "Short sessions count. Twenty minutes before bed adds up to a book a month.",
        "If a book is not working for me after a few chapters, I put it down without guilt and note why.",
      ],
    },
    {
      type: "callout",
      tone: "note",
      text: "This is a plan, not a promise. The finished books will show up on the Consumed page as I get through them, each with a short note on what I took from it.",
    },
    {
      type: "p",
      text: "If you have read any of these and think there is a better book on the same topic, I would genuinely like to hear it. The contact form is the easiest way to tell me.",
    },
  ],
}

export default post
