import type { BlogPost } from "../index"

const _recording_product_demos_as_code: BlogPost = {
  slug: "recording-product-demos-as-code",
  title: "Recording Product Demos as Code",
  date: "2026-11-16",
  type: "blog",
  cover_image: "/images/blog/covers/recording-product-demos-as-code-shot.webp",
  cover_image_dark: "/images/blog/covers/recording-product-demos-as-code-shot-dark.webp",
  cover_alt: "Vitafolio LaTeX editor with source code on the left and a PDF preview of Alex Morgan's CV on the right",
  description:
    "How I replaced hand-recorded screen captures for Vitafolio with Playwright scripts, a seeded throwaway database and one command that rebuilds every clip in light and dark.",
  tags: ["Web", "Tools", "Accessibility", "Full-Stack", "Documentation"],
  projectSlug: "vitafolio",
  published: true,
  content: [
    {
      type: "p",
      text: "The first demo clips I made for [Vitafolio](https://vitafolio.isaacadjei.me) were screen recordings done by hand. I opened the site, clicked through the CV editor and stopped the recording when it looked about right. They went out of date within a week. A button moved, a label changed and the clip on the [Features page](https://vitafolio.isaacadjei.me/features) no longer matched the product. Re-recording meant doing the whole thing again, fumbling the same clicks and hoping my test account still had the right data in it.",
    },
    {
      type: "p",
      text: "So I stopped recording demos and started writing them. Every clip is now a short [Playwright](https://playwright.dev) script that drives a real browser against a local copy of the site. One command records all eight clips in light and dark, takes the README screenshots and converts the lot into the formats the site needs. This post walks through how it fits together and what I would tell anyone who wants to do the same.",
    },
    {
      type: "h2",
      text: "Why a script beats a screen recorder",
    },
    {
      type: "ul",
      items: [
        "It is repeatable. After an interface change I run one command instead of spending an evening re-recording.",
        "It is consistent. Every clip uses the same window size, the same cursor speed and the same pauses.",
        "It is safe. The script runs against a throwaway database full of made-up people, so no real account or personal data ever appears on screen.",
        "It is reviewable. A change to a clip is a diff in a pull request, not a new video file that nobody can inspect.",
      ],
    },
    {
      type: "h2",
      text: "The pipeline",
    },
    {
      type: "diagram",
      code: `flowchart LR
    A[record.sh] --> B[Fresh SQLite database]
    B --> C[Seed made-up people]
    C --> D[Start the site locally]
    D --> E[capture.mjs in Chromium]
    E --> F[Raw .webm clips and .png shots]
    F --> G[build-assets.sh]
    G --> H[Animated WebP]
    G --> I[MP4 for the player page]
    G --> J[Still frame for reduced motion]`,
      caption: "One command records, a second turns the recordings into site assets",
    },
    {
      type: "p",
      text: "The [recording script](https://github.com/zaccesss/vitafolio/tree/main/scripts/demo) rebuilds a [SQLite](https://www.sqlite.org) database, loads a seed file and starts the site on a local port. The seed creates a demo person called Alex Morgan with a finished CV, an earlier support ticket with a reply and a couple of connected sign-in accounts. Employers and links all point at example.com. Nothing in a clip belongs to a real person, which matters because these clips sit on a public page and in a public README.",
    },
    {
      type: "h3",
      text: "Making the local site look live",
    },
    {
      type: "p",
      text: "A recording of localhost:8123 looks like a recording of localhost:8123. I wanted the address bar text and every share link on screen to read as the real domain. Chromium has a launch flag that maps a hostname to another address, so the browser asks for the live domain and quietly gets the local server instead.",
    },
    {
      type: "code",
      lang: "javascript",
      text: `const HOST = 'vitafolio.isaacadjei.me'
const PORT = process.env.DEMO_PORT || '8123'

// the live hostname resolves to the local server, so every link on screen matches the real site
const browser = await chromium.launch({
  channel: 'chromium',
  args: [\`--host-resolver-rules=MAP \${HOST} 127.0.0.1:\${PORT}\`],
})`,
    },
    {
      type: "p",
      text: "I use the full Chromium build rather than the bare headless shell for one practical reason: the headless shell has no PDF viewer, so the LaTeX clip showed an empty preview pane. That took me longer to work out than I would like to admit.",
    },
    {
      type: "h3",
      text: "Drawing the cursor and captions yourself",
    },
    {
      type: "p",
      text: "Browser video recording captures the page, not the operating system. There is no mouse pointer and nowhere to put an explanation. The fix is an init script that runs before every page load and injects two fixed elements: a small circle that follows mousemove events and a caption bar at the bottom of the viewport. Captions are stored in sessionStorage so they survive a navigation in the middle of a step.",
    },
    {
      type: "code",
      lang: "javascript",
      text: `// move the drawn cursor smoothly to an element before acting on it
const point = async (page, locator) => {
  await locator.scrollIntoViewIfNeeded()
  const box = await locator.boundingBox()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 18 })
  await page.waitForTimeout(250)
}

const click = async (page, locator) => {
  await point(page, locator)
  await locator.click()
}

// type at a human pace so a viewer can actually read it
const type = async (page, locator, text, delay = 35) => {
  await click(page, locator)
  await locator.fill('')
  await locator.pressSequentially(text, { delay })
}`,
    },
    {
      type: "p",
      text: "With those three helpers each clip reads like a storyboard: a caption, a few clicks, some typing and a pause. The CV-building clip is around fifteen lines.",
    },
    {
      type: "clip",
      src: "/videos/projects/vitafolio/build.mp4",
      poster: "/videos/projects/vitafolio/build.webp",
      alt: "A new CV called Embedded software roles is created, then its headline, profile, skills, experience and education are typed into the editor and saved",
      caption: "The CV-building clip, recorded entirely by the script: drawn cursor, captions and human-paced typing.",
    },
    {
      type: "h2",
      text: "Problems I hit",
    },
    {
      type: "table",
      headers: ["Problem", "Cause", "Fix"],
      rows: [
        ["Sign-in failed halfway through a full run", "The login rate limit blocked a fresh sign-in for every clip", "Sign in once and [share the saved storage state](https://playwright.dev/docs/auth) with every browser context"],
        ["Sign-up clip could not confirm the email", "No real mail is sent locally", "The local mailer writes to the log file, so the script reads the confirmation link from there"],
        ["OAuth buttons missing from the sign-up page", "No provider keys in the local copy", "Placeholder keys make the buttons render; no clip completes a real third-party sign-in"],
        ["Photo clip needed a face", "Using a real person's photo felt wrong", "The script draws an illustrated avatar as an SVG and screenshots it"],
        ["Dark clips showed leftover data from the light run", "Both runs shared one database", "Each dark pass starts from a freshly seeded database"],
      ],
    },
    {
      type: "h2",
      text: "Turning recordings into something a page can use",
    },
    {
      type: "p",
      text: "Playwright saves WebM. The site needs three things per clip: a small animated image for the Features page and README, a full-quality MP4 for the clip's own player page and a still frame for people who have reduced motion turned on. A shell script uses [ffmpeg](https://ffmpeg.org) to build a palette and an intermediate GIF, then [gif2webp](https://developers.google.com/speed/webp/docs/gif2webp) to produce the animated WebP, which comes out at roughly a third of the size of the GIF. The MP4 uses [H.264 with faststart](https://trac.ffmpeg.org/wiki/Encode/H.264) so it begins playing before it has fully downloaded.",
    },
    {
      type: "callout",
      tone: "tip",
      text: "Pick the still frame on purpose. People with reduced motion see only that one frame, so it should be the moment where the clip says the most, not frame zero. In my script each clip has its own timestamp for the still.",
    },
    {
      type: "p",
      text: "The README then uses a [picture element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture) with media queries, so a viewer gets the dark clip in dark mode and the still image when prefers-reduced-motion is set. Doing that by hand for eight clips in two themes would be tedious. Generated, it costs nothing.",
    },
    {
      type: "h2",
      text: "What I would do differently",
    },
    {
      type: "ol",
      items: [
        "Write the kit before the first clip, not after the third broken one.",
        "Keep the untouched originals. I store the raw WebM files and full-resolution screenshots in the repo's docs folder, which is where the images for this portfolio came from.",
        "Treat selectors in demo scripts like selectors in tests. Prefer labels and roles over CSS classes that change with every redesign.",
        "Add a check that fails loudly. When sign-in fails the script saves a screenshot and stops, instead of recording ninety seconds of a login page.",
      ],
    },
    {
      type: "p",
      text: "The bigger lesson is that a demo is documentation and documentation rots. Anything that rots should be regenerated from a source of truth, not maintained by hand. For code that source is the repo. For a product demo it can be a script that lives right next to it. Every clip this kit produced is on the [Vitafolio project page](/projects/vitafolio).",
    },
    {
      type: "h2",
      text: "Further reading",
    },
    {
      type: "ol-links",
      items: [
        { text: "Playwright documentation: recording videos", url: "https://playwright.dev/docs/videos" },
        { text: "Playwright BrowserContext API, including addInitScript and storageState", url: "https://playwright.dev/docs/api/class-browsercontext" },
        { text: "gif2webp from Google's WebP tools", url: "https://developers.google.com/speed/webp/docs/gif2webp" },
        { text: "MDN: prefers-reduced-motion", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion" },
        { text: "The Vitafolio demo recording kit on GitHub", url: "https://github.com/zaccesss/vitafolio/tree/main/scripts/demo" },
      ],
    },
  ],
}

export default _recording_product_demos_as_code
