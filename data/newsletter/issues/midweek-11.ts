import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "midweek",
  number: 11,
  slug: "midweek-11-galamsey-ghana-rivers",
  title: "Galamsey and the rivers of Ghana",
  subtitle: "Illegal gold mining is turning Ghana's rivers brown. How big the damage is and what the government is doing about it.",
  tags: ["Ghana", "Environment", "Africa"],
  date: "2026-10-14",
  published: true,
  intro: [
    { type: "p", text: "Galamsey is the name Ghanaians use for illegal small-scale gold mining. Diggers strip riverbanks and forest floors to reach gold-bearing soil, then wash it in the nearest stream. The sediment and the chemicals used to separate the gold go straight into the water." },
    { type: "image", src: "/images/newsletter/galamsey-river.jpg", alt: "An aerial view of a narrow bridge crossing a wide river that is an opaque brown, with green forest on both banks", caption: "A bridge over a damaged river in Ghana. Photo: Goldenwabbit, CC BY-SA 4.0, via Wikimedia Commons" },
    { type: "h2", text: "How big the damage is" },
    { type: "p", text: "Assessments cited by Ghana's Water Resources Commission suggest that more than 60 per cent of the country's water bodies are polluted, much of it traceable to mining. The Coalition Against Galamsey reports that forest reserves under active illegal mining have risen from 45 to at least 50, with over 9,000 hectares directly affected. That includes the Atewa watershed, which feeds rivers that millions of people drink from." },
    { type: "p", text: "Farms suffer too. COCOBOD, the state cocoa regulator, has estimated that around 19,000 hectares of cocoa farms have been destroyed or sold off to miners. One writer in Accra put the visible change simply: the colour of the rivers is changing, with turbidity levels becoming unmeasurable." },
    { type: "h2", text: "What the government is doing" },
    { type: "p", text: "On 25 February 2026 the Finance Minister, Dr Cassiel Ato Forson, told Parliament that the Ghana Armed Forces would lead a nationwide campaign to clean water bodies within designated mining areas. NAIMOS, the national task force against illegal mining, is to step up its work in rivers, streams and forest reserves. Writers in Ghana's press argue that enforcement alone will not win. They call for formal small-scale mining licensed away from water bodies so that miners have a legal route." },
    { type: "h2", text: "Why I find it interesting" },
    { type: "p", text: "I grew up in Ghana, so this is not an abstract story to me. It is also a hard problem to engineer around. Clearing sediment from a river after the fact is slow and expensive, while the incentive to dig is immediate. Real progress probably needs monitoring, legal mining and enforcement working together." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[Is the galamsey fight winnable?](https://ghanaiantimes.com.gh/is-the-galamsey-fight-winnable/amp/) from the Ghanaian Times",
        "[Why Ghana cannot defeat galamsey](https://www.myjoyonline.com/why-ghana-cannot-defeat-galamsey/) from MyJoyOnline",
        "[GAF to lead nationwide waterbody cleanup](https://citinewsroom.com/2026/02/galamsey-gaf-to-lead-nationwide-waterbody-cleanup-naimos-to-intensify-crackdown/) from Citi Newsroom",
      ],
    },
  ],
}

export default issue
