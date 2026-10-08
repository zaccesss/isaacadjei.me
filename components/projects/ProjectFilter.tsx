"use client"

import { type Project } from "@/data/projects"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Category = Project["category"] | "all"

const categories: { value: Category; label: string }[] = [
  { value: "all", label: "All" },
  { value: "embedded", label: "Embedded" },
  { value: "hardware", label: "Hardware" },
  { value: "iot", label: "IoT" },
  { value: "software", label: "Software" },
  { value: "web", label: "Web" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "academic", label: "Academic" },
  { value: "other", label: "Other" },
]

interface Props {
  active: Category
  onChange: (cat: Category) => void
}

export default function ProjectFilter({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
      {categories.map((cat) => (
        <Button
          key={cat.value}
          variant={active === cat.value ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(cat.value)}
          className={cn("rounded-full max-sm:min-h-11 max-sm:px-4")}
        >
          {cat.label}
        </Button>
      ))}
    </div>
  )
}
