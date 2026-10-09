import Link from "next/link"
import NewsletterForm from "@/components/shared/NewsletterForm"

export default function SubscribeBox({ id }: { id?: string }) {
  return (
    <div id={id} className="rounded-lg border border-border/60 bg-muted/30 px-6 py-5 space-y-3 scroll-mt-28">
      <p className="text-sm font-medium">Get each issue in your inbox</p>
      <p className="text-xs text-muted-foreground">
        Free with no spam: you confirm by email first, can leave in one click and can see how your details are handled
        in the{" "}
        <Link href="/privacy" className="text-primary underline underline-offset-2 hover:text-primary/80">
          privacy policy
        </Link>
        .
      </p>
      <NewsletterForm variant="compact" />
    </div>
  )
}
