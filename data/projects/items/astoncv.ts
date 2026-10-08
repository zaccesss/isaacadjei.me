import type { Project } from "../index"

const _astoncv: Project = {
    id: "astoncv",
    title: "AstonCV: Full-Stack CV Database",
    description:
      "A CV database website built from scratch in plain PHP 8.2, MySQL and custom CSS with no frameworks: browse, search and download student CVs as PDFs, with accounts and a personal dashboard.",
    longDescription:
      "AstonCV is a full-stack CV database website I built for a university web development portfolio, with no frameworks anywhere in the stack. Anyone can browse and search student CVs in a responsive card grid, filter by programming language, sort by name or view count and download any CV as a formatted PDF. Registered users get a dashboard with a CV completeness score, view statistics, a profile picture upload and forms to update their CV and password.\n\nBuilding without a framework was the point. Every route, every input check and every database call was written by hand, which taught me what frameworks actually do for you. Writing CSRF tokens, a brute-force lockout and bcrypt password flows myself made the security consequence of each decision concrete.\n\nThe site ran on the university's Apache server, which has since been retired. The repository is now archived as the coursework edition and the idea continues in Vitafolio, rebuilt from scratch in Laravel.",
    technologies: [
      "PHP 8.2",
      "MySQL",
      "PDO",
      "HTML5",
      "CSS3",
      "JavaScript",
      "Apache",
      "Composer",
      "mPDF",
    ],
    category: "web",
    featured: false,
    images: [
      "/images/projects/astoncv/main.webp",
      "/images/projects/astoncv/cv.webp",
      "/images/projects/astoncv/register.webp",
      "/images/projects/astoncv/login.webp",
      "/images/projects/astoncv/contact.webp",
      "/images/projects/astoncv/footer.webp",
    ],
    github: "https://github.com/zaccesss/astoncv",
    getInvolved: {},
    date: "2026",
    highlights: [
      "Built entirely from scratch in plain PHP 8.2, MySQL and CSS with no frameworks",
      "Ten security controls including PDO prepared statements, bcrypt, CSRF tokens, a 15 minute lockout after five failed logins and a contact form honeypot",
      "Server-side PDF export of any CV through mPDF, installed with Composer",
      "Live filter and sort by programming language and view count with no page reload",
      "Personal dashboard with a CV completeness score, view statistics and profile picture upload",
      "Archived after the university server was retired, with the work continuing as Vitafolio",
    ],
    cover: "/images/projects/astoncv/cover-home.webp",
    order: 9,
    status: "archived",
    links: [
      { label: "Vitafolio, where the work continues", url: "https://github.com/zaccesss/vitafolio" },
      { label: "Documentation", url: "https://github.com/zaccesss/astoncv/blob/main/DOCUMENTATION.md" },
      { label: "Changelog", url: "https://github.com/zaccesss/astoncv/blob/main/CHANGELOG.md" },
    ],
    sections: [
      { type: "h2", text: "What it does" },
      {
        type: "p",
        text: "The brief was a CV database for programmers: public browsing and search, registration and login, a way for each person to update their own CV and nothing that a visitor could abuse. I added a PDF export, view counts, a completeness score and a dashboard on top. The clips below were recorded from a local copy with made-up people, since the original server no longer exists.",
      },
      {
        type: "clip",
        src: "/videos/projects/astoncv/tour.mp4",
        poster: "/videos/projects/astoncv/tour.webp",
        alt: "A tour of AstonCV: the All CVs grid with search and filters, a CV detail page with a Download PDF button, the registration form, the login page and the Update Your CV page with a profile picture upload",
        caption: "A tour from browsing to updating a CV",
      },
      {
        type: "clip",
        src: "/videos/projects/astoncv/browse.mp4",
        poster: "/videos/projects/astoncv/browse.webp",
        alt: "The home page hero, then the All CVs grid is searched for Python, narrowing the cards to two. A CV detail page with its engagement, key language and Download PDF and Print CV actions is opened",
        caption: "Searching by name or programming language and opening a CV",
      },
      {
        type: "clip",
        src: "/videos/projects/astoncv/register.mp4",
        poster: "/videos/projects/astoncv/register.webp",
        alt: "The Create Account form is filled in, the password strength checklist turns green, the key language, skills, profile, education and work experience are entered and the account is created",
        caption: "Registering with the live password strength checker",
      },
      {
        type: "clip",
        src: "/videos/projects/astoncv/dashboard.mp4",
        poster: "/videos/projects/astoncv/dashboard.webp",
        alt: "A user logs in, the dashboard shows CV views, skills listed and total CVs with a CV preview, then a profile picture is uploaded on the Update Your CV page",
        caption: "Logging in, the dashboard and updating a CV",
      },
      { type: "h2", text: "How a request flows" },
      {
        type: "diagram",
        code: `flowchart LR
    Browser["Browser"] --> Apache["Apache<br/>public/ as web root"]
    Apache --> Pages["PHP pages<br/>index, cv, register, login,<br/>dashboard, update"]
    Pages --> Session["Session and<br/>CSRF token checks"]
    Session --> DB["db.php<br/>shared PDO connection"]
    DB --> MySQL[("MySQL<br/>cvs table")]
    Pages --> Export["export_cv.php"]
    Export --> mPDF["mPDF<br/>via Composer"]
    mPDF --> PDF["PDF download"]`,
        caption: "Each page is its own PHP file sharing one PDO connection, with mPDF for the PDF export",
      },
      {
        type: "p",
        text: "There is no router. Apache serves the public folder and each page is a PHP file that checks the session, validates its input, talks to MySQL through one shared PDO connection and renders its own HTML. Credentials sit in a config file that is never committed and the mPDF library is installed with Composer into a vendor folder that is also kept out of the repository.",
      },
      { type: "h2", text: "The data" },
      {
        type: "diagram",
        code: `erDiagram
    cvs {
        int id PK
        string name
        string email
        string password "bcrypt hash"
        string keyprogramming
        text skills
        text profile
        text education
        text work_experience
        text URLlinks
        string profile_picture
        int view_count
        int login_attempts
        datetime lockout_time
    }`,
        caption: "One table holds each account and its CV, with the lockout counters beside them",
      },
      {
        type: "p",
        text: "The schema is a single cvs table, so the account and the CV share one row. The login attempt counter and lockout time live on the same row, which kept the lockout logic simple. That single-table design is also the clearest limit of the project: one person can only ever have one CV. Vitafolio fixes exactly that, with separate tables for users and their many CVs.",
      },
      { type: "h2", text: "Security" },
      {
        type: "table",
        headers: ["Threat", "Control"],
        rows: [
          ["Cross-site scripting", "htmlspecialchars() on all output"],
          ["SQL injection", "PDO prepared statements on every query"],
          ["Stolen passwords", "password_hash() and password_verify()"],
          ["Cross-site request forgery", "A CSRF token checked on every POST form"],
          ["Brute force", "Accounts lock for 15 minutes after five failed login attempts"],
          ["Editing someone else's CV", "Session authentication on every protected page and an owner check before any update"],
          ["Bad input", "Server-side validation before every database write"],
          ["Malicious uploads", "A type whitelist for JPG, PNG, GIF and WEBP and a 2 MB size limit"],
          ["Spam", "A hidden honeypot field on the contact form"],
        ],
        caption: "The security controls written by hand",
      },
      {
        type: "callout",
        tone: "note",
        text: "The PDF export broke after submission because of one bad line in the export template. I fixed it in the final release before archiving the repository, along with footer links that still pointed at the retired server.",
      },
      { type: "h2", text: "Design" },
      {
        type: "p",
        text: "The interface uses Aston purple with Space Grotesk headings and DM Sans body text, campus photography on every page, an animated stats bar, a marquee strip under the hero, scroll reveal animations on the CV cards through IntersectionObserver and a sticky navbar that blurs on scroll.",
      },
      {
        type: "image",
        src: "/images/projects/astoncv/cv.webp",
        alt: "A CV detail page styled as a document, with a purple header, profile summary, education and work experience, plus side cards for views, key language, contact and actions",
        caption: "A CV detail page",
      },
      { type: "h2", text: "What came next" },
      {
        type: "p",
        text: "AstonCV showed me the idea worked and also where hand-written PHP stops scaling. When the server was retired I rebuilt the concept as Vitafolio in Laravel, with many CVs per person, private and unlisted visibility, accessible tagged PDFs and proper hosting.",
      },
    ],
    references: [
      { title: "PHP Data Objects (PDO) manual", url: "https://www.php.net/manual/en/book.pdo.php", note: "The database layer used for every query" },
      { title: "OWASP Cross-Site Request Forgery Prevention Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html", note: "The token pattern behind the CSRF protection" },
      { title: "mPDF documentation", url: "https://mpdf.github.io/", note: "The library that renders the CV PDFs" },
    ],
  }

export default _astoncv
