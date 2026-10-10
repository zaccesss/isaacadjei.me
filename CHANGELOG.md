# Changelog

Release notes for the public site, generated from its changelog page. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [2.78.0] - 2026-10-10

_Midweek issues_

### Added

- Midweek issues every other Wednesday on topics beyond engineering, from Ghana and Africa to football, psychology and culture. They are on the site only, so your inbox still gets one email a week at most
- Three more Outside issues and photos in earlier ones
- Blog posts show their covers in the feeds again

### Changed

- Newsletter cards and feeds show whether an issue is a letter, an Outside issue or a Midweek issue
- The CNC milling machine project describes the real build
- Project pages no longer show the same link twice

### Fixed

- Pages that do not exist now return a proper not found status

## [2.77.0] - 2026-10-10

_Covers, notes and images_

### Added

- A Notes section on the homepage and previous and next links on every note
- Photos and flowcharts in newsletter issues, in the email as well as on the site
- New demo clips of the site, including the light and dark switch

### Changed

- Blog posts show their covers again, on the list, the post itself and the homepage
- Switching between light and dark is one smooth reveal from the toggle. With reduced motion it is instant
- Images load from the site's own media domain in sizes made in advance, so they stay sharp on any screen
- The homepage reads Projects, Blog, Newsletter, TIL then Notes and lines up evenly on wide screens
- Four research notes are dated and appear with the rest of the notes

## [2.76.0] - 2026-10-10

_Newsletter signature_

### Changed

- Newsletter issues end with the updated signature, with my pronouns and the links on their own line so they read well on a phone

## [2.75.1] - 2026-10-10

_Behind the scenes_

### Fixed

- Music stats count every play, with none missed or counted twice
- Two charts behind the scenes show their figures as soon as you hover or focus them

## [2.75.0] - 2026-10-09

_Ventures_

### Added

- The Links page has a Ventures section for PHAEMOS, MELOPHOS, Vitafolio and Zaccess

## [2.72.4] - 2026-10-09

_On the fediverse_

### Added

- You can follow me on Mastodon at @isaac@isaacadjei.me. Links shared from here now show who wrote them

## [2.72.3] - 2026-10-09

_Newsletter touches_

### Added

- Newsletter issues show their tags in the list, like blog posts and TILs

### Changed

- Every newsletter issue ends with an updated signature and a link to book a call

## [2.72.2] - 2026-10-09

_Behind the scenes_

### Fixed

- A page that failed to open behind the scenes now loads again

## [2.72.1] - 2026-10-09

_Behind the scenes_

### Changed

- Tidier task tracking behind the scenes, so finished work is never shown as overdue

## [2.72.0] - 2026-10-09

_Behind the scenes_

### Added

- New posts, notes and newsletter issues are announced the moment they go live
- Newsletter issues now show how many readers opened and clicked them, without keeping anyone's address

## [2.71.2] - 2026-10-09

_The tools in action_

### Changed

- The development environment project shows every tool in action, from the shell and tmux to Neovim, lazygit, fzf, the Git hooks and Linux, in the same high contrast colours in dark and light mode

## [2.71.1] - 2026-10-09

_Lighter and better watched_

### Changed

- Pages refresh only when something on them changes, so the site does far less work behind the scenes

### Fixed

- The command menu works by tap and click again, not only from the keyboard
- Reactions and Comments links from the feeds open at that section on iPhones too
- Errors from the site are reported again, including ones that happen in your browser

## [2.71.0] - 2026-10-09

_The newsletter moves onto the site_

### Added

- /newsletter: a letter every other week with everything I published since the last one, plus a short Outside issue in the weeks between on something beyond my own work
- Every issue has its own page with reactions, comments and the same signature as my emails. The archive goes back to May
- Sign up with a confirmation link and leave in one click. Issues arrive by email on the morning of their date
- Issues have tags and appear in search, on tag pages and in the all-in-one feed
- Each letter lists what I read, watched and listened to that fortnight
- Notes from May to September, one a month, plus my summer and autumn plans as notes
- The command menu can search the whole site

### Changed

- Blog posts lead with their words instead of a cover image. Projects keep their covers
- Notes is a list like the blog and TIL. What I am building and what is next moved to /now
- Every list pages the same way: 20 per page for writing and feed pages, 15 for project and Consumed cards
- Notes and newsletter issues appear in the writing stats
- One newsletter sign-up per page and a tidier footer

## [2.70.0] - 2026-10-08

_Projects, writing and feeds_

### Added

- /projects: full write-ups for every project with covers, demo clips, diagrams, the team and references, plus new pages for Vitafolio, PHAEMOS, MELOPHOS, LidarSAT, this site and my development environment
- /feeds: Atom feeds for the blog, TIL, notes and newsletter, plus /feed.xml for everything, each opening as a designed page in a browser
- Notes has its own posts with pages and a feed. The newsletter page shows issues on the site itself
- /respub: current research, the papers behind it, open materials and one-click BibTeX and APA citations
- /consumed: Start here picks, collections, a yearly summary, book covers, page previews and what each item led to
- A search button in the header opens the command menu on every page and device
- The /lab terminal asks your name and mirrors a real setup with a tmux status bar, a Neovim view and Git aliases

