import type { Metadata } from "next"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import Callout from "@/components/shared/markdown/Callout"
import {
  BookOpen,
  Bug,
  Contrast,
  Eye,
  FolderGit2,
  Globe,
  Keyboard,
  Layers,
  Type,
} from "lucide-react"
import { FaGithub as Github } from "react-icons/fa6"
import PageHeader from "@/components/layout/PageHeader"

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "What I do so this site and my projects can be read and used by as many people as possible, plus how to tell me when something gets in the way.",
  alternates: {
    canonical: "https://isaacadjei.me/accessibility",
  },
  openGraph: {
    images: ["/api/og?title=Accessibility&description=What%20I%20do%20so%20this%20site%20and%20my%20projects%20can%20be%20read%20and%20used%20by%20as%20many%20people%20as%20possible%2E"],
  },
}

const REPOS_WITH_STATEMENTS = [
  { name: "dotfiles", url: "https://github.com/zaccesss/dotfiles" },
  { name: "dotfiles/terminal/terminal", url: "https://github.com/zaccesss/dotfiles/tree/main/terminal/terminal" },
  { name: "dotfiles/editors/vscode", url: "https://github.com/zaccesss/dotfiles/tree/main/editors/vscode" },
  { name: "dotfiles/editors/neovim", url: "https://github.com/zaccesss/dotfiles/tree/main/editors/neovim" },
  { name: "dotfiles/terminal/tmux", url: "https://github.com/zaccesss/dotfiles/tree/main/terminal/tmux" },
  { name: "dotfiles/terminal/cli-tools", url: "https://github.com/zaccesss/dotfiles/tree/main/terminal/cli-tools" },
  { name: "dotfiles/editors/jetbrains", url: "https://github.com/zaccesss/dotfiles/tree/main/editors/jetbrains" },
  { name: "dotfiles/apps/raycast", url: "https://github.com/zaccesss/dotfiles/tree/main/apps/raycast" },
  { name: "dotfiles/apps/rectangle", url: "https://github.com/zaccesss/dotfiles/tree/main/apps/rectangle" },
]

const linkClass = "body-link"

