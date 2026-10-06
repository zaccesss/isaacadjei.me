import type { Metadata } from "next"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Copyright",
  description: "Who owns the content on isaacadjei.me, the licence for the site's code and the third-party material it uses.",
  alternates: { canonical: "https://www.isaacadjei.me/copyright" },
}

const link = "text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"

export default function CopyrightPage() {
  return (
    <div className="container max-w-3xl py-24 space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Copyright</h1>
        <p className="text-sm text-muted-foreground font-mono">Last updated: October 2026</p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Who owns what on this site and how you can use it. For anything not covered here, ask me through the{" "}
          <Link href="/contact" className={link}>contact page</Link>.
        </p>
      </section>

      <Separator />

      <section className="space-y-10 text-muted-foreground [&_h2]:text-foreground [&_h2]:font-bold [&_h2]:text-xl [&_h2]:mb-3 [&_p]:leading-relaxed [&_p]:text-[0.95rem] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_li]:text-[0.95rem]">
        <div>
          <h2>My content</h2>
          <p>
            &copy; 2026 Isaac Adjei. All rights reserved. This covers my writing, blog posts, project and research
            write-ups, photos, diagrams, my logo and the design of the site. You are welcome to link to any page and
            to quote short passages with a credit and a link back. Anything beyond that, such as republishing a post
            or using my photos, needs my written permission first.
          </p>
        </div>

        <div>
          <h2>The site&rsquo;s code</h2>
          <p>
            The code behind this site is published in my{" "}
            <a href="https://github.com/zaccesss/isaacadjei.me" className={link}>public showcase repository</a> under
            the PolyForm Noncommercial License 1.0.0. You can read it, learn from it and reuse it for anything
            noncommercial, provided you keep the licence and copyright notice. Commercial use needs my permission.
            The licence covers the code only, not the content above.
          </p>
        </div>

        <div>
          <h2>Trade marks and logos</h2>
          <p>
            Names and logos of other companies and products shown on this site, such as Spotify, PlayStation, Steam,
            GitHub and the tools in my tech stack, belong to their owners. They appear only to show what I use or what
            I have been listening to and playing. Their use does not mean any of those companies endorse me or this
            site.
          </p>
        </div>

        <div>
          <h2>Third-party material</h2>
          <ul>
            <li>Fonts: Geist and Geist Mono by Vercel, under the SIL Open Font License 1.1.</li>
            <li>Icons: Lucide under the ISC Licence, react-icons under the MIT Licence, Simple Icons under CC0 1.0 and Devicon under the MIT Licence.</li>
            <li>Maps: MapLibre GL JS under the BSD 3-Clause Licence, with tiles from OpenFreeMap and MapTiler. Map data &copy; OpenStreetMap contributors, available under the Open Database License.</li>
            <li>Charts and diagrams: Recharts under the MIT Licence, Apache ECharts under the Apache License 2.0 and Mermaid under the MIT Licence.</li>
            <li>Album art and track details come from Spotify. Game names and artwork come from PlayStation, Steam and IGDB. Each belongs to its owner.</li>
          </ul>
        </div>

        <div>
          <h2>Reporting a problem</h2>
          <p>
            If you believe something on this site uses your work without permission, tell me through the{" "}
            <Link href="/contact" className={link}>contact page</Link> with a link to the page and I will look at it
            straight away. See also the <Link href="/disclaimer" className={link}>disclaimer</Link> and the{" "}
            <Link href="/privacy" className={link}>privacy policy</Link>.
          </p>
        </div>
      </section>
    </div>
  )
}
