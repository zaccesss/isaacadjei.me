import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  number: 9,
  slug: "issue-09-types-in-python",
  title: "Types in Python and six small lessons",
  subtitle: "The Python type annotations I actually use, plus heaps, handshakes, stack overflows, VHDL and two Ghanaian languages.",
  tags: ["Python", "Types", "FastAPI", "Backend"],
  date: "2026-09-04",
  published: true,
  intro: [
    { type: "p", text: "A quieter fortnight for long posts but a busy one for small lessons. The one long post came straight out of the PHAEMOS backend. The TILs range from microcontroller memory to two Ghanaian languages." },
    { type: "h2", text: "What I wrote" },
    { type: "p", text: "[Python Type Annotations: What I Actually Use and Why](/blog/python-type-annotations) is a practical guide rather than a tour of every feature. It starts with function signatures, then covers Optional and Union, TypedDict for structured data, Pydantic in FastAPI and Protocol for duck typing. Just as important is the section on what not to over-annotate. These are the patterns I use every day in the PHAEMOS backend." },
    { type: "h2", text: "Small things I learned" },
    {
      type: "ul",
      items: [
        "[Encapsulation versus abstraction](/til/oop-encapsulation-vs-abstraction): one hides data, the other hides complexity.",
        "[The HTTPS handshake](/til/how-https-handshake-works) agrees on keys without the private key ever crossing the wire.",
        "[FreeRTOS stack overflow detection](/til/freertos-stack-overflow-detection) has two methods that catch different failures.",
        "[Ga and Twi are different languages](/til/ga-twi-language-difference): being Ga does not mean knowing Twi.",
        "[A missing signal in a VHDL sensitivity list](/til/vhdl-process-sensitivity-list) makes simulation and real hardware disagree.",
        "[Heap fragmentation on a microcontroller](/til/heap-fragmentation-mcu) is why static allocation is the safer default.",
      ],
    },
    { type: "p", text: "Two of these, on FreeRTOS stacks and heap fragmentation, are the same lesson from different sides. On a small chip, memory you cannot see running out is the kind that hurts most." },
  ],
}

export default issue
