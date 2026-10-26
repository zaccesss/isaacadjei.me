import type { TILEntry } from "../index"

const _tailwind_full_class_names: TILEntry = {
    id: "tailwind-full-class-names",
    title: "Tailwind only generates class names it can find written out in full",
    date: "2026-10-26",
    category: "CSS",
    published: true,
    body: "Tailwind [treats source files as plain text](https://tailwindcss.com/docs/detecting-classes-in-source-files) and generates CSS only for complete class names it finds, so `bg-${colour}-500` built at runtime never makes it into the stylesheet. It also ignores tokens it does not recognise without any warning, which is how `items-centre` and `transition-colours` sat in 16 files of the [PHAEMOS](https://phaemos.com) dashboard doing nothing. Map values to complete class strings instead. Spell utilities the American way too.",
    detail: [
      {
        type: "code",
        lang: "tsx",
        code: `// never generated: Tailwind cannot see the finished name
<span className={\`text-\${tone}-600\`}>{label}</span>

// generated: every class appears in full somewhere in the source
const toneClass = {
  ok: "text-green-600",
  warn: "text-amber-600",
  fault: "text-red-600",
} as const

<span className={toneClass[tone]}>{label}</span>`,
        caption: "A lookup object keeps the class names visible to the scanner",
      },
      {
        type: "note",
        text: "A quick grep for British spellings in class names (`centre`, `colour`, `grey`) is worth adding to review. They look right to a UK reader and are invisible to Tailwind.",
      },
    ],
    tags: ["Tailwind", "CSS", "web"],
    source: { label: "Tailwind CSS docs: detecting classes in source files", url: "https://tailwindcss.com/docs/detecting-classes-in-source-files" },
    project: { name: "PHAEMOS", url: "https://phaemos.com", slug: "phaemos" },
  }

export default _tailwind_full_class_names
