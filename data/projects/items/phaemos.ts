import type { Project } from "../index"

const _phaemos: Project = {
    id: "phaemos",
    title: "PHAEMOS: Predictive Maintenance Platform",
    description:
      "An open industrial IoT platform that streams sensor readings from four microcontroller nodes, scores every reading with a calibrated Isolation Forest and turns sustained anomalies into alerts and maintenance tickets on a live dashboard.",
    longDescription:
      "PHAEMOS (pronounced FAY-mos, from the Ancient Greek roots for \"to reveal\" and \"system or order\") is a predictive maintenance platform I am building from the hardware up. Sensor nodes report what a machine is doing, a FastAPI backend scores and stores every reading and a Next.js dashboard shows it live, so a machine that is drifting away from normal is caught before it breaks down. The tagline is reveal before failure.\n\nThe software runs end to end today: ingest, storage, anomaly scoring, alert rules, tickets, notifications and the dashboard, with a simulator that can inject faults such as a failing bearing standing in for real machines. Four nodes are planned (an ESP32 gateway with 11 sensors, an STM32 Black Pill running a vibration FFT at 100 Hz, an Arduino Nano and a Raspberry Pi Pico 2W). Their firmware is written and the boards are being wired and validated, which is the current phase.\n\nThe project lives in its own GitHub organisation as a monorepo. Each component folder (backend, frontend, firmware, hardware, the Rust edge gateway, the client tools and the infrastructure) is published to its own read-only repository on every merge to main. Software is licensed under AGPL-3.0 and the hardware designs under the CERN Open Hardware Licence v2.",
    technologies: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "scikit-learn",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Rust",
      "Go",
      "C",
      "C++",
      "MicroPython",
      "ESP32",
      "STM32",
      "CMSIS-DSP",
      "Docker",
      "WebSocket",
    ],
    category: "iot",
    featured: false,
    images: [
      "/images/projects/phaemos/dashboard.webp",
      "/images/projects/phaemos/device.webp",
      "/images/projects/phaemos/alerts.webp",
      "/images/projects/phaemos/tickets.webp",
      "/images/projects/phaemos/compare.webp",
      "/images/projects/phaemos/devices.webp",
      "/images/projects/phaemos/dashboard-light.webp",
      "/images/projects/phaemos/device-light.webp",
    ],
    github: "https://github.com/phaemos/phaemos",
    website: "https://phaemos.com",
    getInvolved: { discussions: true, roadmap: "https://github.com/orgs/phaemos/projects/1" },
    date: "2026",
    highlights: [
      "End-to-end pipeline: nodes and a Rust store-and-forward gateway post readings to FastAPI, which scores, stores and streams each one to the dashboard over WebSocket",
      "Calibrated Isolation Forest per node type: a typical healthy reading scores near 0 and the model's own decision boundary sits at the 0.7 alert threshold",
      "Measured on simulator streams: healthy machines flagged 4 to 8% of the time, bearing wear caught early in the fault, precision 0.83, recall 1.0 and F1 0.91 on a mixed labelled set",
      "Three anomalous readings in a row raise one alert and open a maintenance ticket; three normal readings clear it, so a chance run on a healthy machine is about one in 8,000",
      "Operations built in: alert rules, maintenance windows, webhooks to Slack, Discord and Teams, email and SMS, an audit log and role-based access with two-factor sign-in plus Google, GitHub and Microsoft accounts",
      "Monorepo split into seven published component repositories, with a Python SDK and fault-injecting simulator plus a Go CLI for load testing",
    ],
    cover: "/images/projects/phaemos/cover-brand-light.webp",
    coverDark: "/images/projects/phaemos/cover-brand.webp",
    order: 4,
    status: "in-progress",
    links: [
      { label: "PHAEMOS on GitHub", url: "https://github.com/phaemos" },
      { label: "Documentation", url: "https://github.com/phaemos/phaemos/tree/main/docs" },
      { label: "Milestones", url: "https://github.com/phaemos/phaemos/milestones" },
    ],
    sections: [
      {
        type: "clip",
        src: "/videos/projects/phaemos/tour.mp4",
        poster: "/videos/projects/phaemos/tour.webp",
        alt: "A tour of the PHAEMOS dashboard moving from the fleet overview to a machine's live charts, the alert list and the ticket view.",
        caption: "A tour of the dashboard running against simulated machines.",
      },
      { type: "h2", text: "Why I built it" },
      {
        type: "p",
        text: "Machines rarely fail suddenly. A bearing wears, a motor runs a little hotter and vibration creeps up for days before anything breaks. Most of that is visible in sensor data long before it is audible on the shop floor. I wanted a platform that covers the whole path from a sensor wired to a microcontroller to a ticket in a technician's queue. Building every layer myself meant I had to make the hardware, the backend, the model and the interface agree with each other.",
      },
      { type: "h2", text: "Architecture" },
      {
        type: "p",
        text: "Readings start on the nodes. The STM32 and the Nano report to the ESP32 over UART and serial, while the ESP32 and the Pico 2W post to the API over Wi-Fi every 5 seconds. A node that sits on a serial line can go through the Rust edge gateway instead, which appends each reading to a spool file, syncs it to disk and forwards spooled readings in order. When the API is unreachable it retries with backoff capped at one minute, so an outage or a reboot loses nothing.",
      },
      {
        type: "diagram",
        code: `flowchart LR
    subgraph NODES["Sensor nodes"]
        STM["STM32 Black Pill<br/>vibration FFT"]
        NANO["Arduino Nano<br/>auxiliary sensors"]
        ESP["ESP32 hub<br/>11 sensors"]
        PICO["Pico 2W<br/>ambient sensors"]
    end
    STM -- "UART" --> ESP
    NANO -- "serial" --> ESP
    NODES -. "serial" .-> EDGE["Rust edge gateway<br/>spools through outages"]
    ESP -- "POST every 5 s" --> API
    PICO -- "POST over Wi-Fi" --> API
    EDGE -- "forwards in order" --> API
    API["FastAPI<br/>scoring, rules, tickets"]
    API --> DB[("PostgreSQL 15")]
    API -. "status check" .-> REDIS[("Redis 7")]
    API -- "WebSocket" --> UI["Next.js dashboard"]
    API --> OUT["Webhooks, email<br/>and SMS"]`,
        caption: "From the sensor nodes through the edge gateway and the API to storage and the dashboard.",
      },
      {
        type: "p",
        text: "The backend is FastAPI on Python 3.11 with PostgreSQL 15 behind it. Redis 7 runs in the Compose stack and is part of the public status check. WebSocket fan-out and rate limits live inside the API process for now. Moving both onto Redis is the step for running several API workers. The dashboard is Next.js 15 with Tailwind CSS. It receives live readings over WebSocket and falls back to polling the latest reading every 5 seconds.",
      },
      { type: "h3", text: "Ingesting and scoring a reading" },
      {
        type: "diagram",
        code: `sequenceDiagram
    participant N as Node or edge gateway
    participant A as FastAPI
    participant M as Isolation Forest
    participant D as PostgreSQL
    participant W as Dashboard
    N->>A: POST /api/v1/telemetry with X-API-Key
    A->>A: Look up the device by its key
    A->>M: Score with the node type's own model
    M-->>A: Score from 0 to 1, anomaly at 0.7 or above
    A->>D: Save the reading with its score
    A->>A: Check the device's alert rules
    A->>D: Third anomaly in a row raises one alert and opens a ticket
    A-->>W: Broadcast the reading over WebSocket
    W->>A: Poll the latest reading every 5 s as a fallback`,
        caption: "One reading from arrival to the dashboard. Rules are skipped during a maintenance window.",
      },
      {
        type: "clip",
        src: "/videos/projects/phaemos/machine.mp4",
        poster: "/videos/projects/phaemos/machine.webp",
        alt: "A machine's page in PHAEMOS showing the anomaly score chart with its threshold line above one small chart per sensor, each updating live.",
        caption: "A machine's page: the anomaly score first, then one chart per sensor with its own scale and unit.",
      },
      { type: "h2", text: "Anomaly scoring and calibration" },
      {
        type: "p",
        text: "The model is a scikit-learn Isolation Forest. It is unsupervised, which matters because nobody has a labelled history of faults for a new machine. It learns what normal looks like and reports how easy a reading is to isolate from the rest. I train it with 200 trees and a contamination of 0.05, so the model's own decision boundary is set where about 5% of its training readings fall outside normal.",
      },
      {
        type: "p",
        text: "The first version mapped the raw score onto 0 to 1 with a fixed formula. Raw scores for normal data sit roughly between -0.4 and -0.7. That formula turned every one of them into 0.9 or more. As soon as a model was trained, every reading counted as an anomaly. I replaced it with a calibration that is stored with the model at training time.",
      },
      {
        type: "ol",
        items: [
          "Take the model's decision value for each reading: the raw score minus the model's offset. Below 0 means outside what it learned as normal.",
          "At training time, store the median decision value of the training readings as the typical healthy decision.",
          "At scoring time, map a typical reading to 0 and the decision boundary to exactly 0.7, then clip the result to the range 0 to 1.",
        ],
      },
      {
        type: "code",
        lang: "python",
        text: `def normalise(model, raw_scores):
    typical = model.phaemos_typical_decision
    decisions = raw_scores - model.offset_
    # a typical reading maps to 0 and the model's boundary to the 0.7 threshold
    return np.clip(0.7 * (typical - decisions) / typical, 0.0, 1.0)`,
      },
      {
        type: "p",
        text: "The 0.7 threshold now means exactly what the trained model learned rather than an arbitrary shift. I also stopped feeding every node type into one model. An STM32 reports eight vibration fields and an ESP32 reports 23 sensors, so a single model saw long runs of zeros for fields a node never has and learned a skewed idea of normal. Each node type with at least 50 readings now gets its own model, trained on the columns present in at least 90% of its readings. A general model covers readings without a node type. Training, evaluation and the live API all go through the same code.",
      },
      {
        type: "table",
        headers: ["Measure", "Result"],
        rows: [
          ["Healthy machines flagged", "4 to 8% of readings, close to the 5% configured"],
          ["Bearing wear on the ESP32 and STM32", "Caught from early in the fault"],
          ["Leaks on the Nano", "Flagged on 100% of readings"],
          ["Precision on a mixed labelled set", "0.83"],
          ["Recall on a mixed labelled set", "1.0"],
          ["F1 on a mixed labelled set", "0.91"],
        ],
        caption: "Measured on simulator streams with faults injected by the PHAEMOS simulator.",
      },
      { type: "h3", text: "From score to alert" },
      {
        type: "p",
        text: "A 5% false positive rate per reading would bury a technician in alerts if every flagged reading raised one. The model therefore raises its own alerts only when three anomalous readings arrive in a row. The alert is critical when the score reaches 0.85. The same alert opens a maintenance ticket. Three normal readings in a row clear it. A fault that comes back reuses the open ticket instead of creating a new one. If healthy readings are flagged independently 5% of the time, a chance run of three is 0.05 cubed, about one in 8,000.",
      },
      {
        type: "clip",
        src: "/videos/projects/phaemos/alerts-tickets.mp4",
        poster: "/videos/projects/phaemos/alerts-tickets.webp",
        alt: "The alerts list in PHAEMOS with severity shown as a dot and a word, followed by opening a ticket for a machine picked by name.",
        caption: "Alerts form one list and a ticket opens from a button with the machine picked by name.",
      },
      {
        type: "callout",
        tone: "note",
        text: "These results come from simulated machines. The next step is training on readings from the real nodes once they are wired, which will show how far the simulator's idea of normal matches a real motor.",
      },
      { type: "h2", text: "Hardware" },
      {
        type: "table",
        headers: ["Board", "Language", "Role"],
        rows: [
          ["ESP32 DevKit", "C++ (Arduino)", "Primary node: 11 sensors, OLED, buzzer, RGB LED, relay and Wi-Fi to the API"],
          ["STM32 Black Pill F411CEU6", "C (STM32 HAL)", "Vibration node: MPU6050 sampled at 100 Hz over I2C, FFT and UART to the ESP32"],
          ["Arduino Nano", "C++ (Arduino)", "Secondary node: BME280, LDR and FC-28 over serial to the ESP32"],
          ["Raspberry Pi Pico 2W", "MicroPython", "Ambient node: BME280, LDR and OLED with Wi-Fi straight to the API"],
        ],
        caption: "The four planned nodes.",
      },
      {
        type: "p",
        text: "The vibration node reports the peak frequency rather than a raw g value, because bearing faults, imbalance and misalignment each show up at characteristic frequencies. My first FFT was a hand-written DFT, which is O(N squared). Moving it to CMSIS-DSP's real FFT on a 128-point buffer made it about nine times faster on the 96 MHz Cortex-M4F. Every node's circuit is simulated in Proteus first and the boards that get manufactured are laid out in KiCad.",
      },
      { type: "h2", text: "The dashboard" },
      {
        type: "p",
        text: "The latest redesign came from using the dashboard every day against the simulator. Live readings are drawn as one small chart per sensor with its own scale, unit and latest value, so pressure near 1000 hPa no longer flattens a 23 degree temperature. The anomaly score comes first with the 0.7 threshold and a 10-reading average drawn on it. Filters are single segmented controls and status, severity and priority show as a dot plus a word, so colour is never the only signal. The dashboard opens on the machine with the newest active alert.",
      },
      {
        type: "clip",
        src: "/videos/projects/phaemos/compare.mp4",
        poster: "/videos/projects/phaemos/compare.webp",
        alt: "The Compare page with two machines selected, one showing its anomaly score climbing above the threshold as vibration ramps up while the other stays near zero.",
        caption: "Comparing a compressor with a developing fault against a healthy spindle motor.",
      },
      {
        type: "image",
        src: "/images/projects/phaemos/dashboard-light.webp",
        alt: "The PHAEMOS dashboard in the light theme with fleet health cards and a machine's live charts.",
        caption: "The light theme. Fixing it meant defining every colour shade the components use.",
      },
      {
        type: "p",
        text: "The redesign also exposed two quiet bugs. The palette was missing shades such as surface-300 and every -400 step, so much of the text and many borders rendered with no colour, above all in the light theme. Separately, layout classes had been spelt the British way (items-centre, justify-centre, transition-colours), which Tailwind silently ignores, so alignment and transitions were lost on 16 components.",
      },
      { type: "h2", text: "Security and operations" },
      {
        type: "ul",
        items: [
          "Every device authenticates with its own X-API-Key on ingest. People sign in with a password, Google, GitHub or Microsoft and get a 15-minute access token plus a 7-day refresh cookie.",
          "Two-factor authentication, once enrolled, is required at every sign-in through a short-lived challenge. Each code is accepted once and changing the password ends every other session.",
          "A Microsoft email never links to an existing account, since a work or school tenant can set an address it never verified.",
          "Admin, Technician and Viewer roles are enforced on API routes and in the interface. Every significant change is written to an audit log.",
          "CI runs tests, CodeQL and gitleaks. JWT handling moved from python-jose to PyJWT when python-jose had no fixed release for a published advisory.",
        ],
      },
      {
        type: "clip",
        src: "/videos/projects/phaemos/overview.mp4",
        poster: "/videos/projects/phaemos/overview.webp",
        alt: "The PHAEMOS fleet overview with health summary cards and a list of devices with their status.",
        caption: "The fleet overview.",
      },
      { type: "h2", text: "What is next" },
      {
        type: "p",
        text: "The milestones put real hardware first: wire and validate the four nodes, collect readings from real machines and retrain the models on them. After that comes hosting the stack for the launch milestone and a sequence model for time-series prediction alongside the Isolation Forest.",
      },
    ],
    references: [
      {
        title: "Isolation Forest (Liu, Ting and Zhou, ICDM 2008)",
        url: "https://doi.org/10.1109/ICDM.2008.17",
        note: "The original paper behind the anomaly model: anomalies are few and different, so they are isolated in fewer random splits.",
      },
      {
        title: "Isolation Forest, author's copy (PDF)",
        url: "https://cs.nju.edu.cn/zhouzh/zhouzh.files/publication/icdm08b.pdf",
        note: "A free copy of the same paper from Zhi-Hua Zhou's publication page.",
      },
      {
        title: "scikit-learn IsolationForest documentation",
        url: "https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.IsolationForest.html",
        note: "The implementation used, including score_samples, offset_ and contamination, which the calibration builds on.",
      },
      {
        title: "ESP32 Series datasheet (Espressif)",
        url: "https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf",
        note: "The primary node's microcontroller.",
      },
      {
        title: "CMSIS-DSP documentation (Arm)",
        url: "https://arm-software.github.io/CMSIS-DSP/latest/",
        note: "The real FFT used on the STM32 vibration node.",
      },
      {
        title: "FastAPI documentation",
        url: "https://fastapi.tiangolo.com/",
        note: "The backend framework.",
      },
    ],
  }

export default _phaemos
