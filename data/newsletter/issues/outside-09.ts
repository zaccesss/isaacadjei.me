import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "outside",
  number: 9,
  slug: "outside-09-roman-space-telescope-launch",
  title: "The Roman Space Telescope is on its way",
  subtitle: "NASA's next flagship observatory launched to survey the sky a thousand times faster than Hubble.",
  tags: ["Space", "Astronomy", "Sensors"],
  date: "2026-09-11",
  published: true,
  intro: [
    { type: "p", text: "NASA's Nancy Grace Roman Space Telescope launched at 7:26 a.m. EDT on 30 August 2026 on a SpaceX Falcon Heavy from Launch Complex 39A at Kennedy Space Center. It separated from the rocket about 31 minutes into the flight and deployed its solar panels and sun shade within 83 minutes of launch. It is now on a three-month journey to the second Sun-Earth Lagrange point, L2, around a million miles from Earth. NASA says the mission was delivered ahead of schedule and on budget." },
    { type: "image", src: "/images/newsletter/roman-space-telescope.jpg", alt: "An illustration of the Nancy Grace Roman Space Telescope against a background of stars", caption: "An illustration of the Nancy Grace Roman Space Telescope. Image: NASA, public domain, via Wikimedia Commons" },
    { type: "p", text: "Roman is designed to survey the universe a thousand times faster than Hubble. Its main instrument is a 300-megapixel infrared camera built from 18 detectors, alongside a coronagraph that will demonstrate technology for imaging planets like Jupiter around other stars. The science goals are dark matter, dark energy and exoplanets, with the first images expected by early 2027." },
    { type: "h2", text: "Why it matters to engineers" },
    { type: "p", text: "The figure that stands out is the downlink. Roman will send about 1.4 terabytes of data a day, the highest data rate of any NASA astrophysics mission so far. A wide field of view is only useful if the spacecraft can get the data home, so the communications system matters as much as the mirror." },
    { type: "p", text: "Coming a couple of months after Rubin began its survey from the ground, this is a good fortnight to notice how much of modern astronomy is a sensor and data engineering problem. Building small sensing systems has taught me that the bottleneck is rarely the sensor itself. It is usually moving, storing and making sense of what the sensor produces." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[NASA's Dark Universe-Seeking Nancy Grace Roman Space Telescope Launches](https://www.nasa.gov/news-release/nasas-dark-universe-seeking-nancy-grace-roman-space-telescope-launches/)",
        "[NASA's Roman Space Telescope Launches (NASA Science)](https://science.nasa.gov/blogs/roman/2026/08/30/nasas-roman-space-telescope-launches/)",
      ],
    },
  ],
}

export default issue
