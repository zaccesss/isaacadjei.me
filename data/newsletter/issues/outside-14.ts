import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "outside",
  number: 14,
  id: "outside-14-intel-4004-first-microprocessor",
  slug: "the-intel-4004-and-the-first-microprocessor",
  title: "The Intel 4004 and the first microprocessor",
  subtitle: "This week marks 55 years since Intel announced the 4004 on 15 November 1971.",
  tags: ["Computing", "History", "Electronics"],
  date: "2026-11-18",
  published: true,
  intro: [
    { type: "p", text: "On 15 November 1971 Intel announced the 4004 in the trade paper Electronic News. It was the first microprocessor sold commercially: a complete central processing unit on one chip of silicon." },
    { type: "image", src: "/images/newsletter/intel-4004.jpg", alt: "Two Intel C4004 chips in white ceramic packages with gold pins, one with its lid removed to show the silicon die", caption: "The Intel C4004. Photo: John Pilge, public domain, via Wikimedia Commons" },
    { type: "h2", text: "A calculator that became a computer" },
    { type: "p", text: "The chip began as a custom job. In 1969 Busicom, a Japanese calculator maker, asked Intel to design a set of chips for a new line of programmable calculators. Ted Hoff and Stanley Mazor proposed something more general: a 4-bit processor that could be programmed to do the calculator's work, as part of a family of chips called the MCS-4." },
    { type: "p", text: "Federico Faggin, assisted by Masatoshi Shima, turned the idea into silicon. Using silicon-gate MOS technology he squeezed the 2,300 transistors of the 4004 into a low-cost 16-pin package. Busicom first held the rights to the design but shared them with Intel in 1971, which let Intel sell the chip to anyone." },
    { type: "h2", text: "Why I find it interesting" },
    { type: "p", text: "The big idea was not the transistor count but programmability. One general-purpose chip could do many different jobs depending on its software, instead of a new custom chip for every product. Every microcontroller I program on my embedded systems module is a descendant of that decision." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[Microprocessor integrates CPU function onto a single chip](https://www.computerhistory.org/siliconengine/microprocessor-integrates-cpu-function-onto-a-single-chip/) from the Computer History Museum",
        "[This day in history: 15 November](https://www.computerhistory.org/tdih/November/15/) from the Computer History Museum",
        "[Busicom](https://en.wikipedia.org/wiki/Busicom) on Wikipedia",
      ],
    },
  ],
}

export default issue
