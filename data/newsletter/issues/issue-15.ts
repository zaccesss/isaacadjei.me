import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  number: 15,
  id: "issue-15-units-and-voltages",
  slug: "units-voltages-sign-in-and-a-lost-spacecraft",
  title: "Units, voltages, sign-in and a lost spacecraft",
  subtitle: "The Mars Climate Orbiter, USB-C Power Delivery, actionable alerts, demo clips as code, OAuth pitfalls, dual booting and how I revise and plan.",
  tags: ["Full-Stack", "Security", "Electronics", "Tools", "Setup", "Engineering"],
  date: "2026-11-27",
  published: true,
  intro: [
    { type: "p", text: "The end of term is in sight, so this fortnight has a little of everything: one story from space, one explainer on the charger in your bag and four posts from keeping Vitafolio and my own machines in good shape." },
    { type: "h2", text: "Two explainers" },
    { type: "p", text: "[The Mars Climate Orbiter](/blog/mars-climate-orbiter-unit-mismatch) was lost in 1999 because one program worked in pound-force seconds and another expected newton-seconds. The units error was only the trigger. The useful part is why several separate checks that should have caught it did not. [How USB-C Power Delivery Negotiates Its Voltage](/blog/how-usb-c-power-delivery-negotiates) explains why a charger gives you 5 V until something asks for more, from the resistors on the CC pins to the messages that agree a power contract and the mistakes that leave a homemade board without power." },
    { type: "h2", text: "From my own projects" },
    { type: "p", text: "[Making Error Alerts Actionable](/blog/actionable-error-alerts) goes back to the night Vitafolio's database went down, when three tools sent three separate alerts. It covers what each one saw, why the health check mattered and four rules that make the next alert say what to do. [Sign-In Pitfalls](/blog/oauth-sign-in-pitfalls-microsoft) is about the hard part of adding Google, GitHub and Microsoft sign-in: deciding when a provider's email can be trusted to join an existing account. With Microsoft the answer is never." },
    { type: "p", text: "[Recording Product Demos as Code](/blog/recording-product-demos-as-code) replaced hand-recorded screen captures with Playwright scripts, a seeded throwaway database and one command that rebuilds every clip in light and dark. [Dual Booting Fedora Beside Windows 11](/blog/dual-booting-windows-ubuntu-wsl2) is the record of putting Fedora KDE Plasma on my ThinkPad and Ubuntu in WSL2 on both Windows PCs, including the day BitLocker asked for its recovery key every time GRUB started Windows." },
    { type: "h2", text: "From the notebook" },
    { type: "p", text: "[How I revise for engineering modules](/notes/how-i-revise-for-engineering-modules) starts from one idea: familiar is not the same as able. That means problems every week from the start of term, past papers as the main event and working from a blank page. [The tools I plan with](/notes/the-tools-i-plan-with) gives every kind of information exactly one home: a calendar for time, Notion for plans and briefs, Obsidian for study notes, GitHub issues and Linear for project work and Zotero for papers." },
    { type: "h2", text: "Small things I learned" },
    {
      type: "ul",
      items: [
        "[LED brightness needs gamma correction](/til/led-pwm-gamma-correction) because half the PWM duty does not look half as bright.",
        "[DOCKER_CONFIG](/til/docker-config-env) points the Docker CLI at a different config folder.",
        "[docker builder prune](/til/docker-builder-prune) clears the build cache that image pruning leaves behind.",
        "[WSL2 runs a real Linux kernel](/til/wsl2-real-linux-kernel) inside a lightweight virtual machine.",
        "[Microsoft Graph's mail property can be null](/til/graph-mail-can-be-null), so sign-in code should fall back to userPrincipalName.",
        "[The OAuth state parameter](/til/oauth-state-login-csrf) is what stops login CSRF.",
      ],
    },
  ],
}

export default issue
