import localFont from "next/font/local"

export const geistSans = localFont({
  variable: "--font-geist-sans",
  display: "swap",
  src: [
    { path: "../node_modules/geist/dist/fonts/geist-sans/Geist-Regular.woff2", weight: "400", style: "normal" },
    { path: "../node_modules/geist/dist/fonts/geist-sans/Geist-Italic.woff2", weight: "400", style: "italic" },
    { path: "../node_modules/geist/dist/fonts/geist-sans/Geist-Medium.woff2", weight: "500", style: "normal" },
    { path: "../node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../node_modules/geist/dist/fonts/geist-sans/Geist-Bold.woff2", weight: "700", style: "normal" },
  ],
})

export const geistMono = localFont({
  variable: "--font-geist-mono",
  display: "swap",
  preload: false,
  src: [
    { path: "../node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "../node_modules/geist/dist/fonts/geist-mono/GeistMono-Medium.woff2", weight: "500", style: "normal" },
    { path: "../node_modules/geist/dist/fonts/geist-mono/GeistMono-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../node_modules/geist/dist/fonts/geist-mono/GeistMono-Bold.woff2", weight: "700", style: "normal" },
  ],
})
