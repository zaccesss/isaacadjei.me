"use client"

import { useEffect, useRef, useState } from "react"
import { skillCategories, professionalSkillGroups, type Skill } from "@/data/skills"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { CHIP_CLASS } from "@/components/shared/Tag"

const TILE =
  "group flex flex-col items-center gap-2 p-3 w-[70px] sm:w-[88px] rounded-xl border bg-card hover:border-primary/50 hover:shadow-lg sm:hover:-translate-y-1.5 sm:hover:scale-105 motion-reduce:sm:hover:translate-y-0 motion-reduce:sm:hover:scale-100 transition-[border-color,box-shadow] sm:transition-all duration-200"

function SkillCard({ skill }: { skill: Skill }) {
  const body = (
    <>
      {skill.icon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={skill.icon}
          alt=""
          width={36}
          height={36}
          className="w-9 h-9 object-contain"
          loading="lazy"
        />
      ) : (
        <div aria-hidden="true" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
          {skill.name.slice(0, 2).toUpperCase()}
        </div>
      )}
      <span className="text-[9px] sm:text-[10px] font-medium text-center leading-tight text-muted-foreground group-hover:text-foreground transition-colors">
        {skill.name}
      </span>
    </>
  )

  if (!skill.url) return <div className={cn(TILE, "cursor-default")}>{body}</div>

  return (
    <a
      href={skill.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(TILE, "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:border-primary")}
    >
      {body}
      <span className="sr-only"> (official site, opens in a new tab)</span>
    </a>
  )
}

function CategorySection({ cat }: { cat: (typeof skillCategories)[0] }) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className={cn(
        "transition-all duration-700",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
    >
      <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-5 text-center">
        {cat.category}
      </h2>
      <div className={cn("skills-grid", `skills-cols-${cat.columns}`)}>
        {cat.skills.map((skill) => (
          <SkillCard key={skill.name} skill={skill} />
        ))}
      </div>
    </section>
  )
}

export default function SkillsPage() {
  return (
    <div className="container py-24 space-y-14">
      <div className="space-y-3 animate-fade-up text-center">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Skills</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A full picture of what I bring - professional skills, hardware experience and the tech
          stack I work with.
        </p>
      </div>

      <div className="space-y-8 animate-fade-up">
        {professionalSkillGroups.map((group) => (
          <section key={group.label} className="space-y-4">
            <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest text-center">
              {group.label}
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {group.skills.map((skill) => (
                <span key={skill} className={CHIP_CLASS}>
                  {skill}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Separator />

      <div className="space-y-3 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Tech Stack</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Technologies I work with and am actively learning. Some are daily tools, others I&apos;m
          still developing.
        </p>
      </div>

      <div className="space-y-12">
        {skillCategories.map((cat) => (
          <CategorySection key={cat.category} cat={cat} />
        ))}
      </div>

      <p className="text-xs text-center max-w-xl mx-auto leading-relaxed text-primary/80">
        <strong className="text-primary">NB:</strong> I am not an expert in all these technologies
        yet. This is a living document that reflects what I am actively using and what I am
        learning. Some tools are part of my daily workflow, others are at beginner level. The
        process of continuous learning is what drives my interest in technology and innovation.
      </p>
    </div>
  )
}
