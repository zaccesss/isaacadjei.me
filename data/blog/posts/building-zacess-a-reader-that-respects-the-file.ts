import type { BlogPost, ContentBlock } from "../index"

const IMG = "/images/projects/zacess"
const VID = "/videos/projects/zacess"

export const zacessLaunch: ContentBlock[] = [
  {
    type: "p",
    text: "Zacess is a free, open-source reader that turns a PDF, a photo of a handout, a Word file or a web page into notes in a reading profile you set once. The browser version is open at [app.zacess.com](https://app.zacess.com) and the project has its own site at [zacess.com](https://zacess.com). This is why I built it, how it works and what it cannot do yet.",
  },
  {
    type: "image",
    src: `${IMG}/app-light.webp`,
    alt: "The Zacess browser version with a document open: the settings panel beside a page of notes with a heading, a list and a table",
    caption: "The browser version with a document open",
  },
  { type: "h2", text: "Why I built it" },
  {
    type: "p",
    text: "I read with one eye, so contrast, size and spacing are practical needs and not preferences. A lot of study material arrives in the formats that are hardest to read: slides on a projector, PDFs with no text layer and photos of whiteboards. The tools that help exist but they are scattered. A screen magnifier does one job, a video magnifier another and a service for disabled students costs money and keeps your files on someone else's server. I wanted one tool that lets me set the page the way my eyes need it, reads it aloud and never asks me to hand over the file.",
  },
  {
    type: "p",
    text: "The name is said like success. It comes from the Latin cēdō, to go or to yield, which is the root of both access and success. That is the idea in one word: get access first and success follows.",
  },
  { type: "h2", text: "What it does today" },
  {
    type: "ul",
    items: [
      "Opens PDFs, photos and scans, Word files, web pages, Markdown and pasted text.",
      "Recognises text in pictures on your device and marks every doubtful word, number or symbol so you can check it.",
      "Rebuilds the headings, lists, tables, equations and links in the right reading order.",
      "Shows the result in your own reading profile: text size up to 96 points, spacing, column width, colours and a reading ruler.",
      "Reads it aloud with the voices already on your device, highlighting each sentence.",
      "Exports clean HTML or EPUB 3 in your profile.",
    ],
  },
  {
    type: "clip",
    src: `${VID}/open.mp4`,
    poster: `${VID}/open.webp`,
    alt: "A two page PDF of lecture notes is chosen and opens as a reading view with a heading, paragraphs, a list and a table",
    caption: "Opening a PDF: the structure comes back as real headings, lists and tables",
  },
  { type: "h2", text: "A scan, with the doubtful words marked" },
  {
    type: "p",
    text: "Text recognition is never perfect. A wrong digit in a lab sheet is worse than a missing word. So every word keeps the confidence score the recogniser gave it and anything below the line is highlighted. The model can also record that a word was confirmed or corrected and keep the original one step away, but the browser version only marks the doubtful words for now and does not edit them yet. The point is that Zacess shows you where it is unsure instead of pretending it is not.",
  },
  {
    type: "clip",
    src: `${VID}/scan.mp4`,
    poster: `${VID}/scan.webp`,
    alt: "A photo of a printed handout is chosen, the text recogniser loads and the recognised text appears with a few doubtful words highlighted",
    caption: "A photographed handout: text recognised on the device, doubtful words highlighted",
  },
  { type: "h2", text: "Your reading profile" },
  {
    type: "p",
    text: "A reading profile is a handful of settings: font, size, line and letter spacing, column width, a contrast theme and a reading ruler. There are four presets to start from, for low vision, for dyslexia, for less visual clutter and for screen readers. Every control can be changed from there. The settings are kept in your browser and nowhere else, so the page looks the same when you come back.",
  },
  {
    type: "p",
    text: "The four contrast themes are chosen by ratio and not by taste. Dark on light is 18.9 to 1, light on dark is 17.2, yellow on black is 17.2 and black on cream is 19.5. WCAG AAA asks for 7 to 1. Once a document is open you can hide the settings so the page takes the whole width. Bring them back whenever you want.",
  },
  {
    type: "clip",
    src: `${VID}/profile.mp4`,
    poster: `${VID}/profile.webp`,
    alt: "The Low Vision preset is chosen, then Dyslexia-Friendly, the text size and line spacing are increased, dark mode is switched on and the settings panel is hidden so the page fills the screen",
    caption: "Presets, text size, dark mode and a hidden panel for focus",
  },
  {
    type: "image",
    src: `${IMG}/app-dark.webp`,
    alt: "The same document in dark mode with large text and wide line spacing",
    caption: "The same page in dark mode",
  },
  { type: "h2", text: "Reading aloud" },
  {
    type: "p",
    text: "Read aloud uses the voices already on your device. Online voices are off by default and clearly labelled, because an online voice sends the text it reads to the company that provides the voice. It highlights the sentence being read, starts from the paragraph you last clicked and has play, pause, previous, next and a speed control. It starts from a tap, which is what iPhone and iPad need. The demo clip for it has sound and captions.",
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
  { type: "h2", text: "Links and export" },
  {
    type: "p",
    text: "A link in a PDF, a web page or a Word file becomes a real link that is underlined and marked, so it is never shown by colour alone. It is listed in a panel so you do not have to hunt for it. The address appears on hover or focus. Read aloud says the link text followed by the word link, never the address unless you ask for that. Zacess never fetches a link, so reading a document cannot reveal that you read it.",
  },
  {
    type: "clip",
    src: `${VID}/links-export.mp4`,
    poster: `${VID}/links-export.webp`,
    alt: "A PDF with two links is opened, the list of links in the document is shown, an address appears on focus and an EPUB is downloaded",
    caption: "The links list and an EPUB download",
  },
  { type: "h2", text: "On a phone or a tablet" },
  {
    type: "p",
    text: "It works by touch and not just on a large screen. Every control is at least 44 pixels, the header holds one row at 320 pixels wide and the layout survives 200 percent text. On a phone there is a Take a photo button that sends a page straight to text recognition.",
  },
  {
    type: "clip",
    src: `${VID}/phone.mp4`,
    poster: `${VID}/phone.webp`,
    alt: "On an iPhone sized screen a photo is taken, the text is recognised, the document opens and the settings panel is hidden",
    caption: "On a phone: Take a photo, read it, hide the panel",
  },
  { type: "h2", text: "How it is put together" },
  {
    type: "p",
    text: "A file never goes to a server. In the browser, pdf.js reads PDFs, Tesseract recognises pictures and mammoth turns Word files into HTML. The result goes to the core, which I wrote in Rust and compiled to WebAssembly. The core finds the reading order, the headings, the lists and the tables, scores every word and writes the document.",
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
  {
    type: "p",
    text: "The core is 440 kilobytes, about 177 gzipped. The same code will run inside the desktop and mobile apps later, so a fix in one place fixes every version.",
  },
  { type: "h3", text: "The document model" },
  {
    type: "p",
    text: "Everything in Zacess passes through one model. A document has pages and blocks in reading order. A block is a heading, a paragraph, a list, a table, an image, an equation or a page break. Text sits in runs. Each run keeps where it came from on the page, how sure the recogniser was and whether you have confirmed or corrected it. That link back to the page is what keeps the reading view faithful to the original.",
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
    type: "p",
    text: "The model has a version number and rules for changing it, so a file saved today still opens in a later release.",
  },
  { type: "h2", text: "The same colours in your code editor" },
  {
    type: "p",
    text: "The four contrast themes worked so well in the reader that I wanted them in my editor and terminal too. Zacess Light, Zacess Dark, Zacess Yellow on Black and Zacess Cream are now code themes for VS Code, JetBrains IDEs, Obsidian, Neovim, Zed, Sublime Text, Helix, Emacs and five terminals. Every text and syntax colour keeps at least 7 to 1 contrast and the colours are tested under three kinds of colour blindness, so two kinds of code never look the same.",
  },
  {
    type: "clip",
    src: `${VID}/themes.mp4`,
    poster: `${VID}/themes.webp`,
    alt: "The code themes page at zacess.com: the theme menu switches between Zacess Light, Dark, Yellow on Black and Cream, the language menu switches between TypeScript, Python, Rust and HTML, then the page scrolls to the four-theme grid and the install cards",
    caption: "Each theme on each language on the code themes page",
  },
  {
    type: "p",
    text: "They are on the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=zacess.zacess-themes), on [Open VSX](https://open-vsx.org/extension/zacess/zacess-themes) for Cursor and VSCodium and in the [Obsidian community directory](https://community.obsidian.md/themes/zacess). Neovim installs them from [zacess.nvim](https://github.com/zacesshq/zacess.nvim). The [code themes page](https://zacess.com/themes/) lets you try each theme on 20 languages before you install anything.",
  },
  { type: "h2", text: "Private by design" },
  {
    type: "p",
    text: "The app reads every file in your browser. Nothing is uploaded, there is no account and nothing is tracked. The page's security policy lets it talk only to its own origin, so the browser itself blocks a request to anywhere else. Your settings are kept in this browser only.",
  },
  { type: "h2", text: "What it cannot do yet" },
  {
    type: "ul",
    items: [
      "It has not been tested with people who use screen readers every day. I have run automated checks with axe and tried it on iPhone, iPad and desktop browser engines, but testing with VoiceOver, NVDA, JAWS and TalkBack users is still to do.",
      "Braille-ready export exists in the core but needs liblouis built for WebAssembly before it reaches the browser.",
      "PowerPoint files do not open yet.",
      "A link to a place inside a PDF stays plain text.",
      "The dyslexia preset asks for the Lexend font, which is not bundled yet, so it falls back to your system font.",
      "Lecture capture, study tools and the apps for Windows, macOS, Linux, iOS and Android are built in the core but have no interface yet.",
    ],
  },
  { type: "h2", text: "Open source and what comes next" },
  {
    type: "p",
    text: "The code is under the AGPL, so anyone can check how it works and nobody can take it and close it. The [repository](https://github.com/zacesshq/zacess) holds the roadmap issues and [Discussions](https://github.com/orgs/zacesshq/discussions) are open for ideas, problems and the material you find hardest to read. Next come the apps, lecture mode and study tools on the same core.",
  },
  {
    type: "p",
    text: "If you try it, the most useful thing you can tell me is what did not work for the way you read. The [project page](/projects/zacess) has the full detail.",
  },
]

const _building_zacess: BlogPost = {
  slug: "building-zacess-a-reader-that-respects-the-file",
  title: "Building Zacess: A Reader That Respects the File",
  date: "2026-10-14",
  type: "blog",
  cover_image: "/images/projects/zacess/cover.webp",
  cover_image_dark: "/images/projects/zacess/cover-dark.webp",
  cover_alt: "The Zacess logo beside a framed screenshot of the reader with a document open",
  description:
    "Zacess is a free, open-source reader that turns PDFs, scans, Word files and web pages into notes in your own reading profile, reads them aloud and keeps every file on your device. Why I built it, how it works, short demos, the matching code themes and what it cannot do yet.",
  tags: ["Accessibility", "Rust", "WebAssembly", "TypeScript", "Zacess", "Code themes"],
  projectSlug: "zacess",
  published: true,
  content: zacessLaunch,
}

export default _building_zacess
