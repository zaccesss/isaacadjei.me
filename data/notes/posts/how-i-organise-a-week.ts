import type { NotePost } from "../index"

const post: NotePost = {
  slug: "how-i-organise-a-week",
  title: "How I organise a week",
  date: "2026-10-09",
  description:
    "Lectures, labs, a weekly PAL session, two elected roles and several projects all share the same seven days. This is the structure that stops them fighting each other.",
  tags: ["Planning", "University", "Productivity"],
  published: true,
  content: [
    {
      type: "p",
      text: "This term my week has more moving parts than it has ever had. There is the course itself, with lectures, labs and coursework. There is a weekly Peer Assisted Learning session in Python that I lead. I am the treasurer of the Computing and Electronics Society and a course rep again. Then there are the projects: Vitafolio is live and has real users, PHAEMOS and MELOPHOS are both in active build and LidarSAT has a team depending on my part of the work. None of that is a complaint. It is just a lot of things that each want to be the most important one.",
    },
    {
      type: "p",
      text: "What I have learned is that the problem is rarely time. It is switching. If every day is a mix of everything, every day feels busy and very little gets finished. So the week has a shape and the shape matters more than any single tool.",
    },
    { type: "h2", text: "Fixed blocks first" },
    {
      type: "p",
      text: "On Sunday evening I put the things that cannot move into the calendar before anything else: lectures, labs, the PAL session, committee meetings and any rep meeting. Those are the skeleton. Everything else has to fit around them, so it makes sense to see them first and stop pretending I have more free hours than I do.",
    },
    {
      type: "p",
      text: "Then I add travel and meals. It sounds obvious, but the gap between a lab ending and the next lecture starting is not real working time once you count walking across campus and eating something. Counting it honestly is the difference between a plan that works and a plan that makes me feel behind by Tuesday.",
    },
    { type: "h2", text: "One theme per day where possible" },
    {
      type: "p",
      text: "Outside the fixed blocks, I try to give each day a main theme. One day leans towards coursework and lab write-ups. One leans towards a project. One carries the admin: society finances, rep emails, replies to people. The theme is not a rule that bans everything else. It is a default, so when I sit down with a free hour I already know what that hour is for.",
    },
    {
      type: "p",
      text: "The PAL day has its own rhythm. The worksheet and slides are ready the day before, so the morning of the session is for a final run through the exercises rather than writing them. Preparing early also means I notice the questions that will trip people up, which makes the session itself calmer.",
    },
    { type: "h2", text: "Deep work in the morning, small work after" },
    {
      type: "p",
      text: "My best focus is earlier in the day, so the hardest task goes there: a derivation I do not understand yet, a circuit that will not behave or a tricky bit of firmware. Email, issue triage and small fixes go later, when my attention is lower anyway. Reading Cal Newport's [Deep Work](https://www.calnewport.com/books/deep-work/) earlier this year gave me the language for this, but the habit came from noticing which hours I actually got things done in.",
    },
    { type: "h2", text: "A weekly review that takes twenty minutes" },
    {
      type: "p",
      text: "Friday or Sunday, I look back before I look forward. The review is short on purpose:",
    },
    {
      type: "ul",
      items: [
        "What did I finish and what slipped?",
        "Is anything due in the next two weeks that I have not started?",
        "Which project gets the most time next week and which one is deliberately parked?",
        "Is there anything I said yes to that I should hand back?",
      ],
    },
    {
      type: "p",
      text: "The parked question is the important one. With several projects, the honest answer is that most weeks only one of them moves forward properly. Choosing it on purpose feels much better than giving each one an hour and watching none of them change.",
    },
    { type: "h2", text: "Protecting rest" },
    {
      type: "p",
      text: "I keep time for church, the gym and people and I put those in the calendar too. If they are not written down, they are the first things to get squeezed when a deadline lands. A week where I rest properly is almost always a week where I get more done, not less.",
    },
    {
      type: "callout",
      tone: "tip",
      text: "If a plan only works when nothing goes wrong, it is not a plan. I leave one evening a week empty so a late lab report or a surprise meeting has somewhere to go.",
    },
    {
      type: "p",
      text: "None of this is clever. It is a calendar, a short list and a habit of looking at both. The real value is that I spend less energy deciding what to do next and more of it actually doing it. I will write up the tools behind it in a later note.",
    },
  ],
}

export default post
