import type { Project } from "../index"

const IMG = "/images/projects/footprints"
const REPO = "https://github.com/zaccesss/footprints"

const _footprints: Project = {
    id: "footprints",
    title: "Footprints: See and Undo What AI Agents Do",
    description:
      "A local ledger of what AI coding agents do on your machine: every file change, shell command and network call, with a diff and a one-step undo for each file change. Open source for macOS, Linux and Windows.",
    longDescription:
      "Footprints is a local ledger of what AI coding agents do on a machine: every file they write, create or delete, every shell command they run and every network call their tools report. Each file change keeps a copy of the file before and after, so any one step can be shown as a diff and undone. It records Claude Code, Cursor, Codex CLI and Gemini CLI through their own hooks and any other agent through a wrapper or a daemon.\n\nAn agent can touch dozens of files in a minute and version control only sees what was committed. I wanted a record of every step as it happens, whichever agent took it, so a bad step can be found and taken back without losing the good ones around it. It also had to be safe to trust. An undo refuses when the file has changed since the agent touched it, so it never overwrites later work without being told to.\n\nIt is written in Rust. A SQLite ledger records each action and a blob store keeps every file image once under its BLAKE3 hash, compressed with zstd. On top of that sit the command line, an MCP server, an OpenTelemetry export and a small Tauri menu bar app. Four releases, 0.1.0 to 0.4.0, came out on 5 November 2026. It installs today through Homebrew, Cargo and release binaries for macOS, Linux and Windows, while the winget package is pending review. It is still an early developer tool and the roadmap says what comes next.",
    technologies: [
      "Rust",
      "SQLite",
      "BLAKE3",
      "zstd",
      "clap",
      "Tauri",
      "MCP",
      "OpenTelemetry",
      "Homebrew",
      "GitHub Actions",
    ],
    category: "software",
    featured: false,
    cover: `${IMG}/demo.webp`,
    order: 9,
    status: "live",
    ongoing: true,
    images: [`${IMG}/demo.webp`, `${IMG}/menu-bar-app.webp`],
    github: REPO,
    getInvolved: {},
    date: "2026",
    highlights: [
      "Native hooks for four agents (Claude Code, Cursor, Codex CLI and Gemini CLI), a wrapper for anything started from a terminal and a daemon for everything else, with 14 agent setup guides plus one for any other agent",
      "Three platforms and five release builds: macOS on arm64 and x86_64, Linux on x86_64 and aarch64 and Windows on x86_64, all three tested in CI with a real end-to-end run",
      "Four releases from 0.1.0 to 0.4.0. Since 0.2.0 each one ships five binaries with SHA-256 sums and goes to crates.io. The latest is also in a Homebrew tap",
      "An undo that refuses with exit status 3 when the file changed since, plus a session undo that simulates every step first and changes nothing if one fails",
      "Every file image stored once under its BLAKE3 hash and compressed with zstd, with files up to 32 MiB reversible by default",
      "An MCP server with three tools and no force option, so an agent can check and undo its own steps but never overwrite newer work or prune its own trail",
      "A menu bar app on macOS, Windows and Linux with 44 pixel buttons, states written in words and the system's own colours",
    ],
    links: [
      { label: "Documentation", url: `${REPO}/tree/main/docs` },
      { label: "Changelog", url: `${REPO}/blob/main/CHANGELOG.md` },
      { label: "Releases", url: `${REPO}/releases` },
    ],
    sections: [
      { type: "h2", text: "Why I built it" },
      {
        type: "p",
        text: "An agent can touch dozens of files in a minute. Version control only sees what was committed, so one bad step in the middle of a session is hard to find and harder to take back on its own. I wanted one record of every step, whichever agent took it, with the old copy of each file kept so a single step can be reversed without losing the good ones around it.",
      },
      {
        type: "p",
        text: "It also had to be safe to trust with real files. An undo refuses when the file has changed since the agent touched it. Forcing one is possible on the command line, but only when the current contents can be stored first, so a forced undo can itself be undone.",
      },
      { type: "h2", text: "How capture works" },
      {
        type: "p",
        text: "Footprints records through three tiers that all write to one ledger. A hook knows why something happened: which tool ran and what the agent said it was for. The wrapper knows what actually changed on disk under the folder it watches. The daemon sees changes from processes nobody wrapped. When two tiers see the same change, the daemon joins its record to the one already made rather than recording it twice.",
      },
      {
        type: "diagram",
        code: `flowchart LR
    A["Agent with hooks<br/>Claude Code, Cursor, Codex CLI, Gemini CLI"] --> H["footprints hook<br/>copy before the tool, copy after"]
    B["Any terminal agent"] --> R["footprints run<br/>clone, watch, rescan"]
    D["Any process"] --> E["footprints daemon<br/>the system's change feed"]
    H --> L[("Ledger<br/>SQLite")]
    R --> L
    E --> L
    H --> S[("Blob store<br/>BLAKE3 and zstd")]
    R --> S
    E --> S
    L --> C["log, diff, undo, MCP and export"]
    S --> C`,
        caption: "Hooks, the run wrapper and the daemon all record into the same ledger and blob store",
      },
      {
        type: "table",
        headers: ["Tier", "How it captures", "Best for"],
        rows: [
          ["Hook adapter", "`footprints hook pre` and `footprints hook post` read the agent's hook payload, store the file before and after the tool and compare the working directory before and after a shell command", "Claude Code, Cursor, Codex CLI and Gemini CLI"],
          ["Wrapper", "`footprints run` copies the watched folder (as a clone that shares blocks with the original where the file system allows it), watches it while the agent runs and rescans afterwards", "Any agent started from a terminal, including ones driving a local model"],
          ["Daemon", "`footprints daemon` follows FSEvents on macOS, inotify on Linux or ReadDirectoryChangesW on Windows until it is stopped", "Editor extensions, desktop apps and anything outside a hook or the wrapper"],
        ],
        caption: "The three capture tiers",
      },
      {
        type: "p",
        text: "The hooks always exit with status 0, so a problem in Footprints never blocks the agent's tool call. A shell hook snapshot stops at 256 MiB of new content or 10 seconds so the agent is never held up. The command's note then says its file changes were not recorded.",
      },
      {
        type: "table",
        headers: ["Agent", "How it is recorded"],
        rows: [
          ["Claude Code, Cursor, OpenAI Codex CLI and Gemini CLI", "Native hooks"],
          ["Aider, OpenCode, Amp and the GitHub Copilot CLI", "The run wrapper, plus MCP where supported"],
          ["Goose, Cline and Continue", "The wrapper for their command line tools or the daemon for their apps, plus MCP"],
          ["Copilot in VS Code, Windsurf, Devin Desktop and Zed", "The daemon, plus MCP"],
          ["Local models through Ollama", "The route of the agent driving them"],
          ["Anything else", "The wrapper or the daemon"],
        ],
        caption: "Supported agents and the route each one takes",
      },
      { type: "h2", text: "A first run" },
      {
        type: "image",
        src: `${IMG}/demo.webp`,
        alt: "A real terminal running Footprints in a folder called demo. cat agent.sh shows a script standing in for an agent: it turns auto_save on in config.toml and creates NOTES.md. footprints run records the command with its two file changes. footprints log lists the command as not reversible and both file changes as reversible. footprints diff 3 shows auto_save changing from false to true, with minus and plus markers so colour is never the only signal. footprints undo 3 restores config.toml and records the undo as entry 4.",
        caption: "A real run in a real terminal, with a short script standing in for the agent",
      },
      { type: "h2", text: "What can and cannot be undone" },
      {
        type: "p",
        text: "Every undo checks the file first. It only goes ahead when the file still matches what the agent left, compared by BLAKE3 hash. Otherwise it refuses with exit status 3 and changes nothing. A session undo simulates every step before it touches any file, so one problem means nothing changes. Each undo is recorded as its own entry, so undoing an undo puts the agent's change back.",
      },
      {
        type: "table",
        headers: ["Recorded", "Undo"],
        rows: [
          ["A file write or edit", "Restores the earlier copy, file mode included"],
          ["A file the agent created", "Deletes it"],
          ["A file the agent deleted", "Recreates it with its contents and mode"],
          ["A shell command", "Not as a whole. Each file it changed in its working directory is recorded under it and can be undone"],
          ["A network call", "Never. The data has already left the machine, so it is recorded only to be seen"],
          ["A file over 32 MiB, a symlink or a directory", "Recorded but not reversible"],
          ["The first daemon change to a file without `--snapshot`", "Not reversible, since there was no earlier copy yet"],
          ["An MCP tool call", "Not recorded in this version"],
        ],
        caption: "What an undo can put back, from the undo guide in the repository",
      },
      {
        type: "callout",
        tone: "note",
        text: "Footprints is an early developer tool. The undo guide in the repository lists every limit, including the Windows read-only attribute that an undo does not restore yet.",
      },
      { type: "h2", text: "Agents can check themselves" },
      {
        type: "p",
        text: "`footprints mcp` is an MCP (Model Context Protocol) server that lets an agent read its own ledger and undo its own mistakes through three tools: `footprints_log`, `footprints_diff` and `footprints_undo`. The undo tool has no force option, so an agent can never overwrite newer work. Nothing that removes history is offered there. `footprints export --otel` writes the ledger as OpenTelemetry GenAI spans for Jaeger, Langfuse or any OTLP tool.",
      },
      {
        type: "p",
        text: "The menu bar app lists today's changes with an undo button on each one, in the macOS menu bar, the Windows notification area and a Linux panel. It uses the same conflict check as the command line and has no force option either. The output never relies on colour alone: the state column says reversible or not reversible in words, diff lines start with + or - and `NO_COLOR` or `--no-color` turns colour off.",
      },
      { type: "h2", text: "Data and privacy" },
      {
        type: "p",
        text: "Everything stays on the machine. There is no telemetry, no account and no network code beyond what an agent itself does. The data lives in `~/.local/share/footprints` on macOS and Linux and in `%LOCALAPPDATA%\\footprints` on Windows. On macOS and Linux its folders are `0700` and its files `0600`, so copies of a private file are never readable by other accounts.",
      },
      {
        type: "table",
        headers: ["Path", "What it holds"],
        rows: [
          ["`ledger.db`", "A SQLite database with one row per action: time, agent, session, kind, target, the agent's stated intent and the hashes of the file before and after"],
          ["`blobs/`", "Every file image once under its BLAKE3 hash, compressed with zstd"],
          ["`staging/`", "The wrapper's copy of a watched folder while a run is in progress"],
          ["`locks/`", "One lock per running wrapper plus the ledger lock every process holds while it has the ledger open"],
        ],
        caption: "The data directory",
      },
      {
        type: "p",
        text: "The blob store keeps copies of every file an agent touched, secrets included, so the folder has to stay private. Old history goes with `footprints prune`, by age, date, session, agent or a size budget. It prints what it would remove and changes nothing without `--yes`. The pruned actions and their file copies go to the Trash (the Recycle Bin on Windows) as one archive that `footprints import` restores with every original id. Prune is never offered over MCP, so an agent can never erase its own trail.",
      },
      { type: "h2", text: "Install" },
      {
        type: "table",
        headers: ["Method", "How"],
        rows: [
          ["Homebrew on macOS and Linux", "`brew install zaccesss/tap/footprints`"],
          ["Cargo (Rust 1.89 or later)", "`cargo install footprints`"],
          ["Release binaries", "Five archives on each GitHub release since 0.2.0, each with a SHA-256 sum"],
          ["winget on Windows", "`winget install zaccesss.Footprints` once the package is accepted. The first submission is pending review in the winget repository"],
          ["Menu bar app", "A universal macOS zip, a Windows installer, a Linux `.deb` and an AppImage on each release since 0.4.0. They are not signed yet, so macOS and Windows warn the first time"],
        ],
        caption: "Ways to install Footprints today",
      },
      {
        type: "code",
        lang: "sh",
        text: "footprints run --agent aider -- aider\nfootprints log\nfootprints diff 2\nfootprints undo 2",
      },
      {
        type: "p",
        text: "That wraps one agent run, lists what it did, shows one change as a diff and takes it back. For an agent with native hooks, `footprints install claude-code --print` prints the settings to merge. Footprints never edits an agent's settings itself.",
      },
      { type: "h2", text: "How it has grown" },
      {
        type: "table",
        headers: ["Release", "What arrived"],
        rows: [
          ["0.1.0", "The SQLite ledger and blob store, undo and session undo, the Claude Code hooks, the run wrapper, the MCP server and the OpenTelemetry export"],
          ["0.2.0", "Windows support, the daemon, hooks for Cursor, Codex CLI and Gemini CLI, the first menu bar app and release binaries published to crates.io"],
          ["0.3.0", "`footprints prune` and `footprints import`, plus the Homebrew tap and the winget packaging"],
          ["0.4.0", "The menu bar app on Windows and Linux, with its installers attached to every release"],
        ],
        caption: "Four releases, all on 5 November 2026",
      },
      { type: "h2", text: "What is next" },
      {
        type: "p",
        text: "The roadmap in the repository keeps what comes next apart from what is deliberately left for later. Next on the list:",
      },
      {
        type: "ul",
        items: [
          "An automatic size budget. `footprints prune --max-size` applies one when it is run, but nothing runs it on a schedule yet.",
          "A signed and notarised menu bar app. Signing needs an Apple Developer account and a Windows code signing certificate, which the project does not have yet.",
          "The menu bar app on GTK 4 for Linux, once Tauri's Linux backend moves to it.",
          "`footprints install <agent>` that writes the hook block into an agent's settings after showing the change and asking. Today every install command only prints.",
          "The winget package, whose first version is pending review.",
          "Restoring the Windows read-only attribute on undo.",
        ],
      },
      {
        type: "p",
        text: "Later come a background service for the daemon, client libraries for Python and Node and ideas such as policies and a team server. Those wait until the ledger format is stable. Bug fixes, new agent adapters and capture improvements are welcome through the repository.",
      },
    ],
}

export default _footprints
