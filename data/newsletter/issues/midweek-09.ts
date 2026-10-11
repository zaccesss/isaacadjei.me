import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "midweek",
  number: 9,
  slug: "midweek-09-akosombo-dam-lake-volta",
  title: "Akosombo and the world's largest artificial lake",
  subtitle: "Ghana's Akosombo Dam created Lake Volta, which covers 3.6 per cent of the country.",
  tags: ["Ghana", "Energy", "Engineering"],
  date: "2026-09-16",
  published: true,
  intro: [
    { type: "p", text: "When Ghana built the Akosombo Dam on the Volta River it flooded part of the river basin and created Lake Volta. The lake covers 8,502 square kilometres, 3.6 per cent of Ghana's land area. That makes it the largest artificial lake in the world by surface area." },
    { type: "image", src: "/images/newsletter/akosombo-dam.jpg", alt: "The Akosombo Dam across the Volta River in Ghana, with green hills behind it", caption: "The Akosombo Dam in Ghana. Photo: Phildawson, public domain, via Wikimedia Commons" },
    { type: "h2", text: "Power for industry" },
    { type: "p", text: "The dam's main purpose was to provide electricity for the aluminium industry. It was called the largest single investment in the economic development plans of Ghana. Its original output was 912 megawatts, raised to 1,020 megawatts by a retrofit project completed in 2006." },
    { type: "p", text: "It came at a cost. The flooding that created the lake displaced many people and changed the local environment. Reported effects include coastal erosion and changes to the local climate, with less rain and higher temperatures." },
    { type: "h2", text: "Why I find it interesting" },
    { type: "p", text: "Akosombo shows both sides of big infrastructure. It still supplies a large share of Ghana's electricity, but the people who lived in the flooded valley paid much of the price. Any large engineering project has to weigh who benefits against who loses out." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[Lake Volta](https://www.britannica.com/place/Lake-Volta) from Encyclopaedia Britannica",
        "[Volta River Authority](https://www.vra.com/), which runs the dam",
        "[Akosombo Dam](https://en.wikipedia.org/wiki/Akosombo_Dam) on Wikipedia",
        "[Lake Volta](https://en.wikipedia.org/wiki/Lake_Volta) on Wikipedia",
      ],
    },
  ],
}

export default issue