### Changed

- One filter panel and pager on every list, with filters kept in the address so a view can be shared
- Code blocks in VS Code colours, callouts with icons and one quiet style for tags and labels
- The header shows Notes and Newsletter, More opens All pages and narrower screens use the menu
- /about, /experience, /uses, /colophon, /now and /friends brought up to date
- The site scales up slightly on large monitors and every animation follows reduced motion

### Fixed

- No sideways scrolling on phones, a phone menu that closes with Escape and larger tap targets everywhere
- Code blocks and the lab terminal use the monospace font again

## [2.69.0] - 2026-10-07

_Community and a new look_

### Added

- A system theme option alongside light and dark, so the site can follow the device setting
- /guestbook: sign the guestbook. Messages appear once they have been approved
- /friends: the personal sites of people I know online, part of the slashfriends project
- /book: book a 30 minute video call in a time that suits you, with a Google Meet link sent straight away
- /copyright and /disclaimer: what is mine, the code licence, trade marks and every third-party font, icon set, map and chart library
- /accessibility: an accessibility statement covering what the site does, its known limits and how to report a problem, plus a skip link to the main content on every page

### Changed

- A tidier header: the main pages stay in the bar and More opens a dropdown of everything else, with the same list in the mobile menu
- A redesigned footer with social links, the newsletter sign-up, grouped links and a back to top link. On phones it stacks in reading order
- All Pages is reorganised so every public page sits in a sensible group, with Guestbook, Friends and Hall of Fame under Community
- /privacy covers the guestbook: what is stored, approval before anything is public and how to have an entry removed
- The ia mark and favicon stay readable on any background
- Under the hood: newer React, error reporting and editor libraries

### Fixed

- /book: the booking calendar follows the site theme instead of always showing dark

## [2.68.0] - 2026-09-26

_Public stats and source_

### Added

- /stats: the hub opens on category tabs for Overview, Coding, Music, Gaming, Applications and Writing and projects, with every area's charts on the same page
- /stats: an At a glance section with headline numbers plus a How it all compares block that sets coding, gaming, listening and GitHub side by side week by week. Each area has a designed card with its own small live picture such as a coding trend, a listening equaliser or a contribution grid
- /stats/writing: a new page covering posts, TILs, tags, reading time, projects, technologies and what I read and watch
- /stats/coding, /stats/music, /stats/gaming and /stats/applications: more charts including radars, treemaps, heatmaps, monthly trends and a country map for applications, drawn from one hourly cached read that holds counts only
- /stats/gaming: a play history block with hours, most played and weekly hours under the live status
- Now playing: the card updates almost at once when the track changes
- The public source code is now on GitHub as isaacadjei.me, published from the site's own source with its own changelog and releases

### Changed

- Every stats page opens on the last 30 days
- Posts and TIL entries dated today now go live at midnight UTC, so an entry no longer shows in a list while its page says not found
- Chart labels no longer overlap: pie and donut legends sit under the chart with the percentages inside the ring and bar chart names are shortened and slanted when there are many
- The site does less work on each visit: the GitHub stats and top tracks data are cached at the edge. The blog feed and share images are cached too. The research page is built ahead and the newsletter issue list is cached for 10 minutes
- /about and /experience refresh daily so a role that starts on a set date appears on its own
- /colophon, /changelog and one blog post link to the new public source repository
- Under the hood: React 19, Tailwind 4, TypeScript 6 and newer chart and icon libraries

### Fixed

- /stats/applications: the maps open in the mode you are viewing the site in. The country map has a dark version with a brighter shading scale
- /stats/applications: the map renders again in every style. Its supporting file had gone out of step with the map library after an upgrade so only the satellite view worked
- The latest push card only shows public repositories

## [2.67.0] - 2026-09-24

### Added

- /notes: a new research note on the routes to restoring sight in a missing eye, covering prosthetic eyes, retinal and cortical implants and whole-eye transplant, with linked sources

### Changed

- /stats/coding: the editor breakdown now names only real editors, with any other client time counted under VS Code
- /til: the Ghanaian day names entry is rewritten with corrected details and linked sources, with Ga day names, birth order names, twin names and the outdooring added
- /privacy and /security-policy: updated to cover every analytics tool, the map and embed providers and the services now in use

## [2.65.2] - 2026-09-10

### Security

- Updated a few dependencies to close known vulnerabilities in packages the site relies on

## [2.65.1] - 2026-09-08

### Fixed

- /stats/applications: the top-cities chart only showed some of its labels, so they are hidden now that the colour legend beneath already names every bar. Applications tagged Remote have no city to plot, so they now appear as their own Remote entry instead of quietly disappearing

## [2.65.0] - 2026-09-07

_Public stats_

### Added

