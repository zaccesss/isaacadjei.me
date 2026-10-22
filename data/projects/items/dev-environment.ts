import type { Project } from "../index"

const _dev_environment: Project = {
    id: "dev-environment",
    title: "Developer Environment: Dotfiles, Configs and Bootstrap",
    description:
      "A family of repositories that rebuilds my whole development setup on macOS, Windows 11, Fedora, Ubuntu and WSL2 with one command: shell profiles, terminal, tmux, every editor and IDE, Git configs, safety hooks, desktop settings and one high contrast palette.",
    longDescription:
      "This started as a single dotfiles repository and grew into a small system. The dotfiles hold the shell profiles for zsh on macOS, bash on Linux and WSL2 and PowerShell 7 on Windows, split into numbered topic files so the same short commands behave the same way on every machine. Around them sit focused config repositories for the terminal, tmux, Neovim, Git, SSH, the command line tools, VS Code, JetBrains IDEs, Eclipse, Zed, Raycast, Rectangle and the operating system's own settings, including a KDE Plasma desktop kept entirely as code.\n\nThree bootstrap repositories tie it together. Each one takes a fresh Mac, Windows 11 PC, Fedora or Ubuntu install, signs in to GitHub, clones the dotfiles and configs, links them into place and applies the captured system settings. Running it again on a machine that is already set up changes nothing and only acts where something is missing.\n\nAccessibility runs through all of it. One high contrast palette file builds the theme for every terminal on every platform, at 7:1 or better in light mode, with bold text that keeps its colour rather than switching to a softer bright shade. Accessibility is a practical need for me rather than polish, so these choices are written down in each repository and a shared accessibility statement links them.",
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
      "Fedora",
      "KDE Plasma",
      "Kitty",
      "VS Code",
      "JetBrains",
      "Eclipse",
      "Zed",
      "WakaTime",
      "GitHub Actions",
      "ShellCheck",
      "Pester",
    ],
    category: "software",
    featured: false,
    images: [
      "/videos/projects/dev-environment/shell-zacess.webp",
      "/videos/projects/dev-environment/tmux-zacess.webp",
      "/images/projects/dev-environment/themes/tmux-light.webp",
      "/images/projects/dev-environment/themes/tmux-yellow-on-black.webp",
      "/images/projects/dev-environment/themes/tmux-cream.webp",
      "/videos/projects/dev-environment/neovim-zacess.webp",
      "/videos/projects/dev-environment/lazygit-zacess.webp",
      "/videos/projects/dev-environment/fzf-zacess.webp",
      "/videos/projects/dev-environment/hooks-zacess.webp",
      "/videos/projects/dev-environment/linux-zacess.webp",
      "/images/projects/dev-environment/editors/vscode-deep-contrast-dark.webp",
      "/images/projects/dev-environment/editors/intellij-deep-contrast-light.webp",
      "/images/projects/dev-environment/editors/zed-deep-contrast-dark.webp",
      "/images/projects/dev-environment/editors/eclipse-deep-contrast-light.webp",
      "/images/projects/dev-environment/editors/xcode-deep-contrast-dark.webp",
      "/images/projects/dotfiles/cmds.webp",
      "/images/projects/dotfiles/banner.webp",
    ],
    github: "https://github.com/zaccesss/dotfiles",
    date: "2025",
    highlights: [
      "One-command bootstraps for macOS, Windows 11, Fedora and Ubuntu 24.04 and 26.04 (desktop, server, VM and WSL2) that are safe to re-run",
      "Shell profiles split into numbered topic files with identical alias names in zsh, bash and PowerShell 7",
      "One high contrast palette file builds every terminal theme, holding light mode at 7:1 or better and failing CI if a colour drops below its floor",
      "Global Git hooks block likely secrets, large files, .env files and force pushes to main before they leave the machine",
      "System settings captured from a configured Mac or PC and replayed on the next one, writing only values that differ",
      "One theme family in every editor and terminal: VS Code, JetBrains IDEs, Eclipse, Zed, Xcode, Neovim and eight terminals, switched together by a single command",
      "Coding time tracked in every editor and app with file names, branches and project folders kept private",
      "The same folder layout, commands, wallpapers, larger yellow pointer and screen, lock and sleep order on every machine",
      "Used daily on a MacBook with OrbStack, a ThinkPad dual booting Windows 11 and Fedora KDE with BitLocker kept on and a Windows gaming PC, with WSL2 on both PCs",
    ],
    cover: "/images/projects/dev-environment/cover.webp",
    order: 9,
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
      { label: "eclipse-config", url: "https://github.com/zaccesss/eclipse-config" },
      { label: "zed-config", url: "https://github.com/zaccesss/zed-config" },
      { label: "xcode-config", url: "https://github.com/zaccesss/xcode-config" },
      { label: "raycast-config", url: "https://github.com/zaccesss/raycast-config" },
      { label: "rectangle-config", url: "https://github.com/zaccesss/rectangle-config" },
      { label: "email-setup-kit", url: "https://github.com/zaccesss/email-setup-kit" },
      { label: "Accessibility statement", url: "https://github.com/zaccesss/accessibility" },
    ],
    sections: [
      { type: "h2", text: "Why it exists" },
      {
        type: "p",
        text: "I work across several machines: a MacBook with OrbStack for Linux containers and VMs, a ThinkPad that dual boots Windows 11 and Fedora KDE, a Windows gaming PC and WSL2 Ubuntu inside both PCs. Every time I switched, the commands changed. Copying to the clipboard is pbcopy on macOS, xclip on Linux and Set-Clipboard on Windows. Small differences like that add up across a day. A new or rebuilt machine also used to cost me a weekend of reinstalling and remembering settings.",
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
    Mac --> Cfg["Config repositories<br/>tmux, Neovim, CLI tools,<br/>VS Code, JetBrains, Eclipse,<br/>Zed, Git, SSH"]
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
          ["Editors", "neovim-config, vscode-config, jetbrains-config, eclipse-config, zed-config", "Neovim in Lua with LSP through Mason, VS Code settings and extensions, JetBrains plugin lists and keymaps, Eclipse preferences for Java and Zed settings, all on the same colour themes"],
          ["Git and SSH", "git-config, git-hooks, ssh-config", "SSH commit signing, global safety hooks and per-host key selection"],
          ["Desktop", "system-defaults, raycast-config, rectangle-config", "Captured macOS, Windows and KDE settings, launcher hotkeys and window shortcuts"],
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
        src: "/videos/projects/dev-environment/shell-zacess.mp4",
        poster: "/videos/projects/dev-environment/shell-zacess.webp",
        alt: "A new zsh session prints the welcome banner with a neutral machine name, cmds pages through the colour-coded command reference, then gs shows two modified files in red and glog shows the recent history of a demo project",
        caption: "The welcome banner, the cmds reference and the short Git aliases in Zacess Deep Contrast Dark",
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
        src: "/videos/projects/dev-environment/tmux-zacess.mp4",
        poster: "/videos/projects/dev-environment/tmux-zacess.webp",
        alt: "tmux with four tabs named editor, git, search and shell, the editor window split into Neovim, a Git log, a ripgrep search and a diff summary, the current tab a solid cyan block",
        caption: "tmux with tabs coloured by window name and four panes in Zacess Deep Contrast Dark",
      },
      {
        type: "p",
        text: "The clips that follow show the same palette carried across every tool: the shell, tmux, Neovim, lazygit, fzf, the hooks and Linux, in Zacess Deep Contrast Dark, then the same tmux layout in three more of the themes. tmux tabs take a colour from their window name and the current tab is a solid reversed block, so the active tab never depends on colour alone.",
      },
      {
        type: "image",
        src: "/images/projects/dev-environment/themes/tmux-light.webp",
        alt: "The same tmux layout in Zacess Deep Contrast Light: black text on white with deep colours and the current tab a solid navy block",
        caption: "Deep Contrast Light, with every colour held at 7:1 or more on white",
      },
      {
        type: "image",
        src: "/images/projects/dev-environment/themes/tmux-yellow-on-black.webp",
        alt: "The same tmux layout in Zacess Yellow on Black: yellow text on black with the tabs and syntax colours tuned for low vision",
        caption: "Yellow on Black, for low vision",
      },
      {
        type: "image",
        src: "/images/projects/dev-environment/themes/tmux-cream.webp",
        alt: "The same tmux layout in Zacess Cream: black text on a soft cream background",
        caption: "Cream, a softer light background",
      },
      {
        type: "p",
        text: "Neovim uses a colour scheme written for this set that draws only with the terminal's own 16 colours, so it shows exactly the palette the terminal shows and switches with it. Meaning never rests on colour alone: selection, search matches and the mode block are reversed, keywords and errors are bold and diagnostics are underlined.",
      },
      {
        type: "clip",
        src: "/videos/projects/dev-environment/neovim-zacess.mp4",
        poster: "/videos/projects/dev-environment/neovim-zacess.webp",
        alt: "A Git log, ripgrep search and diff summary in the shell, then a Python file opened in Neovim with bold keywords, italic comments and relative line numbers, the status line at the bottom",
        caption: "The shell, then Neovim with its terminal palette colour scheme",
      },
      { type: "h2", text: "Command-line tools" },
      {
        type: "p",
        text: "lazygit, fzf and ripgrep are set up to use the terminal's own colour names rather than fixed themes, so they follow light and dark mode with nothing to keep in step. lazygit's selected line is reversed and its diffs use plain red and green with bold reversed highlights for the changed words.",
      },
      {
        type: "clip",
        src: "/videos/projects/dev-environment/lazygit-zacess.mp4",
        poster: "/videos/projects/dev-environment/lazygit-zacess.webp",
        alt: "lazygit with two modified files in the files panel, the README diff on the right with the added lines in green and the commit list below",
        caption: "lazygit following the terminal palette",
      },
      {
        type: "clip",
        src: "/videos/projects/dev-environment/fzf-zacess.mp4",
        poster: "/videos/projects/dev-environment/fzf-zacess.webp",
        alt: "fzf filtering the demo project's files as colo is typed, the matching letters highlighted and the top result reversed",
        caption: "fzf narrowing a file list as you type",
      },
      { type: "h2", text: "Hooks that guard every repository" },
      {
        type: "p",
        text: "The Git hooks are set globally through core.hooksPath, so they run whatever makes the commit: a terminal, an IDE or a script. pre-commit blocks known secret patterns such as cloud keys and access tokens, files of 50 MB or more not tracked by Git LFS and .env files. pre-push blocks a force push that would rewrite the history of main. Every block has a deliberate escape hatch for a confirmed false positive.",
      },
      {
        type: "clip",
        src: "/videos/projects/dev-environment/hooks-zacess.mp4",
        poster: "/videos/projects/dev-environment/hooks-zacess.webp",
        alt: "A config file holding an example AWS access key ID is staged, then the commit is refused by the pre-commit hook with an explanation and the escape hatch for a false positive",
        caption: "The pre-commit hook stopping an example access key",
      },
      {
        type: "callout",
        tone: "note",
        text: "macOS ships BSD sed while Linux and Git for Windows behave like GNU sed. That one flag difference is why each platform folder carries its own copy of the hooks rather than one script branching at runtime.",
      },
      { type: "h2", text: "Across platforms" },
      {
        type: "p",
        text: "linux-bootstrap detects where it runs and adjusts: WSL gets systemd switched on, a desktop VM gets guest integration and desktop-only apps are skipped on a server. It supports Ubuntu 24.04 and 26.04 on both ARM64 and x86_64, which covers the OrbStack VM on the Mac and WSL2 on both PCs. The ThinkPad's Fedora KDE install follows its own guide in the same repository, from the dual boot beside an encrypted Windows to a TPM unlock for the Linux disk. windows-bootstrap installs WSL2 Ubuntu and hands over to it. system-defaults defines preferences once, then applies them through macOS defaults, the Windows registry and GNOME gsettings where a real equivalent exists.",
      },
      {
        type: "clip",
        src: "/videos/projects/dev-environment/linux-zacess.mp4",
        poster: "/videos/projects/dev-environment/linux-zacess.webp",
        alt: "Ubuntu 26.04 in OrbStack on the Mac running the Linux profile in bash: the same welcome banner, the numbered topic files and a Git log of a demo project",
        caption: "The same dotfiles on Ubuntu in OrbStack, running bash",
      },
      { type: "h2", text: "Every editor, one set of themes" },
      {
        type: "p",
        text: "The editors get the same treatment as the terminals. VS Code, the JetBrains IDEs, Eclipse, Zed, Xcode and Neovim each have a config repository with their settings, extensions or plugin lists. Every one of them runs the Zacess colour themes I publish for others too. One command switches every editor and terminal on a machine between the light, dark and deep contrast themes at once, so I never end up reading code in two different palettes. Each editor also reports to WakaTime, with file names, branch names and project folders hidden, so my coding stats cover all of them without exposing what I work on.",
      },
      {
        type: "image",
        src: "/images/projects/dev-environment/editors/vscode-deep-contrast-dark.webp",
        alt: "VS Code in Zacess Deep Contrast Dark: a TypeScript file on pure black with bold keywords, italic comments, cyan frames and a yellow outline on the selected file",
        caption: "VS Code in Deep Contrast Dark",
      },
      {
        type: "image",
        src: "/images/projects/dev-environment/editors/intellij-deep-contrast-light.webp",
        alt: "IntelliJ IDEA in Zacess Deep Contrast Light: a Java class on white with deep blue keywords and purple fields",
        caption: "IntelliJ IDEA in Deep Contrast Light",
      },
      {
        type: "image",
        src: "/images/projects/dev-environment/editors/zed-deep-contrast-dark.webp",
        alt: "Zed in Zacess Deep Contrast Dark: the same TypeScript file with the project panel on the right",
        caption: "Zed in Deep Contrast Dark",
      },
      {
        type: "image",
        src: "/images/projects/dev-environment/editors/eclipse-deep-contrast-light.webp",
        alt: "Eclipse in Zacess Deep Contrast Light: a Java class in the editor with the outline view beside it",
        caption: "Eclipse, with the Zacess plugin for the window and its preference file for the editor colours",
      },
      {
        type: "image",
        src: "/images/projects/dev-environment/editors/xcode-deep-contrast-dark.webp",
        alt: "Xcode in Zacess Deep Contrast Dark: a Swift struct and class on pure black with bold keywords",
        caption: "Xcode in Deep Contrast Dark",
      },
      { type: "h2", text: "The same desktop on every machine" },
      {
        type: "p",
        text: "The settings repository captures how each operating system is set up and replays it: macOS defaults, the Windows registry and the KDE Plasma desktop on Fedora, which runs a Windows 11 style taskbar, the high contrast colour schemes and the same window snapping keys as the Mac. Some choices follow me everywhere because I rely on them. The pointer is larger and yellow with a black outline on all three systems, wallpapers sorted into categories shuffle every five minutes and the screen saver and lock always come before the display turns off, so a long build or download never stops while the machine is plugged in.",
      },
      {
        type: "p",
        text: "Smaller habits match too. Every machine uses the same folder layout for repositories, forks and experiments. Commands such as cls and clearhist work the same in zsh, bash, PowerShell and even Command Prompt.",
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
