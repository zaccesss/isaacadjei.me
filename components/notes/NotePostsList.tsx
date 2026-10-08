import { NotebookPen } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { getPublishedNotes } from "@/data/notes"
import NotePostsBrowser from "./NotePostsBrowser"

export default function NotePostsList() {
  const notes = getPublishedNotes().map(({ slug, title, date, description, tags }) => ({ slug, title, date, description, tags }))
  if (notes.length === 0) return null

  return (
    <>
      <section className="space-y-6" aria-labelledby="note-posts-heading">
        <div className="flex items-center gap-3">
          <NotebookPen className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 id="note-posts-heading" className="text-xl font-bold">Latest Notes</h2>
        </div>
        <NotePostsBrowser notes={notes} />
      </section>
      <Separator />
    </>
  )
}
