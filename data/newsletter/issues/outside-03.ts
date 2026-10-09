import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "outside",
  number: 3,
  slug: "outside-03-linux-7-1",
  title: "Linux 7.1 arrives with a rewritten NTFS driver",
  subtitle: "The first major release of the 7.x series landed on 14 June after a busy cycle.",
  tags: ["Linux", "Open Source", "Operating Systems"],
  date: "2026-06-19",
  published: true,
  intro: [
    { type: "p", text: "Linus Torvalds announced Linux 7.1 on 14 June 2026, half a day early because of his travel plans. It is the first major update in the 7.x series. The headline change is a completely rewritten in-kernel NTFS driver with better write performance plus better handling of large files. Intel's FRED (Flexible Return and Event Delivery) is now enabled by default on supported hardware, alongside graphics improvements for Intel Arc and AMD Radeon cards and wider Landlock sandboxing support." },
    { type: "p", text: "The numbers behind it are worth a look. The cycle brought in nearly 13,000 changes from more than 2,000 developers, hundreds of them contributing for the first time. More than 140,000 lines of old code were also removed, including networking drivers and protocols that almost nobody still uses." },
    { type: "h2", text: "Why it matters to engineers" },
    { type: "p", text: "Deleting code is part of maintenance, not a side effect of it. Every old driver that stays in the tree is something that has to keep compiling, keep being reviewed and keep being trusted. Seeing a project of this size remove 140,000 lines in one release is a useful counterweight to the instinct that more code means more progress." },
    { type: "p", text: "Most of my boards run Linux somewhere in the stack, whether it is a Raspberry Pi gateway or the server that collects sensor data, so kernel releases reach my projects sooner or later. This is not a long-term support release, so for embedded work the practical move is to note the changes and wait for them to reach an LTS kernel or a distribution." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[Linux Kernel 7.1 Officially Released with New NTFS Driver, Intel FRED and Major Code Cleanup](https://www.linuxjournal.com/content/linux-kernel-71-officially-released-new-ntfs-driver-intel-fred-and-major-code-cleanup)",
        "[Linux 7.1 on Kernel Newbies](https://kernelnewbies.org/Linux_7.1)",
      ],
    },
  ],
}

export default issue
