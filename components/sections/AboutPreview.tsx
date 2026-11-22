import ArrowLink from "@/components/shared/ArrowLink"
import { Section, SectionHeading } from "@/components/layout/Section"

export default function AboutPreview() {
  return (
    <Section labelledBy="about">
      <SectionHeading id="about" title="About" />
      <div className="max-w-[68ch] space-y-4 text-lg leading-[1.7] text-foreground/90">
        <p>
          I am Zac. I grew up in Ghana, moved to the UK in 2022 and finished my engineering diploma at Stanmore College with
          a triple Distinction and the Best and Most Hardworking Student award. At Aston I work on embedded systems,
          machine learning and the web.
        </p>
        <p>
          My late father was a mechanical engineer. His words, &ldquo;Always strive to make things better&rdquo;, still guide
          what I build. Much of it is about accessibility, such as Zacess, a free reader that turns documents and web pages
          into notes in your own reading profile.
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
        <ArrowLink href="/about">More about me</ArrowLink>
        <ArrowLink href="/experience">Experience</ArrowLink>
        <ArrowLink href="/skills">Skills and tools</ArrowLink>
      </div>
    </Section>
  )
}
