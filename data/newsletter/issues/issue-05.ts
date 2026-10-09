import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  number: 5,
  slug: "issue-05-my-setup-and-dma",
  title: "My setup and moving data without the CPU",
  subtitle: "A full tour of the tools I use every day, DMA explained from the registers up and three lessons on I2C, pipelines and git worktrees.",
  tags: ["DMA", "STM32", "Embedded", "Tools", "Setup", "Dotfiles"],
  date: "2026-07-10",
  published: true,
  intro: [
    { type: "p", text: "The summer plan is working. This fortnight produced the first of the deeper fundamentals posts I promised myself, along with a long look at the tools I build everything with." },
    { type: "h2", text: "What I wrote" },
    { type: "p", text: "[DMA Explained](/blog/dma-bare-metal) is about letting dedicated hardware move data so the CPU does not have to. It covers how a DMA controller works, channels and requests on an STM32, circular mode for continuous sampling, cache coherency on the Cortex-M7, half-transfer interrupts for double buffering and the pitfalls that catch people out, all configured without leaning on HAL." },
    { type: "p", text: "[My Development Setup in 2026](/blog/my-development-setup-2026) is a full tour of what I actually use: three machines with distinct jobs, the terminal and shell, editors, the hardware lab, note-taking, version control and my dotfiles. It also covers what I changed my mind about, which is often the most useful part of any setup post." },
    { type: "h2", text: "Small things I learned" },
    {
      type: "ul",
      items: [
        "[I2C clock stretching](/til/i2c-clock-stretching) lets a slow peripheral pause the bus by holding the clock line low.",
        "[A read-after-write hazard](/til/cpu-pipeline-raw-hazard) stalls a CPU pipeline unless the hardware forwards the result.",
        "[git worktree](/til/git-worktree) checks out several branches at once in separate folders, so there is no need to stash.",
      ],
    },
    { type: "p", text: "The I2C and pipeline TILs share an idea with the DMA post. Hardware is constantly waiting on other hardware. Good design is mostly about deciding who waits and for how long." },
  ],
}

export default issue