- A new /stats section: a hub page linking into GitHub, coding, music, applications and gaming stats, each on its own page. GitHub, coding and gaming stats moved here from /lab, which now just has the terminal and PCB viewer
- /stats/github: a year-by-year contributions bar chart alongside the usual calendar, plus a period-filterable daily activity chart with a bar per day and a running total line
- /stats/music: real listening history, with a calendar of daily play counts, a radial clock of listening by hour of day, a genre treemap, a release-decade bar chart and a word cloud of top artists, most of them filterable by period
- /stats/applications: a map of where my job search has reached, one pin per city sized by count, with an always-on total and a top-10-cities bar chart alongside it. It is count-only, with no company, role or date behind any pin
- /stats is linked from the footer, /all-pages and the command menu
- /projects/audio-amplifier: a real Bode plot built from hand-logged breadboard and PCB readings, drawn alongside a theoretical curve calculated from the reported component values

### Fixed

- /stats/applications: the headline overstated its total as applications sent, when most tracked locations are listings I found and logged rather than places I applied to. The headline, popups and chart now say opportunities tracked instead
- The applications map gained a style picker, globe and 3D toggles and clickable clustering. Its globe view now fills the box with a real sky behind it and the map follows the site's light and dark toggle
- Pin labels and the top-cities chart now show a real city and country instead of the raw location text
- The map's background files had drifted behind the main bundle after updates, so they are now kept in step with it

### Security

- Patched a dependency vulnerability in a shared transitive package

## [2.60.0] - 2026-08-10

### Changed

- /about: the Societies & Memberships section now shows month-level dates and a society can list more than one role over time. ESOC shows both my Member & Student Representative role and my incoming Treasurer role, which stays hidden until its September 2026 start date. Aston Computer Science Society and Aston Gaming Society joined the list too

### Security

- Tightened how the contact and newsletter forms and a few other public routes handle input

## [2.59.2] - 2026-08-04

### Security

- Patched another batch of dependency vulnerabilities, all in packages pulled in indirectly by the tools the site is built with

## [2.59.1] - 2026-08-03

### Fixed

- /stats and /lab: the GitHub contributions calendar had quietly lost its horizontal scroll on mobile, squashing a whole year of cells to fit the screen. It scrolls again at a proper tappable size and opens already scrolled to today

## [2.59.0] - 2026-07-25

### Added

- Calendar and grid heatmaps now have a Less to More legend, so the colour scale is explained on every one of them

## [2.58.1] - 2026-07-24

### Fixed

- /lab: the GitHub contributions calendar had started showing the current calendar year instead of a real rolling 365 days, because placeholder rows for future days were being stored. It now shows a true rolling year again
- /lab: a small label now marks the isometric calendar so it is clear which view is which

## [2.58.0] - 2026-07-23

### Added

- /lab: the GitHub contributions calendar has a second, circuit-board-styled isometric view under the flat one. Each day is an extruded block and the busiest days light up like an LED. It supports drag to rotate, scroll to zoom and a flat top-down view. Its board follows light and dark mode

### Changed

- /lab: the GitHub contributions calendar now shows a genuine year of history from a daily-synced record instead of GitHub's rolling 52-week graph. It shares one heatmap style with the coding and Strava calendars

### Fixed

- Heatmap and calendar colours could silently fall back to solid black and switching light or dark mode left charts a step behind until a reload. Both are fixed
- Heatmap cells rendered as one flat colour and the day-of-week axis ran upside down. Colours now reflect how active a cell was relative to the rest of the grid and the week reads top to bottom
- Some heatmap cells showed as solid blocks and the empty-cell colour blended into the card in dark mode. Both now read clearly in either theme, with Strava's calendar keeping its orange tint

### Security

- Patched several framework and image-library vulnerabilities flagged by dependency scanning

## [2.57.0] - 2026-07-22

### Added

- /respub: each publication now has its own page with the full abstract, keywords and a citation section with an APA-style reference and a copyable BibTeX block. The listing page is a lighter teaser that links into it
- /links: EWskills joined the Competitive section alongside LeetCode, Codeforces and AtCoder
- /consumed: every item and every music artist page now has prev/next navigation. Books and podcasts got proper cards with working links to their own pages and the category tabs stay visible when switching category

### Changed

- /security-policy and /code-of-conduct now show a Last updated date, same as /privacy and /notes

### Fixed

- /tags and /sitemap.xml now cover notes, publications, resources and music artist genres alongside every other tagged content type, so nothing with its own page goes missing from search engines
- /all-pages now matches the header navigation, with the old flat list split into clearer groups
- /consumed: every item sorts by its real year and month instead of a fixed 2026 and shows the year it actually happened. Tags across the section now link into /tags properly
- Dropped the Ongoing badge from Phaemos and avr-zac on /projects, now that their date range already carries that meaning
- Trimmed the newsletter page's closing explore-the-rest-of-the-site block down to Blog and TIL, since the rest was already one click away

### Security

- Patched a denial-of-service issue in a shared transitive package that was flagged as three separate alerts

## [2.56.0] - 2026-07-21

### Added

