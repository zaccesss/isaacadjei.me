import type { Project } from "../index"

const _lidarsat: Project = {
    id: "lidarsat",
    title: "LidarSAT: GPS-Denied Drone Navigation",
    description:
      "A four-person research project on locating a drone without GPS by matching LiDAR height profiles to public terrain maps, comparing a classic matcher with a learned one. I own the repository and tooling, error measurement and the drone side, from simulated flights to flight logs.",
    longDescription:
      "GPS can be jammed, spoofed or blocked. A drone without it only knows roughly how it has moved since take-off and that estimate drifts further every second. LidarSAT tests terrain-referenced navigation instead: a downward LiDAR measures the shape of the ground under the drone and that height profile is searched for on a very accurate public height map. The map data is the Environment Agency National LIDAR Programme, which covers England at one height value per square metre.\n\nThe research compares two ways of doing the matching on the same data. A classic template matcher follows the approach of a published winning system from the SPRIN-D challenge. A small neural network is trained only on readings from our own simulator. Three questions drive the work: whether the learned matcher beats the classic one, how much accuracy a cheap single-point LiDAR loses against a scanning one and whether a system trained in simulation still works on real flight data from a low-cost drone.\n\nIt is a team project of four under the ENGINERDS organisation, run in one-week cycles over about 20 weeks. I own the repository and its tooling, the flight path generator, error measurement, the drone build and its flight logs. My first milestone was a simulated drone flying a measured mission and producing a log the rest of the pipeline can read.",
    technologies: [
      "Python",
      "ArduPilot",
      "SITL",
      "pymavlink",
      "MAVLink",
      "NumPy",
      "rasterio",
      "uv",
      "pytest",
      "Ruff",
      "GitHub Actions",
      "Ubuntu",
      "UTM",
    ],
    github: "https://github.com/ENGNERDS",
    category: "other",
    featured: false,
    images: [
      "/images/projects/lidarsat/flight-dark.webp",
      "/images/projects/lidarsat/flight-light.webp",
      "/images/projects/lidarsat/sitl-build.webp",
      "/images/projects/lidarsat/sitl-configure.webp",
    ],
    date: "2026",
    highlights: [
      "Simulated ArduPilot Copter mission: a 200 m square at 30 m altitude and 10 m/s, holding 30.0 m on every leg and landing with 63% battery",
      "Built ArduPilot Copter 4.7.1 SITL natively on an Ubuntu ARM64 virtual machine on Apple silicon, with the full setup written up as a guide",
      "Troubleshooting log of 29 real problems with the exact error text and the fix for each, three of them bugs in the mission script's own MAVLink handling",
      "Log trimming that cuts a 13 MB ArduPilot log to 366 KB while keeping every GPS, barometer, attitude and mode record the pipeline needs",
      "Repository tooling: uv lock file, Ruff and pytest in CI, pre-commit, CODEOWNERS by area, Gitleaks scanning and each folder published to its own read-only repository",
      "Team workflow: Linear cycles mirrored to GitHub issues and milestones, shared labels, a project board and Discord feeds with slash commands",
    ],
    cover: "/images/projects/lidarsat/cover-build-log.webp",
    order: 6,
    status: "research",
    links: [
      { label: "SPRIN-D baseline paper", url: "https://arxiv.org/abs/2510.01348" },
    ],
    team: [
      { name: "Louis Mensah", github: "Louisomeg", role: "Project lead: issues, code review and key decisions" },
      { name: "Isaac Adjei", github: "zaccesss", role: "Repository and tooling, flight path generator, error measurement, drone build and flight logs" },
      { name: "Emmanuel Ofori Mensah", github: "mannycodes20", role: "Data pipeline, the prior height map and project docs, later the particle filter" },
      { name: "Emmanuel Boachie", github: "EB-Glitch08", role: "Simulator, classic matcher and learned matcher" },
    ],
    sections: [
      {
        type: "image",
        src: "/images/projects/lidarsat/flight-dark.webp",
        alt: "Three plots of a simulated flight. Left: the flown path seen from above, a near-perfect 200 m square with take-off and landing at the origin. Top right: altitude above home climbing to 30 m, holding for about 95 seconds and descending to land. Bottom right: ground speed reaching 10 m/s on each of the four legs with a dip to near zero at each corner.",
        caption: "The LID-23 mission in ArduPilot SITL: a 200 m square flown at 30 m altitude and 10 m/s, plotted from the flight log.",
      },
      { type: "h2", text: "The idea" },
      {
        type: "p",
        text: "One measurement works like this. The drone flies at a known height, say 30 m above take-off. The LiDAR pointing down reads 22 m to whatever is below, so the surface there is 8 m high, which could be a house. As the drone flies on, those heights form a profile, a fingerprint of the ground. The system searches the map for the place where the same fingerprint appears, then a particle filter tracks that position over time.",
      },
      {
        type: "diagram",
        code: `flowchart LR
    EA["Environment Agency<br/>National LIDAR Programme"] --> DATA["Data pipeline<br/>height map tiles"]
    DATA --> SIM["Simulator<br/>synthetic LiDAR readings"]
    SIM --> CLASSIC["Classic matcher<br/>template matching"]
    SIM --> LEARNED["Learned matcher<br/>small neural network"]
    DRONE["Drone flight logs<br/>GPS as ground truth"] --> CLASSIC
    DRONE --> LEARNED
    CLASSIC -- "heat map" --> PF["Particle filter<br/>position over time"]
    LEARNED -- "heat map" --> PF
    PF --> EVAL["Evaluation<br/>error against ground truth"]
    DRONE --> EVAL`,
        caption: "The research pipeline. The two matchers share one input and output format, so they can be swapped and compared fairly.",
      },
      {
        type: "p",
        text: "The classic matcher slides a measurement over the map and scores every position, producing a heat map of where the drone probably is. The learned matcher has the same input and output but learns which ground features are stable, such as building edges and hills. It also learns which are not, such as tree tops and parked cars. The simulator adds noise, beam width, missing readings and drift, randomised per sample, so the network learns to ignore them. Version 1 deliberately leaves out obstacle avoidance and on-board inference: flights are recorded and processed on a laptop afterwards.",
      },
      { type: "h2", text: "My part: from a simulated flight to a usable log" },
      {
        type: "p",
        text: "The software never waits for the drone. If parts arrive late or a flight goes wrong, the research still moves in simulation. My first job on the drone side was to prove the whole path from a flight to numbers on a laptop before any hardware exists, using ArduPilot's software-in-the-loop simulator. The real drone will run the same ArduPilot firmware, so everything learned here carries over.",
      },
      {
        type: "image",
        src: "/images/projects/lidarsat/sitl-build.webp",
        alt: "A terminal showing the last ArduCopter source files compiling, the build summary for bin/arducopter and the message that the copter build finished successfully in 1 minute 30 seconds.",
        caption: "ArduPilot Copter 4.7.1 SITL building natively on an ARM64 Ubuntu virtual machine in 1 minute 30 seconds.",
      },
      {
        type: "p",
        text: "I ran ArduPilot at the stable Copter 4.7.1 tag on an Ubuntu ARM64 virtual machine in UTM on an Apple silicon Mac, with 8 GB of memory and 4 cores. SITL builds natively on ARM64, so nothing is emulated. The mission itself is a Python script using pymavlink. It waits for a GPS fix, arms, takes off to 30 m, flies four 200 m legs (north, east, south, then west back to the start) and lands, with a battery floor and a timeout on each leg so a stuck flight lands instead of hovering until the battery is empty.",
      },
      {
        type: "diagram",
        code: `flowchart TD
    VM["Ubuntu ARM64 VM<br/>ArduPilot SITL Copter 4.7.1"] --> MISSION["Mission script<br/>pymavlink over TCP 5760"]
    MISSION --> BIN["ArduPilot flight log<br/>about 13 MB"]
    BIN --> TRIM["Trim the log<br/>GPS, BARO, ATT, MODE, MSG, POS"]
    TRIM --> SMALL["Trimmed log<br/>366 KB, kept out of Git"]
    SMALL --> READ["Log reader<br/>NumPy arrays and plots"]
    READ --> CHECK["Check the mission<br/>square size and height"]
    READ --> EVAL["Error measurement<br/>estimate against GPS"]`,
        caption: "My flight-log workflow, from the simulator to the evaluation stage.",
      },
      {
        type: "table",
        headers: ["Check", "Result"],
        rows: [
          ["GPS fix", "Type 6 with 10 satellites"],
          ["Height held", "30.0 m on every leg"],
          ["Ground speed", "10 m/s on each leg"],
          ["GPS track span", "201.7 m north to south, 201.9 m east to west"],
          ["Barometer height", "-0.2 m to 30.2 m"],
          ["Records in the log", "900 GPS, 3,600 barometer, 1,800 attitude and 3 mode changes"],
          ["Battery", "100% at start, 63% after landing"],
        ],
        caption: "The verified run that produced the mission log.",
      },
      {
        type: "p",
        text: "A full ArduPilot log is about 13 MB because it records hundreds of message types. The pipeline only needs a few, so I wrote a trimming script that keeps the GPS, barometer, attitude, mode, message and position records plus the format records needed to decode them. The trimmed file is 366 KB and gave exactly the same record counts and GPS and height ranges as the original when read back with pymavlink. Raw logs never go into Git. A log reader that turns these records into NumPy arrays with a height plot and a path plot is in review.",
      },
      {
        type: "image",
        src: "/images/projects/lidarsat/flight-light.webp",
        alt: "The same three flight plots on a light background: the square path from above, altitude above home and ground speed against time.",
        caption: "The same mission plotted for light backgrounds.",
      },
      { type: "h3", text: "What went wrong along the way" },
      {
        type: "p",
        text: "I logged every problem with its exact error text and fix, 29 in total, so the next person needs about 30 minutes instead of a day. A few were worth more than the rest. ArduPilot only sends a heartbeat to a new connection, so a bare pymavlink script has to request the other data streams itself or every wait times out. Reading one message per loop fell further and further behind, so the script acted on positions that were minutes old until it drained the queue and used the newest message. Setting the old waypoint speed parameter silently did nothing on 4.7.1, which names it WP_SPD. The flight only looked right because 10 m/s was already the default.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "A parameter set from a script that the firmware does not recognise produces no error at all. Read the parameter back after setting it.",
      },
      {
        type: "image",
        src: "/images/projects/lidarsat/sitl-configure.webp",
        alt: "A terminal running waf configure for the SITL board, listing compiler checks and build options before the configure step finishes successfully.",
        caption: "Configuring the SITL build.",
      },
      { type: "h2", text: "Error measurement" },
      {
        type: "p",
        text: "Evaluation is the end of the pipeline. It compares an estimated path with ground truth, which on early flights is GPS kept switched on. The first function measures the straight-line error between an estimate and the truth in map metres and is tested with a normal case, an edge case and an error case. The planned tools report error over a whole path including the worst 5%, plot paths over the height map and produce the numbers behind each research question.",
      },
      { type: "h2", text: "Repository and team tooling" },
      {
        type: "p",
        text: "I set up the repository so four people could work in it from day one: a uv lock file, Ruff and pytest in CI with pre-commit locally, Dependabot, Gitleaks scanning, issue and pull request templates and CODEOWNERS that request review from whoever owns a folder. Each top-level folder is also published to its own read-only repository on every merge. Setup guides cover macOS, Linux and Windows, with troubleshooting pages for Python, Git, CI and the planning tools.",
      },
      {
        type: "ul",
        items: [
          "Weekly Linear cycles, each issue with a goal, a check anyone can run, what to show in the meeting and what to learn first.",
          "Every Linear issue has a GitHub twin with matching status, cycle and assignee, plus shared labels for area, kind, phase, priority and status.",
          "A GitHub project board with table, board and roadmap views plus milestones for each cycle.",
          "A Discord server with feeds for GitHub and Linear activity, a relay for announcements and slash commands for the team.",
        ],
      },
      { type: "h2", text: "What is next" },
      {
        type: "p",
        text: "The next phases run the classic matcher over full simulated flights to get the first error numbers, which then decide the drone's hardware, most likely a cheap single-point LiDAR. After that the learned matcher trains, the drone is built and flown by hand with GPS on as a data recorder and both matchers run on real flight logs.",
      },
    ],
    references: [
      {
        title: "Kilometer-Scale GNSS-Denied UAV Navigation via Heightmap Gradients: A Winning System from the SPRIN-D Challenge",
        url: "https://arxiv.org/abs/2510.01348",
        note: "The closest existing system. Our classic baseline follows its approach.",
      },
      {
        title: "Environment Agency National LIDAR Programme",
        url: "https://environment.data.gov.uk/dataset/2e8d0733-4f43-48b4-9e51-631c25d1b0a9",
        note: "The height map data for England, free under the Open Government Licence.",
      },
      {
        title: "ArduPilot SITL simulator (software in the loop)",
        url: "https://ardupilot.org/dev/docs/sitl-simulator-software-in-the-loop.html",
        note: "The simulated drone the mission flies on.",
      },
      {
        title: "pymavlink (MAVLink Python library)",
        url: "https://mavlink.io/en/mavgen_python/",
        note: "How the mission script talks to the autopilot and how the logs are read.",
      },
    ],
  }

export default _lidarsat
