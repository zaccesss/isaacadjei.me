import type { TILEntry } from "../index"

const _commonmark_heading_permalinks: TILEntry = {
    id: "commonmark-heading-permalinks",
    title: "league/commonmark's heading permalink extension gives every heading a linkable id",
    date: "2026-11-10",
    category: "PHP",
    published: true,
    body: "The [HeadingPermalinkExtension](https://commonmark.thephpleague.com/2.x/extensions/heading-permalinks/) in league/commonmark slugs each heading and adds an anchor, so `# Hello World` becomes linkable as `#content-hello-world`. Both prefixes default to `content`. `apply_id_to_heading` moves the id from the anchor onto the heading itself. Setting `insert` to `none` keeps the ids without printing a visible pilcrow, which suits a table of contents. Vitafolio's [docs pages](https://vitafolio.isaacadjei.me/docs) use it so every heading can be linked to.",
    detail: [
      {
        type: "code",
        lang: "php",
        code: `use League\\CommonMark\\Environment\\Environment;
use League\\CommonMark\\Extension\\CommonMark\\CommonMarkCoreExtension;
use League\\CommonMark\\Extension\\HeadingPermalink\\HeadingPermalinkExtension;
use League\\CommonMark\\MarkdownConverter;

$environment = new Environment([
    'heading_permalink' => [
        'apply_id_to_heading' => true,
        'id_prefix' => 'section',
        'fragment_prefix' => 'section',
        'insert' => 'none',
    ],
]);
$environment->addExtension(new CommonMarkCoreExtension());
$environment->addExtension(new HeadingPermalinkExtension());

echo (new MarkdownConverter($environment))->convert('## Getting started');`,
        caption: "Ids on the headings, no visible symbol, a custom prefix",
      },
      {
        type: "note",
        text: "Slugs keep non-ASCII characters, matching GitHub, so a heading in Arabic or Urdu gets an id in that script. Pass a custom slug normaliser if you need ASCII-only fragments.",
      },
    ],
    tags: ["PHP", "Markdown", "Laravel"],
    source: { label: "league/commonmark: heading permalink extension", url: "https://commonmark.thephpleague.com/2.x/extensions/heading-permalinks/" },
    project: { name: "Vitafolio", url: "https://vitafolio.isaacadjei.me", slug: "vitafolio" },
  }

export default _commonmark_heading_permalinks