- Notes pages and every consumed item now have a share button too, matching blog posts, TIL entries and projects
- /consumed/resources: six new entries, Tech Interview Handbook, GIPHY Developers, Sprite Sheet Generator, NotebookLM, The Missing Semester and Codedex

### Changed

- The World Cup 2026 AI Predictor note is rewritten as the Multi-Sport AI Predictor. The tournament happened without it (Spain won), so it now covers what actually happened and the plan to generalise the same model into an open-ended platform for football, basketball, tennis, cricket, motorsport, rugby, athletics and volleyball. The old URL redirects to the new one
- Blog posts and project pages now name their section in the browser tab, matching TIL: Blog | the post title and Project | the project name. Notes and Consumed detail pages picked up the same convention
- The footer's secondary links are reordered to Now, Lab, Notes, Consumed, Research, Tags and Search
- The Spotify now-playing widget updates faster on /now, the homepage and /consumed/music

### Fixed

- A sweep of every blog post, TIL entry and consumed-page link caught a dozen that had gone dead. Each now points at the correct current source or an equivalent replacement
- The Sky Celebration Day post and TIL are live again, reworded to reflect that a red weather warning moved the day to fully virtual on the day itself
- /lab: the genre chart could show a stray non-genre tag for an artist with little Last.fm data. Junk tags are now filtered more reliably
- The homepage's Today I Learned preview could show older entries ahead of a genuinely new one. It now always shows the 3 most recent

## [2.52.0] - 2026-07-17

### Fixed

- Fixed a group of chart layout bugs on /lab. Bar charts beside a pie no longer sit off to the left, first category labels are back and the coding language, editor and project bars now carry a colour legend
- /lab: the Spotify genre chart folds together genres that differ only by capitalisation or a trailing s, so afrobeats and afrobeat read as one slice

## [2.50.0] - 2026-07-12

### Security

- Tightened rate limiting and input validation on a few public endpoints and updated the site's content security policy

## [2.48.0] - 2026-07-10

_New identity_

### Added

- A signature 'ia' mark now heads every page - it signs itself when you arrive, types the name letter by letter on your first visit of a session and re-signs as you move around; the dot on the i blinks as a little status light
- 404: a small constellation of the initials draws itself above the terminal
- /lab: the loading screen powers up as a copper circuit-board trace and a braille divider spelling the initials sits under the terminal
- Loading screens across blog, projects, search and the other sections pulse a small 'ia' mark instead of a grey bar
- A brand kit with the logo as SVG plus ready-to-use images
- /contribute: a contributing guide covering software, hardware, images and design, writing and courses and this site, with sections on ways to help, pull requests, patience and getting in touch, each cross-linked to its GitHub repo
- /code-of-conduct: a short personal intro followed by the Contributor Covenant 2.1 in full
- /support: where to get help - discussions, an issue, my support email and my contact page

### Changed

- New favicon and app icon: an 'ia' tile that follows your device's light or dark mode, with two blue dots gently alternating in the browser tab where supported
- TIL moved into the main navigation after Blog; the duplicate Blog and TIL links left the footer
- Link previews: the share card's logo tile now uses the site's own colours instead of the old purple gradient
- /security-policy: added a cross-link to its GitHub repo and a pointer to my projects

## [2.46.0] - 2026-07-06

### Added

- /links: my Gitea profile joined the code forges list

## [2.45.0] - 2026-07-05

### Changed

- /lab: the Spotify genre split and listening-era charts were rebuilt on the same chart set as the rest of the lab, so they render crisper and match the coding charts

## [2.44.0] - 2026-07-04

### Changed

- Live status on the homepage, /now and /lab: retuned the polling so the shared edge cache does its job. Cards stay live and fast however many people are watching, with track changes still showing within seconds

### Fixed

- The sitemap no longer lists /privacy, which is deliberately hidden from search engines, so Google stops getting conflicting signals

## [2.43.1] - 2026-07-02

### Fixed

- /links: the GitHub, GitLab, Codeberg, Stack Overflow and Hackster links pointed at misspelt handles - all corrected
- /lab: the projects donut no longer drifts out of line with the languages donut when project names run long

## [2.43.0] - 2026-06-24

### Fixed

- Blog and project link preview images now generate reliably

## [2.40.0] - 2026-06-24

### Added

- A Status link to the public status page in the footer, /all-pages and the command menu, plus a note in the privacy policy about the cookieless visitor analytics the site uses

## [2.37.0] - 2026-06-23

### Changed

- The maintenance page keeps a single light and dark toggle but otherwise renders bare, without the site header or footer. It follows your device theme by default

## [2.36.0] - 2026-06-23

### Added

- A maintenance page at /maintenance that visitors see whenever I switch maintenance mode on

## [2.27.0] - 2026-06-22

### Fixed

- /lab: the In the code stats and top-content widgets showed zeros after a database change and read correctly again

## [2.21.0] - 2026-06-22

### Added

