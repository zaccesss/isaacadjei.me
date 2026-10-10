import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "midweek",
  number: 8,
  slug: "midweek-08-why-we-procrastinate",
  title: "Why we procrastinate",
  subtitle: "Research suggests putting things off is less about time and more about managing how a task makes us feel.",
  tags: ["Psychology", "Habits", "Students"],
  date: "2026-09-02",
  published: true,
  intro: [
    { type: "p", text: "A new term is about to start, which for many students means a fresh start against procrastination. The research suggests the usual advice about time management misses the main cause." },
    { type: "h2", text: "A problem with feelings, not clocks" },
    { type: "p", text: "An article from the Association for Psychological Science sums up the research: a poor concept of time may make procrastination worse, but an inability to manage emotions seems to be its very foundation. One leading researcher's work suggests as many as 20 per cent of people may be chronic procrastinators. Timothy Pychyl of Carleton University describes procrastination as a failure of self-regulation." },
    { type: "p", text: "Putting off a task can bring short-term relief from the stress it causes, which is why it is so tempting. But the psychologists Dianne Tice and Roy Baumeister concluded that, despite those short-term benefits, procrastination cannot be regarded as either adaptive or harmless. The psychologist Piers Steel has argued that impulsiveness is the key factor, since anxiety alone can push people to start early as easily as late." },
    { type: "h2", text: "Why I find it interesting" },
    { type: "p", text: "If the root is a feeling, then the fix is to make starting feel smaller. One simple approach is to commit to just the first few minutes of a task, since the hardest part is often beginning." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[Why wait? The science behind procrastination](https://www.psychologicalscience.org/observer/why-wait-the-science-behind-procrastination) from the Association for Psychological Science",
        "[Procrastination](https://en.wikipedia.org/wiki/Procrastination) on Wikipedia",
      ],
    },
  ],
}

export default issue
