import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  number: 2,
  slug: "issue-02-fpgas-and-bionic-eyes",
  title: "FPGAs, bionic eyes and a new TIL habit",
  subtitle: "A beginner's way into FPGAs, where bionic vision really stands, why I keep a TIL log and six small things I learned.",
  tags: ["FPGA", "VHDL", "Hardware", "Vision", "Research", "Health Tech"],
  date: "2026-05-29",
  published: true,
  intro: [
    { type: "p", text: "This fortnight had two long posts that could not be further apart: one on configuring hardware itself and one on a subject that is personal to me. Around them sits a new habit that produced most of what follows." },
    { type: "h2", text: "What I wrote" },
    { type: "p", text: "[Getting Started with FPGAs](/blog/fpga-vhdl-introduction) is the introduction I wish I had read first. An FPGA is not a microcontroller and does not run instructions. You describe hardware and the chip becomes that circuit. The post covers what is inside an FPGA, why VHDL feels so unlike programming, timing constraints and the critical path, a blinking LED example and when an FPGA beats a microcontroller." },
    { type: "p", text: "[Bionic Vision and Ocular Prosthetics](/blog/ocular-prosthetics-bionic-vision) matters to me because I lost the sight in my right eye to retinoblastoma at two and have worn a prosthesis ever since. It is a research survey rather than medical advice. It covers what prosthetic eyes can and cannot do, epiretinal and subretinal implants, cortical prosthetics, optogenetics and the engineering problems that still stand between today and functional restored vision." },
    { type: "h2", text: "From the notebook" },
    { type: "p", text: "[Why I keep a TIL log](/notes/why-i-keep-a-til-log) explains the habit I started this month: one thing learned, written down the day I learn it. It is small enough to do straight away. Writing it in my own words is the moment I find out whether I really understood it." },
    { type: "h2", text: "Small things I learned" },
    {
      type: "ul",
      items: [
        "[AES-GCM versus AES-CBC](/til/aes-gcm-vs-cbc): GCM authenticates as well as encrypts, while CBC without a MAC is dangerous.",
        "[An LRU cache](/til/lru-cache-implementation) needs a hashmap and a doubly linked list together to get constant-time get and put.",
        "[TypeScript template literal types](/til/typescript-template-literal-types) build string unions from other unions.",
        "[SPI CPOL and CPHA](/til/spi-cpol-cpha) decide which clock edge samples the data. A mismatch means garbage.",
        "[Why cd is a shell builtin](/til/how-cd-works): a separate program could only change its own working directory.",
        "[The volatile keyword in C](/til/volatile-in-c) stops the compiler caching a value that hardware or an interrupt can change.",
      ],
    },
  ],
}

export default issue
