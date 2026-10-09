import type { NotePost } from "../index"

const post: NotePost = {
  slug: "plans-for-autumn-2026",
  title: "My plans for autumn 2026",
  date: "2026-09-25",
  description:
    "Autumn is about balance: a heavy term of modules, three roles on campus and the projects I care about, while I line up a placement for next year.",
  tags: ["Planning", "University", "Projects"],
  published: true,
  content: [
    { type: "p", text: "Autumn 2026 is about balance. A heavy term of modules, three roles on campus and the projects I care about all share the same weeks, while I line up a placement for next year. The plan:" },
    {
      type: "ul",
      items: [
        "Apply for year-long placements and work experience for 2027, with a weekly routine for finding roles, tailoring each application and preparing for assessment centres.",
        "Keep working towards a First by staying on top of every module from week one rather than catching up before exams.",
        "Keep building: ship the next PHAEMOS and MELOPHOS milestones, grow Vitafolio and fly the LidarSAT drone.",
        "Run PAL sessions every week, keep the society's books in order and turn course feedback into real changes as a rep.",
        "Publish writing three days a week until the end of December: blog posts, TILs and notes.",
        "Start working out life after university: the kind of engineer I want to be, where I want to work and what I want to build.",
      ],
    },
    { type: "p", text: "Writing it down here keeps me honest. I will look back at it at the end of term." },
  ],
}

export default post
