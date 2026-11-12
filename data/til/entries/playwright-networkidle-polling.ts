import type { TILEntry } from "../index"

const _playwright_networkidle_polling: TILEntry = {
    id: "playwright-networkidle-polling",
    title: "Playwright's networkidle waits for 500 ms of silence, which a polling page never gives",
    date: "2026-11-12",
    category: "Testing",
    published: true,
    body: "[`waitForLoadState('networkidle')`](https://playwright.dev/docs/api/class-page#page-wait-for-load-state) resolves only once there have been no network connections for at least 500 ms. A page that polls an endpoint more often than that never goes quiet. Neither does one that holds a request open for live updates. Either way the wait runs until it times out. Playwright's own docs now say not to use it for testing. Wait for something a user would see instead, with a [web-first assertion](https://playwright.dev/docs/test-assertions) that retries on its own.",
    detail: [
      {
        type: "code",
        lang: "ts",
        code: `// flaky on a page with a live status poll
await page.goto("/machines")
await page.waitForLoadState("networkidle")

// waits for what matters, retries until it appears
await page.goto("/machines")
await expect(page.getByRole("heading", { name: "Machines" })).toBeVisible()`,
        caption: "Assert on the page the user sees, not on the network going quiet",
      },
      {
        type: "note",
        text: "The same applies to demo recording scripts. A scripted walkthrough that waits on visible elements also runs at a steady, watchable pace.",
      },
    ],
    tags: ["Playwright", "testing", "TypeScript"],
    source: { label: "Playwright docs: page.waitForLoadState", url: "https://playwright.dev/docs/api/class-page#page-wait-for-load-state" },
  }

export default _playwright_networkidle_polling
