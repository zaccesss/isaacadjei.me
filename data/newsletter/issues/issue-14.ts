import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  number: 14,
  id: "issue-14-safety-and-seven-languages",
  slug: "software-safety-seven-languages-and-placement-season",
  title: "Software safety, seven languages and placement season",
  subtitle: "The Therac-25, how TeX was born, a site in seven languages, Web MIDI for MELOPHOS and how I approach placement applications.",
  tags: ["Software Engineering", "Accessibility", "Open Source", "Career", "Hardware"],
  date: "2026-11-13",
  published: true,
  intro: [
    { type: "p", text: "Placement season is in full swing, so a good part of this fortnight was about applications. The rest was split between two stories from computing history and two posts from things I build." },
    { type: "h2", text: "Two stories from computing history" },
    { type: "p", text: "[The Therac-25](/blog/therac-25-software-safety) is the radiation therapy machine that massively overdosed six patients between 1985 and 1987. The more closely I read it, the less it looks like one bug. A race condition, a counter that rolled over and too much trust in software together removed every safety net. [How Donald Knuth Built TeX](/blog/how-knuth-built-tex) is a far happier story: a computer scientist unhappy with the proofs of his own book, a sabbatical that became a decade, a line-breaking algorithm still admired today and a program meant to stop changing. I came to it after adding a LaTeX editor to Vitafolio." },
    { type: "h2", text: "From my own projects" },
    { type: "p", text: "[Shipping a Website in Seven Languages](/blog/website-in-seven-languages) is how Vitafolio went from English only to English, Spanish, French, Brazilian Portuguese, Simplified Chinese, Arabic and Urdu. It covers choosing the language without changing the address, keying strings by their English text, mirroring layouts with logical CSS and the one-byte bug that broke Arabic PDFs. [Building Light-Guided Practice in the Browser with Web MIDI](/blog/web-midi-light-guided-practice) shows how the MELOPHOS Studio reads a real keyboard, lights the next note in amber and scores every note for pitch and timing, all before ordering a single PCB." },
    { type: "h2", text: "Placements" },
    { type: "p", text: "Two notes this fortnight are about the season itself. [What I look for in a placement](/notes/what-i-look-for-in-a-placement) ranks what matters to me as I apply for a year-long placement starting in 2027, starting with real work on a real product. [How I track placement applications](/notes/how-i-track-placement-applications) treats the season as a pipeline, with clear stages, deadlines and next steps for every application." },
    { type: "h2", text: "Small things I learned" },
    {
      type: "ul",
      items: [
        "[Playwright's networkidle](/til/playwright-networkidle-polling) waits for 500 ms of silence, which a polling page never gives.",
        "[league/commonmark's heading permalinks](/til/commonmark-heading-permalinks) give every heading a linkable id.",
        "[Set dir=\"rtl\" on the html element](/til/html-dir-attribute-rtl) rather than setting direction in CSS.",
        "[PDF/UA is ISO 14289](/til/pdf-ua-iso-14289) and it is about tags, not looks.",
        "[An op-amp's slew rate](/til/op-amp-slew-rate) caps how big a signal it can pass at high frequency.",
        "[MIDI note 60 is middle C](/til/midi-note-number-frequency) and each semitone multiplies the frequency by the twelfth root of two.",
      ],
    },
  ],
}

export default issue
