import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "midweek",
  number: 7,
  slug: "midweek-07-two-hour-marathon",
  title: "How close is the two-hour marathon?",
  subtitle: "Kelvin Kiptum ran 2:00:35 in Chicago in 2023. The story of that record and the barrier beyond it.",
  tags: ["Running", "Sport", "Records"],
  date: "2026-08-19",
  published: true,
  intro: [
    { type: "p", text: "For years the two-hour marathon has been distance running's great barrier. At the 2023 Chicago Marathon the Kenyan runner Kelvin Kiptum came closer than anyone in a record-eligible race, finishing in 2:00:35 and breaking the world record by 34 seconds." },
    { type: "image", src: "/images/newsletter/kelvin-kiptum-chicago.jpg", alt: "Kelvin Kiptum running at the 2023 Chicago Marathon", caption: "Kelvin Kiptum at the 2023 Chicago Marathon, on the way to his world record. Photo: Chad Veal, CC BY-SA 4.0, via Wikimedia Commons" },
    { type: "h2", text: "A record and a loss" },
    { type: "p", text: "Kiptum had already run 2:01:25 at the London Marathon earlier in 2023, the second fastest time in history at that point. His Chicago record was ratified by World Athletics on 6 February 2024. Five days later he and his coach died in a car crash in Kaptagat, a training base for distance runners in rural Kenya. He was 24." },
    { type: "p", text: "Eliud Kipchoge has gone under two hours, but not in a race that counts for records. He ran 2:00:25 in the Breaking2 project in 2017 and broke two hours in Vienna in 2019 with rotating pacemakers and other help that the rules do not allow. In 2024 Ruth Chepng'etich set the women's world record of 2:09:56, also in Chicago." },
    { type: "h2", text: "Why I find it interesting" },
    { type: "p", text: "Records like these are a mix of human talent and careful engineering of the conditions: pacing, course choice and equipment. Kiptum's run showed that a sub-two-hour marathon in an open race may now be a matter of when rather than if." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[Men's marathon records](https://worldathletics.org/records/by-discipline/road-running/marathon/outdoor/men) from World Athletics",
        "[Kelvin Kiptum](https://en.wikipedia.org/wiki/Kelvin_Kiptum) on Wikipedia",
        "[Marathon world record progression](https://en.wikipedia.org/wiki/Marathon_world_record_progression) on Wikipedia",
      ],
    },
  ],
}

export default issue
