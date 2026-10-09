import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "outside",
  number: 11,
  slug: "outside-11-python-3-15",
  title: "Python 3.15 brings lazy imports and UTF-8 by default",
  subtitle: "The final release is scheduled for today after a third release candidate last week.",
  tags: ["Python", "Developer Tools", "Open Source"],
  date: "2026-10-09",
  published: true,
  intro: [
    { type: "p", text: "Python 3.15.0 is scheduled for release on 9 October 2026. The third release candidate, 3.15.0rc3, came out on 2 October. The core team has said there will be no ABI changes from the release candidates onwards, so binary wheels built against them will keep working." },
    { type: "p", text: "It is a substantial release. The highlights include:" },
    {
      type: "ul",
      items: [
        "explicit lazy imports for faster start-up (PEP 810)",
        "new frozendict and sentinel built-in types (PEP 814 and PEP 661)",
        "UTF-8 as the default encoding (PEP 686)",
        "Tachyon, a high-frequency statistical sampling profiler (PEP 799)",
        "a significantly upgraded experimental JIT compiler plus frame pointers enabled by default",
      ],
    },
    { type: "h2", text: "Why it matters to engineers" },
    { type: "p", text: "UTF-8 by default removes a long-standing trap. Until now, opening a text file without naming an encoding could behave differently from one machine to the next, so a script that worked on a Mac or Linux box could fail on Windows. Lazy imports matter for command-line tools and short scripts, where loading every module up front can take longer than the actual work." },
    { type: "p", text: "Python sits behind a lot of what I build, from FastAPI backends to data scripts that turn sensor readings into charts. A sampling profiler in the standard library is the change I expect to use most, because it shows where a slow script spends its time without having to change the code first." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[Python 3.15.0rc3 release notes](https://www.python.org/downloads/release/python-3150rc3/)",
        "[PEP 790: Python 3.15 release schedule](https://peps.python.org/pep-0790/)",
      ],
    },
  ],
}

export default issue