- /now: the MacBook and Lenovo cards now show a proper battery gauge that fills to the real level and shifts from blue to amber to red as it drains, with a bolt while charging
- /now: the Gaming PC card was rebuilt to match the PS5 one - CPU and GPU now show as small live graphs, the game I am playing shows underneath while I play and the last game I played shows once the PC is off

### Fixed

- /now, homepage and /lab: the device cards no longer get stuck on an old 'last seen' time while a device is actually online - they stay live now and the clock follows my exact timezone from GPS when I travel

## [2.19.0] - 2026-06-21

### Changed

- /lab: the coding heatmap dropped its small duplicate hourly bar strip - the 'by hour of day' chart beside it already shows that, more clearly

### Fixed

- Live status: the Spotify and GitHub cards no longer go blank together during a brief cache hiccup - each now falls back to its own live source independently

## [2.15.0] - 2026-06-21

### Changed

- /now: Spotify visualiser rebuilt - it extracts the dominant colours from the current album art and renders a sine wave above a bouncy equaliser, both tinted from the cover; bar peaks darken as they rise like a real meter and the wave swings wider and darkens in step with the bar beneath each point; drawn on a device-pixel-ratio canvas so it stays crisp and identically proportioned on every screen, animated on delta-time and tuned for light and dark mode; it no longer pretends to react to audio (Spotify retired the audio analysis API) so the motion is honest album-colour ambience
- /now: Spotify song changes now appear in near-realtime and the live status stream pauses while the browser tab is hidden so a backgrounded page no longer polls
- /lab: Spotify Top Picks genres are back, sourced from Last.fm (Spotify retired its artist genre data) - the genres tab shows a rank-weighted donut and breakdown with duplicate tags merged and each top artist lists its genre tags again
- /lab: Spotify Top Picks artists tab gains an underground-to-mainstream spectrum of my top artists by audience size and the tracks tab a listening-era chart from my all-time tracks by release decade

## [2.11.0] - 2026-06-20

### Changed

- /now: Spotify widget now detects song changes within 5 seconds - a dedicated fast SSE channel polls only Spotify every 5s, keeping the main status stream at its 60s cadence
- /lab: Spotify visualiser bars are now slightly taller with a stronger gradient (30% opacity at the base rising to fully opaque at the peak); bars can no longer touch the sine wave - a hard cap keeps 3px of clearance at all times; peak cap dots now use the foreground colour so they are visible in both light and dark mode
- /lab: Top Picks - track list and artist list are now shown first with bar charts below (was the other way around); track bars now show real track duration (longest track = 100%) rather than rank position; artist bars now show real follower counts (most followed = 100%); each bar chart has a description label explaining the metric; genre breakdown now fetches genres from a dedicated batch artist call so genres are populated for mainstream artists

## [2.10.0] - 2026-06-19

### Added

- /lab: 20+ new terminal commands including stats, streak, today, languages, vscode, os (live WakaTime data), posts (most-read blog and TIL), grade, uptime, now, mottos, hire, cv, decrypt, matrix, make
- /lab: theatrical command animations - hack, coffee, decrypt, matrix, make, sudo and zac now play out line by line with real delays
- /lab: clickable link line type in the terminal - URLs render as primary-coloured anchor tags
- /lab: Spotify visualiser - 52-column horizontal equaliser with a gradient darkening from light violet at the base to dark indigo at the peak (taller bar = darker colour); album art spins like a vinyl record when playing and its colours bleed through the bar shapes via SVG clipPath; bright indigo sine wave below the bars brightens with track energy; blurred album art as card background
- /lab: PCB viewer full redesign - full-width interactive 3D model (real geometry from the original 3DS file converted to GLB, loaded via react-three-fiber + drei); angle presets (front, back, top, bottom, left, right); wireframe toggle, auto-rotate toggle and grid helper; below the 3D model: copper layer drag-to-orbit panels, real board front/back flip card (photos of the actual built board), assembled board photo and full circuit schematic - the photo and schematic cards open in a fullscreen lightbox on click
- /about: approach code animation now ends with a highlighted primary-blue motto line - nohup hustle && disown impostor_syndrome
- /consumed/music/[slug] - individual artist pages for each featured artist; cards on /consumed/music now link through to the detail page with YouTube embed, genre tag and personal notes
- /notes/codeforces-auto-push - research note on auto-pushing competitive programming solutions to GitHub; maps what already exists (CFPusher for Codeforces, LeetHub 3.0 and LeetSync for LeetCode, AtCommitter for AtCoder, UpCode for bulk upload) and where the gaps are (no tool for TryHackMe, no unified extension); plans a single Manifest V3 extension covering Codeforces, AtCoder and TryHackMe with one GitHub PAT and one organised repo

## [2.9.0] - 2026-06-18

### Added

