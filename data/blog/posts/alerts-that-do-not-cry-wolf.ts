import type { BlogPost } from "../index"

const _alerts_that_do_not_cry_wolf: BlogPost = {
  slug: "alerts-that-do-not-cry-wolf",
  title: "Alerts That Do Not Cry Wolf: The Three-in-a-Row Rule",
  date: "2026-10-15",
  type: "blog",
  cover_image: "/images/blog/covers/alerts-that-do-not-cry-wolf-shot.webp",
  cover_image_dark: "/images/blog/covers/alerts-that-do-not-cry-wolf-shot-dark.webp",
  description:
    "A model that flags 5% of healthy readings will page someone constantly if every flag is an alert. How PHAEMOS turns noisy anomaly scores into trustworthy alerts with a run of three, a clear rule, a critical level and one ticket per fault.",
  tags: ["IoT", "Python", "PHAEMOS", "Maintenance", "Backend"],
  projectSlug: "phaemos",
  published: true,
  content: [
    {
      type: "p",
      text: "Once I had [calibrated the anomaly model](/blog/calibrating-anomaly-scores) in [PHAEMOS](https://phaemos.com), it behaved exactly as configured: about 5% of healthy readings scored above the alert threshold. That is the contamination setting doing its job. It is also a problem. A sensor node that reports once a second produces 3,600 readings an hour, so 5% means around 180 false flags an hour from a perfectly healthy machine. If each of those became an email, nobody would read the emails after the first morning. This post is about the small piece of logic that sits between the model and a human.",
    },
    {
      type: "h2",
      text: "A single reading is weak evidence",
    },
    {
      type: "p",
      text: "Any detector with a threshold trades false alarms against missed faults. Lower the threshold and you catch more faults but flag more healthy readings. Raise it and the reverse happens. Tuning the threshold alone cannot escape that trade-off. What helps is noticing that real faults and random noise behave differently over time. A worn bearing does not produce one strange vibration reading and then return to normal for a minute. It keeps producing strange readings and they get stranger. Noise does not persist like that.",
    },
    {
      type: "h2",
      text: "The rule",
    },
    {
      type: "ul",
      items: [
        "Raise an anomaly alert only when the three most recent readings from a device are all anomalous.",
        "Mark it critical if the highest score in that run is 0.85 or more. Otherwise it is a warning.",
        "Clear the alert when the three most recent readings are all normal again.",
        "Open a maintenance ticket with the alert. If the fault returns before someone closes that ticket, reuse it instead of opening another.",
        "Do nothing at all while the device is in a planned maintenance window.",
      ],
    },
    {
      type: "h3",
      text: "Why three?",
    },
    {
      type: "p",
      text: "If healthy readings are flagged independently 5% of the time, the chance of three in a row by pure chance is 0.05 multiplied by itself three times: 0.000125. That is about one in 8,000. That turns 180 false flags an hour into an expected one false run every couple of hours on a node reporting every second. A node reporting every few seconds sees far fewer. Meanwhile a developing fault keeps the run going, so it still raises an alert within a few readings.",
    },
    {
      type: "table",
      headers: ["Run length needed", "Chance from noise alone", "Roughly one false alert per"],
      rows: [
        ["1", "5%", "20 readings"],
        ["2", "0.25%", "400 readings"],
        ["3", "0.0125%", "8,000 readings"],
        ["5", "0.00003%", "3.2 million readings"],
      ],
      caption: "With a 5% per-reading false flag rate, assuming independent readings.",
    },
    {
      type: "callout",
      tone: "note",
      text: "The independence assumption is optimistic. Consecutive sensor readings are correlated, so real false runs are somewhat more common than the table suggests. The numbers are a guide for choosing the run length, not a guarantee.",
    },
    {
      type: "p",
      text: "Three is a judgement call. Five would be quieter, but every extra reading is extra delay before a real fault is reported. For a machine sampled every second or two, three readings costs only a few seconds of latency, which is nothing compared to the hours or days a bearing takes to fail. Industrial process control has used run rules like this for decades. The [Western Electric rules](https://www.itl.nist.gov/div898/handbook/pmc/section3/pmc32.htm) from the 1950s flag a process when several points in a row fall on one side of a limit, for exactly the same reason.",
    },
    {
      type: "h2",
      text: "Clearing matters as much as raising",
    },
    {
      type: "diagram",
      code: "stateDiagram-v2\n  [*] --> Normal\n  Normal --> Alerting: 3 anomalous in a row\n  Alerting --> Alerting: mixed readings, alert stays open\n  Alerting --> Normal: 3 normal in a row\n  Normal --> Alerting: fault returns, same ticket reused",
      caption: "Hysteresis: it takes a clear run to raise the alert and a clear run to clear it.",
    },
    {
      type: "p",
      text: "If a single normal reading cleared the alert, a fault that flickers in and out would raise, clear and raise again many times. The rule is symmetric instead. It needs three anomalous readings to raise and three normal readings to clear, while a mixed run leaves things as they are. Electronics students will recognise this as hysteresis, the same idea that stops a [Schmitt trigger](https://www.ti.com/lit/pdf/scea046) chattering on a noisy input.",
    },
    {
      type: "h2",
      text: "One fault, one ticket",
    },
    {
      type: "p",
      text: "A developing fault often comes and goes before it becomes obvious. If every alert opened a new ticket, one failing pump could produce five tickets in an afternoon. Instead the alert looks for an open ticket on the same device first. If there is one, the new alert is attached to it and its priority is raised to critical if needed. The engineer sees one ticket with a history, which is how they think about the problem anyway.",
    },
    {
      type: "clip",
      src: "/videos/projects/phaemos/alerts-tickets.mp4",
      poster: "/videos/projects/phaemos/alerts-tickets.webp",
      alt: "The Maintenance tickets list in PHAEMOS, followed by the Compare page showing two machines side by side.",
      caption: "The Maintenance tickets list, then the Compare page with two machines side by side.",
    },
    {
      type: "code",
      lang: "python",
      text: `ANOMALY_RUN = 3
CRITICAL_SCORE = 0.85

latest = recent_readings(device, limit=ANOMALY_RUN)
if len(latest) < ANOMALY_RUN:
    return
if all(not r.is_anomaly for r in latest):
    clear_open_alert(device)
    return
if open_alert(device) or not all(r.is_anomaly for r in latest):
    return  # already alerting or a mixed run: change nothing

peak = max(r.anomaly_score for r in latest)
severity = "critical" if peak >= CRITICAL_SCORE else "warning"
raise_alert_and_reuse_or_open_ticket(device, severity, peak)`,
    },
    {
      type: "h2",
      text: "The bug that made 'latest' wrong",
    },
    {
      type: "p",
      text: "The rule depends on knowing which three readings are the most recent. There was a subtle bug hiding here: the latest few readings did not always sort in the order they arrived. Readings were stamped by the database with PostgreSQL's [`now()`](https://www.postgresql.org/docs/current/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT), which returns the start time of the current transaction rather than the current moment. Several readings saved in one transaction shared a timestamp, so sorting by time could not tell them apart. Stamping each reading in the application at the moment it arrives fixed the ordering and made the run logic trustworthy.",
    },
    {
      type: "h2",
      text: "Lessons for any alerting system",
    },
    {
      type: "ol",
      items: [
        "Decide what an alert is for. Ours is for a person to go and look at a machine, so every alert must be worth that walk.",
        "Use persistence over time, not just a threshold, to separate faults from noise.",
        "Make clearing as deliberate as raising so alerts do not flap.",
        "Group repeat alerts into one ticket per fault.",
        "Suppress alerts during planned maintenance.",
        "Check your timestamps. Run logic is only as good as the order of the data.",
      ],
    },
    {
      type: "p",
      text: "The model finds unusual readings. The alerting layer decides what is worth a human's attention. Keeping those two jobs separate made both easier to reason about and it is the reason I trust a PHAEMOS alert when one arrives. More of the system is on the [PHAEMOS project page](/projects/phaemos).",
    },
    {
      type: "h2",
      text: "Further reading",
    },
    {
      type: "ol-links",
      items: [
        { text: "Google SRE book: Monitoring Distributed Systems", url: "https://sre.google/sre-book/monitoring-distributed-systems/" },
        { text: "Google SRE workbook: Alerting on SLOs", url: "https://sre.google/workbook/alerting-on-slos/" },
        { text: "NIST/SEMATECH e-Handbook of Statistical Methods: control charts and the Western Electric rules", url: "https://www.itl.nist.gov/div898/handbook/pmc/section3/pmc32.htm" },
        { text: "Texas Instruments: Understanding Schmitt triggers (PDF)", url: "https://www.ti.com/lit/pdf/scea046" },
        { text: "PostgreSQL documentation: current date and time functions", url: "https://www.postgresql.org/docs/current/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT" },
        { text: "PHAEMOS project site", url: "https://phaemos.com" },
      ],
    },
  ],
}

export default _alerts_that_do_not_cry_wolf
