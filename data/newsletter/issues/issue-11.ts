import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  number: 11,
  slug: "issue-11-choosing-hard-things",
  title: "Choosing hard things and one command for any machine",
  subtitle: "An essay on discomfort, starting competitive programming, bootstrapping macOS, Linux and Windows in one command and four small lessons.",
  tags: ["Personal", "Mindset", "Competitive Programming", "Setup", "Dotfiles", "Linux"],
  date: "2026-10-02",
  published: true,
  intro: [
    { type: "p", text: "Term has started and this fortnight's posts have a common thread: doing the hard version of something on purpose. One is an essay about that habit and the other two are what it looks like in practice." },
    { type: "h2", text: "What I wrote" },
    { type: "p", text: "[On Being Uncomfortable](/blog/on-being-uncomfortable) is a personal essay about choosing situations I am not yet equipped for. I came to the UK from Ghana with a General Arts background and chose the hardest entry route into engineering. The essay covers what deliberate discomfort looks like, why it works, the difference between discomfort and overwhelm and what it costs." },
    { type: "p", text: "[How I Started With Competitive Programming](/blog/competitive-programming-start) is the honest version: grinding LeetCode as exam practice without building intuition, then moving to regular Codeforces contests with Neetcode for structure. It also covers what competitive programming does not teach you and the beginner mistakes I made too." },
    { type: "p", text: "[One Command to Set Up Any Machine](/blog/bootstrap-any-machine-one-command) turns a pile of setup notes into three public bootstrap repositories for macOS, Ubuntu (WSL2 included) and Windows 11. The rule was one command on a new machine and a quick, silent no-op on one already set up. The post covers stages that check before they act, platform differences I did not expect and how to test a script that changes a whole machine." },
    { type: "h2", text: "Small things I learned" },
    {
      type: "ul",
      items: [
        "[apt's Acquire::Retries](/til/apt-acquire-retries) has retried failed downloads three times by default since apt 2.3.2, though a busy CI mirror can still beat it.",
        "[Next.js parallel routes](/til/next-parallel-routes) render independent pages side by side in one layout.",
        "[Slow, hands-separate piano practice](/til/piano-learning-approach) is the quickest way to learn a hard passage.",
        "[A Unix pipe](/til/what-a-pipe-really-is) is a ring buffer inside the kernel, not a file or a socket.",
      ],
    },
  ],
}

export default issue
