import { contentSecurityPolicy } from "./lib/csp.mjs"

const isDev = process.env.NODE_ENV === "development"

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
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
      // files skip middleware, so the CV files that go with the unlisted CV page get their noindex here. It is a header
      // rather than a robots.txt line, which would name the folder to anyone reading that file
      { source: "/resume/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
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
          // 'unsafe-inline' for scripts stays here because a nonce needs every page rendered per request, which would end
          // static pages and edge caching. The dashboard host is stricter: the middleware replaces this there.
          // connect-src must include Cloudflare Turnstile (CAPTCHA) and ZenQuotes
          // because those are called from the browser/API routes at runtime.
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy(),
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
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), usb=(), serial=(), hid=(), bluetooth=(), midi=(), browsing-topics=()" },
          // no other site's window can reach into this one. Popups stay allowed for the CV print window and sign-in
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
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
