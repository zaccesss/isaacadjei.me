import type { Metadata } from "next"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import Callout from "@/components/shared/markdown/Callout"
import {
  Bot,
  Sparkles,
  ListChecks,
  MessageSquareText,
  CircleSlash,
  Tags,
  Gavel,
  BookOpen,
  Mail,
  FolderGit2,
} from "lucide-react"
import { FaGithub as Github } from "react-icons/fa6"

export const metadata: Metadata = {
  title: "AI Policy",
  description:
    "How AI may and may not be used in contributions to my projects: declare it on every pull request, write your own words, understand and test what you submit.",
  alternates: {
    canonical: "https://isaacadjei.me/ai-policy",
  },
  openGraph: {
    images: ["/api/og?title=AI%20Policy&description=How%20AI%20may%20and%20may%20not%20be%20used%20in%20contributions%20to%20my%20projects%2E"],
  },
}

const link = "text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
const code = "font-mono text-sm bg-muted px-1.5 py-0.5 rounded"

export default function AiPolicyPage() {
  return (
    <div className="container max-w-3xl py-24 space-y-16">
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Bot className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">AI Policy</h1>
        </div>
        <p className="text-sm text-muted-foreground font-mono">Last updated: November 2026</p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          This policy covers every contribution to my projects from people outside them: code,
          documentation, commits, issues, pull requests, comments, reviews and discussions. I keep it
          in one place so every repository can point to it.
        </p>
        <Callout kind="important" className="my-0">
          <span className="font-semibold text-foreground">
            Every pull request must say how AI was used, even when the answer is None.
          </span>{" "}
          A pull request without it waits until it is added.
        </Callout>
        <p className="text-sm text-muted-foreground">
          <a
            href="https://github.com/zaccesss/ai-policy"
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-1.5 ${link}`}
          >
            <Github className="h-4 w-4" />
            Also on GitHub: zaccesss/ai-policy
          </a>
        </p>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">AI tools are welcome</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          You can use AI tools to learn, to write code or to find your way around a project. You stay
          responsible for everything you submit.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Assistive technology such as dictation, screen readers, translation and spelling or grammar
          tools is not AI use for this policy. You never need to declare it.
        </p>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <ListChecks className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">What is required</h2>
        </div>
        <ul className="space-y-3 text-muted-foreground leading-relaxed">
          <li>
            <span className="font-semibold text-foreground">Declare your AI use.</span> Pull requests
            ask for None, Assisted or Generated. Issue forms ask whether AI helped you find or check
            the problem.
          </li>
          <li>
            <span className="font-semibold text-foreground">Write your own titles and descriptions.</span>{" "}
            Issue and pull request titles and bodies, comments and reviews are written by you in your
            own words. Imperfect English is fine.
          </li>
          <li>
            <span className="font-semibold text-foreground">Translating and tidying is fine.</span>{" "}
            Write in your own language and translate it with any tool. Fixing the spelling and
            grammar of text you wrote is fine too. Neither needs declaring. Having AI write the title
            or description for you is not allowed. Nor is turning a few words into paragraphs.
          </li>
          <li>
            <span className="font-semibold text-foreground">Follow the templates.</span> Fill in every
            required field and keep the template&apos;s sections.
          </li>
          <li>
            <span className="font-semibold text-foreground">Understand what you submit.</span> You
            should be able to explain any line if asked.
          </li>
          <li>
            <span className="font-semibold text-foreground">Test it.</span> Run the project&apos;s
            checks and say what you ran and what you saw.
          </li>
          <li>
            <span className="font-semibold text-foreground">Open it yourself.</span> Issues, pull
            requests and reviews come from a person. An AI agent must not open them on its own.
          </li>
          <li>
            <span className="font-semibold text-foreground">No bulk submissions.</span> Do not open
            generated issues, pull requests or reviews in bulk.
          </li>
        </ul>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <MessageSquareText className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Reviews and comments</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          A review comment must come from your own reading of the change. A pasted AI review that you
          have not checked yourself will be hidden.
        </p>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <CircleSlash className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">If you used no AI</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Choose None. Everything else stays the same: the same checks and reviews apply.
        </p>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Tags className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Labels</h2>
        </div>
        <ul className="space-y-3 text-muted-foreground leading-relaxed">
          <li>
            <span className={code}>ai-assisted</span>: you wrote it and AI helped with parts.
          </li>
          <li>
            <span className={code}>ai-generated</span>: AI wrote most or all of it and you reviewed and
            tested it.
          </li>
          <li>
            <span className={code}>needs-ai-disclosure</span>: the disclosure is missing, so the pull
            request waits until it is added.
          </li>
        </ul>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Gavel className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">What happens otherwise</h2>
        </div>
        <ul className="space-y-3 text-muted-foreground leading-relaxed">
          <li>
            <span className="font-semibold text-foreground">Missing disclosure:</span> the pull request
            is labelled <span className={code}>needs-ai-disclosure</span> and waits.
          </li>
          <li>
            <span className="font-semibold text-foreground">
              Generated work no person has reviewed or tested,
            </span>{" "}
            including anything an AI agent opened on its own: closed with a short note linking here.
          </li>
          <li>
            <span className="font-semibold text-foreground">Repeated cases</span> fall under the{" "}
            <Link href="/code-of-conduct" className={link}>
              code of conduct
            </Link>
            .
          </li>
        </ul>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Useful reading</h2>
        </div>
        <ul className="space-y-2 text-muted-foreground leading-relaxed">
          <li>
            <Link href="/contribute" className={link}>
              Contributing guide
            </Link>
            : how to get a change from idea to merge
          </li>
          <li>
            <Link href="/code-of-conduct" className={link}>
              Code of conduct
            </Link>
            : how everyone is expected to behave
          </li>
          <li>
            <a
              href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests"
              target="_blank"
              rel="noreferrer"
              className={link}
            >
              About pull requests
            </a>
            : GitHub&apos;s guide
          </li>
          <li>
            <a
              href="https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue"
              target="_blank"
              rel="noreferrer"
              className={link}
            >
              Creating an issue
            </a>
            : GitHub&apos;s guide
          </li>
          <li>
            <a
              href="https://docs.github.com/en/discussions/collaborating-with-your-community-using-discussions/participating-in-a-discussion"
              target="_blank"
              rel="noreferrer"
              className={link}
            >
              Taking part in a discussion
            </a>
            : GitHub&apos;s guide
          </li>
          <li>
            <a href="https://cbea.ms/git-commit/" target="_blank" rel="noreferrer" className={link}>
              How to write a Git commit message
            </a>
            : a short guide by Chris Beams
          </li>
        </ul>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Questions and contact</h2>
        </div>
        <ul className="space-y-3 text-muted-foreground leading-relaxed">
          <li>
            <span className="font-semibold text-foreground">Questions:</span> ask in the
            repository&apos;s Discussions tab where it is turned on. The{" "}
            <Link href="/support" className={link}>
              support page
            </Link>{" "}
            lists every other way to get help.
          </li>
          <li>
            <span className="font-semibold text-foreground">Anything private:</span> email{" "}
            <a href="mailto:contact@isaacadjei.me" className={link}>
              contact@isaacadjei.me
            </a>{" "}
            if something here is unclear or you have a question the policy does not answer.
          </li>
          <li>
            <span className="font-semibold text-foreground">Security problems</span> never go in a
            public issue or discussion. Follow the{" "}
            <Link href="/security-policy" className={link}>
              security policy
            </Link>{" "}
            or email{" "}
            <a href="mailto:security@isaacadjei.me" className={link}>
              security@isaacadjei.me
            </a>
            .
          </li>
        </ul>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <FolderGit2 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Where this applies</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          This applies across{" "}
          <a href="https://github.com/zaccesss" target="_blank" rel="noreferrer" className={link}>
            my repositories
          </a>{" "}
          and{" "}
          <Link href="/projects" className={link}>
            my projects
          </Link>
          . A repository with its own AI notes takes precedence over this policy.
        </p>
      </section>
    </div>
  )
}
