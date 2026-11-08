const isDev = process.env.NODE_ENV === "development"

// static.cloudflareinsights.com serves the CF beacon script; the beacon posts to
// cloudflareinsights.com. GA4 collects via regional hosts (region1.google-analytics.com and
// friends), so connect-src needs the wildcard, not just www. vercel.live (script, connect,
// frame and the pusher websocket) is the Vercel Toolbar, which Vercel injects for me as a
// logged-in team member - visitors never load it, but blocking it spams my own console.
// 'wasm-unsafe-eval' lets the /lab PCB viewer decode its GLB model: drei's useGLTF compiles the meshopt decoder as
// WebAssembly, which a plain script-src blocks. It allows WebAssembly compilation only, never JavaScript eval
const scriptSrc = ["'self'", "'unsafe-inline'", "'wasm-unsafe-eval'", "https://challenges.cloudflare.com", "https://www.googletagmanager.com", "https://static.cloudflareinsights.com", "https://vercel.live", "https://app.cal.com"]
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
// media.zacess.com serves the Zacess scene and game frames as JSON fetched by the frame player (lib/zacess-media.ts)
const connectSrc = ["'self'", "https://media.zacess.com", "https://*.ingest.de.sentry.io", "https://challenges.cloudflare.com", "https://zenquotes.io", "https://*.google-analytics.com", "https://analytics.google.com", "https://api.lanyard.rest", "wss://api.lanyard.rest", "https://cloudflareinsights.com", "https://vercel.live", "wss://ws-us3.pusher.com", "https://api.maptiler.com", "https://tiles.openfreemap.org", "https://services.arcgisonline.com"]

