import type { BlogPost } from "../index"

const _one_palette_eight_terminals: BlogPost = {
  slug: "one-palette-eight-terminals",
  title: "One Palette, Eight Terminals: Building Accessible Terminal Themes",
  date: "2026-10-05",
  type: "blog",
  cover_image: "/images/blog/covers/one-palette-eight-terminals.webp",
  description:
    "How one JSON file and a small Python script generate a high contrast light and dark theme for Terminal.app, iTerm2, Windows Terminal, Ptyxis, GNOME Terminal, Alacritty, Kitty and Hyper, with every colour held to a contrast floor in CI.",
  tags: ["Terminal", "Accessibility", "Tools", "Python", "Dotfiles"],
  projectSlug: "dev-environment",
  published: true,
  content: [
    {
      type: "p",
      text: "I spend most of my day in a terminal and I use a lot of them: [Terminal.app](https://support.apple.com/guide/terminal/welcome/mac) and [iTerm2](https://iterm2.com) on the Mac, [Ptyxis](https://devsuite.app/ptyxis/) on Ubuntu, [Windows Terminal](https://github.com/microsoft/terminal) on the laptop and occasionally [Alacritty](https://alacritty.org), [Kitty](https://sw.kovidgoyal.net/kitty/) or [Hyper](https://hyper.is) when I am testing something. For years each one had its own colours, tweaked by hand at different times. The same `git status` looked different in every app and some combinations were genuinely hard to read. This post is about replacing all of that with one palette and one generator script.",
    },
    {
      type: "h2",
      text: "Sixteen colours and why they matter",
    },
    {
      type: "p",
      text: "Terminal programs do not choose exact colours. They ask for one of sixteen ANSI slots: black, red, green, yellow, blue, magenta, cyan and white, plus a bright version of each. The terminal decides what those slots look like. That indirection is why a theme matters so much. If your terminal's blue is a dark navy on a black background, every directory listing and every Git branch name becomes hard to see, no matter how well the tool itself was designed.",
    },
    {
      type: "h2",
      text: "Setting a contrast target",
    },
    {
      type: "p",
      text: "I used the [WCAG contrast ratio](https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio) as the measure, because it is well defined and easy to compute. The ratio compares the relative luminance of two colours and runs from 1:1 (identical) to 21:1 (black on white). WCAG AA asks for 4.5:1 for normal text and AAA asks for 7:1. I set the light theme to hold every text colour at 7:1 or better on white and the dark theme to hold every text colour at 4.5:1 or better on black, with most sitting far above 7:1.",
    },
    {
      type: "code",
      lang: "python",
      text: `def channel(c):
    # sRGB to linear light, as defined in WCAG 2
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def luminance(hex_colour):
    r, g, b = (int(hex_colour[i:i + 2], 16) / 255 for i in (1, 3, 5))
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)

def contrast(a, b):
    hi, lo = sorted((luminance(a), luminance(b)), reverse=True)
    return (hi + 0.05) / (lo + 0.05)

print(round(contrast("#006813", "#ffffff"), 1))  # light mode green: 7.0`,
    },
    {
      type: "h3",
      text: "Dark mode: saturated beats pale",
    },
    {
      type: "p",
      text: "Many popular dark themes use soft pastel colours. They look calm but pastels sit close together in hue, so red and magenta or green and cyan can blur into each other at a glance. I went the other way: vivid, saturated colours on pure black. Telling two colours apart quickly turned out to matter more to me than squeezing out the last point of contrast. Text is a near-white `#e0e0e0` rather than pure white, which still gives about 15.9:1 but is gentler over a long session.",
    },
    {
      type: "h3",
      text: "Light mode: darken only as far as needed",
    },
    {
      type: "p",
      text: "The light theme keeps the same hues and darkens each one only until it reaches 7:1 on white, so it stays as saturated as possible. Yellow was the awkward one. A dark pure yellow reads as olive, so the light theme's yellow leans towards amber instead. The bright row in light mode is a step darker again, so 'bright' still means 'stronger' in both themes.",
    },
    {
      type: "table",
      headers: ["Colour", "Dark mode on black", "Light mode on white"],
      rows: [
        ["Red", "#ff0f00 (5.3:1)", "#b40b00 (7.0:1)"],
        ["Green", "#00ff2f (15.3:1)", "#006813 (7.0:1)"],
        ["Yellow", "#fff500 (18.3:1)", "#735300 (7.1:1)"],
        ["Blue", "#8ac9ff (11.9:1)", "#0059a5 (7.1:1)"],
        ["Magenta", "#ff66ff (8.6:1)", "#9f009f (7.1:1)"],
        ["Cyan", "#6ff7ff (16.4:1)", "#006369 (7.0:1)"],
      ],
      caption: "Part of the High Contrast palette with each colour's measured contrast against its background.",
    },
    {
      type: "callout",
      tone: "note",
      text: "Dark mode red is the honest exception. At 5.3:1 it reads clearly but meets AA rather than AAA. The accessibility notes in the repository say so plainly and explain how to raise it.",
    },
    {
      type: "h3",
      text: "Bold keeps its colour",
    },
    {
      type: "p",
      text: "Many terminals draw bold text using the bright colour row. In my dark palette the bright row is deliberately softer than the normal row, so that behaviour would make bold text less visible rather than more. The generated configs turn that behaviour off wherever a terminal has the setting, so bold means heavier, not a different colour.",
    },
    {
      type: "h2",
      text: "One source file, eight outputs",
    },
    {
      type: "p",
      text: "Every terminal has its own format. Alacritty uses TOML, Kitty uses a plain key and value file, iTerm2 uses a Dynamic Profile in JSON, Terminal.app uses a property list, Windows Terminal uses a JSON scheme pair, Ptyxis has its own palette file, GNOME Terminal uses dconf and Hyper uses a JavaScript config. Keeping eight hand-written files in step would never last. So the palette lives in exactly one file, `palette/high-contrast.json`. A script, `scripts/build-themes.py`, writes every theme from it.",
    },
    {
      type: "diagram",
      code: "flowchart LR\n  P[palette/high-contrast.json] --> B[build-themes.py]\n  B --> M[Terminal.app and iTerm2]\n  B --> L[Ptyxis and GNOME Terminal]\n  B --> W[Windows Terminal]\n  B --> X[Alacritty, Kitty and Hyper]\n  B --> T[Contrast table in the docs]",
      caption: "The palette is the only place a colour is defined. Everything else is generated.",
    },
    {
      type: "p",
      text: "Two small details made the generator pleasant to live with. iTerm2 identifies a profile by a GUID, so the script derives a fixed one with `uuid5` from a name rather than generating a random one. Rerunning the script updates the existing profile instead of creating a second copy. Hyper's config also holds font settings that differ per platform, so the script rewrites only the block between two marker comments and leaves the rest alone.",
    },
    {
      type: "h2",
      text: "CI as the contrast referee",
    },
    {
      type: "p",
      text: "The script has a `--check` mode that CI runs on every pull request. It fails if a committed theme file is out of date with the palette or if any colour drops below its contrast floor. That means I can tweak a colour on a whim and the build tells me straight away whether I have broken a promise. The contrast table in the docs is generated too, so the numbers people read are always the numbers the palette produces.",
    },
    {
      type: "h2",
      text: "Following light and dark mode",
    },
    {
      type: "p",
      text: "iTerm2, Kitty, Windows Terminal and Ptyxis can all switch between a light and dark palette when the system appearance changes. Terminal.app cannot, so the installer builds a small Swift login agent that watches for appearance changes and switches any tab on a High Contrast profile. Alacritty, Hyper and GNOME Terminal carry the dark half. Alacritty switches to light by swapping one import line. The same colours also go into the VS Code and JetBrains integrated terminals, so the editor matches the standalone apps.",
    },
    {
      type: "clip",
      src: "/videos/projects/dev-environment/tmux.mp4",
      poster: "/videos/projects/dev-environment/tmux.webp",
      alt: "A tmux session opens with three panes: the Git log of terminal-config, its README in Neovim and a new shell with the welcome banner, all in the high contrast palette",
      caption: "The dark half of the palette in practice: Git, Neovim and the shell in one tmux window.",
    },
    {
      type: "p",
      text: "The [bootstrap scripts](/blog/bootstrap-any-machine-one-command) install the palette on every new machine, so a fresh laptop looks right from the first command. If you want to try it, the [terminal-config repository](https://github.com/zaccesss/terminal-config) is public and every preference in it is a single edit and one script run away from your own version. It sits alongside the rest of my tools on the [development environment project page](/projects/dev-environment).",
    },
    {
      type: "h2",
      text: "Further reading",
    },
    {
      type: "ol-links",
      items: [
        { text: "terminal-config on GitHub: the palette, the generator and every theme", url: "https://github.com/zaccesss/terminal-config" },
        { text: "W3C: Understanding Contrast (Enhanced), the 7:1 criterion", url: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html" },
        { text: "WebAIM contrast checker", url: "https://webaim.org/resources/contrastchecker/" },
        { text: "iTerm2 documentation: Dynamic Profiles", url: "https://iterm2.com/documentation-dynamic-profiles.html" },
        { text: "Microsoft Learn: Windows Terminal colour schemes", url: "https://learn.microsoft.com/en-us/windows/terminal/customize-settings/color-schemes" },
        { text: "Kitty documentation: themes and automatic light and dark switching", url: "https://sw.kovidgoyal.net/kitty/kittens/themes/" },
      ],
    },
  ],
}

export default _one_palette_eight_terminals
