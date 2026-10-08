import type { TILEntry } from "../index"

const _git_colour_off_in_pipes: TILEntry = {
    id: "git-colour-off-in-pipes",
    title: "git turns colour off when its output goes to a pipe",
    date: "2026-10-05",
    category: "Git",
    published: true,
    body: "Since Git 1.8.4 [`color.ui`](https://git-scm.com/docs/git-config) defaults to `auto`, which means colour only when the output is written to a terminal. Pipe `git log` into `grep` or redirect it to a file and the escape codes vanish, which is why the same command suddenly looks plain. Git's own pager is the exception because `color.pager` defaults to true. Add `--color=always` when the next program understands ANSI codes, such as `less -R`. Most other tools follow the same rule by checking whether stdout is a terminal, so `ls` and `grep` drop their colour in a pipe for the same reason.",
    detail: [
      {
        type: "code",
        lang: "bash",
        code: `git log --oneline | head            # plain: stdout is a pipe
git log --oneline --color=always | less -R
git -c color.ui=never diff > change.patch   # never colour a file you will apply later`,
        caption: "auto colours a terminal, always colours everything and never colours nothing",
      },
      {
        type: "note",
        text: "Forcing colour into a file you plan to feed back into Git, such as a patch, breaks it. Keep `always` for output a human reads.",
      },
    ],
    tags: ["git", "terminal", "tooling"],
    source: { label: "git-config documentation: color.ui", url: "https://git-scm.com/docs/git-config" },
    series: "Git in practice",
    seriesPart: 1,
  }

export default _git_colour_off_in_pipes
