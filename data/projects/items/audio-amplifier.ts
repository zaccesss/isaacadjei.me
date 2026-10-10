import type { Project } from "../index"

const _audio_amplifier: Project = {
    id: "audio-amplifier",
    title: "Two-Stage Audio Amplifier",
    description:
      "Analogue two-stage amplifier with a TL071 active band-pass filter and an OPA551 buffer, simulated in Proteus and built on a custom PCB that drives an 8 Ω speaker.",
    longDescription:
      "I designed and built a two-stage audio amplifier that takes the headphone output of a phone and drives an 8 Ω speaker from a single 9 V supply, with a passband covering the whole audible range. Stage 1 is a TL071 op-amp wired as an inverting summing active band-pass filter: it combines the left and right channels into mono, sets a gain of 10.67 dB and defines a passband from 6.63 Hz to 28.54 kHz. Stage 2 is an OPA551 unity-gain voltage follower that supplies the current the speaker needs without the first stage having to drive a low-impedance load.\n\nI took the design from hand calculations through Proteus simulation, a dual-supply breadboard, a single-supply breadboard with Vcc/2 biasing and finally a 65 mm x 40 mm PCB with a ground plane, mitred track corners and a clean design rule check. Only once both breadboard builds matched simulation did I move to PCB layout.\n\nThe assembled PCB measured 2.980 Vpp at the speaker against a 3 Vpp target, a 0.67% error. The measured gain stayed within 0.14 dB of the calculated value across every build. The full report, the build journal and the Proteus exports are in the repository, which is archived on Zenodo with a permanent DOI.",
    technologies: ["Proteus", "Analogue Design", "PCB Design", "Op-Amp", "Active Filters", "Electronics"],
    category: "hardware",
    featured: false,
    cover: "/images/projects/audio-amplifier/cover.webp",
    order: 1,
    status: "completed",
    images: [
      "/images/projects/audio-amplifier/pcb-angled.webp",
      "/images/projects/audio-amplifier/main.webp",
      "/images/projects/audio-amplifier/pcb-top.webp",
      "/images/projects/audio-amplifier/pcb-with-speaker.webp",
      "/images/projects/audio-amplifier/pcb-underside.webp",
      "/images/projects/audio-amplifier/block-diagram.webp",
      "/images/projects/audio-amplifier/breadboard-dual.webp",
      "/images/projects/audio-amplifier/breadboard-single.webp",
      "/images/projects/audio-amplifier/freq-response.webp",
      "/images/projects/audio-amplifier/scope-stage1.webp",
      "/images/projects/audio-amplifier/scope-stage2.webp",
      "/images/projects/audio-amplifier/pcb-layout-top.webp",
      "/images/projects/audio-amplifier/3d-model.webp",
      "/images/projects/audio-amplifier/schematic.webp",
    ],
    github: "https://github.com/zaccesss/two-stage-audio-amplifier",
    getInvolved: {},
    date: "2026",
    highlights: [
      "Two-stage design: TL071 inverting summing band-pass filter (Stage 1) and OPA551 unity-gain buffer (Stage 2)",
      "Gain 10.67 dB, passband 6.63 Hz to 28.54 kHz, output 2.980 Vpp into 8 Ω at a 281 mW design output power",
      "Single 9 V supply with Vcc/2 virtual ground biasing and AC coupling on the input and output",
      "1N4007 reverse polarity protection, a green LED power indicator and an on/off switch",
      "65 mm x 40 mm PCB laid out in Proteus with a ground plane, mitred corners and zero DRC errors",
      "Validated across Proteus simulation, dual-supply breadboard, single-supply breadboard and the PCB",
    ],
    links: [
      { label: "Zenodo DOI: 10.5281/zenodo.21903757", url: "https://doi.org/10.5281/zenodo.21903757" },
      { label: "Full technical report", url: "https://github.com/zaccesss/two-stage-audio-amplifier/blob/main/report/REPORT.md" },
      { label: "Build journal", url: "https://github.com/zaccesss/two-stage-audio-amplifier/blob/main/report/JOURNAL.md" },
    ],
    sections: [
      { type: "h2", text: "Why two stages" },
      {
        type: "p",
        text: "No single op-amp in the kit could do both jobs well. The TL071 has a JFET input, low noise and low distortion, which makes it a good filter and gain stage, but it can only source about 10 mA. An 8 Ω speaker at 3 Vpp needs far more than that. The OPA551 can deliver up to 200 mA continuously, so I split the design: the TL071 shapes and amplifies the signal and the OPA551 copies that voltage onto the speaker with the current to back it up.",
      },
      {
        type: "diagram",
        code: `flowchart LR
    PHONE["iPhone 14 Pro Max<br/>0.872 Vpp at 440 Hz"] --> J1["3.5 mm stereo jack"]
    J1 -- "left: C2 and R2" --> S1["Stage 1: TL071CP<br/>inverting summing band-pass<br/>10.67 dB, 6.63 Hz to 28.54 kHz"]
    J1 -- "right: C6 and R5" --> S1
    S1 --> S2["Stage 2: OPA551PA<br/>unity-gain follower"]
    S2 --> C8["C8 2200 µF<br/>output coupling"]
    C8 --> SPK["8 Ω speaker"]
    PWR["9 V PP3 or 12 V adapter"] --> PROT["SW1 switch, D3 reverse<br/>polarity diode, D1 LED"]
    PROT --> BIAS["R3 and R4 divider<br/>Vcc/2, about 4.5 V"]
    BIAS --> S1
    PROT --> S2`,
        caption: "Signal chain left to right, with power feeding both stages",
      },
      { type: "h2", text: "Characterising the source" },
      {
        type: "p",
        text: "Before designing anything I measured the phone. I played a 440 Hz tone (A4, a standard and repeatable test pitch) and recorded the output at all 16 volume steps. The maximum was 1.224 Vpp. I set the design input at 70% of that to leave headroom against clipping, a target of 0.857 Vpp. The volume steps are not linear, so the closest one was step 15 at 0.872 Vpp, a 1.77% error. That became the design input for every calculation that followed.",
      },
      { type: "h2", text: "Stage 1: the active band-pass filter" },
      {
        type: "p",
        text: "The left and right channels each pass through a 1 µF polyester film capacitor and a 24 kΩ resistor into the inverting input of the TL071, which sums them into mono. Matching the two 24 kΩ resistors gives both channels the same input impedance and the same gain. The 82 kΩ feedback resistor R1 sets the gain and the 68 pF capacitor C1 across it sets the upper cut-off.",
      },
      {
        type: "table",
        headers: ["Quantity", "Formula", "Result"],
        rows: [
          ["Midband gain", "R1 / R2 = 82 kΩ / 24 kΩ", "3.42 V/V, 10.67 dB"],
          ["Lower cut-off", "1 / (2π x R2 x C2), with 24 kΩ and 1 µF", "6.63 Hz"],
          ["Upper cut-off", "1 / (2π x R1 x C1), with 82 kΩ and 68 pF", "28.54 kHz"],
        ],
        caption: "Stage 1 design values",
      },
      {
        type: "p",
        text: "My original lower cut-off target was 5 Hz, which needed a 1.326 µF capacitor. Rounding to the nearest real value of 1 µF moved it to 6.63 Hz. That is still far below the 20 Hz limit of human hearing, but it taught me that capacitor tolerance (±20%) matters more to cut-off accuracy than resistor tolerance (±1%).",
      },
      { type: "h2", text: "Stage 2 and the single supply" },
      {
        type: "p",
        text: "The OPA551 is wired as a voltage follower, output tied straight to the inverting input, so it adds current gain and no voltage gain. Running everything from one battery meant creating a virtual ground: R3 and R4 (24 kΩ each) bias the TL071's non-inverting input to half the supply, about 4.5 V on 9 V, so the signal can swing symmetrically above and below it. The input capacitors block that bias from the phone and the 2200 µF output capacitor C8 blocks it from the speaker, where it would waste power and could damage the voice coil.",
      },
      {
        type: "p",
        text: "Decoupling uses 100 nF ceramics on each IC's supply pins and a 10 µF bulk capacitor at the OPA551 for its transient current demands. D3, a 1N4007 in series with the positive rail, blocks a reversed supply. D2, a second 1N4007 from the output to ground, clamps negative spikes to about -0.7 V. A green LED with a 3.3 kΩ resistor shows when the switch is on.",
      },
      { type: "h2", text: "Simulation and breadboards" },
      {
        type: "p",
        text: "I simulated both the dual-supply and single-supply versions in Proteus, exporting 501 points from each AC sweep to plot smooth curves against my measured data. In simulation an 8.2 Ω resistor stands in for the speaker, since Proteus does not model a real speaker's changing impedance. I then built Stage 1 on a breadboard with a ±9 V bench supply to check gain and bandwidth on their own, before adding the bias network and rebuilding the whole amplifier on a single 9 V supply.",
      },
      {
        type: "image",
        src: "/images/projects/audio-amplifier/freq-response.webp",
        alt: "Frequency response graph overlaying simulated curves with measured breadboard and PCB data points across the audio band",
        caption: "Simulated curves against measured data from the breadboards and the PCB",
      },
      {
        type: "callout",
        tone: "note",
        text: "The OPA551 SPICE model in Proteus does not simulate the Stage 2 output correctly in time-domain analysis at 440 Hz. The frequency-domain simulation and every measured result are unaffected, but it is why I trusted the bench over the simulator for Stage 2.",
      },
      { type: "h2", text: "PCB design and assembly" },
      {
        type: "p",
        text: "The 65 mm x 40 mm board follows the signal from left to right: the audio jack on the left edge, the two ICs in the middle with the TL071 before the OPA551 and the speaker output on the right. The 100 nF decoupling capacitors sit directly beside the supply pins, because every extra millimetre of track adds inductance that weakens them. Signal tracks are 0.762 mm and power tracks 1.016 mm, junctions use mitred corners instead of 90 degree bends and the bottom layer is a copper pour ground plane. The design rule check returned no errors.",
      },
      {
        type: "image",
        src: "/images/projects/audio-amplifier/pcb-with-speaker.webp",
        alt: "The assembled purple PCB on an acrylic baseplate connected to an 8 ohm speaker",
        caption: "The finished board driving the speaker",
      },
      {
        type: "p",
        text: "I brought the board up in steps. With no ICs fitted, a multimeter confirmed the 4.5 V virtual ground at the TL071's input. I then fitted the TL071 and swept Stage 1 from 1 Hz to 100 kHz, fitted the OPA551 without a load and checked for a clean 3 Vpp at 440 Hz, then connected the 8.2 Ω load and swept again. Both ICs sit in DIP sockets and the board is mounted on a 3 mm acrylic baseplate with M3 nylon standoffs.",
      },
      { type: "h2", text: "Measured results" },
      {
        type: "table",
        headers: ["Parameter", "Calculated", "Simulated", "Dual-supply breadboard", "Single-supply breadboard", "PCB Stage 1", "PCB Stage 2"],
        rows: [
          ["Gain (dB)", "10.67", "10.67", "~10.58", "~10.81", "~10.73", "10.67"],
          ["Lower cut-off (Hz)", "6.63", "6.60", "~7.2", "~6.8", "~6.9", "~13.2"],
          ["Upper cut-off (kHz)", "28.54", "27.7", "~26.0", "~27.1", "~29.5", "~30.0"],
        ],
        caption: "Calculated, simulated and measured performance across every build",
      },
      {
        type: "table",
        headers: ["Stage", "Input", "Output", "Gain"],
        rows: [
          ["Stage 1 (TL071)", "0.868 Vpp", "3.000 Vpp", "10.77 dB"],
          ["Stage 2 (OPA551)", "0.872 Vpp", "2.980 Vpp", "10.67 dB"],
        ],
        caption: "PCB measurements at 440 Hz on a Tektronix TBS1052C",
      },
      {
        type: "p",
        text: "The gain held within 0.14 dB of the calculated value in every configuration and the Stage 2 output landed within 0.67% of the 3 Vpp target. The Stage 2 lower cut-off of about 13.2 Hz is higher than designed because C8 and the 8.2 Ω load add another high-pass pole, which is still below the range anyone can hear. The small upward shift in the upper cut-off is consistent with C1 sitting at the low end of its tolerance. Every waveform at 440 Hz was a clean sinusoid and the final assembly played an audible tone from the phone at 70% volume.",
      },
      { type: "h2", text: "What I would do differently" },
      {
        type: "ul",
        items: [
          "Replace the screw terminal with a DC barrel jack that takes both a 12 V adapter and a 9 V battery clip, removing the risk of a reversed connection",
          "Design a proper enclosure with a speaker grille from the start",
          "Apply conformal coating to the finished PCB for moisture resistance",
          "Swap the 3.5 mm jack for a Bluetooth receiver module so the amplifier is genuinely portable",
        ],
      },
    ],
    references: [
      { title: "TL071 JFET-input operational amplifier datasheet (Texas Instruments)", url: "https://www.ti.com/lit/ds/symlink/tl071.pdf", note: "Stage 1 op-amp: gain-bandwidth, slew rate, noise and output current" },
      { title: "OPA551 high-voltage, high-current operational amplifier datasheet (Texas Instruments)", url: "https://www.ti.com/lit/ds/symlink/opa551.pdf", note: "Stage 2 buffer: the 200 mA output current that drives the speaker" },
      { title: "Handbook of Operational Amplifier Active RC Networks (TI SBOA093A)", url: "https://www.ti.com/lit/an/sboa093a/sboa093a.pdf", note: "Reference for active RC filter networks, including band-pass designs" },
      { title: "Handbook of Operational Amplifier Applications (TI SBOA092B)", url: "https://www.ti.com/lit/an/sboa092b/sboa092b.pdf", note: "Cited in the report for combining a signal stage with a current stage" },
      { title: "Single-Supply Op Amp Design Techniques (TI SLOA030)", url: "https://www.ti.com/lit/an/sloa030/sloa030.pdf", note: "Biasing op-amps around a mid-supply reference, the basis of the Vcc/2 virtual ground" },
    ],
  }

export default _audio_amplifier