- /respub - academic profile page: research interests, external links (ORCID, Google Scholar, ResearchGate, Academia.edu) and publications list
- /til - Today I Learned: 63 entries across 21 categories; search, category filter and pagination (10 per page); reading time per entry; RSS feed at /til/feed.xml
- /til/[slug] - individual TIL entry pages with ShareButton, optional ToC sidebar and prev/next navigation
- /tags - tag cloud aggregating blog, TIL, projects, publications and consumed content; client-side search
- /tags/[tag] - content filtered by a single tag across all content types in grouped sections
- /search - unified full-text search across blog, TIL, projects, publications, notes, newsletter and consumed; results ranked by relevance score
- /consumed/[category]/[slug] - 216 individual consumed item pages with embedded players (YouTube for videos, Spotify for podcasts) and breadcrumb navigation
- /newsletter/feed.xml - newsletter RSS feed with styled browser view and ?raw for raw XML
- /blog/feed.xml - blog RSS feed at its canonical URL; old /feed.xml permanently redirects here
- FeaturedTIL section on homepage: 3 most recent TIL entries between Featured Blog Posts and Newsletter; each card links to /til/[slug]
- Root-level error boundary (app/error.tsx): calm card with Try again and Go home buttons; distinct from the terminal-style 404
- Custom 404 page: interactive terminal with boot animation, clickable shortcut links and a live command input
- Giscus comment system on all blog posts: GitHub Discussions-powered; dark/light theme matches site
- Blog reactions: 8 standard emoji plus an extended picker (28 additional via SmilePlus); counts shown inline; stored per-post per-user
- Blog cover images on all 20 published posts; RSS feeds include thumbnails for feed reader preview
- Tags and Search added to CommandMenu (Cmd+K) and footer secondary nav row
- Secondary footer nav row: Now, Notes, Lab, Uses, Colophon, Changelog
- Notes page TIL callout card linking to /til
- Lab terminal new commands: til, respub, rss, blogfeed, tilfeed, newsletterfeed, playing (async), lastgame (async), pushed (async)
- Newsletter While you wait section: TIL and Research and publications cross-links added
- Links page restructured from 4 to 10 sections (Professional, Writing, Academic, Code, Competitive Programming, Hackathons, Social, Content, Support, Other); 12 new platforms added including HackerRank, CodeChef, Stack Overflow, TryHackMe and ResearchGate; quick social icon row under bio
- Projects pagination: 9 per page with prev/next navigation; AI/ML added as a project category
- dotfiles project added to /projects: full detail page with overview, 8 highlights, tech stack and 2-image gallery; covers 59 topic files, cross-platform aliases, 3-platform git mirroring and Starship integration
- /uses Terminal and shell section: dotfiles entry and Starship entry with shared config explanation
- Skills page Core Tools: Starship added
- Project detail page: inline code rendering via backtick syntax so command names render as styled code elements
- New blog post: How to Contribute to Open Source: A Practical Guide; published 2026-06-13
- Blog renderer: Spotify episode embeds and inline [text](url) link rendering in paragraph and list blocks
- All 34 blog posts enriched with references sections (6-13 items each) and inline links for tools and projects mentioned

### Changed

- Blog RSS canonical URL moved from /feed.xml to /blog/feed.xml; old URL redirects (301) with query-param forwarding
- Projects: phaemos recategorised to IoT; cad-portfolio and git-unlocked recategorised to Academic; filter bar gains IoT and Academic buttons
- Blog inline links now styled in blue across blog, colophon, consumed, now and uses pages
- ps5:last-game Redis key: only written when a game is actively running so sitting at the home screen no longer overwrites the last played title
- All hover scale and translate CSS transforms scoped to sm: breakpoint to prevent GPU compositing layer exhaustion on iOS Safari
- Social icons on hero and contact page standardised to react-icons/fa6 for GitHub and LinkedIn
- Consumed overview: Year and Month filter labels added; Category label above tabs; all category subpages gain Year filter
- Newsletter issues API now filters out scheduled posts with a future publish date before returning the response
- Removed: BuyMeACoffee from hero and contact social link rows (remains in /links Support section and blog AuthorCard)

### Fixed

- Mobile Safari and Chrome renderer crash (A problem repeatedly occurred) on / and /projects: a single oversized project thumbnail was decoding to over 500MB in browser memory; hover transforms also scoped to sm: and the header's blur-sm effect scoped to desktop so no GPU layers are created on touch devices
- PS5 last played game now persists correctly when offline
- PS5 status no longer shows a stale last seen time while actively online
- Giscus comment iframe blocked by CSP: giscus.app added to frame-src allowlist
- RSS ?raw query param now serves Content-Type: application/xml for Chrome native XML viewer
- Newsletter page showing scheduled issues before their publish date
- First project card on /projects and first post cover on /blog now load eagerly instead of lazily, fixing a slower Largest Contentful Paint for the above-the-fold image on each page
- /lab under-construction GIF reduced from 1.6MB to 833KB via recompression with no visible quality loss; also now loads eagerly to fix a Largest Contentful Paint warning
- /lab terminal maximise button left a 31px gap below the header instead of sitting flush against it

## [2.8.0] - 2026-05-30

### Added

