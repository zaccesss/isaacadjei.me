# isaacadjei.me

Source code for the public pages of [isaacadjei.me](https://isaacadjei.me), the personal site of Isaac Adjei, an Electronic Engineering and Computer Science student at Aston University.

This repository is a published copy of the site's source. It shows how the public pages are built and is meant to be read. Changes are made at the source and published here, so pull requests cannot be merged directly. See [CONTRIBUTING.md](CONTRIBUTING.md) for how to suggest a change.

## What the site includes

- A portfolio with projects, experience, skills and a blog
- Today I Learned entries and notes
- A page of things I have read, watched and listened to
- Public statistics pages with charts, maps and live status cards
- A search page, tag pages, RSS feeds and generated social images

## Built with

| Area | Tools |
| --- | --- |
| Framework | Next.js (App Router) with React and TypeScript |
| Styling | Tailwind CSS with Radix UI primitives and Framer Motion |
| Charts and maps | Recharts, ECharts, MapLibre GL and three.js |
| Content | Typed data modules for posts, entries and projects |
| Testing | Vitest |
| Hosting | Vercel |

## Project structure

| Folder | Contents |
| --- | --- |
| `app/` | Routes, layouts, API route handlers and page level components |
| `components/` | Shared components grouped by area |
| `lib/` | Helpers and data access used by the pages |
| `data/` | Typed content: posts, entries, projects, skills and links |
| `hooks/` | Reusable React hooks |
| `public/` | Static images, fonts and icons |
| `styles/` | Global animation styles |
| `types/` | Shared type declarations |
| `tests/` | Unit tests |

## Running it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Pages that show live data need their service keys. Without them those sections show empty states and the rest of the site works as normal. `.env.example` lists the variables.

Other commands: `npm run build`, `npm run lint` and `npm test`.

## Published content only

Only content that is live on the site is included here. Drafts and entries scheduled for a future date are left out of every publish.

## Licence

Released under the [PolyForm Noncommercial License 1.0.0](LICENSE). You are welcome to read the code and learn from it. Commercial use is not permitted.

## Contact

[isaacadjei.me](https://isaacadjei.me) or contact@isaacadjei.me
