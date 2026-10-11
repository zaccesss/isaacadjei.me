import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "midweek",
  number: 2,
  slug: "midweek-02-world-cup-2026-48-teams",
  title: "The first World Cup with 48 teams",
  subtitle: "The 2026 World Cup starts this week across Canada, Mexico and the United States, the biggest edition yet.",
  tags: ["Football", "World Cup", "Sport"],
  date: "2026-06-10",
  published: true,
  intro: [
    { type: "p", text: "The 2026 FIFA World Cup kicks off this week. It breaks new ground in two ways. It is the first World Cup hosted by three countries (Canada, Mexico and the United States) and the first to include 48 teams instead of 32." },
    { type: "image", src: "/images/newsletter/estadio-azteca.jpg", alt: "Estadio Azteca in Mexico City seen from a drone, with its steep tiers of seats around the pitch", caption: "Estadio Azteca in Mexico City. Photo: ProtoplasmaKid, CC BY-SA 4.0, via Wikimedia Commons" },
    { type: "h2", text: "A tournament across a continent" },
    { type: "p", text: "Matches are spread across 16 host cities: 11 in the United States, 3 in Mexico and 2 in Canada. Mexico becomes the first country to host the World Cup three times, after 1970 and 1986. The United States last hosted in 1994, while this is Canada's first time." },
    { type: "p", text: "The bigger field also brings new faces. Cape Verde, Curaçao, Jordan and Uzbekistan all qualified for their first World Cup." },
    { type: "h2", text: "Why I find it interesting" },
    { type: "p", text: "More teams means more countries with a real stake in the tournament, especially smaller footballing nations that rarely got the chance before. It also means more travel and more matches, so it will be interesting to see whether the quality holds up across a longer tournament." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[FIFA World Cup 26](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026) from FIFA","[2026 FIFA World Cup](https://en.wikipedia.org/wiki/2026_FIFA_World_Cup) on Wikipedia",
      ],
    },
  ],
}

export default issue
