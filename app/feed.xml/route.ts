export function GET(request: Request) {
  const url = new URL(request.url)
  const dest = new URL("/blog/feed.xml", url)
  dest.search = url.search
  return Response.redirect(dest.toString(), 301)
}
