import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  number: 13,
  id: "issue-13-transistors-and-telescopes",
  slug: "transistors-telescopes-gps-and-git-hooks",
  title: "Transistors, telescopes, GPS and git hooks",
  subtitle: "Three stories from engineering history, the Isolation Forest without maths, git hooks, a monorepo for MELOPHOS and two notes from term.",
  tags: ["Engineering", "Hardware", "Learning", "Git", "Open Source", "ML"],
  date: "2026-10-30",
  published: true,
  intro: [
    { type: "p", text: "This fortnight mixed engineering history with the tools I use every day. Three posts look back at how things were built and what went wrong, while the rest come straight out of PHAEMOS, MELOPHOS and LidarSAT." },
    { type: "h2", text: "Stories from engineering history" },
    { type: "p", text: "[How the Transistor Got Small](/blog/how-the-transistor-got-small) runs from valves to the 1947 point-contact transistor, the integrated circuit, the MOSFET, Moore's law and why shrinking stopped being simple. [Hubble's Flawed Mirror](/blog/hubble-mirror-flaw) is about a mirror polished with extraordinary precision to the wrong shape because of one misplaced lens in a test tool everybody trusted. [How GPS Works and Why It Needs Einstein](/blog/how-gps-works-relativity) came from working on LidarSAT, a team project on flying a drone without GPS. It explains distance as time multiplied by the speed of light, why a fix needs four satellites and how both theories of relativity are built into every satellite clock." },
    { type: "h2", text: "From my own projects" },
    { type: "p", text: "[The Isolation Forest, Explained Without Maths](/blog/isolation-forest-without-maths) is the plain-language version of the algorithm behind PHAEMOS. It starts with a guessing game, then builds up random cuts, the forest, the score and the one setting that decides the threshold. [Git Hooks That Have Saved Me](/blog/git-hooks-that-saved-me) walks through the global hooks I run on every machine to catch secrets, big files, force pushes to main and unreadable commit messages before they reach a remote. [Open Source as an Organisation](/blog/monorepo-read-only-split-repos) explains how MELOPHOS keeps eight components in one repository for reviews while publishing each folder as its own read-only repository with real history." },
    { type: "h2", text: "Four new Zacess themes" },
    { type: "p", text: "Zacess Themes 0.2.0 added Zacess High Contrast Dark and Zacess High Contrast Light, on pure black and pure white. Version 0.3.0 adds Zacess Deep Contrast Dark and Zacess Deep Contrast Light, which keep those backgrounds but use deep, fully saturated syntax colours with yellow and red focus outlines, plus a version for Eclipse. In all four the weakest code colour is at least 7.7 to 1 on the background, which is above the high contrast themes built into VS Code and GitHub. That makes eight code themes for nine editors and five terminals, all on the [code themes page](https://zacess.com/themes/). The reader at [app.zacess.com](https://app.zacess.com) has all four as reading themes at 21 to 1: High Contrast Dark and Light, plus the Deep Contrast pair, which went live in the browser version on 21 October." },
    { type: "h2", text: "From the notebook" },
    { type: "p", text: "[Taking lecture notes with low vision in mind](/notes/taking-lecture-notes-with-low-vision-in-mind) describes how I work with one eye: recording lectures in Genio Notes with the slides alongside, marking the moments that matter, writing my own notes and photographing lab setups. Most of it would help anyone." },
    { type: "h2", text: "Small things I learned" },
    {
      type: "ul",
      items: [
        "[A MIDI note-on with velocity 0](/til/midi-note-on-velocity-zero) means note-off.",
        "[Tailwind only generates class names it can find in full](/til/tailwind-full-class-names), so a class built at runtime never reaches the stylesheet.",
        "[git push --force-with-lease](/til/git-force-with-lease) refuses to overwrite work you have not seen.",
        "[A floating digital input reads noise](/til/floating-input-pull-up), so every input needs a pull-up or a pull-down.",
        "[pymavlink's recv_match](/til/pymavlink-recv-match-type) can wait for one message type and give up after a timeout.",
        "[ArduPilot SITL starts near Canberra](/til/ardupilot-sitl-default-cmac) unless you give it a location.",
      ],
    },
  ],
}

export default issue
