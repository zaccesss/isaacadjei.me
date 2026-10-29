import type { Project } from "../index"

const IMG = "/images/projects/zacess"
const VID = "/videos/projects/zacess"

const _zacess: Project = {
    id: "zacess",
    title: "Zacess: Make Every Page Accessible",
    description:
      "A free, open-source reader that turns PDFs, scans, Word files and web pages into notes in your own reading profile, reads them aloud and keeps every file on your device. The browser version is live, built on a Rust core compiled to WebAssembly. Its contrast themes also ship as eight code themes for ten editors and eight terminals. The same themes colour Zacess Scenes, calm animated scenes for the terminal, plus Zacess Games, fourteen original terminal games with sound and music.",
    longDescription:
      "Zacess (said like success, from the Latin cēdō, the root of both access and success) is a reader I am building for people who find standard documents hard to read. You open a PDF, a photo of a handout, a Word file or a web page and it comes back as notes in a reading profile you set once: font, size up to 96 points, line and letter spacing, column width, a contrast theme and a reading ruler. It can read the page aloud with the voices already on the device and export clean HTML or EPUB 3.\n\nI read with one eye, so contrast, size and spacing are practical needs for me. Much of what I study arrives as slides, PDFs with no text layer and photos of whiteboards, which are the formats that are hardest to read. The tools that help are scattered and some keep your files on someone else's server. Zacess is the single tool I wanted: it does the work in the browser, never uploads a file, needs no account and tracks nothing.\n\nThe heart of it is a core written in Rust and compiled to WebAssembly, which lays out text, finds the reading order, marks every doubtful word and writes the document. The same code runs in the browser version at app.zacess.com now and will run inside the desktop and mobile apps later. pdf.js reads PDFs, Tesseract recognises pictures on the device and mammoth turns Word files into HTML before the core takes over. The interface is React with shadcn/ui on Radix. It is checked with axe and on WebKit as well as Chromium so it works by touch on phones and tablets.\n\nThe contrast themes also became code themes, eight of them now. One palette file generates them for VS Code, JetBrains IDEs, Obsidian, Neovim, Zed, Sublime Text, Helix, Emacs, Eclipse, Xcode and eight terminals. A check holds every text and syntax colour to 7 to 1 on the background, keeps the selection, the current line and the find match easy to see and tests them under three kinds of colour blindness. The same themes colour Zacess Scenes, a small Rust program that draws 39 calm scenes in the terminal and shows how a Rust build stands while you work. Zacess Games builds on Scenes: fourteen original terminal games with their own sound and music, including a touch typing trainer and 287 levels of Learn to Code across fifteen tracks.",
    technologies: [
      "Rust",
      "WebAssembly",
      "wasm-bindgen",
      "TypeScript",
      "React",
      "Vite",
      "Tailwind CSS",
      "Radix UI",
      "shadcn/ui",
      "pdf.js",
      "Tesseract.js",
      "mammoth",
      "Astro",
      "Shiki",
      "Lua",
      "bacon",
      "Node.js",
      "Cloudflare Workers",
      "Vitest",
      "Playwright",
      "axe-core",
      "GitHub Actions",
    ],
    category: "software",
    featured: false,
    cover: `${IMG}/cover.webp`,
    coverDark: `${IMG}/cover-dark.webp`,
    order: 3,
    status: "live",
    ongoing: true,
    images: [
      `${IMG}/app-light.webp`,
      `${IMG}/app-dark.webp`,
      `${IMG}/reading-profile.webp`,
      `${IMG}/scan-doubtful.webp`,
      `${IMG}/links-list.webp`,
      `${IMG}/phone.webp`,
      `${IMG}/site-home.webp`,
      `${IMG}/site-how-it-works.webp`,
      `${IMG}/themes-page.webp`,
      `${IMG}/scenes/watch-pass.webp`,
      `${IMG}/scenes/koi-pond.webp`,
      `${IMG}/games/menu.webp`,
      `${IMG}/games/learn-to-code.webp`,
    ],
    video: `${VID}/read-aloud.mp4`,
    videoCaptions: `${VID}/read-aloud.en.vtt`,
    videoCaption: "Turn the sound on: each sentence is highlighted as the voice on the device reads it, with captions",
    github: "https://github.com/zacesshq/zacess",
    website: "https://zacess.com",
    demo: "https://app.zacess.com",
    getInvolved: {},
    date: "2026",
    highlights: [
      "One reading profile: presets for low vision, dyslexia, less visual clutter and screen readers, with size, spacing, column width, colours and a reading ruler kept in your browser",
      "Text recognition on the device, with a confidence for every word and the doubtful ones marked so you can check them",
      "Read aloud that starts from a tap, so it works on iPhone and iPad, using on-device voices unless online ones are switched on",
      "Links inside documents become real links with a list of them. No address is ever fetched",
      "A 440 KB Rust core compiled to WebAssembly, shared by the browser version and the apps to come",
      "Zero axe violations at WCAG 2.2 A and AA, 44 pixel touch targets and checks on WebKit as well as Chromium",
      "Eight code themes for ten editors and eight terminals, on the VS Code Marketplace, Open VSX, the JetBrains Marketplace, the Eclipse Marketplace, the Zed extension store and the Obsidian community directory, generated from one palette with every code colour at 7 to 1 or more on the background",
      "A selection, current line and find match that always stand out, measured by the same check as the colours, plus one installer for every terminal",
      "Zacess Scenes 0.4.0: 39 terminal scenes in all eight themes that never flash, a watch mode for Rust builds and eight synthesised sound sets levelled to the same loudness",
      "Zacess Games 0.1.0: fourteen original terminal games on Zacess Scenes, with synthesised effects and music on separate volumes, Touch Typing on the machine's own keyboard layout and 287 Learn to Code levels across fifteen tracks",
    ],
    links: [
      { label: "Code themes", url: "https://zacess.com/themes/" },
      { label: "Zacess Themes on the VS Code Marketplace", url: "https://marketplace.visualstudio.com/items?itemName=zacess.zacess-themes" },
      { label: "Zacess Scenes", url: "https://zacess.com/scenes/" },
      { label: "Zacess Scenes on GitHub", url: "https://github.com/zacesshq/scenes" },
      { label: "Zacess Games", url: "https://zacess.com/games/" },
      { label: "Zacess Games on GitHub", url: "https://github.com/zacesshq/games" },
      { label: "Discussions", url: "https://github.com/orgs/zacesshq/discussions" },
    ],
    sections: [
      { type: "h2", text: "Why I built it" },
      {
        type: "p",
        text: "A lot of study material arrives in the formats that are hardest to read: slides on a projector, PDFs with no text layer and photos of whiteboards. A screen magnifier does one job, a video magnifier another and a service for disabled students costs money and holds your files on someone else's server. I wanted one tool that lets me set the page the way my eyes need it, reads it aloud and never asks me to hand over the file. There is a [blog post](/blog/building-zacess-a-reader-that-respects-the-file) with the story and short demos.",
      },
      { type: "h2", text: "What it opens today" },
      {
        type: "table",
        headers: ["Input", "How it is read", "State"],
        rows: [
          ["PDF with a text layer", "pdf.js gives each page's positioned text and link annotations to the core", "Works"],
          ["PDF page with no text", "Drawn to a canvas and recognised with Tesseract", "Works"],
          ["Photo or scan", "Tesseract in a worker, with the photo's rotation respected and large images capped at 12 million pixels", "Works"],
          ["Word file (.docx)", "mammoth turns it into HTML and the core reads that", "Works"],
          ["Web page, Markdown, text and pasted text", "Read directly by the core", "Works"],
          ["HTML and EPUB 3 export", "Written by the core in the current reading profile", "Works"],
          ["Braille-ready export", "Exists in the core and needs liblouis built for WebAssembly", "Not in the browser yet"],
          ["PowerPoint", "Not read yet", "Not yet"],
        ],
        caption: "What the browser version opens and writes",
      },
      { type: "h2", text: "How it is put together" },
      {
        type: "p",
        text: "A file never goes to a server. The browser readers turn it into positioned text or recognised words, the Rust core in WebAssembly builds the document and the interface draws it in your profile. Everything that crosses the boundary between the interface and the core is a documented JSON form, so the browser and the apps will speak the same language.",
      },
      {
        type: "diagram",
        code: `flowchart LR
    F["A file, a photo or pasted text"] --> R["Readers in the browser<br/>pdf.js, Tesseract, mammoth"]
    R --> C["Zacess core<br/>Rust compiled to WebAssembly"]
    C --> D["Document<br/>blocks, runs and confidence"]
    P["Your reading profile"] --> V["Reading view"]
    D --> V
    D --> E["HTML and EPUB 3 export"]
    D --> A["Read aloud, sentence by sentence"]`,
        caption: "From a file to a page you can read, all in the browser",
      },
      { type: "h2", text: "The document model" },
      {
        type: "p",
        text: "Every importer produces one Zacess document and every view and export reads one. A document has pages and blocks in reading order. Text sits in runs. Each run keeps its origin on the page so the reading view can always be traced back to the original. The model carries a schema version: adding an optional field needs no new version, changing a field does, a newer file is refused rather than misread and an older one is upgraded when it is read.",
      },
      {
        type: "diagram",
        code: `erDiagram
    DOCUMENT ||--o{ PAGE : has
    DOCUMENT ||--o{ BLOCK : "has in reading order"
    BLOCK ||--o{ RUN : "holds text as"
    BLOCK ||--|| ORIGIN : "comes from"
    RUN ||--o| ORIGIN : "comes from"
    DOCUMENT {
        int schema_version
        string title
        string source_format
    }
    BLOCK {
        int id
        string type
    }
    RUN {
        string text
        float confidence
        string status
        string original_text
        string link
    }
    ORIGIN {
        int page
        object region
    }`,
        caption: "The Zacess document model",
      },
      {
        type: "table",
        headers: ["Block type", "What it carries"],
        rows: [
          ["heading", "A level from 1 to 6 and its runs"],
          ["paragraph", "Runs and a role: body, quote or code (code keeps its spacing and line breaks)"],
          ["list", "Ordered or not, with items that can nest"],
          ["table", "Rows of cells with header, column span and row span plus an optional caption"],
          ["image", "An optional description, where a missing one means it still needs one"],
          ["equation", "The recognised text, optional LaTeX and MathML and whether it is displayed on its own line"],
          ["page_break", "Nothing"],
        ],
        caption: "The block types",
      },
      {
        type: "table",
        headers: ["Run field", "Meaning"],
        rows: [
          ["text", "The text as it now reads"],
          ["confidence", "How sure the recogniser was, from 0 to 1 with 1 for native text"],
          ["status", "recognised, confirmed once checked or corrected once changed"],
          ["original_text", "The recognised text before a correction, so the original stays one step away"],
          ["origin", "The page and the region of the page the text sits in"],
          ["script", "Superscript or subscript, such as an exponent"],
          ["link", "The address the text links to, which is never fetched"],
        ],
        caption: "What a run of text remembers",
      },
      { type: "h2", text: "The reading profile" },
      {
        type: "p",
        text: "A reading profile is a small JSON document with a version, validated by the core, so a profile can be saved, shared and checked the same way everywhere. The four presets are starting points and every field can be changed.",
      },
      {
        type: "table",
        headers: ["Preset", "Font", "Size", "Line spacing", "Theme"],
        rows: [
          ["Low Vision", "Atkinson Hyperlegible", "24 pt", "1.6", "Yellow on black, with a reading ruler"],
          ["Dyslexia-Friendly", "Lexend, falling back to the system font for now", "16 pt", "1.75", "Black on cream"],
          ["Reduced Visual Clutter", "System", "14 pt", "1.5", "Dark on light, decoration hidden"],
          ["Screen Reader", "System", "14 pt", "1.5", "Dark on light, no ruler"],
        ],
        caption: "The presets",
      },
      {
        type: "table",
        headers: ["Field", "Range"],
        rows: [
          ["font_size_pt", "6 to 96"],
          ["line_spacing", "1 to 3 times the font size"],
          ["paragraph_spacing", "0 to 5 times the font size"],
          ["character_spacing", "0 to 0.5 times the font size"],
          ["column_width", "20 to 150 average character widths"],
          ["contrast", "dark_on_light, light_on_dark, yellow_on_black, black_on_cream, high_contrast_dark, high_contrast_light, deep_contrast_dark or deep_contrast_light"],
          ["reading_ruler", "Enabled, position from 0 to 1 and 1 to 5 lines"],
        ],
        caption: "The main reading profile fields",
      },
      {
        type: "table",
        headers: ["Contrast theme", "Text", "Background", "Ratio"],
        rows: [
          ["dark_on_light", "#111111", "#ffffff", "18.9 to 1"],
          ["light_on_dark", "#f5f5f5", "#121212", "17.2 to 1"],
          ["yellow_on_black", "#ffeb3b", "#000000", "17.2 to 1"],
          ["black_on_cream", "#000000", "#fdf6e3", "19.5 to 1"],
          ["high_contrast_dark", "#ffffff", "#000000", "21 to 1"],
          ["high_contrast_light", "#000000", "#ffffff", "21 to 1"],
          ["deep_contrast_dark", "#ffffff", "#000000", "21 to 1"],
          ["deep_contrast_light", "#000000", "#ffffff", "21 to 1"],
        ],
        caption: "The themes are chosen by ratio, well above the 7 to 1 that WCAG AAA asks for",
      },
      { type: "h2", text: "Reading aloud" },
      {
        type: "p",
        text: "Read aloud uses only voices that run on the device unless online voices are switched on in a clearly labelled setting, because an online voice sends the text it reads to the company that provides the voice. It has play, pause, stop, previous and next sentence and a speed control, highlights the sentence being read and starts from the paragraph last clicked or selected. A link is spoken as its text followed by the word link. The address is read only when a setting asks for it.",
      },
      {
        type: "diagram",
        code: `sequenceDiagram
    actor You
    participant App as Zacess app
    participant Voice as Voice on your device
    You->>App: Tap Play
    App->>Voice: Speak sentence 1
    Voice-->>App: Started
    App->>You: Sentence 1 highlighted
    Voice-->>App: Finished
    App->>Voice: Speak sentence 2
    You->>App: Change the speed
    App->>Voice: Next sentence at the new speed
    You->>App: Pause
    App->>Voice: Pause`,
        caption: "Read aloud, one sentence at a time, from a tap",
      },
      { type: "h2", text: "What stays in the browser" },
      {
        type: "table",
        headers: ["What", "Where it lives", "Leaves the device"],
        rows: [
          ["The file you open", "In memory while the page is open", "Never"],
          ["Recognised text and the document", "In memory while the page is open", "Never"],
          ["Reading profile", "This browser's local storage under zacess.profile", "Never"],
          ["Colour mode and panel choice", "Local storage under zacess.theme and zacess.panel", "Never"],
          ["Voices", "The ones already on the device", "Only if online voices are switched on and then only the text being read"],
        ],
        caption: "Where each piece of data lives",
      },
      {
        type: "p",
        text: "The page's content security policy lets it connect only to its own origin, the recogniser, the PDF reader and every font are served from the app itself and the app has no account, cookie or analytics. The policy and the other security headers are sent by the host, so the browser enforces them.",
      },
      { type: "h2", text: "Where it runs" },
      {
        type: "diagram",
        code: `flowchart LR
    V["Your browser"] --> CF["Cloudflare<br/>zacess.com and app.zacess.com"]
    CF --> S["Static files only<br/>page, WebAssembly core, recogniser data, fonts"]
    V --> L["Your files stay here<br/>settings kept in local storage"]`,
        caption: "Static hosting: no server code runs and no file is sent anywhere",
      },
      {
        type: "diagram",
        code: `flowchart LR
    M["zacess<br/>public monorepo under AGPL-3.0"] -- "split workflow" --> C["core<br/>read-only copy"]
    M --> Q["quality<br/>read-only copy"]
    M --> A["app<br/>read-only copy"]
    M --> W["apps/web<br/>app.zacess.com"]
    S["website<br/>zacess.com"]`,
        caption: "One public monorepo, with each part also published as a read-only copy",
      },
      { type: "h2", text: "Code themes" },
      {
        type: "p",
        text: "The contrast themes worked so well in the reader that I wanted them where I spend the rest of my day: in the editor and the terminal. Zacess Light, Zacess Dark, Zacess Yellow on Black and Zacess Cream match the reader's first four themes. Version 0.2.0 added Zacess High Contrast Dark and Zacess High Contrast Light on pure black and pure white. Version 0.3.0 added Zacess Deep Contrast Dark and Zacess Deep Contrast Light for low vision: the same pure backgrounds with deep, fully saturated syntax colours, plus yellow focus outlines on dark and red ones on light. Both Deep Contrast themes are reading themes in the browser version too, with #6bceff links and a yellow focus ring on dark and #0037df links and a red focus ring on light. They live in [zacesshq/themes](https://github.com/zacesshq/themes) under the MIT licence and you can try each one on 20 languages on the [code themes page](https://zacess.com/themes/).",

      },
      {
        type: "table",
        headers: ["Theme", "Made for", "Text on background", "Weakest code colour on the background"],
        rows: [
          ["Zacess Light", "Everyday use in a bright room", "#111111 on #ffffff", "8.2 to 1"],
          ["Zacess Dark", "Everyday use in a dim room", "#f5f5f5 on #121212", "8.5 to 1"],
          ["Zacess Yellow on Black", "Low vision", "#ffeb3b on #000000", "9.7 to 1"],
          ["Zacess Cream", "Dyslexia friendly reading", "#000000 on #fdf6e3", "8.4 to 1"],
          ["Zacess High Contrast Dark", "The highest contrast on a dark screen", "#ffffff on #000000", "9.9 to 1"],
          ["Zacess High Contrast Light", "The highest contrast on a light screen", "#000000 on #ffffff", "8.6 to 1"],
          ["Zacess Deep Contrast Dark", "Low vision, with deep saturated colours", "#ffffff on #000000", "9.0 to 1"],
          ["Zacess Deep Contrast Light", "Low vision, with vivid deep colours", "#000000 on #ffffff", "7.7 to 1"],
        ],
        caption: "The eight code themes in version 0.6.1. Every ratio is rounded down. Every code colour also keeps 7 to 1 on the diff colours and 4.5 to 1 or more over the selection and the current line",
      },
      {
        type: "p",
        text: "Version 0.3.0 also pushed every theme's syntax and terminal colours to full saturation without moving a single contrast ratio. It also gave comments a real colour instead of grey in six of the themes. The four high and deep contrast themes keep their weakest code colour at 7.7 to 1 or more on the background, above the high contrast themes built into VS Code and GitHub, whose weakest code colours measure between 5.83 and 7.05 to 1.",
      },
      { type: "h3", text: "Always knowing where you are" },
      {
        type: "p",
        text: "Contrast on the background was only half the job. Once every colour passed, I noticed how often I lost my place. In most themes, mine included, the selection, the line the cursor is on and the current search match were barely lighter than the background. In my dark themes a selection sat at 1.2 to 1.4 to 1, so it could pass for the background. Versions 0.5.0 and 0.6.0 fixed each one and taught the check to measure them.",
      },
      {
        type: "table",
        headers: ["What", "Before", "Now"],
        rows: [
          ["Selection", "1.1 to 1.4 to 1 on the background", "A solid block in a colour from the theme's own palette with every selected character in one text colour, the way a terminal draws it. The block and the text on it both sit at 7.4 to 9 to 1"],
          ["Current line", "About 1.1 to 1, easy to lose", "A calm band at 1.3 to 1.4 to 1. Plain text, the line number and the cursor keep 7 to 1 over it and every syntax colour keeps 4.5 to 1"],
          ["Other find matches, the word under the cursor and matched brackets", "Fills that could pass for the current match or a selection", "Outlines or underlines with no fill, so they never hide a character. Yellow on Black underlines the word under the cursor with dashes in Neovim and dots in JetBrains IDEs so it does not rely on colour alone"],
          ["Changed lines", "Left to each editor's defaults", "Diff marks beside the code in VS Code, Neovim, Zed and Emacs, checked against every other highlight"],
        ],
        caption: "What versions 0.5.0 and 0.6.0 changed about finding your place",
      },
      {
        type: "p",
        text: "Where an editor keeps each selected word in its own colour, such as VS Code in Zacess Light, Dark and Cream, the selection is a fill in the same hue as strong as the floors allow, with every syntax colour still at 4.5 to 1 over it. The check now reads the cursor, the current line, the find match, the outlines, the diff marks and all 16 terminal colours back out of every generated file. It fails any highlight that should be an outline but has a fill.",
      },
      { type: "h3", text: "More editors and every terminal" },
      {
        type: "p",
        text: "Version 0.4.0 added an Eclipse plugin on the Eclipse Marketplace and Xcode themes, with every syntax type confirmed against the themes Xcode 27.1 ships. Version 0.6.0 added Terminal.app, Warp and WezTerm, which makes eight terminals. It also added an installer: run install.sh in any of them (install.ps1 for Windows Terminal) and it finds the terminal, copies all eight themes to the folder it reads and prints the one step that turns one on. It never edits a settings file. Zacess Yellow on Black now draws terminal text in its own yellow instead of white, matching its editor. All eight themes are in the iTerm2 Color Schemes collection, which Ghostty, WezTerm and Windows Terminal draw their theme lists from. I have also sent them to the kitty and Warp theme collections. Version 0.6.1 split the long README into short guides, including a table of every syntax role in all eight themes and the settings that make each editor follow the system's light and dark mode.",
      },
      {
        type: "diagram",
        code: `flowchart LR
    P["palette/zacess.json<br/>one palette, eight themes"] --> B["build script"]
    B --> E["VS Code, JetBrains, Obsidian, Neovim, Zed,<br/>Sublime Text, Helix, Emacs, Eclipse, Xcode"]
    B --> T["iTerm2, Terminal.app, Ghostty, kitty,<br/>WezTerm, Warp, Alacritty, Windows Terminal"]
    P --> C["check script<br/>7 to 1 text, 3 to 1 borders,<br/>selection, current line, outlines,<br/>colour blindness pairs"]
    C --> R["release<br/>stores and read-only copies"]`,
        caption: "One palette generates every editor and terminal. Nothing ships until the checks pass",
      },
      {
        type: "p",
        text: "Every colour comes from one palette file, so a fix lands in every editor at once. The check script refuses any text or syntax colour under 7 to 1 on the background and the diff backgrounds and under 4.5 to 1 over the selection and the current line. It refuses any border under 3 to 1. It also simulates protanopia, deuteranopia and tritanopia and fails if two kinds of code, such as functions and types, look the same to someone with that kind of colour blindness. When I made Yellow on Black use fewer greens, the first lavender I tried for types failed that check against the blue functions, so I picked a lighter one. Terminals are the one place with an allowance: the coloured slots in the four light themes may sit at 4.5 to 1, the level WCAG AA asks for, because at 7 to 1 they read as black on white. Their black, white and grey slots and every code colour stay at 7 to 1 or more.",
      },
      {
        type: "table",
        headers: ["Where", "How to get it"],
        rows: [
          ["VS Code", "[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=zacess.zacess-themes)"],
          ["VSCodium and other VS Code based editors", "[Open VSX](https://open-vsx.org/extension/zacess/zacess-themes)"],
          ["Obsidian", "[Obsidian community directory](https://community.obsidian.md/themes/zacess)"],
          ["Neovim", "[zacess.nvim](https://github.com/zacesshq/zacess.nvim) with any plugin manager, listed in [awesome-neovim](https://github.com/rockerBOO/awesome-neovim)"],
          ["JetBrains IDEs", "[JetBrains Marketplace](https://plugins.jetbrains.com/plugin/35082-zacess-themes)"],
          ["Zed", "[Zed extension store](https://zed.dev/extensions?query=zacess)"],
          ["Eclipse", "[Eclipse Marketplace](https://marketplace.eclipse.org/content/zacess-themes-0) or the [update site](https://zacesshq.github.io/themes/eclipse/) through Help, Install New Software"],
          ["Xcode", "The [themes repository](https://github.com/zacesshq/themes/tree/main/editors/xcode), brought in with Settings, Themes, Import Classic Theme in Xcode 27"],
          ["Sublime Text, Helix and Emacs", "The [latest release](https://github.com/zacesshq/themes/releases/latest)"],
          ["iTerm2, Terminal.app, Ghostty, kitty, WezTerm, Warp, Alacritty and Windows Terminal", "All eight are in [iTerm2 Color Schemes](https://github.com/mbadolato/iTerm2-Color-Schemes), so the terminals that draw from it list them. The [themes repository](https://github.com/zacesshq/themes/tree/main/editors/terminals) has a file for every terminal and an installer that copies them all"],
          ["Latest release", "The [latest release](https://github.com/zacesshq/themes/releases/latest) on GitHub, published to every store above at the same time"],
        ],
        caption: "Where the code themes are published",
      },
      {
        type: "p",
        text: "A tag builds the VS Code extension, the JetBrains plugin and zips for the other editors and publishes them to the stores. A release script then creates the GitHub release and updates the read-only copies that Obsidian and Neovim install from, with signed commits and tags.",
      },
      { type: "h2", text: "Zacess Scenes" },
      {
        type: "p",
        text: "The themes made the terminal readable. I also wanted something calm to look at while a build runs, without anything that flashes. [Zacess Scenes](https://zacess.com/scenes/) is one small Rust program that draws animated scenes with text characters in the colours of the Zacess theme the terminal is using. Every colour keeps 4.5 to 1 on the background and 7 to 1 on the High Contrast and Deep Contrast themes. A scene fits any terminal from 20 columns by 8 rows up to a full screen and slows down when the system or the person asks for reduced motion. It is MIT licensed in [zacesshq/scenes](https://github.com/zacesshq/scenes) and version 0.4.0 came out on 29 October 2026.",
      },
      {
        type: "image",
        src: `${IMG}/scenes/koi-pond.webp`,
        alt: "The koi-pond scene in Zacess Deep Contrast Dark: a garden pond from above drawn in text characters, with koi in white, yellow and coral gliding under green lily pads and small blue ripples on black",
        caption: "koi-pond, one of the 16 pass scenes, in Deep Contrast Dark",
      },
      {
        type: "table",
        headers: ["Group", "How many", "Examples"],
        rows: [
          ["The original scenes", "10", "sea, rain, snow, starfield, code-rain, fireflies, aurora, campfire, waves and the Zacess mark"],
          ["Pass scenes", "16", "koi-pond, harbour, lanterns, balloons, countryside, winter-cabin, tea and cat-nap"],
          ["Fail scenes", "13", "storm, flood, listing-ship, fog, leak, blackout, traffic-jam and drought"],
        ],
        caption: "39 scenes. The fail scenes read as something gone wrong but move slowly and then hold, so nothing ever flashes, shakes or spins",
      },
      {
        type: "image",
        src: `${IMG}/scenes/harbour.webp`,
        alt: "The harbour scene in Zacess Deep Contrast Dark, drawn in text characters: a crescent moon and stars over a row of buildings with lit windows, a lighthouse, lamps along the quay and moored boats with their masts reflected in the water",
        caption: "harbour, a pass scene",
      },
      {
        type: "image",
        src: `${IMG}/scenes/flood.webp`,
        alt: "The flood scene in Zacess Deep Contrast Dark, drawn in text characters: a street of houses with red roofs and yellow windows under grey cloud and light rain, with a warning sign standing in the road",
        caption: "flood, a fail scene: as it runs the water rises slowly past the doors and nothing flashes",
      },
      { type: "h3", text: "Watching a Rust build" },
      {
        type: "p",
        text: "Watch mode runs [bacon](https://dystroy.org/bacon/) in a Rust project and reads the report it writes after each run. While the build passes it shows a calm scene with a large ALL GOOD banner and any warnings. While it fails it shows a fail scene with a large BUILD FAILED banner and the first errors with their locations. When a failing build is fixed, the pass scene opens out from the middle of the screen and the status bar says recovered. Every state is written on screen as well as shown, so colour or sound is never the only signal. With the notify option each change also becomes a desktop notification that a screen reader announces.",
      },
      {
        type: "image",
        src: `${IMG}/scenes/watch-pass.webp`,
        alt: "Watch mode while a build passes: a calm sea of cyan and blue waves with gulls and a yellow sun, a large green ALL GOOD banner with a check mark, the caption Everything builds. Time to stretch your legs. and a status bar reading my-project, check, passing, 0 warnings, 12s ago",
        caption: "Watch mode while the build passes",
      },
      {
        type: "image",
        src: `${IMG}/scenes/watch-fail.webp`,
        alt: "Watch mode while a build fails: slanting rain under rows of grey cloud, a large coral BUILD FAILED banner with a cross, the caption Something broke. The storm will pass. and two errors with their file and line, one warning in yellow and a status bar reading failing, 2 errors, 1 warning",
        caption: "The same project while the build fails: errors are marked with a cross and warnings with an exclamation mark, so they differ in shape as well as colour",
      },
      {
        type: "table",
        headers: ["Part", "What it does"],
        rows: [
          ["Sound sets", "Eight sets synthesised when the program runs: bells, marimba, kalimba, pad, chip, glass, piano and rain. Every set plays the same phrase for each event and every tone is levelled to the same loudness. Sound can be turned off or kept to waking hours"],
          ["Config file", "A scenes.toml file for the theme, the pass and fail scenes, how they rotate, motion, sound, quiet hours and notifications"],
          ["Lua scenes", "A scene of your own in Lua, run in a sandbox with no file or system access, a budget per frame and a memory limit. A Lua scene draws with palette roles, never raw colours, so it keeps the contrast floor too"],
          ["Snapshots", "An SVG still of any scene with a text description for screen readers or JSON frames for a web page to play"],
          ["Flash meter", "Measures how much each region of a frame changes in brightness. Every scene is checked in all eight themes at four sizes and six motion settings for contrast and for no more than three large changes of brightness in any second"],
          ["Docs", "A docs folder covers the commands, watch mode, sound sets, configuration, themes, Lua scenes, snapshots and every scene in detail"],
        ],
        caption: "What else is in version 0.4.0",
      },
      {
        type: "image",
        src: `${IMG}/scenes/lanterns-light.webp`,
        alt: "The lanterns scene in Zacess Light, drawn in text characters: paper lanterns in red, amber and purple rising over a green line of hills on white, with their reflections on the lake below",
        caption: "The lanterns scene in a light theme. Every scene follows the active Zacess theme",
      },
      {
        type: "p",
        text: "It is not on crates.io yet, so Cargo installs it from the release tag on GitHub. It needs Rust 1.85 or later and a C compiler, since Lua 5.4 is built into the program. Each [release](https://github.com/zacesshq/scenes/releases/latest) also carries a ready-built binary for macOS on Apple silicon and Intel, Linux on x86-64 and ARM64 and Windows on x86-64, each with a checksum file.",
      },
      {
        type: "code",
        lang: "bash",
        text: `cargo install --locked --git https://github.com/zacesshq/scenes --tag v0.4.0 zacess-scenes
zacess-scenes koi-pond           # one scene by name
cd my-project && zacess-scenes watch --sounds piano --notify`,
      },
      { type: "h2", text: "Zacess Games" },
      {
        type: "p",
        text: "Scenes gave the terminal something calm to watch. I also wanted something to play there that holds the same rules on contrast, flashing and motion. [Zacess Games](https://zacess.com/games/) is fourteen original games for the terminal, drawn in the eight Zacess themes. Each game is written in Rust with its levels in Lua and is built on the Zacess Scenes library, so the games share the scenes' themes, contrast floors, flash meter and reduced motion. Every game is its own design and none copies an existing game's rules, board or goal. Version 0.1.0 came out on 29 October 2026 under the MIT licence in [zacesshq/games](https://github.com/zacesshq/games).",
      },
      {
        type: "image",
        src: `${IMG}/games/menu.webp`,
        alt: "The Zacess Games menu in Zacess Deep Contrast Dark: a cyan box headed Pick a game lists the fourteen games in two columns, each with its own symbol and colour, from Stackline to Learn to Code. Stackline is selected and described underneath as Join rails across two wells. The header shows FX 35% and Music 20% and two key lines run along the bottom",
        caption: "The menu: every game in one place, with the effects and music levels always in the header",
      },
      {
        type: "p",
        text: "Each game makes its own sound effects and a calm music loop as it runs, with nothing to download. Effects and music have separate volumes that are remembered between runs and both can be muted with one key. Every game has a How to play page one key away, so the rules are never far off.",
      },
      {
        type: "table",
        headers: ["Game", "What it is"],
        rows: [
          ["Stackline", "Circuit parts fall into two wells. A full row that carries wire from rail to rail clears and pushes a feedback row into the other well"],
          ["Merge Gates", "Push four-bit tiles together through a track of logic gates to make the target output"],
          ["Termle", "Guess a daily electronics or programming term from a category clue, with a streak for days in a row"],
          ["Signal", "A calm rhythm game: catch notes on three lanes as they reach the line"],
          ["Trace", "Route wire from a source to light every node without crossing"],
          ["Drift", "Steer a lantern over a quiet landscape to gather light. There is no way to lose"],
          ["Rooms", "A short roguelike through a broken server: carry parts to faults to open the doors"],
          ["Relay", "Move a packet through gates that keep time with the move count, portals and one-way tiles"],
          ["Through Ball", "Turn-based football about passing lanes and a keeper's reach, over five attacks"],
          ["Slipstream", "A calm road race against the fuel gauge, with slipstreams and a pit lane"],
          ["Array Guard", "Clear drifting debris to protect five satellite dishes"],
          ["Heatsink", "Type electronics terms and code fragments before they reach a chip and heat it, with a calm mode"],
          ["Touch Typing", "A trainer from the home row to timed tests, with an on-screen keyboard that shows the finger for every key"],
          ["Learn to Code", "Fifteen tracks of small programs to fill in, with hints and messages that teach"],
        ],
        caption: "The fourteen games. Eight of them never move on their own and wait for the next key",
      },
      {
        type: "image",
        src: `${IMG}/games/stackline.webp`,
        alt: "Stackline in Zacess Deep Contrast Dark: two wells side by side with a red rail marked plus on the left and a blue rail marked minus on the right of each, a few cyan across parts and magenta upright parts near the bottom and a white piece falling in Well B. A Next panel shows a yellow piece and a key explains across, upright, both and feedback parts",
        caption: "Stackline, part way through a game. Each kind of part has its own shape as well as its own colour",
      },
      { type: "h3", text: "Learn to Code" },
      {
        type: "p",
        text: "Learn to Code has 287 levels across fifteen tracks: Python, Java, C, C++, JavaScript, TypeScript, SQL, Bash and Linux, Git, Rust, Go, C#, Kotlin, Data Structures and Algorithms and AI in Python. Java is the longest at 30 levels and TypeScript the shortest at 15. Each level teaches one idea with a short lesson and a few lines of code with blanks to fill in. A wrong answer gets a message that explains the mistake, a hint is one key away and the answer appears after three tries. Answers are checked inside the game against each level's own list, so nothing typed is ever run as a program. Progress is saved for each language.",
      },
      {
        type: "image",
        src: `${IMG}/games/learn-to-code.webp`,
        alt: "Learn to Code in Zacess Deep Contrast Dark on level 1 of 22 of the Python track. A purple box explains that print shows a value on the screen and that text goes inside quotes. Below it the code line print( Hello ) has the word Hello typed into the blank without quotes, a yellow cross reads Blank 1: Text needs quotes around it. and the expected output Hello, world is shown underneath",
        caption: "Learn to Code explains a wrong answer instead of only marking it wrong",
      },
      { type: "h3", text: "Touch Typing" },
      {
        type: "p",
        text: "Touch Typing runs from the home row to timed tests over 25 lessons in five levels. An on-screen keyboard shows the finger for every key by bracket shape as well as colour, the next key is marked and a missed key is marked underneath rather than by blinking. The keyboard follows the layout of the machine it runs on: UK Mac, UK PC or US, read from the system on macOS, Windows and Linux. The finger hints, the Shift and Option hints and the symbols lesson all follow it, so the keys on screen match the keys under your fingers.",
      },
      {
        type: "image",
        src: `${IMG}/games/touch-typing.webp`,
        alt: "Touch Typing in Zacess Deep Contrast Dark on Beginner lesson 1 of 25, F and J with the index fingers, on a UK Mac (Apple British) keyboard. Typed letters are green with one slip marked by a caret underneath. Below, Next: space, either thumb sits above a keyboard where each key's finger is shown by round, curly, square or angle brackets in its own colour, with a key to the bracket shapes",
        caption: "The standard layout: the line to type, the next key with its finger and the keyboard for the layout in use",
      },
      { type: "h3", text: "From a quarter tmux pane to full screen" },
      {
        type: "p",
        text: "Every game and the menu lay themselves out for the window they are in and choose again on every resize without losing the game. From 60 by 20, about a quarter of a tmux window, a compact layout keeps one status line and one key line and moves the side panels' facts into the status line. From 100 by 30 the full status bar and side panels appear. From 160 by 45 the boards are drawn at twice the size and Touch Typing gets a larger keyboard of boxed keys with a progress panel. Below 60 by 20 a message gives the size needed and the size now.",
      },
      {
        type: "image",
        src: `${IMG}/games/stackline-compact-light.webp`,
        alt: "Stackline in the compact layout in Zacess Light: the same two wells with red plus rails and blue minus rails on white, a single status line reading Score 0, Rows 0 and the next piece with the effects and music levels, no side panel and one key line at the bottom",
        caption: "Stackline in the compact layout and a light theme. The Next panel's facts move into the status line",
      },
      {
        type: "image",
        src: `${IMG}/games/touch-typing-large.webp`,
        alt: "Touch Typing in the large layout in Zacess Deep Contrast Dark: the lesson line across the top, a keyboard of boxed keys coloured and bracketed by finger with a wide space bar and a Progress panel on the right showing 66 words a minute, 92% accuracy against the 95% needed, the weakest key and lessons unlocked for each of the five levels",
        caption: "Touch Typing in the large layout, with boxed keys and a progress panel",
      },
      { type: "h3", text: "Accessibility" },
      {
        type: "table",
        headers: ["Need", "What the games do"],
        rows: [
          ["Contrast", "Every colour keeps at least 4.5 to 1 on the theme's own painted background and at least 7 to 1 on the High Contrast and Deep Contrast themes. A test draws every game in all eight themes and checks every colour on screen"],
          ["No flashing", "Every frame passes through the Scenes flash meter. Clears, merges and wins are marked by a calm change of shape rather than blinking"],
          ["Reduced motion", "A flag, an environment variable or the system setting slows the real time games down. Six games run in time and the rest wait for a key"],
          ["Colour and sound", "Every piece, tile and state has a shape or letter as well as a colour. Every sound has a written twin on screen, so neither is ever the only signal"],
          ["Pause and help", "Every game pauses at any moment and its How to play page is one key away"],
        ],
        caption: "What every game keeps to, from the repository's accessibility statement",
      },
      {
        type: "p",
        text: "Like Scenes, it is not on crates.io, so Cargo installs it from the release tag on GitHub. It needs Rust 1.88 or later and a C compiler, since Lua 5.4 is built into the program. Sound plays through the system's own player, so nothing else is needed. Each [release](https://github.com/zacesshq/games/releases/latest) also carries a ready-built binary for macOS on Apple silicon and Intel, Linux on x86-64 and ARM64 and Windows on x86-64, each with a checksum file.",
      },
      {
        type: "code",
        lang: "bash",
        text: `cargo install --locked --git https://github.com/zacesshq/games --tag v0.1.0 zacess-games
zacess-games                     # the menu
zacess-games learn-to-code       # one game by name`,
      },
      { type: "h2", text: "How it is checked" },
      {
        type: "table",
        headers: ["Check", "What it covers"],
        rows: [
          ["Core tests", "About 300 tests across import, layout, the reading model, exports and the library"],
          ["WebAssembly tests", "20 tests of the functions the browser calls"],
          ["Browser app tests", "57 tests with Vitest, Testing Library and axe"],
          ["Accessibility", "Zero axe violations at WCAG 2.2 A and AA on every screen plus AAA contrast in the reading view"],
          ["Touch and layout", "15 device profiles on WebKit and Chromium, in light and dark, with no control under 44 pixels and no sideways scroll at 320 pixels or at 200 percent zoom"],
          ["Document quality", "A fixed set of documents is scored on every change for characters, numbers, reading order and headings, so a change can never quietly make a document harder to read"],
        ],
        caption: "What runs on every change",
      },
      { type: "h2", text: "The demos" },
      {
        type: "clip",
        src: `${VID}/open.mp4`,
        poster: `${VID}/open.webp`,
        alt: "A two page PDF of lecture notes is chosen and opens as a reading view with a heading, paragraphs, a list and a table",
        caption: "Opening a PDF: the structure comes back as real headings, lists and tables",
      },
      {
        type: "clip",
        src: `${VID}/scan.mp4`,
        poster: `${VID}/scan.webp`,
        alt: "A photo of a printed handout is chosen, the text recogniser loads and the recognised text appears with a few doubtful words highlighted",
        caption: "A photographed handout: text recognised on the device, doubtful words highlighted",
      },
      {
        type: "clip",
        src: `${VID}/profile.mp4`,
        poster: `${VID}/profile.webp`,
        alt: "The Low Vision preset is chosen, then Dyslexia-Friendly, the text size and line spacing are increased, dark mode is switched on and the settings panel is hidden so the page fills the screen",
        caption: "Presets, text size, dark mode and a hidden panel for focus",
      },
      {
        type: "clip",
        src: `${VID}/read-aloud.mp4`,
        poster: `${VID}/read-aloud.webp`,
        captions: `${VID}/read-aloud.en.vtt`,
        alt: "The Play button is pressed and each sentence is highlighted as a voice reads it, then the speed is raised and playback is paused",
        caption: "Turn the sound on for this one: each sentence is highlighted as it is spoken",
      },
      {
        type: "clip",
        src: `${VID}/links-export.mp4`,
        poster: `${VID}/links-export.webp`,
        alt: "A PDF with two links is opened, the list of links in the document is shown, an address appears on focus and an EPUB is downloaded",
        caption: "The links list and an EPUB download",
      },
      {
        type: "clip",
        src: `${VID}/phone.mp4`,
        poster: `${VID}/phone.webp`,
        alt: "On an iPhone sized screen a photo is taken, the text is recognised, the document opens and the settings panel is hidden",
        caption: "On a phone: Take a photo, read it, hide the panel",
      },
      {
        type: "clip",
        src: `${VID}/site-tour.mp4`,
        poster: `${VID}/site-tour.webp`,
        alt: "The Zacess website home page with the tagline highlighted word by word, the colour mode menu set to dark and the How it works page",
        caption: "The website at zacess.com",
      },
      {
        type: "clip",
        src: `${VID}/themes.mp4`,
        poster: `${VID}/themes.webp`,
        alt: "The code themes page at zacess.com as it was with the original four themes: the theme menu switches between Zacess Light, Dark, Yellow on Black and Cream, the language menu switches between TypeScript, Python, Rust and HTML, then the page scrolls to the four-theme grid and the install cards",
        caption: "The code themes page with the original four themes, each on each language",
      },
      { type: "h2", text: "What is next" },
      {
        type: "p",
        text: "The core already has lecture capture, study tools, bilingual reading, universal capture and a local-first sync engine. They need interfaces. Next come the apps for Windows, macOS, Linux, iOS and Android on the same core, then those features in the browser. Before any of that, the browser version needs to be used by people who rely on screen readers every day, because automated checks cannot tell me whether it is pleasant to use. The roadmap lives in the issues of the repository and anyone is welcome to join in. Beside the reader, [Zacess Games](https://zacess.com/games/) takes ideas for new games through a game idea form in its repository and extra Trace, Relay and Learn to Code levels can be written in Lua without building anything.",
      },
    ],
}

export default _zacess
