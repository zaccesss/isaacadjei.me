import type { Metadata } from "next"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import Callout from "@/components/shared/Callout"
import {
  HeartHandshake,
  Bug,
  Cpu,
  BookOpen,
  ImageIcon,
  Lightbulb,
  PencilLine,
  MessagesSquare,
  ShieldAlert,
  GitPullRequest,
  Bot,
  Clock,
  Mail,
  FolderGit2,
  Globe,
  Layers,
  Languages,
} from "lucide-react"
import { FaGithub as Github } from "react-icons/fa6"

export const metadata: Metadata = {
  title: "Contributing",
  description:
    "How to help on my projects: report a bug, flag a hardware problem, improve the writing, suggest an idea or open a pull request.",
  alternates: {
    canonical: "https://www.isaacadjei.me/contribute",
  },
  openGraph: {
    images: ["/api/og?title=Contributing&description=How%20to%20report%20a%20bug%2C%20suggest%20an%20idea%20or%20open%20a%20pull%20request%20on%20my%20projects%2E"],
  },
}

export default function ContributePage() {
  return (
    <div className="container max-w-3xl py-24 space-y-16">
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <HeartHandshake className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">Contributing</h1>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Thank you for taking the time to look at this. Whether you are reporting a bug, suggesting
          an idea or just passing through, I appreciate it.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          This is my shared contributing guide, kept in one place so I am not repeating myself across
          repositories. My work spans software, hardware, a mix of the two, writing, courses and this
          website. Most are personal projects I build for myself and am not actively taking
          contributions on; a few are more public and genuinely welcome them. This guide is the common
          ground for all of them. Where a repository works differently, it says so in its own notes;
          those take precedence over anything here.
        </p>
        <p className="text-sm text-muted-foreground">
          <a
            href="https://github.com/zaccesss/contribute"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
          >
            <Github className="h-4 w-4" />
            Also on GitHub: zaccesss/contribute
          </a>
        </p>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Layers className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">What this covers</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          The same guide applies across everything I build, so the way in is consistent wherever you
          land:
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex gap-3">
            <Cpu className="h-5 w-5 text-primary shrink-0 mt-1" />
            <p className="text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Software and hardware.</span> Web apps and
              tools, plus embedded firmware, PCBs and electronics. Many projects are a mix of the two.
            </p>
          </div>
          <div className="flex gap-3">
            <BookOpen className="h-5 w-5 text-primary shrink-0 mt-1" />
            <p className="text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Writing and courses.</span> Notes, guides
              and course material, where clarity and accuracy matter as much as code.
            </p>
          </div>
          <div className="flex gap-3">
            <ImageIcon className="h-5 w-5 text-primary shrink-0 mt-1" />
            <p className="text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Images and design.</span> Diagrams,
              screenshots, schematics and other assets that make a project easier to follow.
            </p>
          </div>
          <div className="flex gap-3">
            <Globe className="h-5 w-5 text-primary shrink-0 mt-1" />
            <p className="text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">This website.</span> Anything you spot on{" "}
              <span className="font-medium text-foreground">isaacadjei.me</span> itself, from a broken
              link to a typo.
            </p>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          You can browse the range on my{" "}
          <Link
            href="/projects"
            className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
          >
            projects page
          </Link>{" "}
          or across my repositories on{" "}
          <a
            href="https://github.com/zaccesss"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
          >
            GitHub
          </a>
          .
        </p>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Ways to help</h2>
        <div className="space-y-5 text-muted-foreground leading-relaxed">
          <div className="flex gap-3">
            <Bug className="h-5 w-5 text-primary shrink-0 mt-1" />
            <p>
              <span className="font-medium text-foreground">Report a software bug.</span> Open an issue
              on the repository and describe it plainly: what you did, what you expected and what
              happened instead. A small, clear example helps more than anything, even a link or a
              screenshot. For something on this website, tell me the page and your browser too. This is
              genuinely the most useful thing you can do, even if I do not get to it straight away.
            </p>
          </div>
          <div className="flex gap-3">
            <Cpu className="h-5 w-5 text-primary shrink-0 mt-1" />
            <p>
              <span className="font-medium text-foreground">Flag a hardware problem.</span> If the
              project involves hardware, tell me your setup: the board or parts, how it is wired, the
              measurements you took and the versions or environment. A photo of the build often says
              more than a paragraph, so please include one where you can.
            </p>
          </div>
          <div className="flex gap-3">
            <BookOpen className="h-5 w-5 text-primary shrink-0 mt-1" />
            <p>
              <span className="font-medium text-foreground">Improve the writing or a course.</span>{" "}
              Notes, guides and lessons benefit from a second pair of eyes. Point out anything unclear,
              wrong or out of date or suggest an example that would explain it better.
            </p>
          </div>
          <div className="flex gap-3">
            <ImageIcon className="h-5 w-5 text-primary shrink-0 mt-1" />
            <p>
              <span className="font-medium text-foreground">Design, images and media.</span> A clearer
              diagram, a better screenshot, a tidier schematic or a fixed asset are all welcome. Tell
              me what it replaces and why it is better.
            </p>
          </div>
          <div className="flex gap-3">
            <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-1" />
            <p>
              <span className="font-medium text-foreground">Suggest an idea or an improvement.</span>{" "}
              Open an issue and explain the problem you are trying to solve, not only the solution you
              have in mind. I am more likely to act on the why than the what.
            </p>
          </div>
          <div className="flex gap-3">
            <PencilLine className="h-5 w-5 text-primary shrink-0 mt-1" />
            <p>
              <span className="font-medium text-foreground">Fix a typo or small wording slip.</span>{" "}
              These are always welcome. If it is trivial, feel free to open a pull request directly and
              skip the issue.
            </p>
          </div>
          <div className="flex gap-3">
            <MessagesSquare className="h-5 w-5 text-primary shrink-0 mt-1" />
            <p>
              <span className="font-medium text-foreground">Ask a question.</span> Use the
              repository&apos;s Discussions if it has them. Otherwise get in touch, see below.
            </p>
          </div>
          <div className="flex gap-3">
            <Languages className="h-5 w-5 text-primary shrink-0 mt-1" />
            <p>
              <span className="font-medium text-foreground">Write in English where you can.</span>{" "}
              English is the working language for issues, pull requests and comments. Write in your
              own language and translate it if that is easier. Imperfect English is fine.
            </p>
          </div>
          <div className="flex gap-3">
            <ShieldAlert className="h-5 w-5 text-primary shrink-0 mt-1" />
            <p>
              <span className="font-medium text-foreground">Report a security issue.</span> Please do
              not open a public issue for this. Follow the repository&apos;s own security policy if it
              has one, otherwise see my{" "}
              <Link
                href="/security-policy"
                className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
              >
                security policy
              </Link>{" "}
              or email{" "}
              <a href="mailto:security@isaacadjei.me" className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors">
                security@isaacadjei.me
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <GitPullRequest className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Pull requests</h2>
        </div>
        <Callout kind="tip" className="my-0">
          For anything beyond a quick fix, open an issue first. On a personal project I may simply
          prefer to keep it as it is; I would rather save you the wasted effort.
        </Callout>
        <p className="text-muted-foreground leading-relaxed">Once we agree a change is worth doing:</p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>One change is one branch is one pull request. I keep unrelated work apart.</li>
          <li>Keep it small and focused. A tight pull request is read and merged far quicker than one that does five things at once.</li>
          <li>
            Link the issue it closes with{" "}
            <span className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">Closes #123</span>.
          </li>
          <li>
            Code comments explain why, not what: a hidden constraint or a workaround, never a
            restatement of the line.
          </li>
          <li>
            Conventional commit prefixes in the present tense (a repository may override these):{" "}
            <span className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">feat</span>,{" "}
            <span className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">fix</span>,{" "}
            <span className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">chore</span>,{" "}
            <span className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">ci</span>,{" "}
            <span className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">docs</span>.
          </li>
        </ul>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Bot className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Using AI</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          You are welcome to use AI tools while you work, within my{" "}
          <Link href="/ai-policy" className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors">
            AI policy
          </Link>
          . The short version:
        </p>
        <ul className="space-y-3 text-muted-foreground leading-relaxed">
          <li>
            <span className="font-semibold text-foreground">
              Every pull request must say how AI was used, even when the answer is None.
            </span>{" "}
            The template asks for None, Assisted or Generated.
          </li>
          <li>
            <span className="font-medium text-foreground">Write in your own voice.</span> Issue and
            pull request titles, descriptions, comments and reviews are yours. I do not mind imperfect
            grammar; I mind not being able to tell what you actually mean.
          </li>
          <li>
            <span className="font-medium text-foreground">Understand and test what you submit.</span>{" "}
            Read AI output and make sense of it before it becomes a pull request. A change that is
            clearly generated with no understanding or testing behind it will be closed with a short
            note.
          </li>
        </ul>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Clock className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Patience appreciated</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          These are personal projects, so I am not always quick to respond and may not get to
          everything. A clear, well-described issue is the most likely to be picked up when I have the
          time. Thank you for your patience.
        </p>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Getting in touch</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Not everything fits an issue or a discussion. If something is unclear or more personal, email{" "}
          <a
            href="mailto:contact@isaacadjei.me"
            className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
          >
            contact@isaacadjei.me
          </a>{" "}
          or use{" "}
          <Link
            href="/contact"
            className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
          >
            my contact page
          </Link>
          . I will always try to help where I can.
        </p>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <FolderGit2 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Where this applies</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          This is the shared guide across{" "}
          <a
            href="https://github.com/zaccesss"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
          >
            my repositories
          </a>{" "}
          and most of{" "}
          <Link
            href="/projects"
            className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
          >
            my projects
          </Link>
          , kept in the{" "}
          <a
            href="https://github.com/zaccesss/contribute"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
          >
            zaccesss/contribute
          </a>{" "}
          repository. A repository with its own contributing notes takes precedence over this one.
          Thank you again for helping make my projects better.
        </p>
      </section>
    </div>
  )
}
