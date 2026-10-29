import type { BlogPost } from "../index"

const _how_gps_works_relativity: BlogPost = {
  slug: "how-gps-works-relativity",
  title: "How GPS Works and Why It Needs Einstein",
  date: "2026-10-29",
  type: "article",
  cover_image: "/images/blog/covers/how-gps-works-relativity.webp",
  cover_credit: "Image: US Government, public domain, via Wikimedia Commons",
  cover_alt: "Artist's impression of a GPS Block IIR-M navigation satellite in orbit above the Earth, with its solar panels extended",
  description:
    "How GPS turns radio timing into a position, why it needs four satellites and why both of Einstein's theories of relativity are built into every satellite clock.",
  tags: ["Engineering", "Research", "Python", "Learning", "Hardware"],
  published: true,
  content: [
    {
      type: "p",
      text: "This autumn I have been working on [LidarSAT](/projects/lidarsat), a team project about navigating a drone when GPS is not available. Spending weeks on the problem of life without GPS made me realise I had never properly understood how GPS itself works. So I went back to first principles. The answer is a lovely mix of geometry, radio engineering and, surprisingly, general relativity.",
    },
    {
      type: "h2",
      text: "Distance is just time multiplied by the speed of light",
    },
    {
      type: "p",
      text: "Each GPS satellite carries atomic clocks and continuously broadcasts two things: the exact time the signal left the satellite and where the satellite was at that moment. A receiver notes when the signal arrives. The difference between the two times, multiplied by the speed of light, is the distance to that satellite.",
    },
    {
      type: "p",
      text: "Light covers about 30 cm in a nanosecond. That single number explains why the whole system is really a timing system. An error of one microsecond in the clock becomes an error of 300 m on the ground. To place you within a few metres, the timing has to be good to around ten nanoseconds.",
    },
    {
      type: "h2",
      text: "Why four satellites, not three",
    },
    {
      type: "p",
      text: "One distance puts you somewhere on a sphere around one satellite. Two spheres intersect in a circle. A third sphere cuts that circle down to two points. One of those is usually far out in space. So in theory three satellites are enough.",
    },
    {
      type: "p",
      text: "The catch is the receiver's own clock. A phone does not contain an atomic clock, so its idea of the current time is off by an unknown amount. Every measured distance is wrong by that same offset multiplied by the speed of light. GPS treats the clock error as a fourth unknown alongside x, y and z. Four unknowns need four equations, which means four satellites.",
    },
    {
      type: "code",
      lang: "text",
      text: `for each satellite i (at least four of them):

    measured_range_i = c * (t_received - t_sent_i)
                     = distance(receiver, satellite_i) + c * clock_bias

unknowns: x, y, z of the receiver and clock_bias`,
    },
    {
      type: "p",
      text: "The receiver solves these equations with an iterative least squares fit. With more than four satellites in view, which is normal, the extra measurements average out noise. As a bonus, your phone ends up knowing the time very accurately as a side effect of working out where it is.",
    },
    {
      type: "diagram",
      code: `flowchart LR
    S1["Satellite 1<br/>time and position"] --> R["Receiver"]
    S2["Satellite 2"] --> R
    S3["Satellite 3"] --> R
    S4["Satellite 4"] --> R
    R --> P["Solve for x, y, z<br/>and clock error"]
    P --> F["Position and precise time"]`,
      caption: "Four signals give four equations for four unknowns.",
    },
    {
      type: "h2",
      text: "The constellation",
    },
    {
      type: "p",
      text: "GPS is [designed around at least 24 satellites](https://www.gps.gov/space-segment) in six orbital planes, at an altitude of roughly 20,200 km. Each one goes round the Earth twice a day. The orbits are arranged so that at least four satellites are above the horizon from almost anywhere on Earth at any time. In practice around 30 are in service, which gives spare coverage and better geometry.",
    },
    {
      type: "h2",
      text: "Where Einstein comes in",
    },
    {
      type: "p",
      text: "Here is the part that surprised me. The satellite clocks do not tick at the same rate as clocks on the ground, for two separate reasons that pull in opposite directions.",
    },
    {
      type: "ul",
      items: [
        "Special relativity: the satellites move at nearly 3.9 km/s relative to the ground. Moving clocks run slow, so the satellite clocks lose time.",
        "General relativity: the satellites sit much higher in the Earth's gravitational field. Clocks further from a mass run fast, so the satellite clocks gain time.",
      ],
    },
    {
      type: "p",
      text: "Neither effect is big in everyday terms, but the timing budget is measured in nanoseconds. I wrote a short Python script to work out the size of each effect from basic constants.",
    },
    {
      type: "code",
      lang: "python",
      text: `import math

GM = 3.986004418e14      # earth's gravitational parameter, m^3/s^2
C = 299_792_458          # speed of light, m/s
R_EARTH = 6.371e6        # mean radius of the earth, m
R_ORBIT = 2.6562e7       # radius of a gps orbit, m
DAY = 86_400             # seconds in a day

v = math.sqrt(GM / R_ORBIT)                          # orbital speed
special = -v**2 / (2 * C**2)                         # moving clocks run slow
general = GM / C**2 * (1 / R_EARTH - 1 / R_ORBIT)    # clocks higher up run fast
net = special + general

print(f"orbital speed:      {v:,.0f} m/s")
print(f"special relativity: {special * DAY * 1e6:+.1f} microseconds a day")
print(f"general relativity: {general * DAY * 1e6:+.1f} microseconds a day")
print(f"net drift:          {net * DAY * 1e6:+.1f} microseconds a day")
print(f"range error:        {net * DAY * C / 1000:.1f} km a day")`,
    },
    {
      type: "code",
      lang: "text",
      text: `orbital speed:      3,874 m/s
special relativity: -7.2 microseconds a day
general relativity: +45.7 microseconds a day
net drift:          +38.5 microseconds a day
range error:        11.5 km a day`,
    },
    {
      type: "p",
      text: "The [published figures](https://link.springer.com/article/10.12942/lrr-2003-1) are about 7 microseconds slow from motion and 45 microseconds fast from gravity, a net gain of roughly 38 microseconds a day. My simple model lands very close. Left uncorrected, that drift would turn into a position error growing by around 11 km every day. After a week, GPS would be useless.",
    },
    {
      type: "h3",
      text: "How the correction is applied",
    },
    {
      type: "p",
      text: "The fix is surprisingly low-tech. Before launch, the satellite clocks are set to tick slightly slow. Their nominal frequency is 10.23 MHz, but they are tuned to about 10.22999999543 MHz on the ground. Once in orbit, relativity speeds them up to exactly the right rate as seen from Earth. Receivers also apply a small extra correction because the orbits are slightly elliptical, so the effect varies as each satellite moves closer and further away.",
    },
    {
      type: "callout",
      tone: "note",
      text: "Relativity is not the only correction. The signal slows down as it passes through the ionosphere and troposphere, the satellite orbits drift and buildings reflect signals. Modern receivers model or measure all of these. Relativity is simply the one that would break the system completely if ignored.",
    },
    {
      type: "h2",
      text: "Why this matters for GPS-denied navigation",
    },
    {
      type: "p",
      text: "Understanding GPS properly made our team project make more sense. GPS signals arrive at the ground with very little power, so they are [easy to jam or spoof](https://www.gps.gov/spectrum-interference-issues) and they fade in tunnels and urban canyons. A drone that depends entirely on them is fragile. That is why our project matches what the drone's sensors see against stored terrain maps instead. It is a completely different way of answering the same question: where am I?",
    },
    {
      type: "p",
      text: "I find GPS a great example of engineering that is invisible when it works. Billions of people use it every day without knowing that a correction from a theory published in 1915 is quietly running inside every satellite.",
    },
    {
      type: "h2",
      text: "Further reading",
    },
    {
      type: "ol-links",
      items: [
        { text: "Neil Ashby: Relativity in the Global Positioning System, Living Reviews in Relativity", url: "https://link.springer.com/article/10.12942/lrr-2003-1" },
        { text: "GPS.gov: official information about the Global Positioning System", url: "https://www.gps.gov/" },
        { text: "GPS.gov: the space segment and the constellation", url: "https://www.gps.gov/space-segment" },
        { text: "GPS.gov: GPS accuracy and the errors that affect it", url: "https://www.gps.gov/gps-accuracy" },
        { text: "GPS.gov: GPS and telling time", url: "https://www.gps.gov/gps-and-telling-time" },
        { text: "Bartosz Ciechanowski: GPS, an interactive explanation", url: "https://ciechanow.ski/gps/" },
        { text: "ENGNERDS, the team behind our GPS-denied navigation project", url: "https://github.com/ENGNERDS" },
      ],
    },
    {
      type: "h2",
      text: "Watch or listen",
    },
    {
      type: "video",
      youtubeId: "x7mWlAauLPs",
      title: "Perimeter Institute: Everyday Einstein, GPS and relativity",
    },
  ],
}

export default _how_gps_works_relativity
