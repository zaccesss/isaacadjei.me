import type { BlogPost } from "../index"

const _bootstrap_any_machine_one_command: BlogPost = {
  slug: "bootstrap-any-machine-one-command",
  title: "One Command to Set Up Any Machine: Bootstrapping macOS, Linux and Windows",
  date: "2026-10-01",
  type: "blog",
  cover_image: "/images/blog/covers/bootstrap-any-machine-one-command.webp",
  description:
    "How I turned three machines and a pile of setup notes into three public bootstrap repositories that set up macOS, Ubuntu (WSL2 included) and Windows 11 in one command, safely and repeatably.",
  tags: ["Tools", "Setup", "Dotfiles", "Linux", "Productivity"],
  projectSlug: "dev-environment",
  published: true,
  content: [
    {
      type: "p",
      text: "I work across three machines: a Mac that runs Linux virtual machines through [OrbStack](https://orbstack.dev), a Lenovo laptop that dual boots Windows and Ubuntu and [WSL2](https://learn.microsoft.com/en-us/windows/wsl/about) on the Windows side. For a long time each one was set up by hand from a notes file that was always slightly out of date. Every new install cost me an evening and every machine drifted a little further from the others. This post is about how I replaced that notes file with three bootstrap repositories and what I learned about writing setup scripts that are safe to run more than once.",
    },
    {
      type: "h2",
      text: "The goal: one command and no surprises",
    },
    {
      type: "p",
      text: "The rule I set was simple. On a brand new machine one command should produce a complete development setup. On a machine that is already set up the same command should finish in seconds, change nothing and never ask for a password. That second half matters more than it sounds. A script you are scared to re-run is a script you stop using, so the bootstrap drifts out of date just like the notes file did.",
    },
    {
      type: "table",
      headers: ["Platform", "Repository", "Entry point"],
      rows: [
        ["macOS", "[mac-bootstrap](https://github.com/zaccesss/mac-bootstrap)", "bootstrap/bootstrap.sh"],
        ["Ubuntu 24.04 and 26.04, ARM64 and x86_64, WSL2 and VMs", "[linux-bootstrap](https://github.com/zaccesss/linux-bootstrap)", "bootstrap/bootstrap.sh"],
        ["Windows 11", "[windows-bootstrap](https://github.com/zaccesss/windows-bootstrap)", "bootstrap\\bootstrap.ps1"],
      ],
      caption: "Three repositories, one shape. All three pull from the same public dotfiles and config repositories.",
    },
    {
      type: "h2",
      text: "Stages that check before they act",
    },
    {
      type: "p",
      text: "Each bootstrap runs a fixed list of stages in order. On the Mac they are the Xcode command line tools, [Homebrew](https://brew.sh), the dotfiles, the config repositories, the Brewfile, the toolchains and finally the macOS settings. The important design choice is that every stage looks first and only acts where something is missing. If `brew bundle check` says nothing is missing, the Brewfile stage ends without touching anything. If the Xcode tools are already there, Apple's installer never opens.",
    },
    {
      type: "diagram",
      code: "flowchart LR\n  A[Run bootstrap] --> B{Stage already satisfied?}\n  B -- yes --> C[Log and skip]\n  B -- no --> D[Back up anything in the way]\n  D --> E[Install or link]\n  E --> F[Record progress]\n  C --> G[Next stage]\n  F --> G",
      caption: "Every stage follows the same check, back up, act and record loop.",
    },
    {
      type: "p",
      text: "Three habits came out of this. First, never delete: an existing `~/.zshrc` is moved into a backups folder under `~/.local/state` before a link replaces it. Second, never upgrade silently: apps that are already installed stay at their version, because an upgrade should be a decision rather than a side effect. Third, write progress down. A small log of finished stages makes it obvious where a run stopped if the Wi-Fi drops halfway through.",
    },
    {
      type: "h3",
      text: "Link configs instead of copying them",
    },
    {
      type: "p",
      text: "The tool configs ([tmux](https://github.com/zaccesss/tmux-config), [Neovim](https://github.com/zaccesss/neovim-config), [VS Code](https://github.com/zaccesss/vscode-config), lazygit, ripgrep, fzf and the [Git hooks](https://github.com/zaccesss/git-hooks)) live in their own public repositories. The bootstrap clones them into `~/.dotfiles` and symlinks each file into place. Editing a file in the repository changes the live machine straight away, so there is never a question of which copy is the real one. The exceptions are `~/.gitconfig` and `~/.ssh/config`. Those hold a name, an email address, keys and hosts, so they are copied once as a starting point and then left alone.",
    },
    {
      type: "code",
      lang: "bash",
      text: `# a new Mac
xcode-select --install
git clone https://github.com/zaccesss/mac-bootstrap.git
./mac-bootstrap/bootstrap/bootstrap.sh

# a fresh Ubuntu install or WSL2
sudo apt update && sudo apt install -y git
git clone https://github.com/zaccesss/linux-bootstrap.git
./linux-bootstrap/bootstrap/bootstrap.sh --with configs`,
    },
    {
      type: "h2",
      text: "Platform differences I did not expect",
    },
    {
      type: "p",
      text: "A new Mac still ships with bash 3.2, so the macOS script cannot rely on newer features such as associative arrays or `mapfile`. I write it in that old dialect on purpose and run the tests on the same stock bash, so anything newer fails in a test rather than on a fresh Mac. Linux was the opposite problem: one script has to cope with a desktop, a server, a container and WSL2. It detects where it is running and adjusts. WSL gets systemd switched on, a desktop VM gets guest integration and desktop apps are skipped when there is no desktop to run them.",
    },
    {
      type: "p",
      text: "Windows needed a separate PowerShell script rather than a port of the shell one. It installs everything in a [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/) package list, points the PowerShell 7 profile at the dotfiles, links the configs and installs WSL2 with Ubuntu ready for the Linux bootstrap. It also has a `-Plan` switch that prints what would happen without doing it. I would add a dry run mode to any setup script from day one now, because it turns a risky first run into something you can read.",
    },
    {
      type: "callout",
      tone: "warning",
      text: "The Windows bootstrap is honest about its status: it is tested on a Windows runner in CI and in plan mode but has not yet done a full end to end run on a real PC. A setup script deserves the same caution as any other code that changes a machine you care about.",
    },
    {
      type: "h2",
      text: "Testing a script that changes a whole machine",
    },
    {
      type: "p",
      text: "You cannot run a full bootstrap on every pull request, so the tests replace every command that would change the machine with a stub. The stub records that it was called and with which arguments. The tests then check behaviour rather than side effects: a second run calls no installer, an existing file gets backed up before it is replaced and a missing tool is reported by name. On Linux there is also a CI job that resolves every package on both supported Ubuntu releases and both architectures inside containers, so a renamed package fails in CI rather than on a fresh laptop.",
    },
    {
      type: "p",
      text: "That CI job taught me a lesson of its own. One afternoon the x86_64 package jobs started hanging while the ARM64 ones passed. Inside the containers the main Ubuntu mirrors were timing out from GitHub's x86_64 runners, while ARM64 uses a different mirror and was unaffected. The fix was to point those containers at the mirror the runners themselves use, give apt a short network timeout and cap each job's run time so a stall fails fast instead of eating minutes for hours.",
    },
    {
      type: "h2",
      text: "Settings are configuration too",
    },
    {
      type: "p",
      text: "The last stage applies operating system settings: a captured list of macOS preferences on the Mac, GNOME preferences on an Ubuntu desktop and a set of Windows settings. These live in a separate [system-defaults](https://github.com/zaccesss/system-defaults) repository. A capture command records the settings from a machine I am happy with and the apply step writes only the values that differ. That means my accessibility settings, such as the high contrast [terminal palette](https://github.com/zaccesss/terminal-config), follow me to every new machine without me having to remember them.",
    },
    {
      type: "clip",
      src: "/videos/projects/dev-environment/shell.mp4",
      poster: "/videos/projects/dev-environment/shell.webp",
      alt: "A new zsh session prints the welcome banner, cmds shows the colour-coded command reference grouped into navigation, Git, repos and system, then gs and glog show the repository status and recent history",
      caption: "What a freshly bootstrapped shell looks like: the welcome banner, the cmds reference and the short Git aliases.",
    },
    {
      type: "h2",
      text: "What I would tell someone starting their own",
    },
    {
      type: "ol",
      items: [
        "Start with the list of what you install, not the script. A Brewfile or winget JSON file is already half a bootstrap.",
        "Make every step check first. Idempotence is what makes a script worth keeping.",
        "Back up before you replace anything and never delete.",
        "Add a dry run mode before you add a second feature.",
        "Keep secrets out completely. The bootstrap signs in to GitHub through the browser and creates no keys, so nothing sensitive ever sits in the repository.",
        "Fork-friendly beats clever. Every repository reads a GitHub user from an environment variable, so anyone can point the scripts at their own forks.",
      ],
    },
    {
      type: "p",
      text: "The bootstraps are not finished and never will be. What changed is that a new machine is now a coffee break rather than an evening and a reinstall no longer worries me. That is worth more to me than any single tool on the list. The wider setup, from the shell to the editor configs, is written up on the [development environment project page](/projects/dev-environment).",
    },
    {
      type: "h2",
      text: "Further reading",
    },
    {
      type: "ol-links",
      items: [
        { text: "mac-bootstrap on GitHub", url: "https://github.com/zaccesss/mac-bootstrap" },
        { text: "linux-bootstrap on GitHub", url: "https://github.com/zaccesss/linux-bootstrap" },
        { text: "windows-bootstrap on GitHub", url: "https://github.com/zaccesss/windows-bootstrap" },
        { text: "dotfiles on GitHub: the shared shell setup all three pull from", url: "https://github.com/zaccesss/dotfiles" },
        { text: "Homebrew documentation: Brew Bundle and the Brewfile", url: "https://docs.brew.sh/Brew-Bundle-and-Brewfile" },
        { text: "Microsoft Learn: the winget package manager", url: "https://learn.microsoft.com/en-us/windows/package-manager/winget/" },
        { text: "Microsoft Learn: installing WSL", url: "https://learn.microsoft.com/en-us/windows/wsl/install" },
      ],
    },
  ],
}

export default _bootstrap_any_machine_one_command
