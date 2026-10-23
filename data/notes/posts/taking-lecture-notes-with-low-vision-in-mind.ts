import type { NotePost } from "../index"

const post: NotePost = {
  slug: "taking-lecture-notes-with-low-vision-in-mind",
  title: "Taking lecture notes with low vision in mind",
  date: "2026-10-23",
  description:
    "Recording lectures with the slides open in Genio Notes, marking the moments that matter, writing my own notes and lab reports and photographing lab setups. The habits that make lectures and labs workable for me.",
  tags: ["Accessibility", "University", "Note Taking"],
  published: true,
  content: [
    {
      type: "p",
      text: "I see with one eye and that shapes how I take notes more than any productivity advice ever has. Copying a dense slide from across a lecture theatre is slow for anyone. For me it can mean choosing between reading the screen and listening to what is being said about it. Over time I have settled on a setup that removes most of that choice, so I can spend the lecture following the material.",
    },
    {
      type: "p",
      text: "None of it is specialist equipment. Most of it would help anyone, which is a pattern I keep noticing with accessibility in general.",
    },
    { type: "h2", text: "Recording lectures in Genio Notes" },
    {
      type: "p",
      text: "For lectures I use [Genio Notes](https://genio.co/notes), the note taking app from Genio (the company was previously called Glean). I record the lecture in the app and import the lecture slides into the same note, so the audio and the slides sit side by side.",
    },
    {
      type: "p",
      text: "While it records, I add a marker whenever something important comes up: a definition, a worked example, a warning about what usually goes wrong. Genio calls these quick notes and labels and each one is time-stamped to the recording. Afterwards I can jump straight to that moment instead of scrubbing through an hour of audio looking for it.",
    },
    { type: "h2", text: "Why it helps with my vision" },
    {
      type: "p",
      text: "Two things make the biggest difference. The first is that the slides are on my own screen, a comfortable distance from my face and at whatever size I need, rather than on a projector at the far end of the room. The second is that I can listen again. If I missed something because I was reading a slide or a diagram took me longer to take in than the lecturer spent on it, the explanation is still there to replay.",
    },
    {
      type: "p",
      text: "It does not fix everything. A recording is only as good as the room's audio and anything drawn live on a whiteboard still needs its own capture. But it takes away a lot of the pressure to get everything down in the moment.",
    },
    { type: "h2", text: "My own notes do the real work" },
    {
      type: "p",
      text: "The recording is a safety net, not the notes themselves. Mostly I write my own notes from the lecture, in my own words, adding what the slides do not say: the reasoning behind a step, the example the lecturer worked through, the bit they stressed twice. Writing it out is what makes it stick. The markers in Genio tell me exactly where to go back when a section of my notes is thin.",
    },
    {
      type: "p",
      text: "Sometimes I use [Obsidian](https://obsidian.md/) or [Notion](https://www.notion.com/) as well, depending on what the notes are for. Obsidian suits notes I want to link together over a term. Notion suits anything closer to a plan or a list.",
    },
    { type: "h2", text: "Lab reports nobody asked for" },
    {
      type: "p",
      text: "For labs I write my own lab report even when the lab does not require one. It covers what we set out to do, how it was set up, what we measured and what I would check next time. It is extra work in the week, but it means I understand the lab rather than just completing it and it is far easier to revise from than a sheet of numbers.",
    },
    {
      type: "callout",
      tone: "tip",
      text: "Take a photo of the setup before you take it apart. A picture of the wiring, the probe positions or the instrument settings is much quicker to read later than a written description.",
    },
    {
      type: "p",
      text: "That is the other lab habit: I take pictures of how something was set up or working, so I can refer back to it. For me it also means I can zoom in on a breadboard or a scope screen later, at my own pace, instead of trying to take in every detail while leaning over the bench.",
    },
    { type: "h2", text: "What carries over" },
    {
      type: "p",
      text: "The common thread is not having to catch everything in real time. Recording, marking, writing it up myself and keeping photos all give me a second look at the material on my own terms. The same thinking shapes how I build things, which is why accessibility matters on this site and in Vitafolio. If you want the longer version, the [accessibility page](/accessibility) covers what this site does and why.",
    },
  ],
}

export default post
