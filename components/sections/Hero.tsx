import Image from "@/components/shared/media/MediaImage"
import SocialLinks from "@/components/shared/SocialLinks"
import ArrowLink from "@/components/shared/ArrowLink"

export default function Hero() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 pb-12 pt-14 sm:px-8 sm:pb-14 sm:pt-20">
      <div className="flex items-center gap-4">
        <Image
          src="/images/zac_profile.webp"
          alt="Isaac Adjei"
          width={64}
          height={64}
          sizes="64px"
          className="h-14 w-14 rounded-full object-cover sm:h-16 sm:w-16"
          priority
        />
        <h1 className="text-[2.5rem] font-bold leading-none tracking-tight sm:text-6xl">Isaac Adjei</h1>
      </div>
      <p className="mt-8 max-w-[68ch] text-xl font-medium leading-snug sm:text-2xl">
        Building at the intersection of hardware, software and AI/ML.
      </p>
      <p className="mt-4 max-w-[68ch] text-lg leading-relaxed text-foreground/90">
        I study Electronic Engineering and Computer Science at Aston University in Birmingham. I design circuit boards
        and write the firmware and software that run on them. I am open to internships, placements and professional
        opportunities.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
        <SocialLinks iconSize="h-5 w-5" />
        <ArrowLink href="/now">What I am working on now</ArrowLink>
      </div>
    </section>
  )
}
