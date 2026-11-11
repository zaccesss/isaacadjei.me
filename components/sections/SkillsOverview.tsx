"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TAG_LINK_CLASS, CHIP_CLASS } from "@/components/shared/lists/Tag"
import { skillAnchor, skillCategories } from "@/data/skills"
import { staggerContainer, fadeUp } from "@/lib/ui/animations"

export default function SkillsOverview() {
  const PICKS: { label: string; from: string; names: string[] }[] = [
    { label: "Platforms & OS", from: "Platforms & Operating Systems", names: ["Windows", "macOS", "Linux", "Fedora", "Ubuntu"] },
    { label: "Core Tools", from: "Core Tools", names: ["Git", "GitHub", "VS Code", "Neovim", "tmux", "Linear"] },
    { label: "Languages", from: "Languages & Software", names: ["C", "C++", "Python", "TypeScript", "Java", "Rust"] },
    { label: "Embedded & Hardware", from: "Embedded & Hardware", names: ["Embedded C", "ESP32", "STM32", "Atmel AVR", "KiCad", "FreeRTOS"] },
    { label: "Robotics", from: "Robotics", names: ["ROS", "ArduPilot", "NVIDIA Jetson", "Gazebo", "PyBullet"] },
    { label: "Frontend", from: "Frontend", names: ["Next.js", "React", "Tailwind CSS", "Vite", "Playwright", "Three.js"] },
    { label: "Backend", from: "Backend", names: ["Node.js", "Laravel", "FastAPI", "Django", "GraphQL", "PHP"] },
    { label: "Databases", from: "Databases", names: ["PostgreSQL", "MySQL", "Supabase", "Redis", "MongoDB", "TiDB"] },
    { label: "Cloud & DevOps", from: "Cloud & DevOps", names: ["Docker", "Cloudflare", "GitHub Actions", "Vercel", "AWS", "Terraform"] },
    { label: "AI / ML & Data", from: "AI / ML & Data", names: ["PyTorch", "TensorFlow", "NumPy", "Pandas", "Scikit-Learn", "OpenCV"] },
  ]
  const topCategories = PICKS.map(({ label, from, names }) => {
    const all = skillCategories.find((cat) => cat.category === from)?.skills ?? []
    return { category: label, href: `/skills#${skillAnchor(from)}`, skills: names.flatMap((name) => all.filter((skill) => skill.name === name)) }
  }).filter((cat) => cat.skills.length > 0)

  return (
    <section className="py-24 border-t">
      <div className="mx-auto w-full max-w-6xl px-8 space-y-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-10"
        >
          <motion.div variants={fadeUp} className="flex items-end justify-between">
            <div className="space-y-2">
              <p className="text-sm font-mono text-primary uppercase tracking-widest">Skills</p>
              <h2 className="text-3xl font-bold tracking-tight">Technologies I work with</h2>
            </div>
            <Button asChild variant="ghost" className="hidden sm:flex">
              <Link href="/skills">
                All skills
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} className="grid gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {topCategories.map((cat) => (
              <div key={cat.category} className="space-y-3">
<h3 className="text-xs font-semibold uppercase tracking-wider">
                  <Link href={cat.href} className="text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                    {cat.category}
                    <span className="sr-only"> on the Skills page</span>
                  </Link>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill) => (
                    skill.url ? (
                      <a key={skill.name} href={skill.url} target="_blank" rel="noopener noreferrer" className={`${TAG_LINK_CLASS} text-xs`}>
                        {skill.name}
                        <span className="sr-only"> (official site, opens in a new tab)</span>
                      </a>
                    ) : (
                      <span key={skill.name} className={`${CHIP_CLASS} text-xs`}>{skill.name}</span>
                    )
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