export default function AccessibilityPage() {
  return (
    <div className="container max-w-3xl py-24 space-y-16">
      <PageHeader
        title="Accessibility"
        description={
          <>
            This is my accessibility statement, kept in one place so this website and every repository
            can point to it.
          </>
        }
      >
        <p className="text-muted-foreground leading-relaxed">
          It covers what I do so that my work can be read and used by as many people as possible,
          where the gaps are and how to tell me when something gets in the way. A repository with its
          own accessibility notes documents its own settings; those take precedence over anything here.
        </p>
        <p className="text-sm text-muted-foreground">
          <a
            href="https://github.com/zaccesss/accessibility"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 body-link"
          >
            <Github className="h-4 w-4" />
            Also on GitHub: zaccesss/accessibility
          </a>
        </p>
      </PageHeader>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Layers className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">What I aim for</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex gap-3">
            <Eye className="h-5 w-5 text-primary shrink-0 mt-1" />
            <p className="text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Readable structure.</span> Content reads in
              order under real headings, so a screen reader and the page outline can move through it.
            </p>
          </div>
          <div className="flex gap-3">
            <Keyboard className="h-5 w-5 text-primary shrink-0 mt-1" />
            <p className="text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Keyboard first.</span> Every page and
              form can be used from the keyboard, with a visible focus. The one exception is listed
              under the known limitations below.
            </p>
          </div>
          <div className="flex gap-3">
            <Type className="h-5 w-5 text-primary shrink-0 mt-1" />
            <p className="text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Text that stands on its own.</span> Link
              text says where a link goes, images carry alt text and colour never carries a meaning
              alone.
            </p>
          </div>
          <div className="flex gap-3">
            <Contrast className="h-5 w-5 text-primary shrink-0 mt-1" />
            <p className="text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Your settings respected.</span> A light or
              dark theme, reduced motion and your own font size.
            </p>
          </div>
          <div className="flex gap-3">
            <BookOpen className="h-5 w-5 text-primary shrink-0 mt-1" />
            <p className="text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Plain language.</span> A term is explained
              where it first appears.
            </p>
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Globe className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">This website</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          What is in place on isaacadjei.me. This is a list of what I have built, not a claim that the
          site conforms to WCAG at any level.
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>The page language is declared and every page has one heading outline.</li>
          <li>A &quot;Skip to content&quot; link is the first thing the keyboard reaches on every page.</li>
          <li>The theme follows your system setting, with a toggle in the header.</li>
          <li>
            Content never fades in or waits for a scroll to appear. The header signature draws itself
            once when a page loads and the favicon breathes for a few seconds. Both then hold still.
          </li>
          <li>
            When your system asks for reduced motion, the signature, the favicon, the music visualiser
            and the 3D board hold still and the lab terminal prints its output at once. The theme
            changes in one step and opening a project does not animate. The{" "}
            <Link href="/colophon" className={linkClass}>
              colophon
            </Link>{" "}
            lists every case.
          </li>
          <li>
            Nothing is smaller than 13px. Long-form writing is set at 18px in a column of about 68
            characters.
          </li>
          <li>
            Body text and the grey used for secondary text stay above 7 to 1 against the page in both
            themes. Links in running text are always underlined, so they never rely on colour alone.
          </li>
          <li>
            Buttons, links and filter controls are at least 44 by 44 pixels to press, with padding or an
            invisible hit area where the visible control is smaller.
          </li>
          <li>
            Buttons, links and filter controls show a clear focus ring when you reach them from the
            keyboard.
          </li>
          <li>
            Most charts sit in a frame with a title and their unit, with the same figures in a table for
            screen readers. A donut lists its parts with each figure and share, a gauge writes its
            figure and a band word such as On track and the 24 hour clocks write the busiest hour, so
            the main reading never depends on hovering or on telling colours apart.
          </li>
          <li>Icon-only buttons carry a label for screen readers.</li>
          <li>
            The command menu (Ctrl or Cmd with I) reaches every page from the keyboard. The{" "}
            <Link href="/all-pages" className={linkClass}>
              All Pages
            </Link>{" "}
            page lists them all in plain text.
          </li>
          <li>Images carry alt text. Code, commands and output are shown as text, never as screenshots.</li>
        </ul>
        <Callout kind="warning" className="my-0">
          Known limitations: the maps and 3D views on the lab and stats pages are visual by nature.
          Most charts carry their figures in a table, but not every chart has one yet. The signature and
          drawing boards on the guestbook need a mouse, a finger or a pen.
          Both are optional, so the guestbook can still be signed from the keyboard alone. Where a
          page embeds content from another service, that content follows the service&apos;s own
          accessibility.
        </Callout>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <FolderGit2 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">My repositories</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Documentation in every repository follows the same rules:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>a real heading outline, so screen readers and the page outline can jump between sections</li>
          <li>link text that says where the link goes, never &quot;click here&quot;</li>
          <li>alt text on images and badges</li>
          <li>diagrams written as Mermaid or tables where possible, so their content is text</li>
          <li>code, commands and output as text, never as screenshots</li>
          <li>callouts that carry a label such as Note, Tip or Warning, never colour alone</li>
          <li>plain language, with a term explained where it first appears</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">
          A repository whose contents change how something looks, sounds or is operated, such as my
          dotfiles and editor configurations, documents its own settings in its own{" "}
          <span className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">ACCESSIBILITY.md</span>:
          the colours and contrast, the key bindings, the motion and what to change for a different
          need. That file takes precedence over this statement.
        </p>
        <Callout kind="note" className="my-0">
          Many of those settings are preferences rather than requirements. Change them freely in your
          own copy. If a change would help other people too, open an issue or a pull request on that
          repository so I can consider it for everyone.
        </Callout>
        <p className="text-muted-foreground leading-relaxed">
          Repositories and folders with their own statement:{" "}
          {REPOS_WITH_STATEMENTS.map((repo, i) => (
            <span key={repo.name}>
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className={linkClass}
              >
                {repo.name}
              </a>
              {i < REPOS_WITH_STATEMENTS.length - 2 ? ", " : i === REPOS_WITH_STATEMENTS.length - 2 ? " and " : "."}
            </span>
          ))}
        </p>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Bug className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Reporting a barrier</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          If anything on this website or in a repository is hard to read or use, tell me. For a
          repository, open an issue there. For this website, use{" "}
          <Link href="/contact" className={linkClass}>
            my contact page
          </Link>{" "}
          or email{" "}
          <a href="mailto:contact@isaacadjei.me" className={linkClass}>
            contact@isaacadjei.me
          </a>
          . Say what you were trying to do, what happened and what would have worked better. If the
          assistive technology or the settings you use are relevant, mention them too.
        </p>
        <Callout kind="important" className="my-0">
          I treat an accessibility problem as a bug, not a feature request. These are personal
          projects, so I am not always quick, but a barrier goes to the front of the queue.
        </Callout>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Layers className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Where this applies</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          This is the shared statement for this website and most of{" "}
          <Link href="/projects" className={linkClass}>
            my projects
          </Link>
          , kept in the{" "}
          <a
            href="https://github.com/zaccesss/accessibility"
            target="_blank"
            rel="noreferrer"
            className={linkClass}
          >
            zaccesss/accessibility
          </a>{" "}
          repository. A repository with its own accessibility notes takes precedence over this one.
        </p>
      </section>
    </div>
  )
}
