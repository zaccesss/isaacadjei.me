import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "midweek",
  number: 1,
  slug: "midweek-01-africa-day-oau",
  title: "Africa Day and the birth of African unity",
  subtitle: "Every 25 May the continent marks the founding of the Organisation of African Unity in 1963.",
  tags: ["Africa", "History", "Politics"],
  date: "2026-05-27",
  published: true,
  intro: [
    { type: "p", text: "This is the first Midweek issue. Every other Wednesday it looks beyond engineering, at the world, sport, people and culture. It lives on the site only, so your inbox still gets one email a week at most. It starts with a date that matters across the whole continent." },
    { type: "p", text: "On 25 May 1963 representatives of thirty African nations met in Addis Ababa, Ethiopia, hosted by Emperor Haile Selassie. The summit ended with an agreement from all delegates to found the Organisation of African Unity. Its charter set out to coordinate efforts to raise the standard of living of member states and to defend their sovereignty." },
    { type: "h2", text: "From the OAU to the African Union" },
    { type: "p", text: "The OAU was replaced by the African Union on 9 July 2002. The holiday stayed on 25 May. First named Africa Freedom Day and then Africa Liberation Day, it is now celebrated as Africa Day in honour of the OAU's founding." },
    { type: "h2", text: "Why I find it interesting" },
    { type: "p", text: "In 1963 many of the countries in that room had been independent for only a few years. Agreeing to work together that early was a statement about the future as much as the present. Africa Day is a good reminder that the continent's story is one of countries across a whole continent choosing to stand together." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[1963: African states unite against white rule](http://news.bbc.co.uk/onthisday/hi/dates/stories/may/25/newsid_2502000/2502771.stm) from BBC On This Day",
        "[Africa Day](https://en.wikipedia.org/wiki/Africa_Day) on Wikipedia",
      ],
    },
  ],
}

export default issue
