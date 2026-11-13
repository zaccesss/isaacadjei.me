import type { NotePost } from "../index"

const post: NotePost = {
  slug: "how-i-track-placement-applications",
  title: "How I track placement applications",
  date: "2026-11-13",
  description:
    "Stages, deadlines, which CV version went where and what to do next. The tracking habits I use during placement season and why they ended up inside Vitafolio.",
  tags: ["Placements", "Careers", "Vitafolio", "Planning"],
  published: true,
  content: [
    {
      type: "p",
      text: "Placement season is a pipeline problem. Every application moves through the same stages, each stage has its own deadline and the number in flight grows faster than you expect. Last week I wrote about [what I look for in a placement](/notes/what-i-look-for-in-a-placement). This note is about the less glamorous part: keeping track of it all without dropping anything.",
    },
    { type: "h2", text: "The stages" },
    {
      type: "p",
      text: "Almost every application I make goes through some version of the same path:",
    },
    {
      type: "ol",
      items: [
        "Spotted: I have seen the advert and it passes my criteria.",
        "Preparing: tailoring the CV and cover letter.",
        "Applied: submitted, with the date.",
        "Online tests: aptitude, coding or situational judgement tests, each with a deadline.",
        "Interview or assessment centre.",
        "Outcome: offer, rejection or no reply.",
      ],
    },
    {
      type: "p",
      text: "Writing the stages down sounds trivial, but it means every application has exactly one status at any time. When I look at the list I can see at a glance how many are waiting on me and how many are waiting on the employer.",
    },
    { type: "h2", text: "What I record for each one" },
    {
      type: "ul",
      items: [
        "Company, role and a link to the advert, because adverts disappear once they close.",
        "The closing date, plus my own earlier target date.",
        "Which version of my CV and cover letter I sent.",
        "Any contact names, events or conversations that led to it.",
        "The next action and when it is due.",
      ],
    },
    {
      type: "p",
      text: "The CV version is the one people forget. When an interviewer asks about something on my CV, I want to know exactly which version they are holding. I tailor each one slightly, so the differences are real.",
    },
    { type: "h2", text: "From a spreadsheet to Vitafolio" },
    {
      type: "p",
      text: "I started with a spreadsheet, like most people. It worked until the number of applications grew and the CV versions lived somewhere else entirely. Linking a row to the exact file I sent was clumsy and I kept rewriting the same notes.",
    },
    {
      type: "p",
      text: "That frustration is a big part of why [Vitafolio](https://vitafolio.isaacadjei.me) exists. It stores every version of a CV and its application tracker links each application to the version that went with it. The [features page](https://vitafolio.isaacadjei.me/features) covers the details. I use it for my own applications, which is the best way I know to find the rough edges before other students do.",
    },
    {
      type: "callout",
      tone: "note",
      text: "You do not need a dedicated tool to do this well. A spreadsheet with the columns above will get you most of the way. The important part is that every application has a status and a next action.",
    },
    { type: "h2", text: "Deadlines before they are deadlines" },
    {
      type: "p",
      text: "Many placement schemes close early or review applications as they arrive, so the advertised closing date is a ceiling, not a target. I set my own target well before it and treat that as the real deadline. Online tests get the same treatment: I book a time to sit each one as soon as the invitation arrives, rather than leaving the email in my inbox.",
    },
    { type: "h2", text: "A weekly look at the pipeline" },
    {
      type: "p",
      text: "Applications are part of my weekly review. I look for anything that has been sitting in one stage for too long, anything due in the coming week and whether I am applying to roles that actually match my list. If I notice that I am applying everywhere out of panic, that is a sign to slow down and write fewer, better applications.",
    },
    { type: "h2", text: "Handling rejections" },
    {
      type: "p",
      text: "Rejections are part of the process and I record them like any other outcome. When there is feedback I write it down next to the application, because patterns across several rejections are far more useful than any single one. A rejection marked with a reason is information. One I just try to forget is wasted.",
    },
    {
      type: "p",
      text: "The whole system takes a few minutes a day. In return, I never miss a test deadline, I always know what I sent and I can talk about every application with confidence when the phone rings.",
    },
  ],
}

export default post
