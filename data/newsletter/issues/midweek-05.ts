import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "midweek",
  number: 5,
  slug: "midweek-05-when-the-sahara-was-green",
  title: "When the Sahara was green",
  subtitle: "Thousands of years ago the world's largest hot desert was covered in grass, trees and lakes.",
  tags: ["Climate", "History", "Africa"],
  date: "2026-07-22",
  published: true,
  intro: [
    { type: "p", text: "It is hard to picture. For thousands of years most of North Africa was covered by grass, trees and lakes. Scientists call this the African humid period. It is one of the most dramatic climate swings in recent geological history." },
    { type: "image", src: "/images/newsletter/sahara-rock-art.jpg", alt: "Ancient rock art in the Sahara showing human figures with cattle", caption: "Rock art in Tassili n'Ajjer, Algeria, read as a daily scene with cattle. Photo: IssamBarhoumi, CC BY-SA 4.0, via Wikimedia Commons" },
    { type: "h2", text: "What turned it green" },
    { type: "p", text: "The humid period began about 14,600 years ago. Changes in the tilt of the Earth's axis, changes in vegetation and dust over the Sahara and rising greenhouse gases strengthened the African monsoon and brought rain far further north than today. Lakes such as Lake Chad formed or grew and the desert retreated." },
    { type: "p", text: "It ended between about 6,000 and 5,000 years ago, possibly in several steps. As the land dried out, people gradually left the desert for places with more secure water, such as the Nile Valley and Mesopotamia. Those are the regions where some of the earliest complex societies grew." },
    { type: "h2", text: "Why I find it interesting" },
    { type: "p", text: "Climate change is not new, but the speed of it matters. A shift in the Earth's orbit over thousands of years was enough to turn a green landscape into a desert and move whole populations. That puts today's much faster changes into perspective." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[African humid period](https://en.wikipedia.org/wiki/African_humid_period) on Wikipedia",
      ],
    },
  ],
}

export default issue
