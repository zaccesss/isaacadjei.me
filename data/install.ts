export type InstallChannel = {
  name: string
  command?: string
  short?: string
  shell?: boolean
  url?: string
  note?: string
}

export type InstallTool = {
  id: string
  name: string
  summary: string
  repo: string
  project: string
  channels: InstallChannel[]
}

export const installTools: InstallTool[] = [
  {
    id: "zacess-themes",
    name: "Zacess Themes",
    summary: "Eight high-contrast colour themes for code editors, terminals and notes, built for low vision and checked for contrast.",
    repo: "zacesshq/themes",
    project: "/projects/zacess",
    channels: [
      { name: "VS Code Marketplace", short: "VS Code", command: "code --install-extension zacess.zacess-themes", url: "https://marketplace.visualstudio.com/items?itemName=zacess.zacess-themes" },
      { name: "Open VSX (Cursor, Windsurf, VSCodium)", url: "https://open-vsx.org/extension/zacess/zacess-themes", note: "Search for Zacess Themes in the editor's extensions view." },
      { name: "JetBrains Marketplace", url: "https://plugins.jetbrains.com/plugin/35082-zacess-themes", note: "Settings, Plugins, Marketplace, then search for Zacess Themes." },
      { name: "Zed", url: "https://zed.dev/extensions?query=zacess", note: "Open Extensions and search for Zacess." },
      { name: "Neovim", short: "lazy.nvim", shell: false, command: '{ "zacesshq/zacess.nvim", lazy = false, priority = 1000 }', url: "https://github.com/zacesshq/zacess.nvim", note: "Add the plugin to lazy.nvim." },
      { name: "Obsidian", url: "https://community.obsidian.md/themes/zacess", note: "Settings, Appearance, Themes, Manage, then search for Zacess." },
      { name: "Chrome Web Store", url: "https://chromewebstore.google.com/search/zacess" },
      { name: "Firefox Add-ons", url: "https://addons.mozilla.org/firefox/search/?q=zacess&type=statictheme" },
    ],
  },
  {
    id: "zacess-profile",
    name: "Zacess Profile",
    summary: "One accessibility profile for every app: state your needs once and get a checked palette for terminals, editors and the web.",
    repo: "zacesshq/profile",
    project: "/projects/zacess",
    channels: [
      { name: "Homebrew", command: "brew install zacesshq/tap/zacess-profile" },
      { name: "Cargo", command: "cargo install zacess-profile", url: "https://crates.io/crates/zacess-profile" },
      { name: "winget", command: "winget install Zacess.Profile" },
      { name: "Chrome Web Store", url: "https://chromewebstore.google.com/detail/afbflpkolnhidmopegadfnlhenhjkpdc" },
      { name: "Firefox Add-ons", url: "https://addons.mozilla.org/firefox/addon/zacess-profile/" },
      { name: "Microsoft Edge Add-ons", url: "https://microsoftedge.microsoft.com/addons/detail/kdihhdkcphgpaibeemcgheifijflonbg" },
    ],
  },
  {
    id: "zacess-scenes",
    name: "Zacess Scenes",
    summary: "Terminal scenes in your Zacess theme (a sea with fish, rain, snow, a starfield and more) that never flash, with a pause key and reduced motion.",
    repo: "zacesshq/scenes",
    project: "/projects/zacess",
    channels: [
      { name: "Homebrew", command: "brew install zacesshq/tap/zacess-scenes" },
      { name: "Cargo", command: "cargo install --locked zacess-scenes", url: "https://crates.io/crates/zacess-scenes" },
      { name: "winget", command: "winget install Zacess.Scenes" },
    ],
  },
  {
    id: "zacess-games",
    name: "Zacess Games",
    summary: "Original terminal games in the high-contrast Zacess themes, with sound, music and Learn to Code levels.",
    repo: "zacesshq/games",
    project: "/projects/zacess",
    channels: [
      { name: "Homebrew", command: "brew install zacesshq/tap/zacess-games" },
      { name: "Cargo", command: "cargo install --locked zacess-games", url: "https://crates.io/crates/zacess-games" },
      { name: "winget", command: "winget install Zacess.Games" },
    ],
  },
  {
    id: "footprints",
    name: "Footprints",
    summary: "See and undo what coding agents do on your machine: a local ledger of file writes, shell commands and network calls with one-step undo.",
    repo: "zaccesss/footprints",
    project: "/projects/footprints",
    channels: [
      { name: "Homebrew", command: "brew install zaccesss/tap/footprints" },
      { name: "Cargo", command: "cargo install footprints", url: "https://crates.io/crates/footprints" },
      { name: "winget", command: "winget install zaccesss.Footprints" },
    ],
  },
]
