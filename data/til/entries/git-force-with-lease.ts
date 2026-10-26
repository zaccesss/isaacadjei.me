import type { TILEntry } from "../index"

const _git_force_with_lease: TILEntry = {
    id: "git-force-with-lease",
    title: "git push --force-with-lease refuses to overwrite work you have not seen",
    date: "2026-10-24",
    category: "Git",
    published: true,
    body: "[`--force-with-lease`](https://git-scm.com/docs/git-push#Documentation/git-push.txt---force-with-lease) only replaces the remote branch if it still points where your remote-tracking ref says it does, so a teammate's push since your last fetch makes the push fail instead of disappear. The catch is that a background `git fetch`, from an editor for example, updates that ref and quietly renews the lease. `--force-if-includes`, added in Git 2.30, closes the gap by also checking that the remote tip appears in your local branch's reflog, so the lease only holds when you have actually integrated what you fetched.",
    detail: [
      {
        type: "code",
        lang: "bash",
        code: `git fetch origin
git rebase origin/main
git push --force-with-lease --force-if-includes origin feature/tidy
# ! [rejected] feature/tidy -> feature/tidy (stale info)
# someone pushed to feature/tidy since the fetch: look before you overwrite`,
        caption: "The rejection is the point: it gives you a chance to fetch and rebase their work in",
      },
      {
        type: "code",
        lang: "bash",
        code: `git config --global alias.pushf "push --force-with-lease --force-if-includes"`,
        caption: "An alias so the safe version is also the short one",
      },
      {
        type: "note",
        text: "A plain `--force` is still the right tool very rarely, for example on a branch nobody else can push to. On a shared branch the lease is the difference between an error message and lost commits.",
      },
    ],
    tags: ["git", "collaboration", "workflow"],
    source: { label: "git-push documentation", url: "https://git-scm.com/docs/git-push" },
    series: "Git in practice",
    seriesPart: 2,
  }

export default _git_force_with_lease
