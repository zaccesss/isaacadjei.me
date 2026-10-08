import type { Project } from "../index"

const _vitafolio: Project = {
    id: "vitafolio",
    title: "Vitafolio: Every Version of Your CV",
    description:
      "A free Laravel web app for building, storing and sharing every version of a CV, each with its own theme, privacy setting and link, with LaTeX compiled in the browser, a CV checker and a student jobs tracker.",
    longDescription:
      "Vitafolio gives each person a profile and up to ten named CVs: one for software roles, one for research, one for a part-time job. Each CV has its own address, theme, accent colour, font, section order and visibility (public, unlisted or private). A CV can be written in the editor, uploaded as a PDF or Word file or written in LaTeX and compiled in the browser.\n\nIt grew out of AstonCV, a plain PHP CV database I built as coursework. That site proved the idea but ran on a university server that has since been retired, so I rebuilt it from scratch as a real product: Laravel 13 on PHP 8.4, served by FrankenPHP in a Docker container on Render, with TiDB Cloud as the MySQL-compatible database, Cloudinary for files and Resend for email.\n\nOn top of the CVs it has a Check a CV page that scores a CV out of 100 the way an applicant tracking system reads it, a Jobs page of student roles gathered every night, a private applications tracker, support tickets, endorsements, seven interface languages and tagged PDF/UA-1 exports that screen readers can follow.",
    technologies: [
      "Laravel",
      "PHP 8.4",
      "MySQL",
      "TiDB Cloud",
      "FrankenPHP",
      "Docker",
      "Render",
      "Vue",
      "Alpine.js",
      "Tailwind CSS",
      "Vite",
      "LaTeX",
      "WebAssembly",
      "Typst",
      "Cloudinary",
      "Resend",
      "Cloudflare",
      "Sentry",
      "GitHub Actions",
    ],
    category: "web",
    featured: false,
    images: [
      "/images/projects/vitafolio/editor-light.webp",
      "/images/projects/vitafolio/public-cv-light.webp",
      "/images/projects/vitafolio/dashboard-dark.webp",
      "/images/projects/vitafolio/latex-compiled-light.webp",
      "/images/projects/vitafolio/look-and-privacy-light.webp",
      "/images/projects/vitafolio/check-light.webp",
      "/images/projects/vitafolio/jobs-light.webp",
      "/images/projects/vitafolio/applications-light.webp",
      "/images/projects/vitafolio/directory-light.webp",
      "/images/projects/vitafolio/signup-light.webp",
      "/images/projects/vitafolio/connected-light.webp",
      "/images/projects/vitafolio/support-light.webp",
      "/images/projects/vitafolio/editor-dark.webp",
      "/images/projects/vitafolio/public-cv-dark.webp",
      "/images/projects/vitafolio/check-dark.webp",
      "/images/projects/vitafolio/jobs-dark.webp",
    ],
    github: "https://github.com/zaccesss/vitafolio",
    website: "https://vitafolio.isaacadjei.me",
    getInvolved: { discussions: true, roadmap: "https://github.com/users/zaccesss/projects/114" },
    date: "2026",
    highlights: [
      "Up to ten named CVs per account, each with its own address, theme, font, section order and public, unlisted or private visibility",
      "LaTeX compiled entirely in the browser with TeX Live built for WebAssembly, so no server needs a 4 GB TeX install and the source stays private until saved",
      "Generated CV and cover letter PDFs are tagged PDF/UA-1 files from Typst, with headings, bookmarks, a declared language and alt text",
      "Check a CV scores any CV out of 100 the way an applicant tracking system reads it and compares it with a pasted job advert",
      "Nightly jobs feed of internships, placement years, spring weeks, graduate roles and apprenticeships, plus a private applications tracker",
      "Interface in seven languages with right-to-left layouts for Arabic and Urdu, WCAG 2.2 AA colours in both themes and full keyboard use",
    ],
    cover: "/images/projects/vitafolio/cover-home.webp",
    coverDark: "/images/projects/vitafolio/cover-home-dark.webp",
    order: 3,
    status: "live",
    links: [
      { label: "Documentation", url: "https://vitafolio.isaacadjei.me/docs" },
      { label: "Changelog", url: "https://vitafolio.isaacadjei.me/changelog" },
      { label: "AstonCV, the project it grew out of", url: "https://github.com/zaccesss/astoncv" },
    ],
    sections: [
      { type: "h2", text: "Why I built it" },
      {
        type: "p",
        text: "Applying for placements means keeping several CVs at once. A hardware role wants the PCB work first, a software role wants the projects and a part-time job wants something shorter. I kept losing track of which file was the latest and which link I had sent to whom. AstonCV, my coursework CV database, handled one CV per person on a server I did not control. When that server was retired I took the idea and rebuilt it properly, around the problem I actually had: many versions of one record, each shared on its own terms.",
      },
      {
        type: "p",
        text: "The name joins two Latin words: vita as in curriculum vitae and folium, the leaf of paper behind portfolio. Together they mean the pages of a life.",
      },
      { type: "h2", text: "See it in action" },
      {
        type: "p",
        text: "Every clip below was recorded from a throwaway local copy filled with made-up people, using a recording kit kept in the repository so the clips can be redone after any interface change.",
      },
      {
        type: "clip",
        src: "/videos/projects/vitafolio/signup.mp4",
        poster: "/videos/projects/vitafolio/signup.webp",
        alt: "The sign-up form is filled in with the Google, GitHub and Microsoft buttons shown, the email address is confirmed and the dashboard opens with a first CV ready",
        caption: "Creating an account with an email address or a sign-in provider",
      },
      {
        type: "clip",
        src: "/videos/projects/vitafolio/build.mp4",
        poster: "/videos/projects/vitafolio/build.webp",
        alt: "A new CV called Embedded software roles is created, then its headline, profile, skills, experience and education are typed into the editor and saved",
        caption: "Building a CV section by section while the completeness meter fills in",
      },
      {
        type: "clip",
        src: "/videos/projects/vitafolio/share.mp4",
        poster: "/videos/projects/vitafolio/share.webp",
        alt: "The Look and privacy tab is set to the Modern layout with a teal accent and public visibility, then the published CV page with its QR code and the Browse CVs directory are shown",
        caption: "Choosing a layout, accent colour and visibility, then sharing one link",
      },
      {
        type: "clip",
        src: "/videos/projects/vitafolio/compile.mp4",
        poster: "/videos/projects/vitafolio/compile.webp",
        alt: "The LaTeX editor compiles the classic template in the browser, the PDF appears in the preview pane and is then saved to the CV",
        caption: "Compiling a LaTeX template to PDF in the browser",
      },
      {
        type: "clip",
        src: "/videos/projects/vitafolio/profile.mp4",
        poster: "/videos/projects/vitafolio/profile.webp",
        alt: "A photo is chosen, zoomed and dragged into the circle, then uploaded. The handle changes and Connected accounts shows Google and GitHub connected with Microsoft ready to connect",
        caption: "Framing a photo, choosing a handle and connecting sign-in providers",
      },
      {
        type: "clip",
        src: "/videos/projects/vitafolio/check.mp4",
        poster: "/videos/projects/vitafolio/check.webp",
        alt: "A CV is chosen and a job advert is pasted in. The report shows the overall score, the score for each area, suggestions and which advert keywords the CV has and lacks",
        caption: "Checking a CV against a job advert",
      },
      {
        type: "clip",
        src: "/videos/projects/vitafolio/jobs.mp4",
        poster: "/videos/projects/vitafolio/jobs.webp",
        alt: "The Jobs page is filtered to hardware internships and a role is saved. On My applications its status changes to Applied and a role found elsewhere is added by hand",
        caption: "Finding student roles and tracking each application",
      },
      {
        type: "clip",
        src: "/videos/projects/vitafolio/support.mp4",
        poster: "/videos/projects/vitafolio/support.webp",
        alt: "A support ticket about the order of CV sections is opened and given a reference. The tickets list and an earlier conversation with a reply from the support team are then shown",
        caption: "Opening a support ticket and following the conversation",
      },
      { type: "h2", text: "Architecture" },
      {
        type: "p",
        text: "Vitafolio is a server-rendered Laravel application. Pages are Blade templates styled with Tailwind CSS and small interactive parts use the CSP build of Alpine.js, which never evaluates strings, so the content security policy can forbid unsafe evaluation everywhere. The three rich widgets (the LaTeX studio, the section order editor and the photo cropper) are Vue components mounted as islands, so a page without one never downloads Vue.",
      },
      {
        type: "diagram",
        code: `flowchart LR
    People["CV owners and visitors"] --> CF["Cloudflare<br/>DNS, Turnstile, analytics"]
    CF --> App["FrankenPHP<br/>Laravel 13 on PHP 8.4<br/>Docker on Render"]
    App --> DB[("TiDB Cloud<br/>MySQL compatible")]
    App -- "signed requests" --> Media[("Cloudinary<br/>CV files and media")]
    App -- "verification and alerts" --> Mail["Resend"]
    App -. "errors" .-> Sentry["Sentry"]
    People -- "first compile only" --> TeX["LaTeX engine files<br/>on GitHub Pages"]
    Cron["Nightly scheduler"] -- "POST /cron" --> App
    Feeds["Adzuna, Reed and<br/>employer hiring systems"] -- "nightly jobs feed" --> App
    Monitor["Uptime monitor"] -- "GET /up" --> App`,
        caption: "How a request moves through Vitafolio and which outside services it touches",
      },
      {
        type: "p",
        text: "I picked each piece to fit a free hosting budget. FrankenPHP on Alpine Linux is a single small process with far fewer known vulnerabilities than a Debian Apache image. The container runs as an unprivileged user and runs any new migrations on start, so a failed migration stops a broken release from serving traffic. TiDB Cloud Starter never powers off when idle. Free hosting has no scheduled jobs, so a nightly call with a shared secret runs the tidy-up, with a GitHub Actions schedule as the backup. The same uptime check that feeds the status page also keeps the free host awake.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Every outside service is optional. Without its keys a feature switches itself off: no sign-in buttons for an unset provider, no media uploads without Cloudinary and no LaTeX compiling without the engine files. The rest of the site keeps working.",
      },
      { type: "h2", text: "Data model" },
      {
        type: "diagram",
        code: `erDiagram
    users ||--o{ cvs : owns
    users ||--o{ applications : tracks
    users ||--o{ support_tickets : opens
    cvs ||--o| cv_documents : "has a file"
    cvs ||--o{ projects : shows
    cvs ||--o{ endorsements : receives
    cvs ||--o{ cv_views : counts
    job_listings ||--o{ applications : "saved as"
    job_listings ||--o{ job_clicks : counts
    support_tickets ||--o{ support_messages : contains
    support_messages ||--o{ support_attachments : carries`,
        caption: "The main tables: accounts own CVs, applications and tickets, while job listings feed the tracker",
      },
      {
        type: "p",
        text: "The data is relational, which is why I stayed with MySQL. A saved application copies the listing's title, employer, location, link and closing date, so the record outlives the listing when the nightly tidy-up removes it. View counts are one row per visitor per CV per day, keyed by a salted hash that changes daily, so a visitor can never be followed from one day to the next and owners never count their own visits.",
      },
      { type: "h2", text: "LaTeX in the browser" },
      {
        type: "p",
        text: "The LaTeX studio uses CodeMirror for the source and BusyTeX, TeX Live compiled to WebAssembly, to compile with pdfLaTeX, XeLaTeX or LuaLaTeX on the visitor's own device. The engine files are about 120 MB, hosted separately on GitHub Pages and cached after the first compile. Seven starter templates fill in the owner's details. A plain text box can replace the code editor for anyone who finds it easier with a screen reader.",
      },
      {
        type: "image",
        src: "/images/projects/vitafolio/latex-compiled-light.webp",
        alt: "The LaTeX editor with source on the left and the compiled PDF on the right",
        caption: "Source on the left, the compiled PDF on the right",
      },
      { type: "h2", text: "Accessible PDFs" },
      {
        type: "p",
        text: "Generated PDFs for the CV and its cover letter come from Typst, which writes tagged PDF/UA-1 files and refuses to write one that breaks the standard. Each file declares its language and title. The name, section headings and project titles are real headings that also become bookmarks. The page footer is marked as furniture so it is not read out on every page. I chose Typst over mPDF because mPDF cannot write structure tags. A headless browser was the other option but it would need several hundred megabytes of image and memory on a free host. The PDF tests check every one of those tags.",
      },
      { type: "h2", text: "Check a CV and jobs" },
      {
        type: "p",
        text: "Check a CV scores a Vitafolio CV or an uploaded PDF or Word file across heading clarity, contact details, skills, education, experience, keywords and a readable layout area that catches tables, columns, text boxes and contact details hidden in the page header. Uploads are read in memory and never stored. The Jobs page gathers student roles each night from the Adzuna and Reed APIs and from employers' own hiring systems, then classifies each one again from whole words in its title so a Senior Graduate Recruiter is never listed as a graduate role.",
      },
      {
        type: "image",
        src: "/images/projects/vitafolio/check-light.webp",
        alt: "A Check a CV report with the overall score, the area scores and advert keywords",
        caption: "A Check a CV report",
      },
      { type: "h2", text: "Security and privacy" },
      {
        type: "table",
        headers: ["Area", "What I did"],
        rows: [
          ["Sign-in", "Email and password with a breached password check, passkeys, two-factor authentication and Google, GitHub and Microsoft"],
          ["Ownership", "One CvPolicy checked on every change to a CV, its projects, its file and its LaTeX"],
          ["Files", "CV files stored as authenticated Cloudinary assets and passed through only after a visibility check"],
          ["Uploads", "Checked by content rather than name, with images decoded and re-encoded to drop hidden data"],
          ["Headers", "A strict content security policy with no inline code, HSTS and frame blocking"],
          ["Abuse", "Turnstile, a honeypot field, rate limits, reports and a moderation queue"],
          ["CI", "Tests, Pint, PHPStan, composer and npm audits, a Trivy image scan and a Gitleaks scan on every pull request"],
        ],
        caption: "The main safeguards",
      },
      {
        type: "callout",
        tone: "note",
        text: "A Microsoft sign-in never joins an existing account by email, because some organisations let users set unverified addresses. Google and GitHub only share verified addresses, so they can.",
      },
      { type: "h2", text: "What I learned" },
      {
        type: "p",
        text: "Rebuilding AstonCV in a framework showed me how much of my hand-written PHP Laravel already solves, which freed the time for the parts that matter to the people using it: privacy rules that hold on every route, PDFs that screen readers can follow and a site that still works when an outside service is missing. Designing for a free host also made every dependency earn its place.",
      },
    ],
    references: [
      { title: "Laravel documentation", url: "https://laravel.com/docs", note: "The framework Vitafolio is built on" },
      { title: "texlyre-busytex", url: "https://github.com/TeXlyre/texlyre-busytex", note: "TeX Live compiled to WebAssembly, used for the in-browser LaTeX engine" },
      { title: "PDF/UA-1 (ISO 14289-1), Library of Congress format description", url: "https://www.loc.gov/preservation/digital/formats/fdd/fdd000350.shtml", note: "The accessible PDF standard the generated CVs follow" },
      { title: "Typst documentation", url: "https://typst.app/docs/", note: "The typesetting engine that writes the tagged PDFs" },
      { title: "Web Content Accessibility Guidelines (WCAG) 2.2", url: "https://www.w3.org/TR/WCAG22/", note: "The AA target for colours, keyboard use and motion" },
      { title: "JSON Resume schema", url: "https://jsonresume.org/schema", note: "The format used for CV import and export" },
      { title: "FrankenPHP documentation", url: "https://frankenphp.dev/docs/", note: "The application server in the production image" },
    ],
  }

export default _vitafolio
