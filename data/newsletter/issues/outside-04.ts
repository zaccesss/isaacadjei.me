import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "outside",
  number: 4,
  slug: "outside-04-rubin-begins-lsst",
  title: "Rubin Observatory starts its ten-year sky survey",
  subtitle: "The largest digital camera in the world has begun filming the southern sky every few nights.",
  tags: ["Space", "Astronomy", "Data", "Sensors"],
  date: "2026-07-03",
  published: true,
  intro: [
    { type: "p", text: "At the end of June the NSF and DOE Vera C. Rubin Observatory on Cerro Pachón in Chile officially began the Legacy Survey of Space and Time, announced on 30 June. For the next ten years it will image the whole observable southern sky every few nights, building what the team calls a time-lapse movie of the universe." },
    { type: "p", text: "The hardware is on another scale. The telescope's camera has 3,200 megapixels, making it the largest digital camera in the world. It takes a new image roughly every 40 seconds, collects about 10 terabytes of data each night and can send out as many as seven million alerts a night when something in the sky changes. During around six weeks of early optimisation surveys it had already found more than 11,000 previously unknown asteroids." },
    { type: "h2", text: "Why it matters to engineers" },
    { type: "p", text: "Rubin is as much a data pipeline as a telescope. Seven million alerts a night is far too many for people to read, so the alerts stream out automatically to classification systems that decide what deserves a closer look. Designing that flow, from sensor readout to storage to a filtered stream of events, is the same problem as any large sensing system, just with a mountain-top camera at one end." },
    { type: "p", text: "My own projects work at a tiny fraction of this scale, but the shape is familiar: sensors produce far more readings than anyone will look at, so the useful work is in deciding which changes are worth raising as an alert. Rubin is a good example of getting that filter right before the data arrives." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[Rubin Observatory begins capturing the greatest cosmic movie ever made (AURA)](https://www.aura-astronomy.org/blog/2026/06/30/action-nsf-doe-vera-c-rubin-observatory-begins-capturing-the-greatest-cosmic-movie-ever-made/)",
        "[Rubin Observatory starts the Legacy Survey of Space and Time (University of Washington)](https://www.washington.edu/news/2026/06/30/rubin-observatory-legacy-survey-space-time-lsst/)",
      ],
    },
  ],
}

export default issue
