import type { BlogPost } from "../index"

const _git_hooks_that_saved_me: BlogPost = {
  slug: "git-hooks-that-saved-me",
  title: "Git Hooks That Have Saved Me: Secrets, Big Files and Force Pushes",
  date: "2026-10-24",
  updated: "2026-10-29",
  type: "blog",
  cover_image: "/images/blog/covers/git-hooks-that-saved-me.webp",
  description:
    "The three global Git hooks I run on every machine, what each one checks and the real mistakes they have stopped before they reached a remote.",
  tags: ["Git", "GitHub", "Security", "Tools", "Setup"],
  projectSlug: "dev-environment",
  published: true,
  content: [
    {
      type: "p",
      text: "Most of my worst Git moments have the same shape. Something goes into a commit that should never have been there, I push it and only then do I notice. A token in a config file. A 200 MB screen recording. A rebase pushed with --force onto main. Each one is easy to avoid once and hard to avoid every single time, which is exactly the kind of job a computer should do instead of me.",
    },
    {
      type: "p",
      text: "So I keep a small set of [Git hooks](https://github.com/zaccesss/dotfiles/tree/main/git/git-hooks) that run on every commit and every push, on every repository, on all three of my machines: a Mac, a Lenovo laptop dual booting Windows and Fedora and WSL2 on the Windows side. This post walks through what they check, why each check exists and how you can build the same safety net in an afternoon.",
    },
    {
      type: "h2",
      text: "Hooks in one paragraph",
    },
    {
      type: "p",
      text: "A [Git hook](https://git-scm.com/docs/githooks) is an executable script that Git runs at a fixed point in its workflow. A pre-commit hook runs before a commit is created and can refuse it by exiting with a non-zero status. A pre-push hook runs before anything leaves your machine and can refuse the push the same way. Hooks normally live in .git/hooks inside one repository, which is the problem: a new clone has none of them. The fix is one global setting.",
    },
    {
      type: "code",
      lang: "bash",
      text: `mkdir -p ~/.git-hooks
cp pre-commit pre-push commit-msg ~/.git-hooks/
chmod +x ~/.git-hooks/*
git config --global core.hooksPath ~/.git-hooks`,
    },
    {
      type: "p",
      text: "With [core.hooksPath](https://git-scm.com/docs/git-config#Documentation/git-config.txt-corehooksPath) set, every repository on the machine uses the same folder. It does not matter whether the commit comes from a terminal, VS Code or a JetBrains IDE: they all call Git, so they all hit the hooks.",
    },
    {
      type: "diagram",
      code: `flowchart LR
    A["git commit"] --> B{"pre-commit"}
    B -- "secret, big file or .env" --> X["Refused"]
    B -- "clean" --> C{"commit-msg"}
    C -- "subject over 72 characters" --> X
    C -- "clean" --> D["Commit created"]
    D --> E["git push"] --> F{"pre-push"}
    F -- "rewrites main" --> X
    F -- "fast-forward" --> G["Remote updated"]`,
      caption: "Where each hook sits between typing a command and changing a remote.",
    },
    {
      type: "h2",
      text: "Check one: secrets in the staged diff",
    },
    {
      type: "p",
      text: "The pre-commit hook reads the staged diff with git diff --cached and greps only the added lines for well-known token shapes. AWS access keys start with AKIA followed by 16 upper-case characters. GitHub tokens start with ghp_, gho_ and friends. Private keys begin with a BEGIN PRIVATE KEY header. Database URLs with a password embedded between the colon and the @ are another favourite. Each pattern is one line.",
    },
    {
      type: "code",
      lang: "bash",
      text: `diff_content=$(git diff --cached -U0)

check_pattern() {
    if echo "$diff_content" | grep -Eq "^\\+.*$1"; then
        echo "Error: possible $2 in staged changes."
        secret_hit=1
    fi
}

check_pattern 'AKIA[0-9A-Z]{16}' "AWS access key ID"
check_pattern 'gh[pousr]_[A-Za-z0-9]{36,}' "GitHub token"
check_pattern '-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----' "private key header"`,
    },
    {
      type: "p",
      text: "The first time it fired for real I was testing a demo folder with a file called config.env. I had assumed my .env check would catch it, but that check only matches names like .env or .env.local, not config.env. The secret pattern caught the key instead. Two overlapping checks covered a gap I did not know I had, which is the whole argument for defence in depth.",
    },
    {
      type: "clip",
      src: "/videos/projects/dev-environment/hooks-zacess.mp4",
      poster: "/videos/projects/dev-environment/hooks-zacess.webp",
      alt: "A config file holding an example AWS access key ID is staged and committed. The pre-commit hook refuses the commit with an explanation and the escape hatch for a false positive",
      caption: "The pre-commit hook refusing a commit that contains an example access key.",
    },
    {
      type: "callout",
      tone: "warning",
      text: "A hook only sees what you stage. It is not a replacement for a proper scanner such as [gitleaks](https://github.com/gitleaks/gitleaks) running in CI, which has a far larger and maintained rule set. The hook catches the mistake before it exists in history at all. The CI scan catches whatever the hook missed.",
    },
    {
      type: "h2",
      text: "Check two: big files without Git LFS",
    },
    {
      type: "p",
      text: "[GitHub refuses any single file over 100 MB](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github) and starts warning at 50 MB. Worse, once a large binary is committed it lives in every clone forever unless you rewrite history. My hook checks the size of every staged file. Over 10 MB it prints a warning. At 50 MB or more it blocks the commit unless the file matches a pattern in .gitattributes that sends it through [Git LFS](https://git-lfs.com).",
    },
    {
      type: "table",
      headers: ["Size", "What the hook does", "Why"],
      rows: [
        ["Under 10 MB", "Nothing", "Normal source files and small images"],
        ["10 MB to 50 MB", "Warns", "Probably fine once, a smell if it keeps happening"],
        ["50 MB or more", "Blocks unless tracked by LFS", "GitHub warns at 50 MB and history keeps it forever"],
      ],
    },
    {
      type: "p",
      text: "This one has saved me most often with demo recordings. A raw screen capture of a product demo is easily a few hundred megabytes. The hook stops the commit, I compress the clip or track it with git lfs track and nobody else has to download it twice.",
    },
    {
      type: "p",
      text: "One cross-platform detail caught me out. Reading a file size uses stat. macOS ships BSD stat (stat -f%z) while Linux and Git for Windows ship GNU stat (stat -c%s). The same is true of sed -i. Rather than branch on the operating system at runtime, I keep a mac copy and a linux copy of the hook. Windows uses the linux copy, because [Git for Windows](https://gitforwindows.org) runs hooks through its bundled [MSYS2](https://www.msys2.org) shell.",
    },
    {
      type: "h2",
      text: "Check three: force pushes that rewrite main",
    },
    {
      type: "p",
      text: "Force pushing a feature branch after a rebase is normal. Force pushing main is how teammates lose work. The pre-push hook receives one line per ref on standard input: local ref, local SHA, remote ref and remote SHA. A push is a rewrite exactly when the remote SHA is not an ancestor of the local SHA. Git can answer that question directly with [`git merge-base --is-ancestor`](https://git-scm.com/docs/git-merge-base).",
    },
    {
      type: "code",
      lang: "bash",
      text: `ref_input=$(cat)

echo "$ref_input" | while read -r local_ref local_sha remote_ref remote_sha; do
    case "$remote_ref" in
        refs/heads/main|refs/heads/master) ;;
        *) continue ;;
    esac
    if ! git merge-base --is-ancestor "$remote_sha" "$local_sha"; then
        echo "Error: this push rewrites the history of $remote_ref."
        exit 1
    fi
done || exit 1`,
    },
    {
      type: "p",
      text: "Two edge cases matter. A brand new branch has a remote SHA of all zeros and a deleted branch has a local SHA of all zeros, so the full hook skips both. The other trap is standard input itself. Git LFS has its own pre-push hook that also needs to read that list of refs. If my loop reads standard input directly, there is nothing left for LFS and large file uploads silently fail. Capturing it once into a variable and passing it on afterwards fixed that.",
    },
    {
      type: "h2",
      text: "Check four: commit messages people can read",
    },
    {
      type: "p",
      text: "The commit-msg hook is the least dramatic but the one I notice most. It blocks a subject line over 72 characters, because that is roughly where git log --oneline and GitHub's commit list start truncating. It also replaces smart quotes and other punctuation that sneaks in when a message is pasted from a document. Small, but it keeps history tidy without me thinking about it.",
    },
    {
      type: "h2",
      text: "Escape hatches and honesty",
    },
    {
      type: "p",
      text: "Every hook can be skipped with --no-verify. That is deliberate. A false positive, such as a test fixture that looks like a key, should not stop work. The rule I hold myself to is that --no-verify is a decision I make after reading the diff, never a habit. If I find myself reaching for it often, the pattern is wrong and the hook needs fixing.",
    },
    {
      type: "quote",
      text: "Hooks do not make you careful. They make carelessness expensive at the cheapest possible moment.",
    },
    {
      type: "h2",
      text: "Building your own",
    },
    {
      type: "ol",
      items: [
        "Create a hooks folder in your home directory and point core.hooksPath at it.",
        "Start with one pre-commit check for the secret types you actually use, such as your cloud provider and GitHub.",
        "Add the large file guard and set the threshold below your host's limit.",
        "Add the pre-push ancestry check for main.",
        "Install Git LFS first if you use it, since its hooks must still run after yours.",
        "Test each hook by making the mistake on purpose in a throwaway repository.",
      ],
    },
    {
      type: "p",
      text: "That last step matters most. A hook you have never seen fire is a hook you are trusting on faith. Commit a fake key in a scratch repository, watch it get refused and only then rely on it. The hooks themselves are public in the [git-hooks folder of zaccesss/dotfiles](https://github.com/zaccesss/dotfiles/tree/main/git/git-hooks) and the rest of the setup is on the [development environment project page](/projects/dev-environment).",
    },
    {
      type: "h2",
      text: "Further reading",
    },
    {
      type: "ol-links",
      items: [
        { text: "git-hooks on GitHub: the hooks from this post", url: "https://github.com/zaccesss/dotfiles/tree/main/git/git-hooks" },
        { text: "Git documentation: githooks, every hook and its inputs", url: "https://git-scm.com/docs/githooks" },
        { text: "Pro Git: customising Git with hooks", url: "https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks" },
        { text: "Git documentation: git push, including --force-with-lease", url: "https://git-scm.com/docs/git-push" },
        { text: "gitleaks, a maintained secret scanner for CI", url: "https://github.com/gitleaks/gitleaks" },
        { text: "Git Large File Storage", url: "https://git-lfs.com" },
        { text: "GitHub Docs: about large files on GitHub", url: "https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github" },
      ],
    },
  ],
}

export default _git_hooks_that_saved_me
