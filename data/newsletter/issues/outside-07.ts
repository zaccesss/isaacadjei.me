import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "outside",
  number: 7,
  slug: "outside-07-hybrid-electric-flight-utah",
  title: "A hybrid-electric aircraft flies across Utah",
  subtitle: "Ampaire's EEL flew from Salt Lake City to Cedar City as a test of future cargo routes.",
  tags: ["Aviation", "Electric Propulsion", "Engineering"],
  date: "2026-08-14",
  published: true,
  intro: [
    { type: "p", text: "On 6 August 2026 Ampaire flew its hybrid-electric EEL from Salt Lake City International Airport to Cedar City Regional Airport, working with the Utah Department of Transportation to test a future cargo route along the I-15 corridor. The flight covered around 240 miles in 1 hour and 45 minutes. The FAA described it as the second major step in its eVTOL Integration Pilot Program, which brings new kinds of aircraft into the national airspace under real operating conditions." },
    { type: "p", text: "The EEL is a modified Cessna 337 Skymaster, a twin-engine aircraft with one propeller at the front and one at the back. Ampaire has replaced the front engine with electric propulsion while the rear propeller is still driven by combustion. For Utah it was the first of several hybrid-electric demonstrations planned under its uFLY initiative over the next three years." },
    { type: "h2", text: "Why it matters to engineers" },
    { type: "p", text: "Hybrid designs are a practical answer to the battery problem. Batteries still store far less energy per kilogram than fuel, so a fully electric aircraft trades range for clean operation. Splitting the work between an electric motor and a combustion engine lets a testbed like this gather real data on power management, thermal behaviour and reliability on routes that matter now, rather than waiting for battery chemistry to catch up." },
    { type: "p", text: "Power electronics and battery management are the parts of this I would most like to see up close. The control problem of sharing load between two very different power sources, safely and in the air, is a serious piece of embedded engineering." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[Ampaire's hybrid-electric aircraft flies between Salt Lake City and Cedar City airports (Urban Air Mobility News)](https://www.urbanairmobilitynews.com/air-taxis/ampaires-hybrid-electric-aircraft-flies-between-salt-lake-city-and-cedar-city-airports/)",
        "[Utah Begins Real-World Hybrid-Electric Aircraft Demonstrations (FLYING)](https://www.flyingmag.com/utah-hybrid-electric-aircraft-demonstrations/)",
        "[FAA weekly bulletin, 6 August 2026](https://content.govdelivery.com/accounts/USAFAA/bulletins/423e361)",
      ],
    },
  ],
}

export default issue
