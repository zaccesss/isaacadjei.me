import type { Project } from "../index"

const IMG = "/images/projects/zacess"
const VID = "/videos/projects/zacess"

const _zacess: Project = {
    id: "zacess",
    title: "Zacess: Make Every Page Accessible",
    description:
      "A free, open-source reader that turns PDFs, scans, Word files and web pages into notes in your own reading profile, reads them aloud and keeps every file on your device. The browser version is live, built on a Rust core compiled to WebAssembly.",
    longDescription:
      "Zacess (said like success, from the Latin cēdō, the root of both access and success) is a reader I am building for people who find standard documents hard to read. You open a PDF, a photo of a handout, a Word file or a web page and it comes back as notes in a reading profile you set once: font, size up to 96 points, line and letter spacing, column width, a contrast theme and a reading ruler. It can read the page aloud with the voices already on the device and export clean HTML or EPUB 3.\n\nI read with one eye, so contrast, size and spacing are practical needs for me. Much of what I study arrives as slides, PDFs with no text layer and photos of whiteboards, which are the formats that are hardest to read. The tools that help are scattered and some keep your files on someone else's server. Zacess is the single tool I wanted: it does the work in the browser, never uploads a file, needs no account and tracks nothing.\n\nThe heart of it is a core written in Rust and compiled to WebAssembly, which lays out text, finds the reading order, marks every doubtful word and writes the document. The same code runs in the browser version at app.zacess.com now and will run inside the desktop and mobile apps later. pdf.js reads PDFs, Tesseract recognises pictures on the device and mammoth turns Word files into HTML before the core takes over. The interface is React with shadcn/ui on Radix. It is checked with axe and on WebKit as well as Chromium so it works by touch on phones and tablets.",
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
    ],
    links: [
      { label: "Discussions", url: "https://github.com/orgs/zacesshq/discussions" },
    ],
    sections: [
      { type: "h2", text: "Why I built it" },
      {
        type: "p",
        text: "A lot of study material arrives in the formats that are hardest to read: slides on a projector, PDFs with no text layer and photos of whiteboards. A screen magnifier does one job, a video magnifier another and a service for disabled students costs money and holds your files on someone else's server. I wanted one tool that lets me set the page the way my eyes need it, reads it aloud and never asks me to hand over the file.",
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
          ["contrast", "dark_on_light, light_on_dark, yellow_on_black or black_on_cream"],
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
      { type: "h2", text: "How it is checked" },
      {
        type: "table",
        headers: ["Check", "What it covers"],
        rows: [
          ["Core tests", "About 300 tests across import, layout, the reading model, exports and the library"],
          ["WebAssembly tests", "20 tests of the functions the browser calls"],
          ["Browser app tests", "51 tests with Vitest, Testing Library and axe"],
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
      { type: "h2", text: "What is next" },
      {
        type: "p",
        text: "The core already has lecture capture, study tools, bilingual reading, universal capture and a local-first sync engine. They need interfaces. Next come the apps for Windows, macOS, Linux, iOS and Android on the same core, then those features in the browser. Before any of that, the browser version needs to be used by people who rely on screen readers every day, because automated checks cannot tell me whether it is pleasant to use. The roadmap lives in the issues of the repository and anyone is welcome to join in.",
      },
    ],
}

export default _zacess
