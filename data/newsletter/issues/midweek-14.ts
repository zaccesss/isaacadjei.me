import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "midweek",
  number: 14,
  id: "midweek-14-mpesa-kenya-mobile-money",
  slug: "m-pesa-and-how-kenya-leapfrogged-the-bank-branch",
  title: "M-Pesa and how Kenya leapfrogged the bank branch",
  subtitle: "In 2007 a phone network in Kenya started letting people send money by text. A decade later researchers measured what it did for poverty.",
  tags: ["Africa", "Kenya", "Technology"],
  date: "2026-11-25",
  published: true,
  intro: [
    { type: "p", text: "In 2007 Safaricom, Kenya's largest mobile network, started M-Pesa, a money transfer service that runs on ordinary phones. Instead of a bank account you load cash onto your phone at a local agent, send it by text message and the person at the other end withdraws it at their own agent." },
    { type: "image", src: "/images/newsletter/mpesa-agent.jpg", alt: "A small shop front in Nairobi painted green with M-PESA signs and an Equity bank agent sign, with a customer at the counter", caption: "An M-Pesa and Equity agent in Nairobi. Photo: Fiona Graham, CC BY-SA 2.0, via Wikimedia Commons" },
    { type: "h2", text: "What it did for poverty" },
    { type: "p", text: "The economists Tavneet Suri and William Jack, working with Innovations for Poverty Action, took advantage of how unevenly the agent network grew. They tracked incomes in areas that gained agents between 2008 and 2010 and compared them with areas that did not. Their study estimated that access to M-Pesa increased per capita consumption and lifted 194,000 households, about 2 per cent of Kenyan households, out of poverty." },
    { type: "p", text: "The effect was strongest for women. Places that went from zero to six M-Pesa agents ended up with 22 per cent fewer female-headed households living in extreme poverty than similar places where no agents arrived. By then the network had grown to around 150,000 agents across the country." },
    { type: "h2", text: "Why I find it interesting" },
    { type: "p", text: "Kenya did not build a bank branch in every town first. It used the network it already had in phones and small shops. It skipped a step that richer countries took for granted. The clever part is less the software than the agents: a human network that turns digital money back into cash wherever people live. The study compared areas rather than running a controlled trial, so the exact figures come with that caveat." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[In Kenya, phones replace bank tellers](https://www.fsdkenya.org/blogs-publications/blog/in-kenya-phones-replace-bank-tellers/) from FSD Kenya",
        "[The long-run poverty and gender impacts of mobile money](https://doi.org/10.1126/science.aah5309) by Tavneet Suri and William Jack in Science",
      ],
    },
  ],
}

export default issue