- Mobile banner: slim dismissible notice below the header on screens narrower than 768px suggesting the site is best viewed on a laptop or desktop; hidden via md:hidden so it never appears on wider screens
- git-unlocked project gallery expanded with 4 new images: 3D GitHub logo badge (card preview), Octocat with GitHub profile on laptop, Octocat and Groot figurines and close-up Octocat; card preview image updated from banner SVG to the 3D logo badge
- /now page intro now links to nownownow.com/p/n4lZ alongside the existing Derek Sivers credit so visitors can find the listed profile
- Colophon expanded: shadcn/ui and next-themes as separate entries; backend section adds Vercel, Resend, Beehiiv, GitHub Actions and Cloudflare Turnstile; design section adds GA4, share feature and responsive design note; new Notable pages and features section covers /lab, /blog renderer, /consumed, /changelog and OG image generation; all live status entries expanded with more detail; Vercel and Cloudflare links added to header meta
- /now page content refreshed: updated Where I am (London for summer), Studying (FPGA/VHDL, competitive programming on Neetcode/Leetcode/Codeforces, hackathons), Building (accurate Phaemos hardware detail, World Cup 2026 AI Predictor added, This site blurb updated), Thinking about (internship search, events, Sky campus mention), Outside of work (running and hiking added)

### Fixed

- Header theme toggle and hamburger menu now pin correctly to the far right on small screens; replaced the three-column grid with flex justify-between on mobile so the controls are never left drifting toward the centre when the desktop navigation is hidden
- Mobile banner text changed from text-muted-foreground to text-foreground so it reads clearly as black on light and white on dark
- /now page header now shows Updated live only - removed Last updated May 2026 which was misleading alongside a live indicator
- /notes and /privacy pages updated from May 2026 to June 2026

## [2.7.0] - 2026-05-29

### Added

- Notes page teaser strip: slim animated live status preview on /notes linking to /now; full widget removed from notes
- Now and Lab added to main navigation; navigation centred in header using three-zone grid layout
- Contact page now shows email address below the contact form
- Footer social row reordered and simplified: All Pages, Contact, Newsletter, LinkedIn, GitHub, ORCID
- Footer newsletter signup form removed; newsletter signup remains on /blog and /newsletter
- Spotify card shows Spotify icon and external link to profile in card header
- FiveM added to GPC game detection
- PS5 card renders IGDB cover art when online; shows text-only last played game name when offline

### Changed

- Spotify icon colour changed from Spotify green to blue to match site colour theme
- Home removed from navigation; avatar links to homepage
- /uses and /now references to 'notes page' corrected to 'now page'

### Fixed

- feed.xml?raw no longer crashes with Cloudflare CPU timeout; returns raw XML directly instead of running regex transforms
- PS5 lastGame and lastGameImage now read from lastKnown instead of the live source so the last played game persists when offline

### Security

- Force brace-expansion to 5.0.6 via npm overrides to resolve CVE-2026-45149 (GHSA-jxxr-4gwj-5jf2)

## [2.4.0] - 2026-05-27

### Added

- Share button on project detail pages, blog posts, /cv and /links - Web Share API with clipboard fallback and 2-second 'Copied!' confirmation
- Open Graph thumbnails on every public page via /api/og - dynamic per-page title and description

### Changed

- Em and en dashes removed throughout the site; replaced with hyphens
- Oxford commas removed throughout

## [2.3.0] - 2026-05-20

### Added

- /consumed page: 49 YouTube videos, 12 Spotify podcasts and 10 books logged for 2026; content sorted oldest to newest across January to May; All tab groups by month; click-to-play video facade; music section links to the Notes page Spotify widget
- /now page: snapshot of what I am doing right now covering location, studying, building, reading, thinking about, outside of work and listening; inspired by nownownow.com
- /uses page: all the hardware, software and tools I use day to day
- /colophon page: how the site is built, the full stack and the decisions behind it
- /changelog page: this page, full version history from the first commit
- Dark/light mode crossfade: 150ms ease transition on theme toggle instead of instant swap
- Next and previous post navigation at the bottom of every blog post
- Blog reactions: thumbs up, flame, lightbulb and heart per post stored in Redis; one click, no comments
- Post series grouping: series and seriesPart fields on BlogPost; SeriesBanner component on post pages; series indicator on post cards
- Hall of Fame reframe: personal acknowledgements (God, mum, dad) lead the page before security researchers
- Command menu searches projects and includes all hidden pages in a More group
- Spotify device name shown in the card label when actively playing
- Spotify podcast and episode support: episode title, show name and episode artwork shown the same as tracks
- Spotify last played: when nothing is active the card shows the previous track or episode in a greyed-out grayscale state
- Real-time Spotify progress bar: ticks forward every second client-side and snaps to the true position on each API poll
- RSS feed 'View raw XML' button: opens a syntax-highlighted dark HTML view of the raw feed with colour-coded tags, attributes, CDATA and processing instructions
- Scrolling marquee on long Spotify track titles: title scrolls continuously when it overflows the card width, looping seamlessly; short titles stay static

### Changed

