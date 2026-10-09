import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import "@/styles/animations.css"
import PublicShell from "@/components/layout/PublicShell"
import CommandMenu from "@/components/shared/CommandMenu"
import FaviconAnimator from "@/components/shared/FaviconAnimator"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { SITE_URL } from "@/lib/constants"
import { Analytics } from "@vercel/analytics/next"
import SiteAnalytics from "@/components/shared/Analytics"

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const CF_BEACON_TOKEN = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Isaac Adjei",
  url: SITE_URL,
  jobTitle: "Electronic Engineering and Computer Science Student",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Aston University",
  },
  sameAs: ["https://github.com/zaccesss", "https://linkedin.com/in/isaacadjei"],
}

export const viewport: Viewport = { width: "device-width", initialScale: 1 }

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Isaac Adjei | EECS",
    template: "%s | Isaac Adjei",
  },
  description:
    "Electronic Engineering and Computer Science student at Aston University, Birmingham. Building full-stack software, embedded systems, AI/ML and data science solutions from concept to deployment.",
  keywords: [
    "Isaac Adjei",
    "Zac",
    "Zacess",
    "Electronic Engineering",
    "Computer Science",
    "Aston University",
    "Embedded Systems",
    "AI",
    "Machine Learning",
    "Data Science",
  ],
  authors: [{ name: "Isaac Adjei" }],
  creator: "Isaac Adjei",
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    title: "Isaac Adjei | EECS",
    description:
      "Electronic Engineering and Computer Science student building full-stack software, embedded systems, AI/ML and data science solutions.",
    siteName: "Isaac Adjei Portfolio",
    images: [{
      url: "/api/og?title=Isaac%20Adjei&description=Electronic%20Engineering%20and%20Computer%20Science%20Student",
      width: 1200,
      height: 630,
      alt: "Isaac Adjei - Electronic Engineering and Computer Science Student",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Isaac Adjei | EECS",
    description:
      "Electronic Engineering and Computer Science student building full-stack software, embedded systems, AI/ML and data science solutions.",
    images: ["/api/og?title=Isaac%20Adjei&description=Electronic%20Engineering%20and%20Computer%20Science%20Student"],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="me" href="https://mastodon.social/@isaacadjei" />
        <meta name="fediverse:creator" content="@isaacadjei@mastodon.social" />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="Isaac Adjei"
          href="/blog/feed.xml"
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="Isaac Adjei: everything"
          href="/feed.xml"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <SiteAnalytics gaId={GA_ID} cfToken={CF_BEACON_TOKEN} />
      </head>
      <body
        suppressHydrationWarning
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PublicShell>{children}</PublicShell>
          <CommandMenu />
          <FaviconAnimator />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
