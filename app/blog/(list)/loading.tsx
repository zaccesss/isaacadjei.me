import IAMark from "@/components/shared/marks/IAMark"

export default function BlogLoading() {
  return (
    <div className="container max-w-4xl py-24 space-y-12">
      <div className="space-y-4">
        <IAMark size={40} className="text-muted-foreground/50 animate-pulse" />
        <div className="h-5 w-96 bg-muted rounded animate-pulse" />
      </div>
      <div className="space-y-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-lg border border-border/60 px-6 py-5">
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
