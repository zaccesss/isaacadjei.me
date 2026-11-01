import type { NotePost } from "../index"

const post: NotePost = {
  slug: "notes-from-running-society-finances",
  title: "Notes from running a society's finances",
  date: "2026-10-30",
  description:
    "What a couple of events as treasurer of the Computing and Electronics Society have taught me about buying through the Students' Union, ordering food from the right place and keeping records someone else could pick up.",
  tags: ["Society", "Leadership", "Finance", "University"],
  published: true,
  content: [
    {
      type: "p",
      text: "This year I am treasurer of the Aston Computing and Electronics Society. Before I started, I assumed the job was mostly arithmetic. It is not. The sums are the easy part. Most of the work is knowing how money is supposed to move through a society, where things should be bought from and keeping the rest of the committee in the picture.",
    },
    {
      type: "p",
      text: "We have run a couple of events so far. That is not a lot, but the first one taught us more about how things actually work than any amount of reading beforehand. These are the notes I would give myself on day one.",
    },
    { type: "h2", text: "The first event was the real training" },
    {
      type: "p",
      text: "For our first event the committee paid for things out of our own pockets and planned to sort it out afterwards. It worked, in the sense that the event happened, but it was not the right way to do it. Personal money and society money got mixed up and working out who was owed what took longer than it should have. We learned from it and we do things differently now.",
    },
    { type: "h2", text: "Ask the Students' Union first" },
    {
      type: "p",
      text: "The biggest lesson is that the Students' Union is not just where the society's account sits. It has its own partners and approved providers and it knows the rules for spending far better than a new committee does. Before buying anything now, it is usually worth checking with the SU first. Often there is already a route that is cheaper, simpler or both and it saves us from having to undo a purchase later.",
    },
    { type: "h2", text: "Order from the right place, especially food" },
    {
      type: "p",
      text: "Food is where this matters most. People coming to an event have dietary requirements and we have a responsibility to get those right. There is also a more serious side. If someone got food poisoning from a supplier that was not approved, both the SU and the society would be in real trouble. Ordering from an approved provider is not red tape for its own sake. It is what protects the people who turn up and the society itself.",
    },
    {
      type: "callout",
      tone: "tip",
      text: "Before an event, check with the Students' Union where the food should come from. It takes one message and it covers dietary requirements and safety in a way a quick supermarket run cannot.",
    },
    { type: "h2", text: "It is more than the finances" },
    {
      type: "p",
      text: "On a small committee, nobody only does their own job. As well as the money side, I help set up and run events when they need an extra pair of hands: carrying kit, setting out the room, helping on the day. Being there also helps with the finance side, because I see what an event really needs rather than guessing from a list.",
    },
    { type: "h2", text: "Habits I am building" },
    {
      type: "p",
      text: "None of this is a polished system yet. These are the habits I am working on as I go:",
    },
    {
      type: "ul",
      items: [
        "Keep every receipt and note what it was for and which event it belongs to.",
        "Record spending clearly enough that whoever takes over next year could follow it without asking me.",
        "Give the committee a short, regular update on what has come in, what has gone out and what is coming up.",
        "When an idea does not fit, explain the trade-off instead of giving a flat no: what it would replace, whether a smaller version works or whether it fits better later.",
      ],
    },
    {
      type: "p",
      text: "The handover point matters to me in particular. A treasurer serves for a year and the next one should not have to start from nothing. It is the same reason I write documentation in software. If only one person understands how something works, it is fragile.",
    },
    { type: "h2", text: "What carries over" },
    {
      type: "p",
      text: "The role is teaching me things that have little to do with money: asking the people who know before acting, thinking about who could be affected by a decision and writing things down so they outlast me. Those all show up in engineering work too.",
    },
    {
      type: "p",
      text: "If you are thinking of standing for a treasurer role in your own society, do it. Expect the first event to teach you a lot and talk to your Students' Union early. It is far less intimidating once you know who to ask.",
    },
  ],
}

export default post
