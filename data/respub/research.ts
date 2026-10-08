export type ResearchStatus = "simulation" | "hardware" | "live"

export interface ResearchLink {
  label: string
  href: string
}

export interface ResearchLine {
  id: string
  name: string
  projectSlug: string
  question: string
  method: string
  status: ResearchStatus
  found: string
  links: ResearchLink[]
  materials: ResearchLink[]
  materialsNote?: string
}

export const researchLines: ResearchLine[] = [
  {
    id: "lidarsat",
    name: "LidarSAT",
    projectSlug: "lidarsat",
    question:
      "Can a drone work out where it is without GPS by matching the shape of the ground below it against a public height map? Within that: does a learned matcher beat a classic one, how much accuracy does a cheap single-point LiDAR lose against a scanning one and does a system trained in simulation still work on real flight data?",
    method:
      "A downward LiDAR turns the ground under the drone into a height profile, which is searched for on the Environment Agency National LIDAR Programme map of England at one height value per square metre. A classic template matcher following the winning SPRIN-D system is compared with a small neural network trained only on our own simulator, both feeding the same particle filter. Flights run in ArduPilot SITL first, then on a real drone with GPS kept on as ground truth.",
    status: "simulation",
    found:
      "The drone side works end to end in simulation: a measured SITL mission (a 200 m square at 30 m and 10 m/s) produces a flight log that the pipeline can read, trimmed from about 13 MB to 366 KB with identical record counts. There are no matcher error figures yet. The classic matcher runs over full simulated flights next and those numbers decide the drone's hardware.",
    links: [
      { label: "Project page", href: "/projects/lidarsat" },
      { label: "ENGINERDS on GitHub", href: "https://github.com/ENGNERDS" },
    ],
    materials: [
      {
        label: "Environment Agency National LIDAR Programme (the map data used)",
        href: "https://environment.data.gov.uk/dataset/2e8d0733-4f43-48b4-9e51-631c25d1b0a9",
      },
    ],
    materialsNote:
      "LidarSAT is a four-person team project and its repositories are private for now. Code, data and results will follow when the team publishes them.",
  },
  {
    id: "phaemos",
    name: "PHAEMOS",
    projectSlug: "phaemos",
    question:
      "Can an unsupervised model catch a machine drifting away from its normal behaviour early without burying a technician in false alarms?",
    method:
      "Each kind of sensor node gets its own Isolation Forest, trained only on the fields that node really reports. Scores are calibrated against each model's own training data: a typical healthy reading maps to 0 and the model's decision boundary maps to exactly 0.7, the alert threshold. An alert is raised only after three anomalous readings in a row and three normal readings clear it.",
    status: "hardware",
    found:
      "On simulator streams, healthy machines are flagged 4 to 8% of the time against a 5% contamination setting, every injected fault was caught including early bearing wear and the mixed labelled set gives precision 0.83, recall 1.0 and F1 0.91. The three-in-a-row rule makes a chance alert on a healthy machine about one in 8,000. These are simulated machines; retraining on readings from the real nodes comes next.",
    links: [
      { label: "Project page", href: "/projects/phaemos" },
      { label: "phaemos.com", href: "https://phaemos.com" },
      { label: "Repository", href: "https://github.com/phaemos/phaemos" },
    ],
    materials: [
      { label: "Source code (AGPL-3.0)", href: "https://github.com/phaemos/phaemos" },
      { label: "Documentation", href: "https://github.com/phaemos/phaemos/tree/main/docs" },
    ],
  },
  {
    id: "vitafolio",
    name: "Vitafolio",
    projectSlug: "vitafolio",
    question:
      "Can a free CV builder produce PDFs that a screen reader can follow properly, not just PDFs that look right?",
    method:
      "Generated CV and cover letter PDFs come from Typst, which writes tagged PDF/UA-1 (ISO 14289-1) files and refuses to write one that breaks the standard. Each file declares its language and title, headings are real headings that become bookmarks and the page footer is marked as furniture so it is not read out on every page. PDF tests check every one of those tags and the interface targets WCAG 2.2 AA colours in both themes with full keyboard use.",
    status: "live",
    found:
      "mPDF cannot write structure tags and a headless browser would need several hundred megabytes of image and memory on a free host, so Typst was the practical route to tagged output. Every generated CV and cover letter now ships as a tagged PDF/UA-1 file.",
    links: [
      { label: "Project page", href: "/projects/vitafolio" },
      { label: "vitafolio.isaacadjei.me", href: "https://vitafolio.isaacadjei.me" },
      { label: "Repository", href: "https://github.com/zaccesss/vitafolio" },
    ],
    materials: [
      { label: "Source code (MIT)", href: "https://github.com/zaccesss/vitafolio" },
      { label: "Documentation", href: "https://vitafolio.isaacadjei.me/docs" },
      { label: "Changelog", href: "https://vitafolio.isaacadjei.me/changelog" },
    ],
  },
]

export interface ResearchInterest {
  area: string
  detail: string
  links?: ResearchLink[]
}

