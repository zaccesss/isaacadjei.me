import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "outside",
  number: 10,
  slug: "outside-10-flex-and-sentinel-3c",
  title: "FLEX launches to watch plants glow from orbit",
  subtitle: "ESA's first satellite built to measure photosynthesis shared a Vega-C ride with Sentinel-3C.",
  tags: ["Space", "Earth Observation", "Sensors"],
  date: "2026-09-25",
  published: true,
  intro: [
    { type: "p", text: "Vega-C flight VV30 lifted off from Europe's Spaceport in French Guiana at 03:21 UTC on 15 September 2026, carrying two European satellites. Sentinel-3C, the third satellite in the Copernicus Sentinel-3 series, was released first. About an hour later came FLEX, the latest of ESA's Earth Explorer missions. ESA's operations centre in Germany then received a first signal from each, confirming both were safely in orbit." },
    { type: "p", text: "FLEX is ESA's first satellite designed specifically to measure photosynthetic activity from space. Its Fluorescence Imaging Spectrometer picks up the faint glow that plants give off while they photosynthesise, which reveals plant health, ecosystem productivity and the effects of stress and climate change. It flies in tandem with Sentinel-3A at first, a role Sentinel-3C will later take over. Sentinel-3C itself monitors oceans, land, ice and the atmosphere, measuring surface temperatures, ocean colour and inland water levels." },
    { type: "h2", text: "Why it matters to engineers" },
    { type: "p", text: "Measuring a signal this faint against bright reflected sunlight is a hard instrument problem. It is also a neat example of sensor fusion in orbit: flying FLEX alongside a Sentinel-3 satellite lets one set of measurements give context to the other. The launch itself relied on Vespa, an adapter that stacks two satellites inside one fairing so they can share a ride." },
    { type: "p", text: "Sensors are where most of my projects start, so the idea of reading plant health from a glow that is invisible to the eye is a striking one. It is the same principle as any good measurement: find the signal that tells you about the system before the visible symptoms appear." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[FLEX and Sentinel-3C launched (ESA)](https://www.esa.int/Applications/Observing_the_Earth/FLEX_and_Sentinel-3C_launched)",
        "[Launch preview: Avio to launch spacecraft to monitor plant health and ocean conditions (Spaceflight Now)](https://spaceflightnow.com/2026/09/14/live-coverage-avio-to-launch-spacecraft-to-monitor-plant-health-and-ocean-conditions/)",
      ],
    },
  ],
}

export default issue
