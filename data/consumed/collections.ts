export type ConsumedCollection = {
  slug: string
  title: string
  description: string
  tags: string[]
  titles?: string[]
}

export const CONSUMED_COLLECTIONS: ConsumedCollection[] = [
  {
    slug: "embedded-systems-from-zero",
    title: "Embedded systems from zero",
    description: "From logic gates and a breadboard CPU to C on a microcontroller, FPGAs and real-time firmware.",
    tags: ["embedded", "embedded systems", "electronics", "fpga", "verilog", "arduino", "microcontrollers", "rtos", "pcb", "digital", "computers", "protocols"],
    titles: [
      "Nand to Tetris", "Nandland", "FPGA4Fun", "SparkFun Learn", "Electronics Tutorials", "Ben Eater's Website",
      "UT Austin: Embedded Systems", "Embedded Artistry", "Learn-C.org", "HDLBits", "EDA Playground",
      "Interrupt by Memfault", "Falstad Circuit Simulator", "Basic Electrical and Electronics Engineering", "Embedded",
      "The world of embedded systems (Interview)", "The Amp Hour #721. Chip Design for Fun (and Waffles) with Julia Desmazes",
    ],
  },
  {
    slug: "careers-and-placements",
    title: "Careers and placements",
    description: "Interviews, CVs, negotiation and how the industry actually hires, gathered while looking for a placement.",
    tags: ["career", "careers", "interview", "interviews", "placements", "industry"],
    titles: ["Tech Interview Handbook", "Developer Roadmaps", "GitHub Student Developer Pack"],
  },
  {
    slug: "faith-and-life",
    title: "Faith and life",
    description: "Scripture, character and perspective: the things that keep the rest of the list in proportion.",
    tags: ["faith", "bible", "life", "perspective", "inspiration", "self-improvement"],
    titles: ["Message of The Day (MoTD)", "Habits and Routines"],
  },
  {
    slug: "computer-science-foundations",
    title: "Computer science foundations",
    description: "Algorithms, data structures, maths and how computers work underneath the languages.",
    tags: ["cs", "algorithms", "data-structures", "maths", "linear-algebra", "numerics", "computer science"],
    titles: ["CS50x 2026", "MIT OpenCourseWare", "Nand to Tetris", "The Missing Semester", "OSDev Wiki", "Khan Academy"],
  },
]

export function findCollection(slug: string): ConsumedCollection | undefined {
  return CONSUMED_COLLECTIONS.find((c) => c.slug === slug)
}