export const researchInterests: ResearchInterest[] = [
  {
    area: "GNSS-denied navigation and terrain-relative positioning",
    detail:
      "Locating a drone when GPS is jammed, spoofed or blocked by matching what a downward LiDAR sees against public terrain maps. I work on the drone side of LidarSAT: simulated flights, flight logs and measuring how far an estimate is from the truth.",
    links: [{ label: "LidarSAT", href: "/projects/lidarsat" }],
  },
  {
    area: "Anomaly detection for predictive maintenance",
    detail:
      "Scoring sensor readings so a machine that is drifting from normal is caught before it breaks, with scores that mean what the model learned and alert rules that keep false alarms rare. This is the core of PHAEMOS.",
    links: [{ label: "PHAEMOS", href: "/projects/phaemos" }],
  },
  {
    area: "Accessible document generation",
    detail:
      "Generating PDFs that carry real structure (headings, bookmarks, a declared language and reading order) so assistive technology can follow them. Vitafolio writes tagged PDF/UA-1 CVs this way.",
    links: [{ label: "Vitafolio", href: "/projects/vitafolio" }],
  },
  {
    area: "Assistive technology for low vision",
    detail:
      "I have lived with one working eye since I was two, so contrast, colour coding that never stands alone and predictable layouts are practical needs for me. I build them into the documents, interfaces and notes I make.",
    links: [{ label: "Accessibility statement", href: "/accessibility" }],
  },
  {
    area: "Light-guided music learning",
    detail:
      "MELOPHOS lights the next notes above a keyboard or along a fretboard and scores what is played, with practice data kept on your own server. It is early: the browser Studio runs melody practice and the first hub board is in design.",
    links: [
      { label: "MELOPHOS", href: "/projects/melophos" },
      { label: "melophos.com", href: "https://melophos.com" },
    ],
  },
  {
    area: "Bionic vision and ocular prosthetics",
    detail:
      "Retinal and cortical implants, digitally made prosthetic eyes and whole-eye transplant, read from published sources. The problems underneath them, high channel count neural interfaces, flexible bio-integrated electronics and nerve regeneration, are the engineering I want to work on.",
    links: [
      { label: "Prosthetics and health technology", href: "/notes/prosthetics-health-tech" },
      { label: "Could someone with one eye get a second?", href: "/notes/one-eye-vision-research" },
    ],
  },
  {
    area: "Open education",
    detail:
      "Open-source learning materials that lower the barrier to version control and collaborative development. git-unlocked, 217 files across 12 sections under the MIT licence, is published on Zenodo with a DOI.",
    links: [{ label: "git-unlocked", href: "/respub/git-unlocked-2026" }],
  },
]

export interface KeyPaper {
  citation: string
  why: string
  href: string
  identifier: string
}

export interface PaperGroup {
  line: string
  papers: KeyPaper[]
}

export const keyPapers: PaperGroup[] = [
  {
    line: "LidarSAT",
    papers: [
      {
        citation:
          "Werner, M., Čapek, D., Musil, T., Franěk, O., Báča, T. and Saska, M. (2025). Kilometer-Scale GNSS-Denied UAV Navigation via Heightmap Gradients: A Winning System from the SPRIN-D Challenge. arXiv.",
        why: "The baseline the classic matcher follows.",
        href: "https://arxiv.org/abs/2510.01348",
        identifier: "arXiv:2510.01348",
      },
      {
        citation:
          "Gordon, N. J., Salmond, D. J. and Smith, A. F. M. (1993). Novel approach to nonlinear/non-Gaussian Bayesian state estimation. IEE Proceedings F (Radar and Signal Processing), 140(2).",
        why: "The particle filter that tracks position from each matcher's heat map.",
        href: "https://doi.org/10.1049/ip-f-2.1993.0015",
        identifier: "doi:10.1049/ip-f-2.1993.0015",
      },
    ],
  },
  {
    line: "PHAEMOS",
    papers: [
      {
        citation:
          "Liu, F. T., Ting, K. M. and Zhou, Z.-H. (2008). Isolation Forest. 2008 Eighth IEEE International Conference on Data Mining (ICDM).",
        why: "The anomaly model every reading is scored with.",
        href: "https://doi.org/10.1109/ICDM.2008.17",
        identifier: "doi:10.1109/ICDM.2008.17",
      },
    ],
  },
  {
    line: "Vitafolio",
    papers: [
      {
        citation: "ISO 14289-1:2014. Document management applications: Electronic document file format enhancement for accessibility, Part 1: Use of ISO 32000-1 (PDF/UA-1).",
        why: "The accessible PDF standard the generated CVs follow, described by the Library of Congress.",
        href: "https://www.loc.gov/preservation/digital/formats/fdd/fdd000350.shtml",
        identifier: "PDF/UA-1",
      },
      {
        citation: "W3C (2024). Web Content Accessibility Guidelines (WCAG) 2.2. W3C Recommendation, 12 December 2024.",
        why: "The AA target for colours, keyboard use and motion in the interface.",
        href: "https://www.w3.org/TR/WCAG22/",
        identifier: "WCAG 2.2",
      },
    ],
  },
]
