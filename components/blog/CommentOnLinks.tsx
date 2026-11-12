import { Fragment } from "react"
import { commentLinks } from "@/lib/content/comment-links"
import ReplyPressCounter from "@/components/blog/ReplyPressCounter"

const LINK = "inline-flex min-h-11 min-w-11 items-center body-link"

export const REPLY_ANYWHERE = "Have a thought, correction or question? Reply where you already are and it reaches me."

export const commentLead = (alongside: boolean) => (alongside ? "Or comment on" : "Comment on")

export default function CommentOnLinks({ path, alongside = false }: { path: string; alongside?: boolean }) {
  const links = commentLinks(path)
  if (links.length === 0) return null
  return (
    <p className="text-sm text-muted-foreground">
      <ReplyPressCounter />
      {commentLead(alongside)}{" "}
      {links.map((l, i) => (
        <Fragment key={l.network}>
          {i > 0 && (i === links.length - 1 ? " or " : ", ")}
          <a href={l.href} className={LINK} target="_blank" rel="noopener noreferrer" aria-label={`Comment on ${l.network} (opens in a new tab)`}>
            {l.network}
          </a>
        </Fragment>
      ))}
    </p>
  )
}

export function ReplySection({ path, as: Heading = "h2", className }: { path: string; as?: "h2" | "h3"; className?: string }) {
  if (commentLinks(path).length === 0) return null
  return (
    <section id="comments" aria-labelledby="reply-heading" className={className ?? "space-y-2 scroll-mt-20"}>
      <div>
        <Heading id="reply-heading" className="text-base font-semibold">Reply</Heading>
        <p className="text-sm text-muted-foreground mt-0.5">{REPLY_ANYWHERE}</p>
      </div>
      <CommentOnLinks path={path} />
    </section>
  )
}
