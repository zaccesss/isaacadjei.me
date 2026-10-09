import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  number: 1,
  slug: "issue-01-from-a-sensor-to-a-platform",
  title: "PHAEMOS, AstonCV and a first look at analytics",
  subtitle: "The first issue: a predictive maintenance platform, a CV database with no frameworks, a business analytics course and six small lessons.",
  tags: ["IoT", "ML", "Full-Stack", "Security", "Python", "Data Science"],
  date: "2026-05-15",
  published: true,
  intro: [
    { type: "p", text: "Welcome to the first issue. The format is simple. Every couple of weeks I write a short letter like this one, then everything I published since the last issue follows underneath: blog posts, TILs and notes. Every piece lives on the site too, so nothing here is written only for the email." },
    { type: "p", text: "This fortnight was mostly about writing up things I had been building quietly. Three long posts came out of it, along with six small lessons from embedded C, the web, algorithms and one proverb from home." },
    { type: "h2", text: "What I wrote" },
    { type: "p", text: "The big one is [Phaemos: Building a Predictive Maintenance Platform](/blog/phaemos-predictive-maintenance). It walks through four hardware nodes (an ESP32, an STM32 Black Pill, an Arduino Nano and a Raspberry Pi Pico 2W) carrying 11 sensors, a FastAPI and PostgreSQL backend, an Isolation Forest model that scores every reading and a live Next.js front end. The tagline is reveal before failure. The whole point is to spot a fault in the data before anyone can see it on the machine." },
    { type: "p", text: "[Building AstonCV](/blog/astoncv-full-stack-cv-database) is the story of a university module project where the brief banned frameworks. It is pure PHP 8.2, MySQL, CSS and JavaScript, with eleven security measures, PDF export through mPDF and four versions of the interface before it felt right. Working without a framework showed me exactly what frameworks normally do for you." },
    { type: "p", text: "[Learning Business Analytics](/blog/business-analytics-data-to-decisions) collects my notes from a structured course that runs from probability and statistics through Python and descriptive analytics to predictive machine learning and prescriptive optimisation. I took it partly so I could explain these ideas to someone meeting them for the first time, because teaching is the quickest way to find the gaps in what you know." },
    { type: "h2", text: "Small things I learned" },
    {
      type: "ul",
      items: [
        "[PWM timer maths](/til/pwm-timer-maths): the duty cycle is the compare register over the period, so you can change brightness without touching the frequency.",
        "[Debounce versus throttle](/til/debounce-vs-throttle): one waits for a pause, the other caps how often a function can run.",
        "[Format string vulnerabilities in C](/til/format-string-vulnerability-c): why passing user input straight to printf can leak or overwrite memory.",
        "[Static local variables in C](/til/static-local-var-scope) keep their value between calls without exposing that state to the rest of the code.",
        "[Binary search on the answer](/til/binary-search-on-answer) works on any monotone predicate, not only on sorted arrays.",
        "[A Ga proverb](/til/ga-proverb-systems-thinking) about small streams joining into a powerful river, which maps neatly onto systems thinking.",
      ],
    },
  ],
}

export default issue
