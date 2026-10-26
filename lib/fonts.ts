import localFont from "next/font/local"

export const geistSans = localFont({
  variable: "--font-geist-sans",
  display: "swap",
  src: [
    { path: "./fonts/Geist-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Geist-Italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/Geist-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Geist-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Geist-Bold.woff2", weight: "700", style: "normal" },
  ],
})

export const geistMono = localFont({
  variable: "--font-geist-mono",
  display: "swap",
  preload: false,
  src: [
    { path: "./fonts/GeistMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/GeistMono-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/GeistMono-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/GeistMono-Bold.woff2", weight: "700", style: "normal" },
  ],
})
