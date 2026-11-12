# isaacadjei.me

[![CI](https://github.com/zaccesss/isaacadjei.me/actions/workflows/ci.yml/badge.svg)](https://github.com/zaccesss/isaacadjei.me/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/zaccesss/isaacadjei.me?label=release)](https://github.com/zaccesss/isaacadjei.me/releases/latest)
[![Licence: PolyForm NC](https://img.shields.io/badge/licence-PolyForm%20Noncommercial-blue.svg)](LICENSE)

Source code for [isaacadjei.me](https://isaacadjei.me), the personal site of Isaac Adjei, an Electronic Engineering and Computer Science student. It holds my projects, my writing and research and a set of public statistics pages with charts, maps and live status cards.

> [!NOTE]
> This repository is meant to be read. It is a personal site, so I do not merge pull requests here. See [CONTRIBUTING.md](CONTRIBUTING.md) for how to suggest a change or report a bug.

## What is on the site

| Page | What it holds |
| --- | --- |
| [About](https://isaacadjei.me/about) | Who I am and how I got here |
| [Experience](https://isaacadjei.me/experience) | Roles, education and what I did in each |
| [Skills](https://isaacadjei.me/skills) | What I work with, grouped by area |
| [Projects](https://isaacadjei.me/projects) | Electronics and software projects, each with its own write-up |
| [Blog](https://isaacadjei.me/blog) | Longer posts on engineering, projects and student life |
| [Today I Learned](https://isaacadjei.me/til) | Short entries, one thing learnt at a time |
| [Notes](https://isaacadjei.me/notes) | How I work, study and plan |
| [Newsletter](https://isaacadjei.me/newsletter) | Letters and shorter issues, all readable on the site |
| [Research](https://isaacadjei.me/research) | Work in progress |
| [Publications](https://isaacadjei.me/publications) | What has been published, with citations |
| [Open source](https://isaacadjei.me/open-source) | What I have contributed to other projects |
| [Consumed](https://isaacadjei.me/consumed) | What I read, watch and listen to |
| [Lab](https://isaacadjei.me/lab) | An interactive terminal with themes, scenes and games |
| [Stats](https://isaacadjei.me/stats) | Public statistics on my coding, music, gaming and writing |
| [Now](https://isaacadjei.me/now) | What I am focused on at the moment |
| [Uses](https://isaacadjei.me/uses) | The hardware and software I work with |
| [Links](https://isaacadjei.me/links) | Every profile of mine in one place |
| [Friends](https://isaacadjei.me/friends) | People I learn from and how to become pen pals |
| [Guestbook](https://isaacadjei.me/guestbook) | Messages and drawings from visitors |
| [Install](https://isaacadjei.me/install) | How to set up the tools I publish |
| [Accessibility](https://isaacadjei.me/accessibility) | The accessibility statement the site is built to |
| [Changelog](https://isaacadjei.me/changelog) | What changed in each release |
| [All pages](https://isaacadjei.me/all-pages) | Everything else, in one list |

## Tech stack

<div align="center">

### Framework and styling

| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" width="60" alt="" /> | <img src="https://cdn.jsdelivr.net/gh/qkrdmstlr3/techstack-generator@1a8656741692dfe08effc82600f4d0d4bb87d420/static/react-icon.svg" width="60" alt="" /> | <img src="https://cdn.jsdelivr.net/gh/qkrdmstlr3/techstack-generator@1a8656741692dfe08effc82600f4d0d4bb87d420/static/ts-icon.svg" width="60" alt="" /> | <img src="https://skillicons.dev/icons?i=tailwind" width="60" alt="" /> | <img src="https://cdn.simpleicons.org/framer/0055FF" width="60" alt="" /> | <img src="https://cdn.simpleicons.org/radixui/8B5CF6" width="60" alt="" /> |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **Next.js** | **React** | **TypeScript** | **Tailwind CSS** | **Framer Motion** | **Radix UI** |

### Charts, maps and 3D

| <img src="https://cdn.simpleicons.org/apacheecharts/AA344D" width="60" alt="" /> | <img src="https://cdn.simpleicons.org/maplibre/396CB2" width="60" alt="" /> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg" width="60" alt="" /> |
| :---: | :---: | :---: |
| **ECharts** | **MapLibre GL** | **three.js** |

### Tooling and hosting

| <img src="https://cdn.simpleicons.org/vitest/6E9F18" width="60" alt="" /> | <img src="https://cdn.jsdelivr.net/gh/qkrdmstlr3/techstack-generator@1a8656741692dfe08effc82600f4d0d4bb87d420/static/eslint-icon.svg" width="60" alt="" /> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" width="60" alt="" /> | <img src="https://cdn.jsdelivr.net/gh/qkrdmstlr3/techstack-generator@1a8656741692dfe08effc82600f4d0d4bb87d420/static/github-icon.svg" width="60" alt="" /> | <img src="https://skillicons.dev/icons?i=vercel" width="60" alt="" /> |
| :---: | :---: | :---: | :---: | :---: |
| **Vitest** | **ESLint** | **Git** | **GitHub Actions** | **Vercel** |

### Data and services

| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="60" alt="" /> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" width="60" alt="" /> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="60" alt="" /> | <img src="https://skillicons.dev/icons?i=cloudflare" width="60" alt="" /> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sentry/sentry-original.svg" width="60" alt="" /> |
| :---: | :---: | :---: | :---: | :---: |
| **PostgreSQL** | **Upstash Redis** | **Node.js** | **Cloudflare** | **Sentry** |

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
| `CHANGELOG.md` | Release notes for the site |

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
