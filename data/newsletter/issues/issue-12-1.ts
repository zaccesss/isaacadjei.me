import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  number: 12.1,
  slug: "issue-12-1-calibrated-alerts-and-a-new-paper",
  title: "Calibrated alerts, a database move and a new paper",
  subtitle: "The second of today's two issues: calibrating PHAEMOS alerts, moving a production database the night it went down, Ariane 5 and a fuller git-unlocked paper.",
  tags: ["PHAEMOS", "IoT", "Backend", "Research", "Git"],
  date: "2026-10-16",
  published: true,
  greeting: "Hello again,",
  skip: [
    "blog:building-zacess-a-reader-that-respects-the-file",
    "blog:sky-animol-screening-invite",
    "blog:one-palette-eight-terminals",
    "blog:accessibility-as-a-default-wcag-2-2",
    "note:how-i-organise-a-week",
    "note:reading-list-autumn-term",
    "til:wcag-aaa-contrast-7-to-1",
    "til:git-colour-off-in-pipes",
  ],
  intro: [
    { type: "p", text: "This is the second of today's two issues. The first fortnight on email was too much for one message, so [Issue 12](/newsletter/issue-12-welcome-to-the-newsletter) leads with Zacess and this one carries the engineering posts and some research news. From the next letter onwards it is back to one issue a fortnight." },
    { type: "h2", text: "New research: a fuller git-unlocked paper" },
    { type: "p", text: "I rewrote the [technical note behind git-unlocked](/respub/git-unlocked-2026) and published it as a new version on Zenodo. It is now a ten-page paper with a review of what research says about learning Git, the teaching principles behind the course, measured figures (182 files and about 79 hours of guided study) and 37 checked references. Every release of the course is now archived with its own DOI too. The research page lets you cite it in APA, Harvard, IEEE, MLA, Chicago, BibTeX or RIS." },
    { type: "h2", text: "What I wrote" },
    { type: "p", text: "[Moving a Production Database When the Free Host Shuts Down](/blog/moving-a-production-database-to-tidb) tells the story of Vitafolio going down one evening because its free MySQL plan powered the database off for inactivity. It covers reading the errors in order, moving every table to TiDB Cloud the same night and checking nothing was lost." },
    { type: "p", text: "From PHAEMOS there are two linked posts. [Calibrating Anomaly Scores](/blog/calibrating-anomaly-scores) explains how a one-line normalisation formula flagged every reading, including the training data. Calibrating against the model's own decision boundary is what fixed it. [Alerts That Do Not Cry Wolf](/blog/alerts-that-do-not-cry-wolf) then turns noisy scores into alerts worth trusting with a run of three, a clear rule for clearing and one ticket per fault." },
    { type: "p", text: "[Ariane 5 Flight 501](/blog/ariane-5-flight-501-overflow) walks through the inquiry into the 1996 launch that broke up about 40 seconds after lift-off because reused software squeezed a 64-bit value into a 16-bit integer. It ends with the lessons I apply in my own embedded code." },
    { type: "h2", text: "Small things I learned" },
    {
      type: "ul",
      items: [
        "[GitHub Actions jobs run for up to six hours](/til/github-actions-timeout-minutes) unless timeout-minutes says otherwise.",
        "[PostgreSQL now()](/til/postgres-now-transaction-time) returns the same time for a whole transaction.",
        "[IsolationForest's decision_function](/til/isolation-forest-offset) is score_samples minus offset_, which was the key to the calibration fix.",
        "[SQLAlchemy Identity() columns](/til/sqlalchemy-identity-not-null) default to NOT NULL to match PostgreSQL.",
      ],
    },
  ],
}

export default issue
