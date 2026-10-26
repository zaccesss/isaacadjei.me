import type { BlogPost } from "../index"

const _hubble_mirror_flaw: BlogPost = {
  slug: "hubble-mirror-flaw",
  title: "Hubble's Flawed Mirror: How 1.3 mm Blurred a Space Telescope",
  date: "2026-10-26",
  type: "article",
  cover_image: "/images/blog/covers/hubble-mirror-flaw.webp",
  cover_credit: "Photo: NASA, public domain, via Unsplash",
  description:
    "How one misplaced lens let the Hubble Space Telescope reach orbit in 1990 with a mirror polished precisely to the wrong shape and what that teaches about trusting a single test.",
  tags: ["Engineering", "Research", "Learning", "Best Practices"],
  published: true,
  content: [
    {
      type: "p",
      text: "On 24 April 1990 the Space Shuttle Discovery carried the [Hubble Space Telescope](https://science.nasa.gov/mission/hubble/) into orbit. It had been in development for well over a decade and was meant to take the sharpest pictures of the universe ever made. Within weeks of the first test images, it was clear something was wrong. Stars that should have been tiny points were surrounded by a blurry halo.",
    },
    {
      type: "p",
      text: "The cause turned out to be the main mirror itself. It had been polished with extraordinary precision to the wrong shape. I keep coming back to this story because the root cause was not a bad weld or a broken component. It was a measurement everybody trusted.",
    },
    {
      type: "h2",
      text: "What spherical aberration means",
    },
    {
      type: "p",
      text: "A telescope mirror is curved so that every ray of light hitting it is reflected to the same focal point. Hubble's 2.4 m [primary mirror](https://science.nasa.gov/mission/hubble/observatory/design/optics/) was meant to have a very specific hyperbolic shape. Instead, its outer edge was too flat by about 2.2 micrometres, roughly a fiftieth of the width of a human hair. That sounds tiny, but optics work at the scale of the wavelength of light. Light from the edge of the mirror focused at a different point from light near the centre.",
    },
    {
      type: "p",
      text: "That is spherical aberration. Instead of one sharp focus there was a smear of them. Most of the light from a star landed in a wide halo rather than a tight core, which ruined faint, detailed observations even though bright objects could still be studied.",
    },
    {
      type: "h2",
      text: "The tool that lied",
    },
    {
      type: "p",
      text: "You cannot check a mirror like this with a ruler. While polishing, the contractor Perkin-Elmer tested the surface with a device called a reflective null corrector. It is an arrangement of mirrors and a lens that makes a perfectly shaped mirror look perfectly flat to an interferometer. Polish until the test shows no error and the mirror is done.",
    },
    {
      type: "p",
      text: "The null corrector itself had been assembled wrongly. One lens sat 1.3 mm out of position. The [optical systems failure report](https://ntrs.nasa.gov/citations/19910003124) published in November 1990 traced the problem to how its spacing was measured: a laser was meant to reflect off the end of a measuring rod through a hole in a field cap, but worn paint on the cap meant the reflection came from the wrong surface. The technicians added washers to make the reading look right. From then on, the instrument confidently guided the polishing towards the wrong shape.",
    },
    {
      type: "diagram",
      code: `flowchart LR
    A["Lens spaced 1.3 mm wrong"] --> B["Null corrector expects the wrong shape"]
    B --> C["Mirror polished until the test reads perfect"]
    C --> D["Mirror perfect for the wrong shape"]
    D --> E["Spherical aberration in orbit"]
    F["Other tests disagree"] -. "dismissed" .-> C`,
      caption: "A single trusted instrument turned a 1.3 mm assembly error into a precise but wrong mirror.",
    },
    {
      type: "h2",
      text: "The warnings that were ignored",
    },
    {
      type: "p",
      text: "This is the part that matters most to me as an engineer. The flaw was detectable before launch. Simpler auxiliary tests, including refractive null correctors used for the rough polishing stage, showed an error. The investigation board found that these results were set aside because the reflective null corrector was considered the more accurate instrument. The board also found that cost and schedule pressure had squeezed out independent verification. No one tested the finished mirror against a second, independent reference.",
    },
    {
      type: "quote",
      text: "The primary mirror was made in the wrong shape.",
      source: "The Hubble Space Telescope Optical Systems Board of Investigation, November 1990",
    },
    {
      type: "h2",
      text: "Glasses for a telescope",
    },
    {
      type: "p",
      text: "There is a hopeful end to the story. Because the error was so precise, it could be measured exactly from the blurry images and from the faulty null corrector, which was still in storage. That meant it could be cancelled out. In December 1993 the crew of Space Shuttle Endeavour, on [STS-61](https://www.nasa.gov/mission/sts-61/), the [first servicing mission](https://science.nasa.gov/mission/hubble/observatory/missions-to-hubble/servicing-mission-1/), installed two fixes.",
    },
    {
      type: "table",
      headers: ["Fix", "What it did"],
      rows: [
        ["WFPC2", "A replacement main camera with the correction built into its own optics"],
        ["COSTAR", "A set of small corrective mirrors placed in front of the other instruments, in effect a pair of glasses"],
      ],
    },
    {
      type: "p",
      text: "Later instruments were designed with the correction built in from the start, so COSTAR was eventually removed in 2009. Hubble went on to become one of the most productive scientific instruments ever built. The mirror is still the same flawed mirror. Everything after it compensates.",
    },
    {
      type: "h2",
      text: "What I take from it",
    },
    {
      type: "h3",
      text: "Your test equipment is part of the system",
    },
    {
      type: "p",
      text: "When I debug a circuit, I assume the oscilloscope is right. Usually it is. But a probe on the wrong attenuation setting, a ground lead picking up noise or a multimeter on the wrong range can all lie convincingly. Hubble is the extreme version: the test fixture was wrong, so everything it approved was wrong in exactly the same way. Calibrating and sanity-checking the tool is part of the measurement.",
    },
    {
      type: "h3",
      text: "One test is an opinion, two independent tests are evidence",
    },
    {
      type: "p",
      text: "Software has the same trap. A test written by the same person, with the same misunderstanding as the code, will happily pass. Independent checks, such as a different method, a different person or a real end-to-end run, are what catch a shared assumption. When I build anything that matters now, I try to prove it two different ways before calling it done.",
    },
    {
      type: "h3",
      text: "A disagreeing result is data, not noise",
    },
    {
      type: "p",
      text: "The rough tests disagreed and were explained away. It is very human to trust the expensive, precise instrument over the cheap one. But when two measurements disagree, at least one of them is telling you something you do not yet understand. That is the moment to stop and find out which, not to pick the answer you prefer.",
    },
    {
      type: "callout",
      tone: "tip",
      text: "A practical habit: before trusting a new measurement setup, test it on something you already know the answer to. A known resistor, a reference voltage or a hand-calculated output. If the setup cannot get the known case right, it will not get the unknown one right either.",
    },
    {
      type: "p",
      text: "Hubble's mirror is a reminder that precision and accuracy are not the same thing. Perkin-Elmer achieved astonishing precision. The accuracy was lost in a few millimetres of a test rig that nobody double-checked.",
    },
    {
      type: "h2",
      text: "Further reading",
    },
    {
      type: "ol-links",
      items: [
        { text: "NASA: Hubble's mirror flaw", url: "https://science.nasa.gov/mission/hubble/observatory/design/optics/hubbles-mirror-flaw/" },
        { text: "The Hubble Space Telescope optical systems failure report (NASA Technical Reports Server)", url: "https://ntrs.nasa.gov/citations/19910003124" },
        { text: "NASA: Servicing Mission 1, when WFPC2 and COSTAR were installed", url: "https://science.nasa.gov/mission/hubble/observatory/missions-to-hubble/servicing-mission-1/" },
        { text: "NASA: STS-61 mission page", url: "https://www.nasa.gov/mission/sts-61/" },
        { text: "NASA: the Hubble mission", url: "https://science.nasa.gov/mission/hubble/" },
      ],
    },
    {
      type: "h2",
      text: "Watch or listen",
    },
    {
      type: "video",
      youtubeId: "2X0Hghl3SYk",
      title: "NASA Goddard: Hubble's Servicing Mission 1",
    },
    {
      type: "video",
      youtubeId: "ujt8aP31i34",
      title: "The 1990 NASA press conference explaining the spherical aberration (YouTube archive)",
    },
    {
      type: "spotify",
      episodeId: "3TffbLiTZJAjWEhvljanL1",
      title: "13 Minutes, Trouble with Hubble: A window on the universe",
    },
  ],
}

export default _hubble_mirror_flaw
