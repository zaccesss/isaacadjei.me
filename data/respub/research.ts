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
  {
    id: "zacess",
    name: "Zacess",
    projectSlug: "zacess",
    question:
      "Can one free tool turn the formats people find hardest to read (slides, scanned PDFs, photos of handouts, Word files and web pages) into text laid out for each reader, read it aloud and keep every file on the reader's own device without losing what the original said?",
    method:
      "A Rust core compiled to WebAssembly (440 KB) turns every import into one document model in which each run of text keeps its place on the original page. pdf.js, Tesseract and mammoth read PDFs, scans and Word files in the browser. Reading profiles set the font, size up to 96 points, line and letter spacing, line length and theme, with presets for low vision (Atkinson Hyperlegible at 24 points, 1.6 line spacing and 45-character lines) and dyslexia (Lexend with 0.12 em letter spacing and 1.75 line spacing on cream). Every recognised word carries a confidence and doubtful ones are marked for checking. Read aloud uses the voices on the device and highlights each sentence. HTML and EPUB 3 exports are checked with axe-core and EPUBCheck in CI. The matching code themes come from one palette, hold every syntax colour at 7:1 or more and are checked under simulated protanopia, deuteranopia and tritanopia.",
    status: "live",
    found:
      "The browser version is live with zero axe-core violations at WCAG 2.2 A and AA on its main screens, checked on WebKit as well as Chromium. Text recognition on scanned, number-heavy notes misreads symbols such as kΩ as kQ, which is why every word's confidence is shown rather than hidden. A braille-ready export exists in the core but needs liblouis built for WebAssembly before it reaches the browser. The code themes are on the VS Code Marketplace, Open VSX and the Obsidian community directory.",
    links: [
      { label: "Project page", href: "/projects/zacess" },
      { label: "app.zacess.com", href: "https://app.zacess.com" },
      { label: "zacess.com", href: "https://zacess.com" },
      { label: "Code themes", href: "https://zacess.com/themes/" },
    ],
    materials: [
      { label: "Source code", href: "https://github.com/zacesshq/zacess" },
      { label: "Documentation", href: "https://github.com/zacesshq/zacess/tree/main/docs" },
      { label: "Code themes source", href: "https://github.com/zacesshq/themes" },
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
      "Documents that carry real structure (headings, bookmarks, a declared language and reading order) so assistive technology can follow them. Readers that lay any document out for the person reading it are part of the same problem. Vitafolio writes tagged PDF/UA-1 CVs this way and Zacess rebuilds PDFs, scans and Word files into reading profiles with accessible HTML and EPUB exports.",
    links: [
      { label: "Vitafolio", href: "/projects/vitafolio" },
      { label: "Zacess", href: "/projects/zacess" },
    ],
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
    area: "FPGAs and digital design",
    detail:
      "Describing hardware in a language rather than wiring it by hand and weighing whether a job belongs in logic or in software. It runs through my Digital Design module and the reading I am doing this term. VHDL sits alongside C in the embedded work I want to do next.",
  },
  {
    area: "Control systems and robotics",
    detail:
      "Feedback control, from a PID loop on a motor to the flight controller that keeps a drone on its mission. My Control Systems and Robotics module covers the theory and LidarSAT is where I watch an autopilot fly a planned route in simulation.",
    links: [{ label: "LidarSAT", href: "/projects/lidarsat" }],
  },
  {
    area: "Signal processing and communications",
    detail:
      "Getting useful information out of noisy signals: filters, spectra and how data survives a channel. PHAEMOS computes a vibration spectrum on a microcontroller and my audio amplifier is an active band-pass filter, both small cases of a much larger field.",
    links: [
      { label: "PHAEMOS", href: "/projects/phaemos" },
      { label: "Audio amplifier", href: "/projects/audio-amplifier" },
    ],
  },
  {
    area: "Analogue and power electronics",
    detail:
      "Circuits that handle real voltages and currents, from op-amp stages to the converters that power every board. Building the audio amplifier from simulation to my own PCB made me want to understand power stages properly.",
    links: [{ label: "Audio amplifier", href: "/projects/audio-amplifier" }],
  },
  {
    area: "Machine learning on embedded devices",
    detail:
      "Running models close to the sensor on hardware with little memory and power, so a device can decide for itself without sending everything to a server. PHAEMOS scores readings on a server today, which makes this the natural next question.",
    links: [{ label: "PHAEMOS", href: "/projects/phaemos" }],
  },
  {
    area: "Hardware and embedded security",
    detail:
      "How devices are attacked and defended at the level of firmware, buses and keys rather than only on the network. I am learning security through capture the flag challenges and encryption. Bare-metal C on AVR shows how little stands between code and the hardware.",
    links: [{ label: "avr-zac", href: "/projects/avr-zac" }],
  },
  {
    area: "Space systems and engineering failures",
    detail:
      "What spacecraft, satellites and launchers teach about building systems that cannot be fixed once they fly. The inquiries into failures reveal as much about software, testing and assumptions as about hardware.",
    links: [{ label: "Ariane 5 Flight 501", href: "/blog/ariane-5-flight-501-overflow" }],
  },
  {
    area: "Computing education",
    detail:
      "How people learn technical tools and what makes teaching material work for someone learning alone. I lead weekly Peer Assisted Learning sessions in Python and wrote git-unlocked, so I see both sides: explaining in person and writing for a reader I never meet.",
    links: [{ label: "git-unlocked", href: "/projects/git-unlocked" }],
  },
  {
    area: "Open education",
    detail:
      "Open-source learning materials that lower the barrier to version control and collaborative development. git-unlocked, 182 files across 12 sections under CC BY-SA 4.0, is published on Zenodo with a DOI.",
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
  {
    line: "Zacess",
    papers: [
      {
        citation: "Rello, L. and Baeza-Yates, R. (2013). Good fonts for dyslexia. Proceedings of the 15th International ACM SIGACCESS Conference on Computers and Accessibility (ASSETS).",
        why: "Eye-tracking evidence that sans serif, monospaced and roman fonts read faster for people with dyslexia, behind the fonts in the presets.",
        href: "https://doi.org/10.1145/2513383.2513447",
        identifier: "doi:10.1145/2513383.2513447",
      },
      {
        citation: "Zorzi, M., Barbiero, C., Facoetti, A., Lonciari, I., Carrozzi, M., Montico, M. et al. (2012). Extra-large letter spacing improves reading in dyslexia. Proceedings of the National Academy of Sciences, 109(28).",
        why: "Why the dyslexia preset widens letter spacing.",
        href: "https://doi.org/10.1073/pnas.1205566109",
        identifier: "doi:10.1073/pnas.1205566109",
      },
      {
        citation: "Rello, L., Pielot, M. and Marcos, M.-C. (2016). Make It Big! The Effect of Font Size and Line Spacing on Online Readability. Proceedings of the 2016 CHI Conference on Human Factors in Computing Systems.",
        why: "Evidence that larger text reads better, behind the large starting sizes and the 96-point limit.",
        href: "https://doi.org/10.1145/2858036.2858204",
        identifier: "doi:10.1145/2858036.2858204",
      },
      {
        citation: "W3C (2024). Web Content Accessibility Guidelines (WCAG) 2.2. W3C Recommendation, 12 December 2024.",
        why: "The text spacing, visual presentation and 7:1 contrast criteria the profiles and themes are built to. The app is tested against its AA level.",
        href: "https://www.w3.org/TR/WCAG22/",
        identifier: "WCAG 2.2",
      },
      {
        citation: "Smith, R. (2007). An Overview of the Tesseract OCR Engine. Ninth International Conference on Document Analysis and Recognition (ICDAR 2007).",
        why: "The text recognition engine, whose confidence for each word marks the doubtful ones.",
        href: "https://doi.org/10.1109/ICDAR.2007.4376991",
        identifier: "doi:10.1109/ICDAR.2007.4376991",
      },
      {
        citation: "Haas, A., Rossberg, A., Schuff, D. L., Titzer, B. L., Holman, M., Gohman, D. et al. (2017). Bringing the web up to speed with WebAssembly. Proceedings of the 38th ACM SIGPLAN Conference on Programming Language Design and Implementation (PLDI).",
        why: "The design of WebAssembly, which lets the Rust core run in the browser.",
        href: "https://doi.org/10.1145/3062341.3062363",
        identifier: "doi:10.1145/3062341.3062363",
      },
      {
        citation: "W3C (2024). EPUB Accessibility 1.1. W3C Recommendation, 17 October 2024.",
        why: "The accessibility requirements and metadata the EPUB 3 export follows.",
        href: "https://www.w3.org/TR/epub-a11y-11/",
        identifier: "EPUB Accessibility 1.1",
      },
      {
        citation: "Machado, G. M., Oliveira, M. M. and Fernandes, L. A. F. (2009). A Physiologically-based Model for Simulation of Color Vision Deficiency. IEEE Transactions on Visualization and Computer Graphics, 15(6).",
        why: "The colour vision simulation every pair of code theme colours is checked under.",
        href: "https://doi.org/10.1109/TVCG.2009.113",
        identifier: "doi:10.1109/TVCG.2009.113",
      },
      {
        citation: "Ottosson, B. (2020). A perceptual color space for image processing (OKLab).",
        why: "The colour space the themes use to measure whether two colours still differ in lightness.",
        href: "https://bottosson.github.io/posts/oklab/",
        identifier: "OKLab",
      },
    ],
  },
]
