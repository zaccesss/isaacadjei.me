# isaacadjei.me

[![CI](https://github.com/zaccesss/isaacadjei.me/actions/workflows/ci.yml/badge.svg)](https://github.com/zaccesss/isaacadjei.me/actions/workflows/ci.yml)
[![License: PolyForm NC](https://img.shields.io/badge/license-PolyForm%20Noncommercial-blue.svg)](LICENSE)

Source code for the public pages of [isaacadjei.me](https://isaacadjei.me), the personal site of Isaac Adjei, an Electronic Engineering and Computer Science student at Aston University. The site has a portfolio, a blog, Today I Learned entries, notes and a page of things read, watched and listened to. It also has public statistics pages with charts, maps and live status cards.

> [!NOTE]
> This repository is a published copy of the site's source. It is meant to be read. Changes are made at the source and published here, so pull requests cannot be merged directly. See [CONTRIBUTING.md](CONTRIBUTING.md) for how to suggest a change.

> [!IMPORTANT]
> Only content that is live on the site is included. Drafts and entries scheduled for a future date are left out of every publish.

## Tech stack

<div align="center">

### Framework and styling

| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" width="60" /> | <img src="https://techstack-generator.vercel.app/react-icon.svg" width="60" /> | <img src="https://techstack-generator.vercel.app/ts-icon.svg" width="60" /> | <img src="https://skillicons.dev/icons?i=tailwind" width="60" /> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/framermotion/framermotion-original.svg" width="60" /> | <img src="https://cdn.simpleicons.org/radixui/8B5CF6" width="60" /> |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **Next.js** | **React** | **TypeScript** | **Tailwind CSS** | **Framer Motion** | **Radix UI** |

### Charts, maps and 3D

| <img src="https://cdn.simpleicons.org/apacheecharts/AA344D" width="60" /> | <img src="https://cdn.simpleicons.org/maplibre/396CB2" width="60" /> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg" width="60" /> |
| :---: | :---: | :---: |
| **ECharts** | **MapLibre GL** | **three.js** |

### Tooling and hosting

| <img src="https://cdn.simpleicons.org/vitest/6E9F18" width="60" /> | <img src="https://techstack-generator.vercel.app/eslint-icon.svg" width="60" /> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" width="60" /> | <img src="https://techstack-generator.vercel.app/github-icon.svg" width="60" /> | <img src="https://skillicons.dev/icons?i=vercel" width="60" /> |
| :---: | :---: | :---: | :---: | :---: |
| **Vitest** | **ESLint** | **Git** | **GitHub Actions** | **Vercel** |

</div>

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

Open http://localhost:3000. Other commands are `npm run build`, `npm run lint` and `npm test`.

> [!TIP]
> Pages that show live data need their service keys. Without them those sections show empty states and the rest of the site works as normal. `.env.example` lists the variables.

## Licence

Released under the [PolyForm Noncommercial License 1.0.0](LICENSE). You are welcome to read the code and learn from it. Commercial use is not permitted.
