import type { NotePost } from "../index"

const post: NotePost = {
  slug: "what-i-look-for-in-a-placement",
  title: "What I look for in a placement",
  date: "2026-11-06",
  description:
    "I am applying for a year-long placement starting in 2027 across embedded, hardware and software teams. These are the things that matter to me when I decide where to apply, ranked honestly.",
  tags: ["Placements", "Careers", "University"],
  published: true,
  content: [
    {
      type: "p",
      text: "I am applying for a year-long placement starting in 2027. My course sits across electronics and computer science, so the roles I am looking at range from embedded firmware and hardware teams to software engineering. That breadth is useful, but it also means I could apply almost anywhere. To avoid spraying applications at every advert, I wrote down what actually matters to me. This is that list, in roughly the order I weigh it.",
    },
    { type: "h2", text: "Real work on a real product" },
    {
      type: "p",
      text: "The first question I ask is what a placement student actually does. I want to ship something: code that runs in a product, a board that gets built, a test rig someone keeps using after I leave. Some schemes rotate students through shadowing and training for most of the year. That has value, but a year is long enough to own a piece of real work and that is what I want to come back with.",
    },
    {
      type: "p",
      text: "Good signs in an advert are specific: it names the team, the product area and the tools. Vague adverts are not always bad, but they are the ones I ask about at interview.",
    },
    { type: "h2", text: "Hardware and software together" },
    {
      type: "p",
      text: "My favourite work happens where the two meet: firmware talking to a sensor, a backend making sense of data from a device, a dashboard showing what a machine is doing. That is exactly what PHAEMOS and MELOPHOS are about. A team where I can touch both sides, even if my main role is one of them, is worth a lot to me. Embedded and hardware companies matter to me just as much as the big software names for that reason.",
    },
    { type: "h2", text: "A mentor who has time" },
    {
      type: "p",
      text: "A year goes far better with someone who reviews my work honestly and explains why. I look for any sign of how placement students are supported: a named mentor, regular reviews, previous students who stayed on or came back as graduates. Reviews on sites like [Higherin](https://higherin.com/) (formerly RateMyPlacement) help here, as long as I read the recent ones rather than the average score.",
    },
    {
      type: "p",
      text: "Being a student judge for the targetjobs awards also showed me how differently employers describe their schemes. The strongest submissions talked about what students built and how they were supported, not just how many events they attended.",
    },
    { type: "h2", text: "Engineering culture" },
    {
      type: "p",
      text: "I care about how a team works: code review, testing, documentation and whether people are encouraged to ask questions. I run my own repos with issues, pull requests, reviews and changelogs, so I notice quickly when that culture is missing. A place that values clear documentation and careful review is a place I will learn the most.",
    },
    { type: "h2", text: "Accessibility in practice" },
    {
      type: "p",
      text: "This one is personal. I work with one eye, so screen setup, high contrast tools and a manager who will not treat a reasonable adjustment as a nuisance all matter. I do not need much, but I pay attention to how a company talks about accessibility before I ever have to ask.",
    },
    { type: "h2", text: "Location, pay and the practical bits" },
    {
      type: "p",
      text: "These are lower on the list but not unimportant. A placement has to be affordable to live on and the commute or relocation has to be realistic. I would rather take a slightly lower salary at a team that ticks the boxes above than chase the highest number.",
    },
    { type: "h2", text: "What I do not weigh heavily" },
    {
      type: "ul",
      items: [
        "Brand name on its own. A famous company with an unclear role loses to a smaller one with a clear one.",
        "Perks. Free lunch is nice. It is not a reason to spend a year somewhere.",
        "How competitive a scheme is. Hard to get into does not mean good for me.",
      ],
    },
    {
      type: "callout",
      tone: "note",
      text: "Writing the list down turned out to be the useful part. It makes it much easier to decide quickly when a new advert appears and it keeps cover letters honest because I can say exactly why a role fits.",
    },
    {
      type: "p",
      text: "Next week I will write up how I actually track the applications themselves, which turned into a small project of its own.",
    },
  ],
}

export default post
