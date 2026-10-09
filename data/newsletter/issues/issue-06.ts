import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  number: 6,
  slug: "issue-06-interrupts-and-websockets",
  title: "Interrupts, WebSockets and choosing what to build",
  subtitle: "Non-blocking firmware, real-time data on the web, how I pick my next project and five lessons from git to PostgreSQL.",
  tags: ["Embedded", "Firmware", "WebSockets", "Full-Stack", "JavaScript", "C"],
  date: "2026-07-24",
  published: true,
  intro: [
    { type: "p", text: "Two posts this fortnight turned out to be the same idea from opposite ends: stop asking whether something has happened and get told when it does. One is about firmware and one is about the browser." },
    { type: "h2", text: "What I wrote" },
    { type: "p", text: "[Interrupt-Driven Design](/blog/interrupt-driven-embedded-design) explains why polling loops fall apart as soon as a microcontroller has two jobs. It covers what an interrupt really is, the volatile keyword, debouncing a button in an ISR, critical sections, what an ISR should never do, a UART receive buffer and interrupt priority and nesting on ARM Cortex-M." },
    { type: "p", text: "[Real-Time Data on the Web](/blog/real-time-web-data) compares long polling, Server-Sent Events and WebSockets on latency, connection overhead, firewall behaviour and how hard each is to build. It also covers SSE reconnection with event IDs, WebSocket heartbeats and what I use on this site, ending with a plain guide to which one to pick." },
    { type: "h2", text: "From the notebook" },
    { type: "p", text: "[How I decide what to build next](/notes/how-i-decide-what-to-build-next) lists the four questions every idea has to pass before it gets real hours. Will it teach me something reading cannot? Does it solve a problem I have? Is there a first version I could finish in a few weeks? Would I be happy to write about it? The ideas that survive usually sit where hardware and software meet." },
    { type: "h2", text: "Small things I learned" },
    {
      type: "ul",
      items: [
        "[git rebase --onto](/til/git-rebase-onto) moves a branch from one base to another, leaving the commits you do not want behind.",
        "[How Python runs](/til/python-how-it-runs): CPython compiles source to bytecode first. The .pyc files are that output.",
        "[Tracking progressive overload](/til/tracking-progressive-overload): logging every lift is the quickest way to see whether you are actually getting stronger.",
        "[Edge functions avoid cold starts](/til/edge-vs-serverless-cold-start) by running in lightweight V8 isolates instead of full containers.",
        "[EXPLAIN ANALYZE in PostgreSQL](/til/explain-analyze-postgres) shows what the planner expected next to what really ran, which is where slow queries give themselves away.",
      ],
    },
  ],
}

export default issue
