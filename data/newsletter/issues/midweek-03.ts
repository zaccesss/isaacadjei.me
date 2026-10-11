import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "midweek",
  number: 3,
  slug: "midweek-03-sleep-memory-exams",
  title: "Sleep, memory and exam season",
  subtitle: "Why the night before an exam matters as much as the hours of revision before it.",
  tags: ["Psychology", "Sleep", "Learning"],
  date: "2026-06-24",
  published: true,
  intro: [
    { type: "p", text: "It is exam season for many students. The temptation is to trade sleep for one more hour of revision. The research on memory suggests that is usually a bad deal." },
    { type: "h2", text: "What sleep does for memory" },
    { type: "p", text: "Taking something in happens in milliseconds, but turning it into a stable long-term memory can take minutes, days or even years. That second step is called consolidation. Studies have shown that memories are stabilised and strengthened by a night's sleep and even by daytime naps." },
    { type: "p", text: "Different stages of sleep seem to help different kinds of memory. Facts and events are generally thought to benefit from deep slow-wave sleep. Skills and habits are thought to benefit from REM sleep, the stage where most dreaming happens. The results are not perfectly consistent, but the overall direction is clear: sleep is part of how learning sticks." },
    { type: "h2", text: "Why I find it interesting" },
    { type: "p", text: "As a student I find this a useful reminder. A late night of cramming feels productive, but if it costs the sleep that consolidates what you learned, some of that effort is wasted. Spreading revision over several days with proper sleep in between gives the brain more chances to do its part." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[Why is sleep important?](https://www.nhlbi.nih.gov/health/sleep/why-sleep-important) from the NHLBI, part of the US National Institutes of Health","[Sleep and memory](https://en.wikipedia.org/wiki/Sleep_and_memory) on Wikipedia, which links the underlying studies",
      ],
    },
  ],
}

export default issue