if (isDev) {
  scriptSrc.push("'unsafe-eval'")
  connectSrc.push("ws://127.0.0.1:3000", "ws://localhost:3000")
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // the commit is the Sentry release, so browser errors match the source maps uploaded for that build
  env: { NEXT_PUBLIC_SENTRY_RELEASE: process.env.VERCEL_GIT_COMMIT_SHA ?? "" },
  // maps are only generated when they can be uploaded; scripts/sentry-release.mjs deletes them after, so none are served
  productionBrowserSourceMaps: Boolean(process.env.SENTRY_AUTH_TOKEN),
  images: {
    // domains[] is deprecated in Next.js 13+ - use remotePatterns instead.
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "www.google.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "mosaic.scdn.co" },
      // Zacess product stills and posters from the zacess-media bucket (lib/zacess-media.ts)
      { protocol: "https", hostname: "media.zacess.com" },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // serve images in AVIF (best compression) with WebP as a fallback.
    // Next.js negotiates the format automatically via Accept headers.
    formats: ["image/avif", "image/webp"],
  },
  outputFileTracingIncludes: {
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
    // server maps for readable server stack traces in Sentry, removed again after upload
    serverSourceMaps: Boolean(process.env.SENTRY_AUTH_TOKEN),
    // saved assistant chats can carry a downscaled image as a data URL, so I lift the default 1MB
    // server-action body cap a little. Images are shrunk client-side first, so this stays modest.
    serverActions: { bodySizeLimit: "4mb" },
  },
  async redirects() {
    return [
      // renamed the posts analytics route from blog-analytics to post-analytics; keep old links working.
      // the World Cup predictor note generalised into a multi-sport platform; keep the old link working.
      { source: "/notes/world-cup-ai-predictor", destination: "/notes/multi-sport-ai-predictor", permanent: true },
      // the dotfiles project grew into the wider developer environment write-up
      { source: "/projects/dotfiles", destination: "/projects/dev-environment", permanent: true },
      // role CVs are no longer public; the public page keeps the general CV
      { source: "/cv/cv-picker", destination: "/cv", permanent: false },
      { source: "/cv/cover-letters", destination: "/cv", permanent: false },
    ]
  },
  async headers() {
    return [
      // public files and metadata routes go out with max-age=0, so Cloudflare revalidates each one with Vercel and every
      // view still counts as a Vercel CDN request. Cloudflare-CDN-Cache-Control is read only by Cloudflare and never reaches
      // the browser (https://developers.cloudflare.com/cache/concepts/cdn-cache-control/), so Cloudflare holds files for a
      // day and the feeds for an hour while the browser behaviour stays as it was. /resume is left out on purpose: the CV
      // must update the moment a new one is built.
      ...[
        "/images/:path*", "/Media/:path*", "/brand/:path*", "/frames/:path*", "/maps/:path*", "/models/:path*",
        "/videos/:path*", "/documents/:path*", "/icon.svg", "/icon.png", "/apple-icon", "/manifest.webmanifest",
        "/opengraph-image", "/twitter-image", "/:any+/opengraph-image", "/:any+/twitter-image",
        "/giscus-theme-dark.css", "/giscus-theme-light.css",
      ].map((source) => ({
        source,
        headers: [{ key: "Cloudflare-CDN-Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      })),
      ...["/robots.txt", "/sitemap.xml", "/feed.xml", "/newsletter/feed.xml"].map((source) => ({
        source,
        headers: [{ key: "Cloudflare-CDN-Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" }],
      })),
      // noindex OG and Twitter image generation routes - they are internal
      // image endpoints, not content pages and should not appear in search results.
      { source: "/opengraph-image",          headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
      { source: "/twitter-image",            headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
      { source: "/:any+/opengraph-image",    headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
      { source: "/:any+/twitter-image",      headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
      {
        source: "/(.*)",
        headers: [
          // ─── Content Security Policy ────────────────────────────────────────
          // controls which resources the browser is allowed to load.
          // 'unsafe-inline' for scripts is required because next-themes injects
          // an inline script to prevent flash-of-unstyled-content on page load.
          // tighten to a nonce-based policy in a future pass if needed.
          // connect-src must include Cloudflare Turnstile (CAPTCHA) and ZenQuotes
          // because those are called from the browser/API routes at runtime.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src ${scriptSrc.join(" ")}`,
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data: https://cal.com",
              "img-src 'self' data: blob: https:",
              // demo clips and their posters load from the R2 media domain (lib/media.ts); without this, video falls
              // back to default-src 'self' and every clip would be blocked. media.zacess.com is the Zacess product
              // bucket, so its recordings can play here once they are uploaded at a release
              "media-src 'self' https://media.isaacadjei.me https://media.zacess.com",
              `connect-src ${connectSrc.join(" ")}`,
              // MapLibre GL JS (the Applications map) parses vector tiles in a Web Worker created
              // from a blob: URL - worker-src falls back to script-src, not default-src, per the
              // CSP spec and 'self' alone does not implicitly cover a blob: worker.
              "worker-src 'self' blob:",
              // include 'self' so the /cv page can embed /resume/cv.html in an iframe
              // giscus.app is required for the blog comments iframe
              "frame-src 'self' https://challenges.cloudflare.com https://www.youtube.com https://open.spotify.com https://giscus.app https://vercel.live https://cal.com https://app.cal.com",
              // use SAMEORIGIN instead of 'none' so the CV iframe can load same-origin content
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          // use SAMEORIGIN so the CV preview iframe can load /resume/cv.html from the same origin
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // prevent MIME type sniffing - browser must respect declared Content-Type
          { key: "X-Content-Type-Options", value: "nosniff" },
          // force HTTPS for 2 years; include subdomains; submit for HSTS preload list
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // only send the origin (no path/query) as Referer on cross-origin requests
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // disable browser features the portfolio does not use
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // NOTE: X-XSS-Protection was intentionally removed.
          // it is deprecated, ignored by all modern browsers and can cause issues
          // in some legacy scenarios. CSP above supersedes it entirely.
        ],
      },
    ]
  },
}

export default nextConfig

// only init OpenNext Cloudflare in local dev - it breaks Vercel builds if run unconditionally
if (isDev) {
  import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
}
