import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "outside",
  number: 2,
  slug: "outside-02-nasa-moon-base-missions",
  title: "NASA names its first three Moon Base missions",
  subtitle: "Commercial landers, a rover and a set of hopping drones make up the first steps towards a lunar base.",
  tags: ["Space", "Robotics", "Engineering"],
  date: "2026-06-05",
  published: true,
  intro: [
    { type: "p", text: "On 26 May NASA set out the first three missions of its Moon Base programme, all built around commercial landers. Moon Base I is targeted for no earlier than autumn 2026 on Blue Origin's Blue Moon Mark 1 Endurance lander, heading for the Shackleton Connecting Ridge near the lunar south pole. Moon Base II will carry Astrolab's FLIP rover on Astrobotic's Griffin lander. Moon Base III will fly the Lunar Vertex investigation on Intuitive Machines' Nova-C lander, named Trinity, to study the bright patterns known as lunar swirls. Moon Base III also carries payloads from ESA plus the Korea Astronomy and Space Science Institute." },
    { type: "image", src: "/images/newsletter/moon-shackleton-crater.jpg", alt: "A view of Shackleton crater near the Moon's south pole, with its deep floor shaded", caption: "Shackleton crater near the Moon's south pole, mapped by the Lunar Reconnaissance Orbiter. Image: NASA Goddard Space Flight Center, public domain, via Wikimedia Commons" },
    { type: "p", text: "NASA also shared an update on MoonFall, a mission led by its Jet Propulsion Laboratory with a spacecraft built by Firefly Aerospace. It will land drones on the surface that hop across the terrain and photograph hard-to-reach areas over a single lunar day. That launch is targeted for 2028." },
    { type: "h2", text: "Why it matters to engineers" },
    { type: "p", text: "The payloads are a good reminder that most of the work is in the unglamorous parts. Moon Base I carries stereo cameras to study how lander thrusters disturb the surface plus a laser retroreflector array that helps orbiting spacecraft pin down a precise location. Those are measurement and navigation problems first, the kind that decide whether a later crewed landing in 2028 goes to plan." },
    { type: "p", text: "As someone who builds sensor nodes, the MoonFall drones are the part I would most like to read the design documents for. Every one of them has to sense, decide and land on its own, far from any operator, on a power budget that ends when the lunar day does." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[NASA Provides Update on Moon Base Rovers, Landers, Missions](https://www.nasa.gov/news-release/nasa-provides-update-on-moon-base-rovers-landers-missions/)",
        "[Moon Base announcement speech by Administrator Isaacman](https://www.nasa.gov/blogs/workforce-updates/2026/05/27/moon-base-announcement-speech-may-26-2026-administrator-isaacman-remarks/)",
      ],
    },
  ],
}

export default issue
