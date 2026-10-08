import type { Project } from "../index"

const _melophos: Project = {
    id: "melophos",
    title: "MELOPHOS: Light-Guided Instrument Learning",
    description:
      "An open instrument learning platform: a hub that lights the next notes above a keyboard or along a fretboard, scores what is played and keeps practice data on your own server. Early stage, with a working browser Studio for melody practice.",
    longDescription:
      "MELOPHOS (pronounced MEL-oh-fos, from the Greek for song and light) is a light-guided practice system I am designing. A small hub reads notes from an instrument over USB-MIDI, Bluetooth MIDI, a MIDI jack or an audio input, lights the notes to play on LED bars sized to real key spacing and logs every note against a practice session. The tagline is song made visible.\n\nLight-up keyboards already exist, but the ones I found were locked to one brand's app, one instrument and a subscription. MELOPHOS is built around instrument profiles, so a 61, 76 or 88 key keyboard or a guitar is a configuration change rather than a rebuild. The server is self-hosted with one Docker Compose command, so practice history stays on hardware you own.\n\nIt is early. The monorepo scaffold is in place for every component and the browser Studio already runs melody practice, with a simulated player standing in for a real performer. The first hub board and LED bars are in design in KiCad, with a working piano version targeted for December 2026.",
    technologies: [
      "TypeScript",
      "Vite",
      "Web MIDI API",
      "Rust",
      "WebAssembly",
      "PyO3",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "TimescaleDB",
      "MQTT",
      "ESP32-S3",
      "C++",
      "PlatformIO",
      "FastLED",
      "KiCad",
      "Docker",
    ],
    category: "iot",
    featured: false,
    images: [
      "/images/projects/melophos/studio-playing.webp",
      "/images/projects/melophos/studio.webp",
      "/images/projects/melophos/studio-summary.webp",
      "/images/projects/melophos/social-preview.webp",
      "/images/projects/melophos/linkedin-cover.webp",
    ],
    github: "https://github.com/melophos/melophos",
    website: "https://melophos.com",
    getInvolved: { discussions: true, roadmap: "https://github.com/orgs/melophos/projects/1" },
    date: "2026",
    highlights: [
      "Browser Studio with melody practice: an amber light shows the next note with the two after it dimmed, each note is checked for pitch and timing and a summary reports accuracy, timing and best streak",
      "A Play demo button runs a song with a simulated player that drives the same scoring logic as a real MIDI keyboard",
      "Rust scoring engine that matches each expected note with the closest press inside a 150 ms window and counts hits, misses and wrong notes",
      "Instrument profiles with a JSON schema for 61, 76 and 88 key keyboards and a six-string guitar, shared by every component",
      "Hub firmware scaffold for the ESP32-S3 with a 31250 baud MIDI input, a lock-free note bus and FastLED rendering, tested on the host",
      "Monorepo of eight components, each published to its own read-only repository, with software under AGPL-3.0 and hardware under CERN-OHL-S-2.0",
    ],
    cover: "/images/projects/melophos/cover-studio.webp",
    order: 5,
    status: "in-progress",
    links: [
      { label: "MELOPHOS on GitHub", url: "https://github.com/melophos" },
      { label: "Roadmap", url: "https://github.com/melophos/melophos/blob/main/docs/roadmap.md" },
      { label: "Documentation", url: "https://github.com/melophos/melophos/tree/main/docs" },
    ],
    sections: [
      {
        type: "clip",
        src: "/videos/projects/melophos/practice.mp4",
        poster: "/videos/projects/melophos/practice.webp",
        alt: "The MELOPHOS Studio playing Ode to Joy with a simulated player: an amber light above the on-screen keyboard moves to each next note and a line below reports whether each note was right and how many milliseconds early or late it landed.",
        caption: "Melody practice in the Studio, driven by the simulated player.",
      },
      {
        type: "callout",
        tone: "note",
        text: "MELOPHOS is in early development. Everything shown here runs in the browser with a simulated player or a MIDI keyboard. The hub hardware is still in design.",
      },
      { type: "h2", text: "What it is for" },
      {
        type: "p",
        text: "Learning a piece means finding the right key at the right time. A light right where your hands are, on a single flat line above the keys, removes most of the searching. I made accessibility a design goal from the start rather than a feature added later: the lights sit in one plane right where the hands are and the whole system works with instruments people already own.",
      },
      {
        type: "p",
        text: "Three practice modes are planned. Melody waits for the right note, Rhythm holds a set tempo and Listen plays the piece through. Later versions add remote lessons where a teacher's playing lights up a student's instrument over WebRTC, song import from audio and room lighting through WLED and Home Assistant.",
      },
      { type: "h2", text: "Architecture" },
      {
        type: "p",
        text: "The system has four main parts. The hub sits beside the instrument and drives the lights. The server stores sessions and handles slow work such as importing songs. The Studio is a browser app for practice, the song library and hub setup. The scoring engine is shared between them so a performance gets the same score everywhere.",
      },
      {
        type: "diagram",
        code: `flowchart LR
    subgraph HUB["Hub on ESP32-S3"]
        IN["Inputs"] --> BUS["Note bus<br/>ring buffer"]
        BUS --> RENDER["LED renderer<br/>FastLED"]
        BUS --> REC["Session recorder"]
    end
    INST["Keyboard or guitar"] -- "USB-MIDI, Bluetooth MIDI,<br/>MIDI jack or audio" --> IN
    RENDER --> BARS["LED bars<br/>keys and frets"]
    REC -- "MQTT" --> SRV["Server<br/>FastAPI"]
    SRV --> DB[("Postgres with<br/>TimescaleDB")]
    CORE["Scoring engine<br/>Rust crate"] -- "PyO3 module" --> SRV
    CORE -- "WebAssembly" --> STUDIO["Studio<br/>browser app"]
    STUDIO <-- "HTTPS and WebSocket" --> SRV
    INST -. "Web MIDI" .-> STUDIO`,
        caption: "The design the scaffold grows into. The PyO3 and WebAssembly builds of the scoring engine are still to come.",
      },
      {
        type: "p",
        text: "The hub is an ESP32-S3 because it is the one widely available chip with a USB host port to read and power a keyboard, Bluetooth LE for Bluetooth MIDI and Wi-Fi for the server, plus enough RAM for a full song. Each input runs on its own and pushes note events onto one lock-free ring buffer, so a slow input never blocks the lights. The renderer maps notes to LEDs through the instrument profile and drives WS2812B bars with FastLED, which uses the chip's RMT peripheral for the timing. A session starts on the first note and ends after two minutes of silence.",
      },
      {
        type: "p",
        text: "The server is FastAPI with Postgres and TimescaleDB. Note events live in a hypertable because one session can produce thousands of rows. Hubs publish to Mosquitto on per-device topics in batches every 250 ms. Redis and a worker handle slow imports away from the request path and MinIO stores recordings and imported files.",
      },
      { type: "h2", text: "The Studio and melody practice" },
      {
        type: "p",
        text: "The Studio is the first piece people can use. It is a static TypeScript app built with Vite that talks to a keyboard directly through the Web MIDI API, so plain practice needs no server at all. Pick a song and a light strip above the on-screen keyboard shows the next note in amber, with the two after it glowing dimly, the same way the hub's LEDs will. Each played note is checked for pitch and for how far from the beat it landed. A wrong note is marked while the light waits on the right one, as a teacher would.",
      },
      {
        type: "image",
        src: "/images/projects/melophos/studio-playing.webp",
        alt: "The Studio mid-song on Ode to Joy at 100 beats a minute, showing E4 as the next note, note 12 of 30, with an amber key lit and the message D4 right, 88 ms late.",
        caption: "Mid-song: the next note, progress through the piece and timing feedback on the last note.",
      },
      {
        type: "p",
        text: "I kept the practice logic pure, with no knowledge of where notes come from. The on-screen keyboard, the demo player and a real MIDI device all call the same play function with a note and a timestamp. That is what made the Play demo button cheap to build and honest to show: the simulated player goes through exactly the scoring a real performance would, including a deliberate slip now and then.",
      },
      {
        type: "code",
        lang: "typescript",
        text: `play(note: number, atMs: number): Result | null {
  if (this.finished) return null
  if (this.startedAt === null) this.startedAt = atMs
  const expected = this.song.notes[this.index]!.note
  const offsetMs = Math.round(atMs - this.startedAt - this.expectedTimeMs(this.index))
  const result = { expected, played: note, correct: note === expected, offsetMs }
  this.results.push(result)
  // a wrong note is marked and the guide waits on the same note
  if (result.correct) this.index += 1
  return result
}`,
      },
      {
        type: "image",
        src: "/images/projects/melophos/studio-summary.webp",
        alt: "The Studio practice summary after a demo run of Ode to Joy: 97% accuracy, 30 of 31 notes right, 43 ms average from the beat and a best streak of 20 notes.",
        caption: "The summary after the last note: accuracy, average timing and best streak.",
      },
      {
        type: "p",
        text: "Three public-domain pieces ship with it: Ode to Joy, Twinkle, Twinkle, Little Star and a C major scale. Web MIDI works in Chrome, Edge and desktop Firefox 108 and later. Safari and Firefox for Android cannot reach MIDI devices, so the Studio checks for Web MIDI support before it asks for access.",
      },
      { type: "h2", text: "The scoring engine" },
      {
        type: "p",
        text: "The Studio's live scoring follows one note at a time. For a whole stored performance I wrote a Rust crate that matches each expected note with the closest unused press of the same pitch inside a timing window, 150 ms by default, then counts what is left as misses and wrong notes. Wrong presses count against accuracy so mashing every key cannot score 100%. The plan is to compile this one crate to WebAssembly for the Studio and to a Python module through PyO3 for the server, so the same performance gets the same score in both places. Tempo tracking with dynamic time warping comes next, so a steady but slower performance is not scored as late.",
      },
      { type: "h2", text: "Where it stands" },
      {
        type: "table",
        headers: ["Component", "Built so far", "Still to come"],
        rows: [
          ["Studio", "Melody practice, Play demo, Web MIDI keyboard view and profiles", "Web Bluetooth, song library and progress views"],
          ["Scoring engine", "The Rust score function and its tests", "WebAssembly and PyO3 bindings, tempo tracking"],
          ["Hub firmware", "MIDI jack input, note bus, FastLED bars and session capture", "USB-MIDI host, Bluetooth MIDI, audio input and MQTT"],
          ["Server", "Health check, sessions API with summaries, MQTT topic validation", "Postgres storage, MQTT subscriber and WebSocket feed"],
          ["Hardware", "Hub board and octave LED bar rev A in design in KiCad 9, power budget and draft bill of materials", "First boards manufactured, enclosure and mounting rail"],
        ],
        caption: "Status from the project's architecture notes and roadmap.",
      },
      {
        type: "image",
        src: "/images/projects/melophos/social-preview.webp",
        alt: "The MELOPHOS social preview card with the wordmark and the tagline song made visible.",
        caption: "The MELOPHOS brand, named the same way as its sister project PHAEMOS.",
      },
    ],
    references: [
      {
        title: "Web MIDI API (MDN)",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API",
        note: "How the Studio reads a keyboard in the browser, with browser support.",
      },
      {
        title: "MIDI 1.0 Core Specifications (MIDI Association)",
        url: "https://midi.org/midi-1-0-core-specifications",
        note: "The note on and note off messages every input is built around. It also defines the 31250 baud serial MIDI the hub's jack input reads.",
      },
      {
        title: "WS2812B datasheet",
        url: "https://cdn-shop.adafruit.com/datasheets/WS2812B.pdf",
        note: "The addressable LEDs on the key and fret bars.",
      },
      {
        title: "FastLED",
        url: "https://github.com/FastLED/FastLED",
        note: "The LED library the hub's renderer uses.",
      },
      {
        title: "ESP32-S3 Series datasheet (Espressif)",
        url: "https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf",
        note: "The hub's microcontroller, chosen for its USB host, Bluetooth LE and Wi-Fi.",
      },
      {
        title: "PyO3 user guide",
        url: "https://pyo3.rs/",
        note: "How the Rust scoring engine will be exposed to the Python server.",
      },
    ],
  }

export default _melophos
