import type { Project } from "../index"

const _dev_environment: Project = {
    id: "dev-environment",
    title: "Developer Environment: Dotfiles, Configs and Bootstrap",
    description:
      "A family of public repositories that rebuilds my whole development setup on macOS, Windows, Ubuntu and WSL2 with one command: shell profiles, terminal, tmux, Neovim, editor and Git configs, safety hooks and one high contrast palette.",
    longDescription:
      "This started as a single dotfiles repository and grew into a small system. The dotfiles hold the shell profiles for zsh on macOS, bash on Linux and WSL2 and PowerShell 7 on Windows, split into numbered topic files so the same short commands behave the same way on every machine. Around them sit focused config repositories for the terminal, tmux, Neovim, Git, SSH, the command line tools, VS Code, JetBrains IDEs, Raycast, Rectangle and the operating system's own settings.\n\nThree bootstrap repositories tie it together. Each one takes a fresh Mac, Windows 11 PC or Ubuntu install, signs in to GitHub, clones the dotfiles and configs, links them into place and applies the captured system settings. Running it again on a machine that is already set up changes nothing and only acts where something is missing.\n\nAccessibility runs through all of it. One high contrast palette file builds the theme for every terminal on every platform, at 7:1 or better in light mode, with bold text that keeps its colour rather than switching to a softer bright shade. Accessibility is a practical need for me rather than polish, so these choices are written down in each repository and a shared accessibility statement links them.",
    technologies: [
      "Zsh",
      "Bash",
      "PowerShell",
      "Starship",
      "tmux",
      "Neovim",
      "Lua",
      "Git",
      "Homebrew",
      "winget",
      "WSL2",
      "OrbStack",
      "Python",
      "GitHub Actions",
      "ShellCheck",
    ],
    category: "software",
    featured: false,
    images: [
      "/images/projects/dev-environment/shell.webp",
      "/images/projects/dev-environment/tmux.webp",
      "/images/projects/dev-environment/hooks.webp",
      "/images/projects/dotfiles/cmds.webp",
      "/images/projects/dotfiles/banner.webp",
      "/videos/projects/dev-environment/shell-palette.webp",
      "/videos/projects/dev-environment/tmux-palette.webp",
      "/images/projects/dev-environment/tmux-light.webp",
      "/videos/projects/dev-environment/neovim.webp",
      "/videos/projects/dev-environment/lazygit.webp",
      "/videos/projects/dev-environment/fzf.webp",
      "/videos/projects/dev-environment/hooks-palette.webp",
      "/videos/projects/dev-environment/linux.webp",
    ],
    github: "https://github.com/zaccesss/dotfiles",
    date: "2026",
    highlights: [
      "One-command bootstraps for macOS, Windows 11 and Ubuntu 24.04 and 26.04 (desktop, server, VM and WSL2) that are safe to re-run",
      "Shell profiles split into numbered topic files with identical alias names in zsh, bash and PowerShell 7",
      "One high contrast palette file builds every terminal theme, holding light mode at 7:1 or better and failing CI if a colour drops below its floor",
      "Global Git hooks block likely secrets, large files, .env files and force pushes to main before they leave the machine",
      "System settings captured from a configured Mac or PC and replayed on the next one, writing only values that differ",
      "Used daily on a MacBook with OrbStack and a Lenovo laptop dual booting Windows and Ubuntu, with WSL2 on Windows",
    ],
    cover: "/images/projects/dev-environment/cover.webp",
    order: 8,
    status: "live",
    links: [
      { label: "mac-bootstrap", url: "https://github.com/zaccesss/mac-bootstrap" },
      { label: "windows-bootstrap", url: "https://github.com/zaccesss/windows-bootstrap" },
      { label: "linux-bootstrap", url: "https://github.com/zaccesss/linux-bootstrap" },
      { label: "terminal-config", url: "https://github.com/zaccesss/terminal-config" },
      { label: "tmux-config", url: "https://github.com/zaccesss/tmux-config" },
      { label: "neovim-config", url: "https://github.com/zaccesss/neovim-config" },
      { label: "git-hooks", url: "https://github.com/zaccesss/git-hooks" },
      { label: "git-config", url: "https://github.com/zaccesss/git-config" },
      { label: "ssh-config", url: "https://github.com/zaccesss/ssh-config" },
      { label: "cli-tools-config", url: "https://github.com/zaccesss/cli-tools-config" },
      { label: "system-defaults", url: "https://github.com/zaccesss/system-defaults" },
      { label: "vscode-config", url: "https://github.com/zaccesss/vscode-config" },
      { label: "jetbrains-config", url: "https://github.com/zaccesss/jetbrains-config" },
      { label: "raycast-config", url: "https://github.com/zaccesss/raycast-config" },
      { label: "rectangle-config", url: "https://github.com/zaccesss/rectangle-config" },
      { label: "email-setup-kit", url: "https://github.com/zaccesss/email-setup-kit" },
      { label: "Accessibility statement", url: "https://github.com/zaccesss/accessibility" },
    ],
    sections: [
      { type: "h2", text: "Why it exists" },
      {
        type: "p",
        text: "I work across several machines: a MacBook with OrbStack for Linux containers and VMs, a Lenovo laptop that dual boots Windows and Ubuntu and WSL2 inside Windows. Every time I switched, the commands changed. Copying to the clipboard is pbcopy on macOS, xclip on Linux and Set-Clipboard on Windows. Small differences like that add up across a day. A new or rebuilt machine also used to cost me a weekend of reinstalling and remembering settings.",
      },
      {
        type: "p",
        text: "The goal is the same muscle memory everywhere and a rebuild that is one command. The implementation differs per platform. The name of every command never does.",
      },
      { type: "h2", text: "How the repositories fit together" },
      {
        type: "diagram",
        code: `flowchart TD
    Mac["mac-bootstrap"] --> Dot["dotfiles<br/>zsh, bash, PowerShell 7<br/>Starship prompt"]
    Win["windows-bootstrap"] --> Dot
    Lin["linux-bootstrap"] --> Dot
    Mac -- "OrbStack Ubuntu VM" --> Lin
    Win -- "WSL2 Ubuntu" --> Lin
    Mac --> Cfg["Config repositories<br/>tmux, Neovim, CLI tools,<br/>VS Code, JetBrains, Git, SSH"]
    Win --> Cfg
    Lin --> Cfg
    Pal["terminal-config<br/>one palette file"] -- "build-themes.py" --> Themes["Terminal.app, iTerm2, Windows Terminal,<br/>Ptyxis, GNOME Terminal, Alacritty,<br/>Kitty and Hyper themes"]
    Mac --> Pal
    Win --> Pal
    Mac --> Sys["system-defaults<br/>captured OS settings"]
    Win --> Sys
    Cfg --> Hooks["git-hooks<br/>core.hooksPath on every repo"]
    A11y["accessibility<br/>shared statement"] -.-> Dot
    A11y -.-> Pal`,
        caption: "Each bootstrap installs the dotfiles and configs. One palette builds every terminal theme and the hooks guard every repository",
      },
      {
        type: "table",
        headers: ["Layer", "Repositories", "What they provide"],
        rows: [
          ["Bootstrap", "mac-bootstrap, windows-bootstrap, linux-bootstrap", "Package installs from a Brewfile or winget list, toolchains, cloning and linking every config, settings and optional extras"],
          ["Shell", "dotfiles", "Profiles split into numbered topic files, identical aliases, the Starship prompt and a colour-coded command reference"],
          ["Terminal", "terminal-config, tmux-config", "The High Contrast palette for eight terminals and tmux with vi-style copy mode and session restore"],
          ["Editors", "neovim-config, vscode-config, jetbrains-config", "Neovim in Lua with LSP through Mason, VS Code settings and extensions, JetBrains plugin lists and keymaps"],
          ["Git and SSH", "git-config, git-hooks, ssh-config", "SSH commit signing, global safety hooks and per-host key selection"],
          ["Desktop", "system-defaults, raycast-config, rectangle-config", "Captured OS settings, launcher hotkeys and window shortcuts"],
          ["Tools", "cli-tools-config", "ripgrep, fzf, lazygit and zoxide defaults with the same theme"],
          ["Mail", "email-setup-kit", "Custom domain email with SPF, DKIM, DMARC, filters and accessible signatures"],
        ],
        caption: "The public repositories and their jobs",
      },
      {
        type: "p",
        text: "The configs are cloned into one folder and linked into place, so editing a file in a repository applies straight away. The Git and SSH configs are copied once instead, because they hold a person's own name, keys and hosts. Anyone can fork the set and point the bootstrap at their own GitHub account.",
      },
      { type: "h2", text: "The shell" },
      {
        type: "p",
        text: "Each platform's profile is a short loader that sources every numbered topic file in order: PATH, colours, navigation, Git, SSH, networking, Docker, Kubernetes, cloud tools and a file per language toolchain, with the Starship prompt last so it sees everything before it. The order matters. The colour file defines the variables the welcome banner and the cmds reference use. nvm is lazy-loaded through stub functions that replace themselves on first use, so the cost of loading it is paid once per session rather than on every new tab.",
      },
      {
        type: "clip",
        src: "/videos/projects/dev-environment/shell.mp4",
        poster: "/videos/projects/dev-environment/shell.webp",
        alt: "A new zsh session prints the welcome banner, cmds shows the colour-coded command reference grouped into navigation, Git, repos and system, then gs and glog show the repository status and recent history",
        caption: "The welcome banner, the cmds reference and the short Git aliases",
      },
      {
        type: "clip",
        src: "/videos/projects/dev-environment/shell-palette.mp4",
        poster: "/videos/projects/dev-environment/shell-palette.webp",
        alt: "A zsh session prints the welcome banner, then cmds shows the colour-coded command reference grouped into navigation, Git, repos and system",
        caption: "The banner and the cmds reference in the current palette",
      },
      { type: "h2", text: "One palette for every terminal" },
      {
        type: "p",
        text: "All the colours live in one JSON file. A Python script writes the theme for every terminal from it and also regenerates the colour table in the guide, so the documentation can never drift from the real values. CI fails when a generated file is out of date or a colour drops below its contrast floor.",
      },
      {
        type: "ul",
        items: [
          "Dark mode uses vivid, saturated colours on pure black, because saturated colours are easier to tell apart at a glance",
          "Light mode keeps the same hues and darkens each one only as far as it needs to reach 7:1 on white",
          "Bold text keeps its colour instead of switching to the bright row, which is the softer row in dark mode",
          "Text is near-white rather than pure white in dark mode to cut glare over long sessions",
          "Windows are fully opaque, since a see-through window lets whatever sits behind it lower the contrast",
          "Reduced motion, increased contrast and zoom stay under the operating system's own accessibility settings, which the scripts never override",
        ],
      },
      {
        type: "clip",
        src: "/videos/projects/dev-environment/tmux.mp4",
        poster: "/videos/projects/dev-environment/tmux.webp",
        alt: "A tmux session opens with three panes: the Git log of terminal-config, its README in Neovim and a new shell with the welcome banner, all in the high contrast palette",
        caption: "tmux with Neovim and the shell side by side in the same palette",
      },
      {
        type: "p",
        text: "The clips that follow show the same palette carried across every tool: the shell, tmux, Neovim, lazygit, fzf, the hooks and Linux, in dark mode with a light mode view of tmux. tmux tabs take a colour from their window name and the current tab is a solid reversed block, so the active tab never depends on colour alone.",
      },
      {
        type: "clip",
        src: "/videos/projects/dev-environment/tmux-palette.mp4",
        poster: "/videos/projects/dev-environment/tmux-palette.webp",
        alt: "tmux with four tabs coloured by name (editor cyan, git green, search yellow, shell magenta) and the editor window split into Neovim, a Git log, a ripgrep search and a diff summary, all in the high contrast palette",
        caption: "tmux with tabs coloured by window name and four panes in the same palette",
      },
      {
        type: "image",
        src: "/images/projects/dev-environment/tmux-light.webp",
        alt: "The same tmux layout in light mode: dark text on white, with the tab colours and the current tab's solid block darkened to stay readable",
        caption: "The same layout in light mode, with every colour held at 7:1 on white",
      },
      {
        type: "p",
        text: "Neovim uses a colour scheme written for this set that draws only with the terminal's own 16 colours, so it shows exactly the palette the terminal shows and switches with it. Meaning never rests on colour alone: selection, search matches and the mode block are reversed, keywords and errors are bold and diagnostics are underlined.",
      },
      {
        type: "clip",
        src: "/videos/projects/dev-environment/neovim.mp4",
        poster: "/videos/projects/dev-environment/neovim.webp",
        alt: "A Git log, ripgrep search and diff summary in the shell, then a Python file opened in Neovim with keywords in magenta, strings in green and functions in cyan, the status line at the bottom",
        caption: "The shell, then Neovim with its terminal palette colour scheme",
      },
      { type: "h2", text: "Command-line tools" },
      {
        type: "p",
        text: "lazygit, fzf and ripgrep are set up to use the terminal's own colour names rather than fixed themes, so they follow light and dark mode with nothing to keep in step. lazygit's selected line is reversed and its diffs use plain red and green with bold reversed highlights for the changed words.",
      },
      {
        type: "clip",
        src: "/videos/projects/dev-environment/lazygit.mp4",
        poster: "/videos/projects/dev-environment/lazygit.webp",
        alt: "lazygit with a modified README selected in the files panel, its diff on the right with the added line in green and the commit list below",
        caption: "lazygit following the terminal palette",
      },
      {
        type: "clip",
        src: "/videos/projects/dev-environment/fzf.mp4",
        poster: "/videos/projects/dev-environment/fzf.webp",
        alt: "fzf filtering the repository's files for the word theme, the matching letters highlighted and the top result reversed",
        caption: "fzf narrowing a file list as you type",
      },
      { type: "h2", text: "Hooks that guard every repository" },
      {
        type: "p",
        text: "The Git hooks are set globally through core.hooksPath, so they run whatever makes the commit: a terminal, an IDE or a script. pre-commit blocks known secret patterns such as cloud keys and access tokens, files of 50 MB or more not tracked by Git LFS and .env files. pre-push blocks a force push that would rewrite the history of main. Every block has a deliberate escape hatch for a confirmed false positive.",
      },
      {
        type: "clip",
        src: "/videos/projects/dev-environment/hooks.mp4",
        poster: "/videos/projects/dev-environment/hooks.webp",
        alt: "A file containing an example AWS access key ID is staged and committed. The pre-commit hook refuses the commit with an explanation",
        caption: "The pre-commit hook stopping an example access key",
      },
      {
        type: "clip",
        src: "/videos/projects/dev-environment/hooks-palette.mp4",
        poster: "/videos/projects/dev-environment/hooks-palette.webp",
        alt: "A file containing an example AWS access key ID is staged, then the commit is refused by the pre-commit hook with an explanation and the escape hatch for a false positive",
        caption: "The same hook in the current palette, with its escape hatch for a false positive",
      },
      {
        type: "callout",
        tone: "note",
        text: "macOS ships BSD sed while Linux and Git for Windows behave like GNU sed. That one flag difference is why each platform folder carries its own copy of the hooks rather than one script branching at runtime.",
      },
      { type: "h2", text: "Across platforms" },
      {
        type: "p",
        text: "linux-bootstrap detects where it runs and adjusts: WSL gets systemd switched on, a desktop VM gets guest integration and desktop-only apps are skipped on a server. It supports Ubuntu 24.04 and 26.04 on both ARM64 and x86_64, which covers the OrbStack VM on the Mac, the Ubuntu install on the Lenovo and WSL2. windows-bootstrap installs WSL2 Ubuntu and hands over to it. system-defaults defines preferences once, then applies them through macOS defaults, the Windows registry and GNOME gsettings where a real equivalent exists.",
      },
      {
        type: "clip",
        src: "/videos/projects/dev-environment/linux.mp4",
        poster: "/videos/projects/dev-environment/linux.webp",
        alt: "Ubuntu 26.04 in OrbStack on the Mac running the Linux profile in bash: the same welcome banner, the OS version, the numbered topic files and a Git log in the same palette",
        caption: "The same dotfiles on Ubuntu in OrbStack, running bash",
      },
      { type: "h2", text: "Keeping it consistent" },
      {
        type: "p",
        text: "With this many repositories, drift is the real risk. Scheduled automation keeps labels, mirrors and backups consistent across all of them. Every repository that changes how something looks or is operated carries its own ACCESSIBILITY.md written from its real settings, pointing back to the shared statement. The dotfiles also keep an engineering journal of the decisions behind them, from the split into topic files to the alias conflicts and the prompt.",
      },
    ],
    references: [
      { title: "tmux wiki", url: "https://github.com/tmux/tmux/wiki", note: "The terminal multiplexer behind the tmux config" },
      { title: "Neovim documentation", url: "https://neovim.io/doc/", note: "The editor configured in Lua" },
      { title: "Starship configuration", url: "https://starship.rs/config/", note: "The cross-shell prompt used on every platform" },
      { title: "Understanding WCAG 2.2: Contrast (Enhanced)", url: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html", note: "The 7:1 level the light palette is held to" },
    ],
  }

export default _dev_environment
