import type { BlogPost } from "../index"

const _actionable_error_alerts: BlogPost = {
  slug: "actionable-error-alerts",
  title: "Making Error Alerts Actionable: Lessons from Sentry and Render",
  date: "2026-11-23",
  type: "report",
  cover_image: "/images/blog/covers/actionable-error-alerts-shot.webp",
  cover_image_dark: "/images/blog/covers/actionable-error-alerts-shot-dark.webp",
  cover_alt: "Vitafolio support ticket titled Adding a second email address, with a question, a support reply and an empty reply box",
  description:
    "One database outage produced three separate alerts from three tools. How I read them, what each one was really telling me and the changes that make the next alert say what to do.",
  tags: ["Web", "Tools", "Full-Stack", "SoftwareEngineering", "Security"],
  projectSlug: "vitafolio",
  published: true,
  content: [
    {
      type: "p",
      text: "On the evening of 6 October my phone lit up three times in a few minutes. An uptime monitor said [Vitafolio's](https://vitafolio.isaacadjei.me) health check was returning 502. [Sentry](https://sentry.io) opened a new issue about a refused database connection, then another about a hostname that would not resolve. [Render](https://render.com) reported that the service had exited with status 1 and was restarting. Three tools, three messages and one underlying cause: the free database plan had powered the database off for inactivity.",
    },
    {
      type: "p",
      text: "The site was back in about ninety minutes and the database has since moved to a host that stays on. That migration is [its own story](/blog/moving-a-production-database-to-tidb). This post is about the alerts, because that night showed me the difference between an alert that tells you something happened and one that tells you what to do.",
    },
    {
      type: "h2",
      text: "What each tool saw",
    },
    {
      type: "table",
      headers: ["Tool", "What it reported", "What it actually meant"],
      rows: [
        ["Uptime monitor", "GET /up returned 502", "Users cannot reach the site. Something is badly wrong, but not what"],
        ["Sentry, first issue", "SQLSTATE connection refused, raised from the /up health check", "The app is running but cannot talk to its database"],
        ["Sentry, second issue", "The database hostname does not resolve", "The database is not just slow. It is gone from DNS, so it is off or deleted"],
        ["Render", "Exited with status 1, then restarting", "The start-up script runs migrations, cannot reach the database and crashes in a loop"],
      ],
    },
    {
      type: "p",
      text: "Read in order, they tell a clear story. The second Sentry issue was the most useful by far. A refused connection could be a firewall, a full connection pool or a restart. A hostname that does not resolve points straight at the database host itself. Within a minute of reading it I was in the database provider's console, where the service showed as powered off.",
    },
    {
      type: "h2",
      text: "Why the health check mattered",
    },
    {
      type: "p",
      text: "In Vitafolio, [/up](https://laravel.com/framework/docs/13.x/deployment#health-route) answers 200 only when the app boots and the database answers a query. That is why the uptime monitor fired at all. A health check that does not touch your dependencies will cheerfully report healthy while every real page returns an error. A quick way to see what your own check really proves is to stop the database locally and call it.",
    },
    {
      type: "code",
      lang: "bash",
      text: `# with the database stopped, a useful health check should fail
curl -s -o /dev/null -w "%{http_code}\\n" http://localhost:8000/up
# 200 here means the check is not testing what users depend on`,
    },
    {
      type: "callout",
      tone: "warning",
      text: "A health check that touches the database is also a load you add on every probe. Keep the query trivial and the probe interval sensible. Mine runs every few minutes. Note that this did not keep the free database awake either: the host did not count it as activity.",
    },
    {
      type: "h2",
      text: "Four rules for alerts I now follow",
    },
    {
      type: "h3",
      text: "1. One cause should produce one page, not four",
    },
    {
      type: "p",
      text: "Three tools all shouting about the same outage is noise. The uptime monitor is the one that should wake me up, because it measures what users experience. Sentry and the host's logs are where I go to find out why. I now treat the uptime alert as the page and the others as evidence, so the message I act on is the one that matters most.",
    },
    {
      type: "h3",
      text: "2. Alert on a rate, not on every failure",
    },
    {
      type: "p",
      text: "A nightly batch task in the same app calls an external API dozens of times. At first a single refused request sent an error email, which meant a flaky night produced a dozen emails and I learned to ignore them. Now a failed call is retried twice after a short pause and one alert is raised only when more than a quarter of calls fail. The alert names which calls failed and why. It fires rarely and when it does it is worth reading.",
    },
    {
      type: "h3",
      text: "3. The alert should carry its own context",
    },
    {
      type: "p",
      text: "An alert is read on a phone, often half asleep. Sentry already [groups repeated errors into one issue](https://docs.sentry.io/product/issues/grouping-and-fingerprints/) and shows the stack trace, the request path and the exact error message. That is how the hostname error told me so much on its own. For scheduled work I include the job name and the count of failures in the message itself so I do not have to open a dashboard to know how bad it is.",
    },
    {
      type: "h3",
      text: "4. Never send personal data to the error tracker",
    },
    {
      type: "p",
      text: "Error trackers make it very easy to attach the signed-in user, request bodies and SQL bindings to every event. For a site that holds CVs that is exactly the wrong default. Vitafolio runs Sentry with [default personal data](https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii) and SQL bindings both switched off. On this portfolio Sentry runs on the server only, with tracing switched off, so nothing about visitors is collected at all.",
    },
    {
      type: "code",
      lang: "typescript",
      text: `// server-side only: errors, no tracing, no personal data
import * as Sentry from "@sentry/nextjs"

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0,
    sendDefaultPii: false,
  })
}`,
    },
    {
      type: "h2",
      text: "Turning an alert into work",
    },
    {
      type: "p",
      text: "The other half of actionable is what happens after the fix. An alert that disappears once the site is back up teaches nothing. My rule is that every real incident becomes a written issue with three parts: what happened with times, the cause and the permanent fix with a checklist. The quick fix that night was powering the database on and redeploying. The permanent fix was moving to a host whose free tier does not power off. Both were written down before I went to sleep.",
    },
    {
      type: "diagram",
      code: `flowchart LR
    A[Uptime alert] --> B[Read Sentry and host logs]
    B --> C[Quick fix: restore service]
    C --> D[Write the incident issue]
    D --> E[Permanent fix in its own PR]
    E --> F[Confirm on the live site, then close]`,
      caption: "From alert to closed issue",
    },
    {
      type: "h2",
      text: "What I would tell another student running a side project",
    },
    {
      type: "ul",
      items: [
        "Free tiers have rules that are not always obvious. Read what happens on inactivity before you put real users on one.",
        "Make the health check prove the things users depend on, not just that the process is alive.",
        "Give each tool one job: one to page you, one to explain the error, one to show the logs.",
        "If you have started ignoring an alert, it is broken. Fix the threshold or delete it.",
        "Confirm the fix on the live site before closing anything.",
        "Write the change up where users will see it. Vitafolio's fixes land in its [changelog](https://vitafolio.isaacadjei.me/changelog) and the wider build is on the [Vitafolio project page](/projects/vitafolio).",
      ],
    },
    {
      type: "h2",
      text: "Further reading",
    },
    {
      type: "ol-links",
      items: [
        { text: "Google SRE book: Monitoring Distributed Systems", url: "https://sre.google/sre-book/monitoring-distributed-systems/" },
        { text: "Sentry documentation: alerts", url: "https://docs.sentry.io/product/monitors-and-alerts/alerts/" },
        { text: "Render documentation: health checks", url: "https://render.com/docs/health-checks" },
        { text: "Better Stack documentation: uptime monitoring", url: "https://betterstack.com/docs/uptime/start/" },
        { text: "Sentry documentation: issue grouping", url: "https://docs.sentry.io/product/issues/grouping-and-fingerprints/" },
        { text: "Laravel documentation: the /up health route", url: "https://laravel.com/framework/docs/13.x/deployment#health-route" },
        { text: "Vitafolio documentation", url: "https://vitafolio.isaacadjei.me/docs" },
      ],
    },
  ],
}

export default _actionable_error_alerts
