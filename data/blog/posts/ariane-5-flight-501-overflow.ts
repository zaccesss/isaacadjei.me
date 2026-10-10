import type { BlogPost } from "../index"

const _ariane_5_flight_501_overflow: BlogPost = {
  slug: "ariane-5-flight-501-overflow",
  title: "Ariane 5 Flight 501: How a Number Too Big for 16 Bits Destroyed a Rocket",
  date: "2026-10-11",
  type: "article",
  cover_image: "/images/blog/covers/ariane-5-flight-501-overflow.webp",
  description:
    "In 1996 the first Ariane 5 broke up about 40 seconds after launch because reused software converted a 64-bit value into a 16-bit integer. A walk through the inquiry report and the lessons I take from it as a student who writes embedded code.",
  tags: ["SoftwareEngineering", "Engineering", "Embedded", "Learning"],
  published: true,
  content: [
    {
      type: "p",
      text: "On 4 June 1996 the first Ariane 5 rocket lifted off from [Kourou in French Guiana](https://www.esa.int/Enabling_Support/Space_Transportation/Europe_s_Spaceport) carrying four [Cluster](https://www.esa.int/Science_Exploration/Space_Science/Cluster) science satellites. Around 40 seconds later it veered off course, broke up under aerodynamic load and was destroyed by its self-destruct system. Nobody was hurt, but years of work and a payload worth hundreds of millions of dollars were lost in front of the cameras. The cause was not an engine, a weld or a fuel leak. It was one line of arithmetic in software that had worked perfectly on the previous rocket. I come back to this story whenever I write code that will run on hardware, because almost every lesson in it applies to student projects too.",
    },
    {
      type: "h2",
      text: "What the inertial reference system does",
    },
    {
      type: "p",
      text: "A launcher needs to know its attitude and motion at every instant. Ariane 5 had two inertial reference systems, known by their French initials as SRI. Each contains gyroscopes and accelerometers plus a computer that turns their readings into attitude and velocity data for the main on-board computer. The two units ran the same software, one active and one in hot standby, so that a hardware failure in one would not end the flight.",
    },
    {
      type: "p",
      text: "Much of that software came from Ariane 4, where it had a long and successful record. Reusing proven flight software sounds like the safe choice. That assumption is the heart of the story.",
    },
    {
      type: "h2",
      text: "The failure, step by step",
    },
    {
      type: "ol",
      items: [
        "Part of the SRI software, an alignment function, calculated a value called the horizontal bias (BH). This function only has a purpose before lift-off.",
        "On Ariane 4 the alignment function kept running for about 40 seconds into flight. That allowed a quick restart if a countdown was held at the last moment. The requirement was carried over to Ariane 5 even though it served no purpose there.",
        "Ariane 5 flies a different early trajectory with much higher horizontal velocity than Ariane 4. BH grew far larger than anything Ariane 4 had produced.",
        "The code converted BH from a 64-bit floating point number to a 16-bit signed integer. A 16-bit signed integer can only hold values from -32,768 to 32,767. The value did not fit and the processor raised an Operand Error.",
        "That conversion was not protected by an exception handler. The SRI software was designed to treat any unhandled exception as a hardware fault, so the unit reported a failure and shut down.",
        "The standby SRI had failed in exactly the same way 72 milliseconds earlier, because it ran the same code on the same data. Redundancy offered no protection at all.",
        "The active SRI sent a diagnostic bit pattern to the on-board computer. The on-board computer read that pattern as genuine flight data and commanded full deflection of the nozzles to correct an attitude error that did not exist.",
        "The rocket swung to a high angle of attack, the aerodynamic forces tore it apart and the self-destruct system triggered.",
      ],
    },
    {
      type: "diagram",
      code: "flowchart TD\n  A[Ariane 4 software reused] --> B[Alignment still running after lift-off]\n  C[Ariane 5 higher horizontal velocity] --> D[BH value too large]\n  B --> D\n  D --> E[64-bit float to 16-bit int overflow]\n  E --> F[Unhandled exception shuts down both SRIs]\n  F --> G[Diagnostic data read as flight data]\n  G --> H[Full nozzle deflection and breakup]",
      caption: "No single cause: a chain of reasonable decisions that only failed together.",
    },
    {
      type: "h2",
      text: "Why the conversion was unprotected",
    },
    {
      type: "p",
      text: "The software was written in [Ada](https://www.adaic.org), a language designed for safety-critical systems that checks for exactly this kind of overflow. The developers had analysed seven variables at risk of overflow. Four were protected. Three were left unprotected, partly to keep the SRI computer below a target workload of 80%. The decision was justified by arguing that those values were physically limited by the trajectory. On Ariane 4 that argument was true. Nobody revisited it for Ariane 5 because the trajectory data for the new rocket was never included in the SRI's requirements.",
    },
    {
      type: "code",
      lang: "c",
      text: `#include <stdint.h>

/* the Ariane 4 assumption: bh always fits, so convert directly */
int16_t to_int16_unchecked(double bh) {
    return (int16_t)bh;   /* undefined behaviour in C if bh is out of range */
}

/* the defensive version: decide what happens at the edges */
int16_t to_int16_saturating(double bh) {
    if (bh > INT16_MAX) return INT16_MAX;
    if (bh < INT16_MIN) return INT16_MIN;
    return (int16_t)bh;
}`,
    },
    {
      type: "p",
      text: "The original code was Ada, not C, but the pattern is universal. The unchecked version is not wrong in itself. It encodes an assumption about the inputs. The danger is that the assumption lives in someone's head or an old analysis document rather than next to the code, where the next person to reuse it would see it.",
    },
    {
      type: "h2",
      text: "Why testing did not catch it",
    },
    {
      type: "p",
      text: "The SRI had been tested thoroughly, but not with Ariane 5's real flight trajectory. In the system-level simulations the SRIs were represented by simulated output rather than the real units running the real software. The [inquiry board](https://esamultimedia.esa.int/docs/esa-x-1819eng.pdf) concluded that a full closed-loop test with the actual trajectory would very likely have exposed the failure. In other words, the tests checked that the software met its requirements. The requirements were the problem.",
    },
    {
      type: "quote",
      text: "The failure of Ariane 501 was caused by the complete loss of guidance and attitude information 37 seconds after start of the main engine ignition sequence.",
      source: "Ariane 501 Inquiry Board report, ESA, July 1996",
    },
    {
      type: "h2",
      text: "What the inquiry recommended",
    },
    {
      type: "p",
      text: "The board, chaired by the mathematician [Jacques-Louis Lions](https://mathshistory.st-andrews.ac.uk/Biographies/Lions_Jacques-Louis/), made recommendations that read like a checklist for any embedded system. Switch off functions that have no purpose during flight. Test with realistic data and real equipment wherever possible. Do not let a unit stop sending sensible data just because one non-critical calculation failed. Review all flight software, including justifications for unprotected code. Make those justifications visible to reviewers.",
    },
    {
      type: "h2",
      text: "Lessons I apply in student projects",
    },
    {
      type: "table",
      headers: ["Ariane 5 lesson", "What it looks like at my scale"],
      rows: [
        ["Reused code carries hidden assumptions", "When I copy a driver or a timer routine from an old lab, I check its clock speed, ranges and units against the new board"],
        ["Dead code can still kill", "Code that only matters at start-up should stop running after start-up"],
        ["Identical redundancy fails identically", "Two copies of the same logic fed the same data are one point of failure, not two"],
        ["Fail safe, not fail silent", "An error path should send a clearly flagged error, never something a receiver could mistake for real data"],
        ["Test against the real conditions", "Bench tests with real sensor ranges, not only the values I expected"],
      ],
    },
    {
      type: "p",
      text: "The part that stays with me most is how reasonable each individual decision was. Reusing proven code was sensible. Saving processor time was sensible. Treating an exception as a hardware fault made sense for random hardware failures. The disaster came from those decisions meeting a new context that nobody had written down. That is why I now try to put assumptions in comments and tests right next to the code that depends on them.",
    },
    {
      type: "p",
      text: "[Ariane 5](https://www.esa.int/Enabling_Support/Space_Transportation/Launch_vehicles/Ariane_5) went on to become one of the most reliable launchers ever built, including the 2021 launch of the [James Webb Space Telescope](https://www.esa.int/Science_Exploration/Space_Science/Webb). Flight 501 is a reminder that reliability is not something software has. It is something software has in a particular context.",
    },
    {
      type: "h2",
      text: "Further reading",
    },
    {
      type: "ol-links",
      items: [
        { text: "ESA: Ariane 501, presentation of the Inquiry Board report", url: "https://www.esa.int/Newsroom/Press_Releases/Ariane_501_-_Presentation_of_Inquiry_Board_report" },
        { text: "The full Ariane 501 Inquiry Board report (PDF)", url: "https://esamultimedia.esa.int/docs/esa-x-1819eng.pdf" },
        { text: "ESA: Ariane 5 launch vehicle", url: "https://www.esa.int/Enabling_Support/Space_Transportation/Launch_vehicles/Ariane_5" },
        { text: "ESA: the Cluster mission that flight 501 carried", url: "https://www.esa.int/Science_Exploration/Space_Science/Cluster" },
        { text: "Ada Information Clearinghouse: the Ada language", url: "https://www.adaic.org" },
      ],
    },
    {
      type: "h2",
      text: "Watch or listen",
    },
    {
      type: "video",
      youtubeId: "W3YJeoYgozw",
      title: "Ian Sommerville: Ariane launch failure, a software engineering case study",
    },
  ],
}

export default _ariane_5_flight_501_overflow
