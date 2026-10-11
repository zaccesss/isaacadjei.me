import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "midweek",
  number: 6,
  slug: "midweek-06-afrobeats-goes-global",
  title: "How Afrobeats went global",
  subtitle: "A sound from Lagos, Accra and London that became one of the fastest growing genres in the world.",
  tags: ["Music", "Africa", "Culture"],
  date: "2026-08-05",
  published: true,
  intro: [
    { type: "p", text: "If you listen to my music on this site's live status, you will see a lot of Afrobeats. It is less one style than a name for a fusion of sounds coming out of Nigeria and Ghana. Hiplife, jùjú, highlife, azonto and Naija beats all sit under the Afrobeats umbrella." },
    { type: "image", src: "/images/newsletter/burna-boy-lagos.jpg", alt: "Burna Boy performing on stage at a concert in Lagos", caption: "Burna Boy at the Nativeland concert in Lagos in 2016. Photo: Catherine Omeresan Sutherland, CC BY-SA 4.0, via Wikimedia Commons" },
    { type: "h2", text: "Afrobeats, not Afrobeat" },
    { type: "p", text: "It is easy to confuse with Afrobeat without the s: the 1960s and 1970s genre made by artists such as Fela Kuti and Tony Allen. Afrobeats is newer and is produced mainly in Lagos, Accra and London. It borrows from the United States, Jamaica and Trinidad and reinvents those influences as something of its own." },
    { type: "p", text: "It broke into the global mainstream in the late 2010s, with artists finding success across Africa, Europe and North America. Between 2017 and 2022 Afrobeats streams on Spotify grew by 550 per cent." },
    { type: "h2", text: "Why I find it interesting" },
    { type: "p", text: "Afrobeats is a rare case of a sound moving from Africa outwards on its own terms, helped by streaming and by diaspora communities in cities like London. It shows how culture can travel when the distribution is open to everyone." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[Afrobeats](https://www.britannica.com/art/Afrobeats) from Encyclopaedia Britannica",
        "[Afrobeats](https://en.wikipedia.org/wiki/Afrobeats) on Wikipedia",
        "[Afrobeat](https://en.wikipedia.org/wiki/Afrobeat) on Wikipedia, for the older genre",
      ],
    },
  ],
}

export default issue
