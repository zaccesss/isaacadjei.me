import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "How I use AI",
  description: "What I use AI for, what I keep for myself and what I check.",
  alternates: {
    canonical: "https://isaacadjei.me/ai",
  },
  openGraph: {
    images: ["/api/og?title=How%20I%20use%20AI&description=What%20I%20use%20AI%20for%2C%20what%20I%20keep%20for%20myself%20and%20what%20I%20check."],
  },
}

const link = "body-link"
const paragraph = "text-base text-muted-foreground leading-relaxed"

export default function AiPage() {
  return (
    <div className="container max-w-2xl py-24 space-y-6">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">How I use AI</h1>
        <p className="text-sm text-muted-foreground font-mono">Last updated: November 2026</p>
      </div>

      <p className={paragraph}>
        Most people use AI in some way now and I am one of them. I do not think there is any shame in that or
        any point in hiding it. What matters is how it is used and whether you are honest about it, so this
        page sets out what I use it for, what I keep for myself and what I check.
      </p>

      <p className={paragraph}>
        I came to it late. I did not use it at all until early 2025. Before that I was wary of it and, I
        admit, I did not know how to use it. I learnt how it works before I started and that is why I use it
        the way I do now.
      </p>

      <p className={paragraph}>
        Mainly it is a double check. I am partially sighted, so I mistype and I miss things, in my own work
        and in whatever I happen to be reading. English is not my mother tongue. I speak and write it but I am
        still getting better at it, so now and then a sentence comes out in a way that changes the meaning of
        what I wanted to say. It picks up the spelling and the grammar and points out the sentence that could
        be misread. I could manage without it, but it helps sometimes.
      </p>

      <p className={paragraph}>
        I also ask it the kind of question I would once have typed into a search engine: who invented
        something, how a thing behaves, whether the tools I have picked suit an idea I am planning. I still
        search and I still read, because it is not my most reliable source, but it is good at putting a
        general concept in simpler terms and it is useful for longer research. One example is{" "}
        <Link href="/til/substack-compose-link" className={link}>
          the Substack compose link I wrote up as a TIL
        </Link>
        . I used it as a guide while I looked for a way to open the editor there with text already filled in.
        It told me three times there was no such way. I did not believe it, so I insisted on finding it and
        it guided me at some points along the way. It turned out to be there all along.
      </p>

      <p className={paragraph}>
        With code I ask whether something is doing the right thing and it helps me spot bugs. I fix them
        myself when I can. When I cannot, it guides me through it and then I check what it did, because I need to
        understand a change before I keep it. I test nearly everything before it ships. I will be the one asked
        about it later. As part of security I also set up hooks, which are automatic checks that control what it can
        do. They stop things like passwords, very large files and forced changes before anything leaves my
        device, whoever wrote them. I wrote about them in{" "}
        <Link href="/blog/git-hooks-that-saved-me" className={link}>
          Git Hooks That Have Saved Me
        </Link>
        .
      </p>

      <p className={paragraph}>
        Most things I keep for myself. The ideas come from me and the work usually passes through my own
        hands first. Formal and personal writing I prefer to do myself, with a check for spelling at most. The
        same goes for anything sensitive and for anything that could do harm, to me or to anyone else. I am
        very careful with certain things. When I state a fact I look it up myself and only have it checked
        when I am unsure.
      </p>

      <p className={paragraph}>
        It has limits and I try to remember them. It is wrong more often than you might expect, it sounds
        sure of itself when it is and it will nearly always agree with you, which is not the same as being
        right. My AI modules taught me why. These systems find patterns in data without understanding what the words
        mean, so a model can score well and still be wrong. A confident answer does not impress me. I use it when I need to understand something further or when I am unsure, not to have my own
        thinking approved. Not knowing something and struggling with it for a while is part of learning, so I
        try not to skip that part.
      </p>

      <p className={paragraph}>
        I am not perfect at any of this. Sometimes I can be impatient and approve something too quickly. When
        that happens I go back to check it or I redo it myself.
      </p>

      <p className={paragraph}>
        None of it runs without rules. My AI modules at university gave me the words for how I work. Bounded
        autonomy means a system may choose its own action, but only among options people have permitted. Human
        oversight means a person approves or takes over at set points. That is how I treat it. It works inside
        limits I have set and it does not get to add what it likes. I read what it produces before it goes
        anywhere, because once something leaves my device it is
        mine to answer for, whether that is writing or code. I take security seriously, so I am careful about
        what I put into it. Wherever I contribute, on an open source project, at work or anywhere else, I follow
        the rules that place sets for AI. Where there are none I am still happy to say how something was made
        when I am asked. Once my work is merged or published it is my responsibility. I would hate for a
        mistake of mine to cause someone a problem or make their day worse.
      </p>

      <p className={paragraph}>
        I am a Christian and there are values I hold to, honesty among them, which apply here in the same way
        they apply everywhere else.
      </p>

      <p className={paragraph}>
        I like learning and I would sooner understand what I am doing than pretend I know it all. I am fine
        with admitting a mistake and asking for help. My teachers taught me to use a tool and still
        think for myself. My sight limits me in some areas and I put in
        the effort regardless.
      </p>

      <p className={paragraph}>
        University work is different from everything above: each module sets its own rules on AI and I follow
        those.
      </p>

      <p className={paragraph}>
        The decisions here are mine and so is the responsibility. One argument from my first AI module has
        stayed with me: hold the people responsible, not the machine. If something on this site is wrong, that
        is on me, so please tell me through the{" "}
        <Link href="/contact" className={link}>
          contact page
        </Link>
        .
      </p>

      <p className={paragraph}>I will update this page as the way I work changes.</p>

      <p className={paragraph}>
        Thank you to Derek Sivers and Damola, whose pages gave me the idea for this one:{" "}
        <a href="https://sive.rs/ai" target="_blank" rel="noopener noreferrer" className={link}>
          Derek Sivers&apos;s AI page
          <span className="sr-only"> (opens in a new tab)</span>
        </a>{" "}
        and{" "}
        <a href="https://www.bydamo.la/p/ai-manifesto" target="_blank" rel="noopener noreferrer" className={link}>
          Damola&apos;s AI manifesto
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        .
      </p>

      <p className="text-sm text-muted-foreground leading-relaxed pt-4">
        The rules for people who contribute to my projects are on a separate page, the{" "}
        <Link href="/ai-policy" className={link}>
          AI Policy
        </Link>
        .
      </p>
    </div>
  )
}
