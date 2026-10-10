import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "midweek",
  number: 4,
  slug: "midweek-04-ghana-republic-day",
  title: "Ghana becomes a republic",
  subtitle: "Last week Ghana marked Republic Day, the anniversary of the country becoming a republic on 1 July 1960.",
  tags: ["Ghana", "History", "Politics"],
  date: "2026-07-08",
  published: true,
  intro: [
    { type: "p", text: "Last week, on 1 July, Ghana marked Republic Day. It commemorates 1960, when the country moved from a constitutional monarchy with Queen Elizabeth II as head of state to a republic with its own president." },
    { type: "image", src: "/images/newsletter/kwame-nkrumah.jpg", alt: "A black and white portrait photograph of Kwame Nkrumah", caption: "Kwame Nkrumah. Photo: The National Archives UK, Open Government Licence" },
    { type: "h2", text: "The 1960 vote" },
    { type: "p", text: "Ghana had become independent on 6 March 1957, which is still its main national holiday. In 1960 a referendum asked whether to become a republic with a presidential system. More than 1,000,000 people voted in favour, about 88 per cent of the vote. A presidential election held at the same time was won by the Prime Minister, Kwame Nkrumah." },
    { type: "p", text: "Nkrumah was inaugurated on 1 July 1960 and replaced the Queen as head of state, which also ended the post of Governor-General. The story did not end there. Four years later another referendum strengthened the president's powers and turned Ghana into a one-party state." },
    { type: "h2", text: "Why I find it interesting" },
    { type: "p", text: "Independence and becoming a republic were two separate steps, three years apart. The second one is easy to forget, but it is when Ghana's head of state became a Ghanaian. Nkrumah's birthday, 21 September, is now marked as Founders' Day." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[1960 Ghanaian constitutional referendum](https://en.wikipedia.org/wiki/1960_Ghanaian_constitutional_referendum) on Wikipedia",
        "[Public holidays in Ghana](https://en.wikipedia.org/wiki/Republic_Day_(Ghana)) on Wikipedia",
      ],
    },
  ],
}

export default issue
