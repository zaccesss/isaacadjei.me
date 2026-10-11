import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "midweek",
  number: 10,
  slug: "midweek-10-black-history-month-uk",
  title: "Black History Month in the UK starts tomorrow",
  subtitle: "The UK has marked Black History Month in October since 1987, thanks to a Ghanaian organiser in London.",
  tags: ["History", "UK", "Culture"],
  date: "2026-09-30",
  published: true,
  intro: [
    { type: "p", text: "Tomorrow is the start of October, which in the United Kingdom is Black History Month. The United States and Canada mark it in February. Ireland and the UK observe it in October." },
    { type: "h2", text: "How it started here" },
    { type: "p", text: "The UK's Black History Month was organised through the leadership of Akyaaba Addai-Sebo, a Ghanaian analyst who was a coordinator of special projects at the Greater London Council. The first celebration was held in London on 1 October 1987. Dr Maulana Karenga from the United States was invited to a Greater London Council event about Black people's contributions to history." },
    { type: "h2", text: "Why I find it interesting" },
    { type: "p", text: "It is striking that the UK's Black History Month began with a Ghanaian in London. It is a good example of how one person with an idea and the right platform can start something that lasts for decades. This October is a chance to learn some history that school may have skipped." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[Black History Month UK](https://www.blackhistorymonth.org.uk/), the official UK site","[Black History Month](https://en.wikipedia.org/wiki/Black_History_Month) on Wikipedia, for the 1987 history",
      ],
    },
  ],
}

export default issue