- /consumed description updated to 'so far this year' to reflect ongoing additions
- Gaming PC card restructured: offline state shows only last-seen; GPU, CPU and game fields are live-only
- Live status layout: time card moved to the left column and MacBook card to the right in the two-column row
- Spotify polling interval reduced from 30s to 10s so track changes appear faster
- GitHub icon replaced with GitBranch from lucide-react in the last-pushed card

### Fixed

- YouTube and Spotify embeds blocked by CSP: added www.youtube.com and open.spotify.com to frame-src
- Gaming PC card CPU and GPU combined onto one line to prevent the card expanding taller than others
- Separator and icon visibility improved in both light and dark mode
- Sitemap missing 7 pages: /now, /consumed, /uses, /changelog, /colophon, /all-pages and /privacy were live but not indexed by Google
- RSS feed unstyled in Chrome: Chrome 131 dropped XSLT support; the feed now serves a styled dark HTML page to browsers and raw XML to feed readers
- Spotify podcasts not showing in widget: the player API call was missing ?additional_types=track,episode so Spotify silently returned nothing for episodes

## [2.2.0] - 2026-05-18

### Added

- Dynamic OG images per blog post and project page via Next.js ImageResponse
- Article JSON-LD structured data on all published blog posts
- Beehiiv past newsletter issues on the newsletter page, cached in Redis
- Related posts section at the bottom of each blog post (up to 3 shared-tag matches)
- GitHub contribution heatmap, commits, PRs, issues and last pushed on the Lab page
- Blog post search in the command menu
- RSS feed XSL stylesheet so the feed renders as a styled page in browsers

### Changed

- All ten project long descriptions expanded with design rationale and build process
- Homepage hero completely rewritten with a two-paragraph structure and nav links
- Lab terminal auto-focuses input after boot so you can type immediately
- Sitemap lastModified dates changed from new Date() to real last-changed dates

### Fixed

- OG/Twitter image generation routes marked noindex so Google ignores them
- Privacy page removed from sitemap to resolve conflicting noindex signals

## [2.1.0] - 2026-05-15

### Added

- Live status widget: Spotify now playing with album art and progress bar, London time, MacBook battery and charging state, GitHub last push
- Reading progress bar at the top of every blog post
- Copy button on all code blocks
- Sticky table of contents sidebar on blog posts with 3+ headings
- Custom 404 page: terminal-style animated boot sequence with error line
- /notes/world-cup-ai-predictor and /notes/prosthetics-health-tech detail pages
- AstonCV blog post

### Changed

- Live status cards moved from homepage to /notes and /lab
- Spotify polling interval reduced from 30s to 10s
- Newsletter page fully rewritten with topic cards and past issues link

### Fixed

- All em dashes and en dashes removed sitewide
- Oxford commas removed from all content

## [2.0.0] - 2026-05-14

### Added

- Full blog system with 11 published posts across 7 content types
- Blog-to-project cross-linking via projectSlug field
- Newsletter system via Beehiiv API with subscription form
- /notes page: public notebook with current builds and plans
- /lab page: interactive terminal with 30+ commands
- /security-policy and /hall-of-fame pages
- Command menu keyboard shortcuts (Mod+H/A/P/E/S/B/N/J/C/L)

### Changed

- Blog page redesigned with type filter tabs and date-sorted post grid
- Lab page: terminal moved here with upgraded colour scheme
- About page intro expanded with retinoblastoma, father, Adisadel leadership and more

### Fixed

- Blog post 404s: params now awaited as Promise in Next.js dynamic routes
- Lab terminal crash on boot fixed

### Security

- /security-policy published with responsible disclosure contact and response timeline

## [1.1.0] - 2026-05-11

### Added

- avr-zac project: ATmega644P bare metal C with nine-mode state machine
- Phaemos smart maintenance platform added to featured projects
- ORCID profile link in footer and /links
- Cybersecurity project category
- Platforms & Operating Systems skills category
- public/.well-known/security.txt
- Per-page canonical tags on all routes

### Fixed

- GitHub username corrected from zaccesss to zaccesss throughout

## [1.0.1] - 2026-05-06

### Fixed

- ERR_TOO_MANY_REDIRECTS in production caused by conflicting host redirect rules
- Canonical host handling consolidated between app and edge layers
- ThemeProvider typing compatibility restored for next-themes

## [1.0.0] - 2026-04-28

_Initial launch_

### Added

- Full portfolio site launched on isaacadjei.me
- Pages: Home, About, Projects, Experience, Skills, Blog, Contact, CV, Links
- Project detail pages with image gallery for 7 projects
- CV viewer and downloadable PDF route
- Contact form with honeypot, rate limiting and input sanitisation
- Command palette (Cmd/Ctrl+I) for quick navigation
- Dark/light mode toggle
- Scroll progress indicator and back-to-top button
- Open Graph and Twitter card metadata
- Cloudflare Turnstile on contact form
- Content Security Policy headers
- Upstash Redis rate limiting
- Gitleaks secret scanning in CI
- Dependabot auto-updates with auto-merge
