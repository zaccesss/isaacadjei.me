import type { NotePost } from "../index"

const post: NotePost = {
  slug: "what-i-want-from-this-summer",
  title: "What I want from this summer",
  date: "2026-06-19",
  description:
    "Summer is the longest stretch of time I get all year. My plan for it: building things that matter and documenting them properly.",
  tags: ["Planning", "Projects", "Reflection"],
  published: true,
  content: [
    { type: "p", text: "Summer is the only time of year when I have long, unbroken weeks. That is easy to waste, so before it starts properly I want to write down what it is for." },
    { type: "p", text: "This summer is about building things that matter and documenting them properly. The plan:" },
    {
      type: "ul",
      items: [
        "Prepare for the next academic year: review the modules, get ahead on coursework and sharpen the fundamentals.",
        "Learn FPGA development and VHDL from scratch, working up to real hardware designs.",
        "Get serious about competitive programming with consistent Codeforces practice.",
        "Publish the remaining blog posts and keep the newsletter going with regular issues.",
        "Complete the avr-zac state machine project and document it fully.",
        "Get the multi-sport AI predictor properly shipped, starting with football.",
        "Begin deep research into retinoblastoma, ocular prosthetics and bio-integrated health technology.",
        "Study fields outside engineering: business, psychology, economics and anything else worth understanding.",
      ],
    },
    { type: "h2", text: "Finish, then share" },
    { type: "p", text: "Several of my projects work but are not finished in the sense that matters. They have no proper write-up and no record of why they are built the way they are. Closing that gap matters more to me than starting something new." },
    { type: "p", text: "I will look back at this list in September and be honest about how it went." },
  ],
}

export default post
