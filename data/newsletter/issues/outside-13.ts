import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "outside",
  number: 13,
  id: "outside-13-silicon-photonics-reliability-standard",
  slug: "silicon-photonics-gets-its-first-reliability-standard",
  title: "Silicon photonics gets its first reliability standard",
  subtitle: "JEDEC published JESD264, a shared rulebook for qualifying chips that move data with light.",
  tags: ["Electronics", "Semiconductors", "Data centres"],
  date: "2026-11-06",
  published: true,
  intro: [
    { type: "p", text: "On 1 October JEDEC, the body behind the memory standards in almost every computer, published JESD264: Silicon Photonics Qualification and Reliability Requirements. It is the first industry-wide standard for deciding whether a silicon photonics chip is reliable enough to ship." },
    { type: "p", text: "Silicon photonics builds optical parts on a silicon chip with much the same processes as ordinary electronics: waveguides that steer light, modulators that turn electrical signals into pulses of light and photodiodes that turn them back. These chips already sit inside the optical links between servers. They matter more each year as AI clusters need more bandwidth than copper can carry over any distance." },
    {
      type: "diagram",
      code: "flowchart TD\n  A[Electrical signal] --> B[Modulator]\n  B -->|pulses of light| C[Waveguide]\n  C --> D[Photodiode]\n  D --> E[Electrical signal]",
      caption: "A simplified optical link on a chip: the modulator turns the signal into light, the waveguide carries it and the photodiode turns it back.",
    },
    { type: "h2", text: "What the standard covers" },
    { type: "p", text: "JEDEC describes four areas. The first is reliability protocols for silicon photonics dies and integrated chipsets. The second is guidelines for qualifying individual components such as modulators, photodiodes and waveguides. The third covers assembly and laser integration. The fourth sets expectations for manufacturing process control and traceability." },
    { type: "h2", text: "Why light needs its own rules" },
    { type: "p", text: "Ordinary chip qualification grew up around electrical performance, materials and package durability. An optical chip can pass every electrical test and still fail in ways those tests never look for: optical power that fades, insertion loss that creeps up, a wavelength that drifts or a fibre that slowly loses its alignment. Until now each company judged those risks its own way, so a chip designer, a foundry, a packaging house and a module maker could all mean something different by reliable." },
    { type: "p", text: "The problem grows as optics move closer to the processor. In co-packaged optics the optical engine shares a package with the chip it serves, so lasers, fibres, substrates and silicon dies sit millimetres apart. Heat, warping and moisture then become questions for the whole system rather than for one part, which is where a common test baseline helps most." },
    { type: "h2", text: "Why I find it interesting" },
    { type: "p", text: "Standards rarely make headlines, but they decide when a technology stops being an experiment and becomes something anyone can buy with confidence. It is the same lesson as every prototype I build: a design is only as good as the tests that prove it keeps working. Those tests are worth agreeing on before anything ships." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[JEDEC publishes first industry-wide silicon photonics reliability standard (JEDEC)](https://www.jedec.org/news/pressreleases/jedec%C2%AE-publishes-first-industry-wide-silicon-photonics-reliability-standard-ai)",
        "[JEDEC unveils first industry-wide silicon photonics reliability standard (TrendForce)](https://www.trendforce.com/news/2026/10/06/news-jedec-unveils-first-industry-wide-silicon-photonics-reliability-standard-setting-rules-across-four-key-areas/)",
      ],
    },
  ],
}

export default issue
