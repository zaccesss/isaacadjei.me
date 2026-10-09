import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "outside",
  number: 8,
  slug: "outside-08-hot-chips-risc-v",
  title: "RISC-V takes a full tutorial day at Hot Chips",
  subtitle: "The chip design symposium opened with a day on RISC-V profiles, platforms and cars.",
  tags: ["RISC-V", "Semiconductors", "Hardware", "Open Source"],
  date: "2026-08-28",
  published: true,
  intro: [
    { type: "p", text: "Hot Chips, the yearly symposium where chip designers present the architecture of real processors, ran from 23 to 25 August 2026. It opened on the Sunday with two tutorial tracks. One covered memory technology. The other was given over entirely to RISC-V, the open instruction set architecture that anyone can implement without paying a licence fee." },
    { type: "p", text: "The RISC-V track gave an update on standards and adoption, with a focus on profiles and platforms. It also covered how enterprise open source is developing around the architecture, a profile for interoperability with NVIDIA GPUs and the opportunities and challenges of using RISC-V in cars. The main conference days that followed covered CPUs, GPUs, automotive chips built from chiplets, FPGA systems and memory." },
    { type: "h2", text: "Why it matters to engineers" },
    { type: "p", text: "Profiles are the unglamorous part that makes an open architecture usable. The base RISC-V instruction set is small and many extensions are optional, so software cannot simply assume a feature is present. A profile names a fixed set of extensions that a chip must support, which lets an operating system or a compiler target a whole class of chips at once. Seeing that work presented next to automotive use shows how far RISC-V has moved from research boards towards safety-critical products." },
    { type: "p", text: "As someone who builds on microcontrollers, I already have a RISC-V core within reach: the RP2350 on the Raspberry Pi Pico 2 family can run on either Arm or RISC-V cores. Talks like these are a good prompt to try the RISC-V side for a project rather than leaving it as a curiosity." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[Hot Chips: A Symposium on High Performance Chips](https://hotchips.org/)",
        "[Hot Chips 2026 programme](https://hc2026.hotchips.org/)",
      ],
    },
  ],
}

export default issue
