import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "outside",
  number: 12,
  slug: "outside-12-bell-x-1-sound-barrier",
  title: "The day the Bell X-1 broke the sound barrier",
  subtitle: "This week marks the anniversary of the first flight faster than sound, on 14 October 1947.",
  tags: ["Aviation", "History", "Engineering"],
  date: "2026-10-23",
  published: true,
  intro: [
    { type: "p", text: "This week marks the anniversary of one of the best-known flights in aviation. On 14 October 1947 Captain Charles E. \"Chuck\" Yeager of the U.S. Air Force flew the Bell X-1 faster than the speed of sound, reaching Mach 1.06, about 700 mph, at 43,000 feet. He named the aircraft Glamorous Glennis after his wife. It is now part of the collection of the Smithsonian's National Air and Space Museum." },
    { type: "p", text: "The X-1 did not take off on its own. It was carried up under a Boeing B-29 Superfortress and dropped at around 23,000 feet, then climbed on a Reaction Motors rocket engine producing 6,000 pounds of thrust. NASA's own history describes the orange aircraft as resembling a 50-calibre machine gun bullet mated to a pair of straight, stubby wings. A few months later, on 26 March 1948, the X-1 went on to reach Mach 1.45." },
    { type: "image", src: "/images/newsletter/bell-x1-in-flight.jpg", alt: "The Bell X-1, a bullet-shaped rocket plane with straight wings and the tail number 6062, in flight above desert mountains with a short exhaust trail behind it", caption: "The Bell X-1 in flight. Photo: NASA, public domain, via Wikimedia Commons" },
    { type: "h2", text: "Why it matters to engineers" },
    { type: "p", text: "Before the flight, some engineers feared that an aircraft would lose control as it approached Mach 1. In the event the flight was smooth, with no violent buffeting. The X-1 programme answered that question by building a research aircraft whose whole purpose was to collect data at the edge of what was understood. It is a clear early example of a test vehicle designed around measurement rather than service." },
    { type: "p", text: "This issue looks back rather than at the news. The X-1 is a reminder that much of engineering progress comes from instrumented experiments that are built to find out, which is how I try to approach every prototype: decide what it needs to measure before deciding what it needs to do." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[Bell X-1 Glamorous Glennis (Smithsonian National Air and Space Museum)](https://airandspace.si.edu/collection-objects/bell-x-1-glamorous-glennis/nasm_A19510007000)",
        "[Research in Supersonic Flight and the Breaking of the Sound Barrier (NASA History)](https://www.nasa.gov/history/SP-4219/Chapter3.html)",
      ],
    },
  ],
}

export default issue
