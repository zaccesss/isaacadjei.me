import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  number: 7,
  slug: "issue-07-decisions-behind-phaemos",
  title: "The decisions behind PHAEMOS and writing clearly",
  subtitle: "Why each part of PHAEMOS is the way it is, how to write clearly as an engineer and six lessons from CPUs, ADCs, algorithms, faith and GPS.",
  tags: ["PHAEMOS", "IoT", "Embedded", "Writing", "Documentation", "Career"],
  date: "2026-08-07",
  published: true,
  intro: [
    { type: "p", text: "This fortnight I finally wrote the PHAEMOS post I had been circling all summer: not what it does but why it is built the way it is. Writing that one made me think hard about how I write in general, so the second post is about exactly that." },
    { type: "h2", text: "What I wrote" },
    { type: "p", text: "[PHAEMOS: Engineering Decisions from Breadboard to Distributed IoT System](/blog/phaemos-engineering-decisions) traces the project from a single ESP32 and a DHT22 on a breadboard to a multi-node system. It explains why there are four different microcontrollers, each with its own job, why FastAPI won as the backend and how Isolation Forest handles anomaly detection. The most useful sections are the honest ones: what I got wrong and what I would do differently now." },
    { type: "p", text: "[Writing Clearly as an Engineer](/blog/writing-for-engineers) collects the habits that make technical writing easier to read. Lead with the conclusion, keep one idea per paragraph, use the active voice and avoid nominalisations. It also covers when a diagram earns its place, why code comments are documentation and how to write for a reader you do not know. Most of it comes from mistakes I made in reports, documentation and blog posts." },
    { type: "h2", text: "Small things I learned" },
    {
      type: "ul",
      items: [
        "[Sorting before processing](/til/branch-prediction-sorted-arrays) can double the speed of a loop because the branch predictor finally sees a pattern.",
        "[An ADC is only as accurate as its reference voltage](/til/adc-reference-voltage-quality), so a drifting reference quietly shifts every reading.",
        "[Lazy propagation](/til/segment-tree-lazy-propagation) keeps range updates on a segment tree at O(log n).",
        "[Tabulation versus memoisation](/til/dp-tabulation-vs-memoisation): both solve dynamic programming problems but only one risks overflowing the call stack.",
        "[Prayer reorients attention](/til/faith-prayer-shapes-focus): starting a work session that way makes me say what actually matters.",
        "[How GPS works](/til/how-gps-works): three satellites fix a position and a fourth corrects the receiver's clock.",
      ],
    },
  ],
}

export default issue
