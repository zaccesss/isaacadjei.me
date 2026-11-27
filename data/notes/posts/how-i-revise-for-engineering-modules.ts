import type { NotePost } from "../index"

const post: NotePost = {
  slug: "how-i-revise-for-engineering-modules",
  title: "How I revise for engineering modules",
  date: "2026-11-27",
  description:
    "Engineering exams test whether you can do things, not whether you recognise them. Past papers, worked problems from a blank page, explaining it out loud and spacing it out across the term.",
  tags: ["Revision", "University", "Learning"],
  published: true,
  content: [
    {
      type: "p",
      text: "The biggest mistake I made early on was revising engineering the way I might revise a history essay: rereading notes until they felt familiar. Familiar is not the same as able. An electronics exam does not ask whether I recognise a circuit. It asks me to analyse one I have never seen, under time pressure, with nothing but a calculator. So my revision has to practise exactly that.",
    },
    {
      type: "p",
      text: "With the end of term in sight, this is the approach I am using.",
    },
    { type: "h2", text: "Start in week one, not week ten" },
    {
      type: "p",
      text: "Revision does not begin when lectures end. After each week's lectures I do a small set of problems on that week's material, usually the tutorial sheet plus one or two from a textbook. It is not long, but it means that by the end of term I am revising things I have already practised rather than learning them for the first time.",
    },
    { type: "h2", text: "Past papers are the main event" },
    {
      type: "p",
      text: "Past papers tell me what the module actually tests, how questions are phrased and how marks are split. I work through them in three passes:",
    },
    {
      type: "ol",
      items: [
        "Open book and untimed, to find the gaps. Anything I cannot start goes on a list.",
        "Closed book on the topics from that list, once I have gone back and fixed them.",
        "Fully timed, in one sitting, close to the exam. This is about pace as much as knowledge.",
      ],
    },
    { type: "h2", text: "Work problems from a blank page" },
    {
      type: "p",
      text: "Reading a worked solution and nodding along is the most convincing illusion in revision. I cover the solution, attempt the problem myself and only look once I am properly stuck. If I needed the solution, the problem goes back on the list for another attempt a few days later. The second attempt is where the learning actually sticks.",
    },
    { type: "h2", text: "Explain it out loud" },
    {
      type: "p",
      text: "Leading a PAL session every week has taught me more about revision than any guide. When a student asks why something works, I find out very quickly whether I actually understand it or only know the steps. I now do the same thing alone: pick a topic and explain it out loud or in writing, as if to someone who has not seen it. Wherever I stumble is exactly what needs more work. It is essentially the Feynman technique and it works.",
    },
    { type: "h2", text: "Space it out" },
    {
      type: "p",
      text: "Instead of one long session per topic, I come back to each one several times with gaps in between. For definitions, formulas and standard results I use flashcards in [Anki](https://apps.ankiweb.net/), which schedules reviews automatically so cards I find easy come back less often. The cards are short and in my own words. If a card needs a paragraph, it is a problem to practise, not a fact to memorise.",
    },
    { type: "h2", text: "Build the formula sheet myself" },
    {
      type: "p",
      text: "Even when the exam provides a formula sheet, I write my own as I go. Making it forces me to decide what is important and how the ideas connect. I usually find I barely need it by the end, which is the point.",
    },
    { type: "h2", text: "Labs and projects count too" },
    {
      type: "p",
      text: "Some of my best revision has been accidental. Debugging an interrupt on the ATmega644P in avr-zac made timer registers far clearer than any lecture slide. Designing the sensor nodes for PHAEMOS has done the same for signal conditioning. When a topic connects to something I have built, I revise it through that project and the understanding lasts much longer.",
    },
    {
      type: "callout",
      tone: "tip",
      text: "Keep a mistakes list. Every time you get something wrong in practice, write down what went wrong in one line. Reading that list the night before an exam is worth more than rereading any set of notes.",
    },
    { type: "h2", text: "Look after the basics" },
    {
      type: "p",
      text: "Sleep, food and exercise are part of revision, not breaks from it. I protect them most in the weeks before exams, because a tired brain makes careless mistakes on problems it could otherwise solve. Long nights feel productive. They rarely are.",
    },
  ],
}

export default post
