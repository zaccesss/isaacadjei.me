// the site's Content-Security-Policy. next.config.mjs sends it on every response and the middleware sends a stricter
// version on the dashboard host, so both share one list.
const isDev = process.env.NODE_ENV === "development"

// static.cloudflareinsights.com serves the CF beacon script; the beacon posts to
// cloudflareinsights.com. GA4 collects via regional hosts (region1.google-analytics.com and
// friends), so connect-src needs the wildcard, not just www. vercel.live (script, connect,
// frame and the pusher websocket) is the Vercel Toolbar, which Vercel injects for me as a
// logged-in team member - visitors never load it, but blocking it spams my own console.
// 'wasm-unsafe-eval' lets the /lab PCB viewer decode its GLB model: drei's useGLTF compiles the meshopt decoder as
// WebAssembly, which a plain script-src blocks. It allows WebAssembly compilation only, never JavaScript eval
export const scriptSrc = ["'self'", "'unsafe-inline'", "'wasm-unsafe-eval'", "https://challenges.cloudflare.com", "https://www.googletagmanager.com", "https://static.cloudflareinsights.com", "https://vercel.live", "https://app.cal.com"]
// app.cal.com serves the /book embed script, which sizes the booking calendar to its content and themes it to match the site
// api.maptiler.com serves vector tiles, glyphs and style JSON for the MapTiler map, all fetched by
// MapLibre GL JS via connect-src, not img-src (they are not plain <img> requests).
// tiles.openfreemap.org backs the manual OpenFreeMap fallback provider and the public /stats map,
// kept on a separate no-key provider so a traffic spike on the public page can never exhaust the
// MapTiler quota; services.arcgisonline.com is OpenFreeMap's own satellite style, a raster source
// on a third, separate domain. All three were needed here but only api.maptiler.com was ever
// listed for a while - an earlier PR swapped tiles.openfreemap.org out for api.maptiler.com when
// the map briefly went MapTiler-only,
// then a later PR reintroduced the OpenFreeMap toggle without restoring its own connect-src entry,
// so every OpenFreeMap style was silently CSP-blocked until this was fixed (confirmed via real
// console CSP-violation errors, not a guess).
// *.ingest.de.sentry.io receives browser error reports (instrumentation-client.ts); the org lives in Sentry's EU region
// media.zacess.com serves the Zacess scene and game frames as JSON fetched by the frame player (lib/content/zacess-media.ts)
const connectSrc = ["'self'", "https://media.zacess.com", "https://*.ingest.de.sentry.io", "https://challenges.cloudflare.com", "https://zenquotes.io", "https://*.google-analytics.com", "https://analytics.google.com", "https://api.lanyard.rest", "wss://api.lanyard.rest", "https://cloudflareinsights.com", "https://vercel.live", "wss://ws-us3.pusher.com", "https://api.maptiler.com", "https://tiles.openfreemap.org", "https://services.arcgisonline.com"]

if (isDev) {
  scriptSrc.push("'unsafe-eval'")
  connectSrc.push("ws://127.0.0.1:3000", "ws://localhost:3000")
}

// extraConnect is for the dashboard alone: the Assistant's runner sits on another origin, which the dashboard's pages
// must be allowed to call. The public site never gets it
export function contentSecurityPolicy(scriptSources = scriptSrc, extraConnect = []) {
  return [
    "default-src 'self'",
    `script-src ${scriptSources.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data: https://cal.com",
    "img-src 'self' data: blob: https:",
    // demo clips and their posters load from the R2 media domain (lib/content/media.ts); without this, video falls
    // back to default-src 'self' and every clip would be blocked. media.zacess.com is the Zacess product
    // bucket, so its recordings can play here once they are uploaded at a release
    "media-src 'self' https://media.isaacadjei.me https://media.zacess.com",
    `connect-src ${[...connectSrc, ...extraConnect].join(" ")}`,
    // MapLibre GL JS (the Applications map) parses vector tiles in a Web Worker created
    // from a blob: URL - worker-src falls back to script-src, not default-src, per the
    // CSP spec and 'self' alone does not implicitly cover a blob: worker.
    "worker-src 'self' blob:",
    // include 'self' so the /cv page can embed /resume/cv.html in an iframe
    // giscus.app is required for the blog comments iframe
    "frame-src 'self' https://challenges.cloudflare.com https://www.youtube.com https://open.spotify.com https://giscus.app https://vercel.live https://cal.com https://app.cal.com",
    // use SAMEORIGIN instead of 'none' so the CV iframe can load same-origin content
    "frame-ancestors 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ")
}

// no page needs these, except that the dashboard's Assistant page may use the microphone for dictation and voice
export function permissionsPolicy(microphone = false) {
  return `camera=(), microphone=${microphone ? "(self)" : "()"}, geolocation=(), usb=(), serial=(), hid=(), bluetooth=(), midi=(), browsing-topics=()`
}
