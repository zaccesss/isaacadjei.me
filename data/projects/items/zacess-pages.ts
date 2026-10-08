import type { Project } from "../index"

const _zacess_pages: Project = {
    id: "zacess-pages",
    title: "zacess.com: Terminal Landing Page",
    description:
      "The landing page for zacess.com: a working terminal in the browser with a boot sequence, command history, tab autocomplete and a daily quote, built with Next.js, TypeScript and Tailwind CSS.",
    longDescription:
      "zacess-pages is the landing page for zacess.com while I rebuild the full site. Instead of a static under construction notice it is a real terminal in the browser, built as a Next.js App Router application with TypeScript and Tailwind CSS. A ZacessOS boot sequence plays on load, then the prompt activates with a blinking block cursor. It supports command history on the arrow keys, tab autocomplete, line-by-line output and a suggest mode that collects a message and opens a pre-filled email.\n\nThe core challenge was making the terminal feel real rather than decorative. Real terminals have history, autocomplete that lists every option when more than one matches, deliberate output pacing and a clear split between navigation and local commands. A div with a monospaced font is not a terminal, so each of these had to be built from scratch in React state. The boot lines are paced with awaited timeouts rather than CSS animation, so each one appears after the last has finished, which reads as sequential system output rather than a scripted effect.\n\nNavigation commands open pages on isaacadjei.me in a new tab. Local commands download my CV, open a mail client, show the build status or clear the screen while keeping the boot lines. Three hidden commands reward curious visitors. A ZenQuotes quote is fetched through a server-side API route and refreshes every 30 minutes. The site deploys to Vercel on every push to main, with Cloudflare DNS routing zacess.com and www.zacess.com.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "next-themes", "Vercel", "Cloudflare"],
    category: "web",
    featured: false,
    cover: "/images/projects/zacess-pages/cover.webp",
    order: 11,
    status: "live",
    images: [
      "/images/projects/zacess-pages/main.webp",
      "/images/projects/zacess-pages/terminal.webp",
    ],
    github: "https://github.com/zaccesss/zacess-pages",
    demo: "https://zacess.com",
    date: "2026",
    highlights: [
      "Genuine terminal behaviour: ZacessOS boot sequence, blinking block cursor and output printed line by line at 20 ms per line",
      "Command history on the up and down arrows and tab autocomplete that lists every match when more than one fits",
      "Typed input is HTML-escaped before it is echoed back, so it cannot inject markup into the output",
      "ZenQuotes quote proxied through a Next.js API route to avoid CORS, refreshed every 30 minutes with a fallback quote",
      "Working Mac-style window controls: close, minimise, maximise and a new session that reboots the terminal",
      "Cyan prompts, green commands and amber output that stay the same in light and dark mode",
    ],
    links: [
      { label: "Live site: zacess.com", url: "https://zacess.com" },
    ],
    sections: [
      { type: "h2", text: "How it is put together" },
      {
        type: "p",
        text: "The page is three components: a banner, the terminal and a quote bar. All of the terminal's behaviour lives in one client component and every command is plain data in a single commands file, so adding a command never means touching the terminal logic. The only server code is a small route that proxies the quote API.",
      },
      {
        type: "diagram",
        code: `flowchart LR
    V["Visitor"] --> CF["Cloudflare DNS<br/>zacess.com"]
    CF --> VC["Vercel<br/>Next.js App Router"]
    VC --> T["Terminal component<br/>boot, input, history"]
    T --> C["commands file<br/>command definitions"]
    T -- "navigation commands" --> P["isaacadjei.me<br/>opens in a new tab"]
    T -- "cv, collaborate, suggest" --> L["CV download<br/>or mailto link"]
    VC --> Q["Quote bar<br/>refresh every 30 minutes"]
    Q --> API["API route<br/>api/quote"]
    API --> Z["ZenQuotes API"]`,
        caption: "Request path and the moving parts behind the terminal",
      },
      { type: "h2", text: "Making it behave like a terminal" },
      {
        type: "p",
        text: "Every line of output is an entry in React state with its own type: a system line, an echoed command, output, a blank spacer or a divider. Boot lines are tagged, which is how clear can wipe everything typed since boot while leaving the boot readout in place. While a command is printing, the terminal is marked busy and ignores new input, the same way a real shell does not take a second command until the first returns.",
      },
      {
        type: "table",
        headers: ["Behaviour", "How it works"],
        rows: [
          ["Boot sequence", "Four ZacessOS status lines, 110 ms apart, then a divider and a hint to type help"],
          ["Output pacing", "Each output line waits 20 ms before printing so responses scroll in like real output"],
          ["History", "The up and down arrows step through earlier commands"],
          ["Tab autocomplete", "A single match completes the input. Several matches are listed under the prompt"],
          ["Unknown command", "Prints a bash-style command not found error with a pointer to help"],
          ["Cursor", "The real input is hidden off-screen and its text mirrored into a visible span with a blinking block"],
        ],
        caption: "Terminal behaviour",
      },
      {
        type: "p",
        text: "Suggest mode is a second terminal state. The prompt changes to suggestion, the next line typed becomes the message and the page opens the visitor's mail client with it pre-filled, unless they type cancel or exit. Either way the terminal returns to normal mode.",
      },
      {
        type: "diagram",
        code: `stateDiagram-v2
    [*] --> Booting
    Booting --> Ready: boot lines printed
    Ready --> Busy: Enter on a command
    Busy --> Ready: output printed
    Ready --> Suggest: suggest
    Suggest --> Ready: message sent to mail client
    Suggest --> Ready: cancel or exit
    Ready --> Booting: new session button`,
        caption: "Terminal states",
      },
      {
        type: "callout",
        tone: "note",
        text: "React's strict mode runs effects twice in development, which would print the boot sequence twice. Starting the boot inside a zero-delay timeout that the cleanup cancels means only the second run survives, so the boot runs exactly once.",
      },
      { type: "h2", text: "Commands" },
      {
        type: "table",
        headers: ["Group", "Commands", "What they do"],
        rows: [
          ["Navigate", "whoiszac, about, projects, experience, skills, blog, contact, links", "Open the matching page on isaacadjei.me in a new tab"],
          ["Local", "journey, cv, collaborate, suggest, status, clear, help", "Show my background, download the CV, open a mail client, collect a suggestion, show build status, clear the screen or list commands"],
          ["Hidden", "Three unlockables", "Left for visitors to find"],
        ],
        caption: "The command set",
      },
      { type: "h2", text: "Window controls and theming" },
      {
        type: "p",
        text: "The title bar controls all work. Close collapses the terminal to a restore button, minimise hides the content but keeps the title bar, maximise expands it to a full viewport overlay and the plus button starts a fresh session with a new boot sequence. A toggle in the corner switches the page between light and dark through next-themes, but the terminal keeps its own palette in both so the cyan, green and amber stay readable. The scrollbar is styled to match and touch devices get a tap-to-type hint.",
      },
      { type: "h2", text: "The quote bar" },
      {
        type: "p",
        text: "ZenQuotes does not allow calls from the browser on another origin, so the quote bar asks a Next.js route handler instead. The route fetches a random quote server-side and returns it as JSON. If the API fails or returns something unexpected, it returns a fallback quote so the bar is never empty. The bar refetches every 30 minutes and needs no API key or environment variables.",
      },
      { type: "h2", text: "Deployment and next steps" },
      {
        type: "p",
        text: "Vercel builds and deploys every push to main and Cloudflare points zacess.com and www.zacess.com at it. The terminal, history, autocomplete, window controls, mobile support, easter eggs and custom domain are done. The full zacess.com experience is in progress, with an interactive projects showcase and case studies planned after it.",
      },
    ],
    references: [
      { title: "Next.js App Router documentation", url: "https://nextjs.org/docs/app", note: "The framework the page is built on" },
      { title: "Next.js route handlers", url: "https://nextjs.org/docs/app/api-reference/file-conventions/route", note: "How the quote proxy route is defined" },
      { title: "ZenQuotes API documentation", url: "https://docs.zenquotes.io/", note: "The public quote API behind the quote bar" },
      { title: "next-themes", url: "https://github.com/pacocoursey/next-themes", note: "The light and dark mode toggle" },
      { title: "Tailwind CSS documentation", url: "https://tailwindcss.com/docs", note: "Styling, alongside CSS custom properties for the terminal palette" },
      { title: "Vercel custom domains", url: "https://vercel.com/docs/domains", note: "Serving the site on zacess.com" },
    ],
  }

export default _zacess_pages
