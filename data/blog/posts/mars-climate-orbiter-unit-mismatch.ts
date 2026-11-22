import type { BlogPost } from "../index"

const _mars_climate_orbiter_unit_mismatch: BlogPost = {
  slug: "mars-climate-orbiter-unit-mismatch",
  title: "The Mars Climate Orbiter: How a Unit Mismatch Lost a Spacecraft",
  date: "2026-11-22",
  type: "article",
  cover_image: "/images/blog/covers/mars-climate-orbiter-unit-mismatch.webp",
  cover_credit: "Photo: NASA, public domain, via Unsplash",
  cover_alt: "The planet Mars as a full tan disc with darker markings, craters and a pale polar cap, against a black background",
  description:
    "In 1999 a spacecraft was lost at Mars because one program worked in pound-force seconds and another expected newton-seconds. What actually went wrong and what it teaches anyone who writes code that touches physical quantities.",
  tags: ["Engineering", "SoftwareEngineering", "Learning", "Embedded"],
  published: true,
  content: [
    {
      type: "p",
      text: "Every engineering student has lost marks for a missing unit. Very few of us have lost a spacecraft for one. On 23 September 1999 NASA's [Mars Climate Orbiter](https://science.nasa.gov/mission/mars-climate-orbiter/) fired its engine to slow into orbit around Mars, passed behind the planet as planned and was never heard from again. The cause was a mismatch between imperial and SI units in software on the ground.",
    },
    {
      type: "p",
      text: "It is tempting to tell this as a story about one careless conversion. The investigation tells a more useful story. The units error was the trigger, but several separate checks that should have caught it did not. That is the part worth learning from.",
    },
    {
      type: "h2",
      text: "The mission",
    },
    {
      type: "p",
      text: "The orbiter launched on 11 December 1998. It was meant to study the Martian climate and atmosphere and to act as a communications relay for the Mars Polar Lander that followed it. Lockheed Martin built the spacecraft and NASA's [Jet Propulsion Laboratory](https://www.jpl.nasa.gov/missions/mars-climate-orbiter/) navigated it. The combined mission cost was about 327.6 million US dollars.",
    },
    {
      type: "h2",
      text: "What went wrong",
    },
    {
      type: "p",
      text: "A spacecraft's reaction wheels slowly build up momentum and small thruster firings are used to dump it. Each firing gives the spacecraft a tiny push, which changes its trajectory slightly. Navigators need to know the size of every push so they can predict where the spacecraft will be.",
    },
    {
      type: "p",
      text: "Ground software built by the spacecraft contractor calculated the impulse of these firings and wrote it to a file. The navigation software at JPL read that file and expected the numbers in newton-seconds, as the interface specification required. The file actually held pound-force seconds. One pound-force is about 4.45 newtons, so every small push was underestimated by that factor.",
    },
    {
      type: "diagram",
      code: `flowchart LR
    A[Thruster firings on the spacecraft] --> B[Contractor ground software]
    B -->|impulse in lbf s| C[File]
    C -->|read as N s| D[JPL navigation software]
    D --> E[Trajectory prediction off by a little each time]
    E --> F[Orbit insertion far too low]`,
      caption: "The value was right. The unit attached to it was not.",
    },
    {
      type: "p",
      text: "Each error was tiny. Worse, the orbiter needed these momentum dumps 10 to 14 times more often than the navigation team expected, because its solar array was asymmetric and sunlight pressure pushed it round. Over nine months of cruise the small errors added up. The board found the trajectory at Mars was about 170 km lower than planned. It was meant to pass about 226 km above the surface at its first closest approach and later estimates put it at about 57 km. The minimum altitude the spacecraft could survive was thought to be about 80 km. It most likely broke up in the atmosphere or skipped off into space.",
    },
    {
      type: "h2",
      text: "Why nobody caught it",
    },
    {
      type: "p",
      text: "The [Mishap Investigation Board's Phase I report](https://llis.nasa.gov/llis_lib/pdf/1009464main1_0641-mr.pdf), released in November 1999, named the root cause as the failure to use metric units in a ground software file called Small Forces. It then listed eight contributing causes, including inadequate communication between project elements, too few navigation staff and a verification process that did not properly cover ground software. A few stand out to me.",
    },
    {
      type: "ul",
      items: [
        "The interface was not verified end to end. The specification said SI units, but nobody tested that the file produced by one program was read correctly by the other.",
        "Navigators noticed that the trajectory did not behave as their models predicted. Their concerns were raised informally and were not escalated or resolved, partly because they had not gone through the formal process for logging them.",
        "A final trajectory correction manoeuvre that could have raised the approach altitude was discussed but not carried out.",
        "The navigation team was small and stretched across more than one mission, which left less time to chase an anomaly.",
      ],
    },
    {
      type: "quote",
      text: "The Board recognizes that mistakes occur on spacecraft projects. However, sufficient processes are usually in place on projects to catch these mistakes before they become critical to mission success. Unfortunately for MCO, the root cause was not caught by the processes in-place in the MCO project.",
      source: "Mars Climate Orbiter Mishap Investigation Board, Phase I Report, 1999",
    },
    {
      type: "h2",
      text: "Lessons I take into my own work",
    },
    {
      type: "h3",
      text: "1. Put the unit in the name",
    },
    {
      type: "p",
      text: "A variable called impulse tells you nothing about its unit. A variable called impulse_ns does. It costs nothing and makes a mismatch visible at the point where two pieces of code meet. In embedded code I do the same with timing: delay_ms and period_us rather than delay and period.",
    },
    {
      type: "h3",
      text: "2. Let the type system carry units where you can",
    },
    {
      type: "p",
      text: "Some languages and libraries can check units for you. F# has [units of measure](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/units-of-measure) built in. In Python, the [pint](https://pint.readthedocs.io/) library attaches units to numbers and refuses to add metres to seconds. Even in C, wrapping a quantity in a small struct stops you passing a raw number where a different unit is expected.",
    },
    {
      type: "code",
      lang: "python",
      text: `import pint

ureg = pint.UnitRegistry()

impulse = 10 * ureg.pound_force * ureg.second
expected = impulse.to(ureg.newton * ureg.second)

print(expected)            # 44.48... newton * second

# mixing incompatible units fails loudly instead of silently
try:
    impulse + 3 * ureg.metre
except pint.DimensionalityError as err:
    print("caught:", err)`,
    },
    {
      type: "h3",
      text: "3. Test the interface, not just each side of it",
    },
    {
      type: "p",
      text: "Both programs probably passed their own tests. The failure lived in the gap between them. When I connect a sensor to a microcontroller or a backend to a frontend, the most valuable test is the one that pushes a known value all the way through and checks what comes out at the other end.",
    },
    {
      type: "h3",
      text: "4. Treat an unexplained anomaly as a bug until proven otherwise",
    },
    {
      type: "p",
      text: "The navigators saw that something was off. The system around them made it easy to carry on. In student projects the equivalent is a reading that is slightly wrong, a test that fails once in ten runs or a value that drifts. The temptation is always to move on. The orbiter is a good reminder of where that leads.",
    },
    {
      type: "callout",
      tone: "note",
      text: "This was not the only unit-related incident of its kind. In 1983 an Air Canada Boeing 767, later nicknamed the [Gimli Glider](https://en.wikipedia.org/wiki/Gimli_Glider), ran out of fuel in flight after a fuel load was calculated in pounds instead of kilograms. The crew glided it to a safe landing.",
    },
    {
      type: "h2",
      text: "Why it still matters",
    },
    {
      type: "p",
      text: "It would be comforting to think this could only happen in 1999. It can happen in any project where two teams, two programs or two people pass numbers between them without agreeing on what those numbers mean. That includes a group project where one person writes the sensor driver and another writes the dashboard. The fix is not cleverness. It is boring discipline: units in names, checks at interfaces and taking small surprises seriously.",
    },
    {
      type: "h2",
      text: "Further reading",
    },
    {
      type: "ol-links",
      items: [
        { text: "Mars Climate Orbiter Mishap Investigation Board Phase I Report (NASA, PDF)", url: "https://llis.nasa.gov/llis_lib/pdf/1009464main1_0641-mr.pdf" },
        { text: "NASA Science: Mars Climate Orbiter mission page", url: "https://science.nasa.gov/mission/mars-climate-orbiter/" },
        { text: "NASA JPL: Mars Climate Orbiter mission page", url: "https://www.jpl.nasa.gov/missions/mars-climate-orbiter/" },
        { text: "NASA Space Science Data Coordinated Archive: Mars Climate Orbiter, with launch and loss dates", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1998-073A" },
        { text: "NIST: the SI base and derived units", url: "https://www.nist.gov/pml/owm/metric-si/si-units" },
        { text: "Pint, a Python library for physical quantities", url: "https://pint.readthedocs.io/" },
        { text: "F# units of measure", url: "https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/units-of-measure" },
        { text: "The Gimli Glider incident", url: "https://en.wikipedia.org/wiki/Gimli_Glider" },
      ],
    },
    {
      type: "h2",
      text: "Watch or listen",
    },
    {
      type: "video",
      youtubeId: "urcQAKKAAl0",
      title: "Scientific American: When NASA lost a spacecraft because it did not use metric",
    },
    {
      type: "video",
      youtubeId: "QJ5LVsxLrZs",
      title: "Filip Van Laenen at ACCU 2019: learning from the Mars Climate Orbiter mistake, on units in code",
    },
  ],
}

export default _mars_climate_orbiter_unit_mismatch
