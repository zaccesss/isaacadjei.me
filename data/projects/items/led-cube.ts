import type { Project } from "../index"

const _led_cube: Project = {
    id: "led-cube",
    title: "4x4x4 NeoPixel LED Cube",
    description:
      "64 individually addressable WS2812B LEDs on an Arduino Uno with adaptive brightness, four animation modes and a custom wooden enclosure.",
    longDescription:
      "I designed and built a 4x4x4 interactive LED display that combines hand construction with embedded firmware. The cube holds 64 WS2812B NeoPixel LEDs soldered onto a copper wire frame, built layer by layer on a jig so the spacing and alignment stay consistent. Every layer was tested on its own before stacking and the finished frame sits in a custom wooden enclosure with access for USB programming and power.\n\nAn Arduino Uno (ATmega328P at 16 MHz) drives all 64 LEDs from one data pin. It runs four animations (Colour Wipe, Smooth RGB Fade, Fire Effect and Rainbow Cycle), reads an LDR to dim the cube in bright rooms and responds to a power button and a mode button with buzzer feedback. Live diagnostics stream over serial at 9600 baud.\n\nIt was an academic engineering project where I was the lead developer for a team called NeoPixel Innovators. The repository carries the full documentation, an FAQ, the hardware and software guides and the project paperwork (Gantt chart, budget and market analysis). It is archived on Zenodo with a permanent DOI.",
    technologies: ["Arduino", "C++", "WS2812B", "Adafruit NeoPixel", "Embedded Systems", "Electronics"],
    category: "embedded",
    featured: false,
    cover: "/images/projects/led-cube/cover-enclosure.webp",
    order: 2,
    status: "completed",
    images: [
      "/images/projects/led-cube/neopixel-main.webp",
      "/images/projects/led-cube/cube-lit-2.webp",
      "/images/projects/led-cube/final-setup.webp",
      "/images/projects/led-cube/build-layer.webp",
      "/images/projects/led-cube/frame-angle.webp",
      "/images/projects/led-cube/internals-1.webp",
      "/images/projects/led-cube/internals-2.webp",
      "/images/projects/led-cube/power-circuit.webp",
      "/images/projects/led-cube/build-lit.webp",
      "/images/projects/led-cube/main.webp",
    ],
    github: "https://github.com/zaccesss/neopixel-led-cube",
    getInvolved: {},
    video: "/Media/neopixel-description.mp4",
    videoCaption: "A narrated walkthrough of the four lighting modes and the light sensor adjusting the brightness",
    date: "2025",
    highlights: [
      "64 WS2812B LEDs hand-soldered onto a copper wire frame, built and tested one 16-LED layer at a time",
      "Four animation modes: Colour Wipe, Smooth RGB Fade, a heat-diffusion Fire Effect and Rainbow Cycle",
      "LDR adaptive brightness maps a 10-bit light reading (0 to 1023) inversely to LED brightness (255 down to 20)",
      "Edge-detected, debounced power and mode buttons with buzzer confirmation on every power toggle",
      "1000 µF capacitor across the 5 V rail absorbs inrush when many LEDs change at once",
      "Live serial diagnostics at 9600 baud: power state, active pattern, raw LDR value and mapped brightness",
    ],
    links: [
      { label: "Zenodo DOI: 10.5281/zenodo.21903764", url: "https://doi.org/10.5281/zenodo.21903764" },
      { label: "Full technical documentation", url: "https://github.com/zaccesss/neopixel-led-cube/blob/main/DOCUMENTATION.md" },
      { label: "Arduino sketch", url: "https://github.com/zaccesss/neopixel-led-cube/blob/main/software/neopixel_cube/neopixel_cube.ino" },
    ],
    sections: [
      {
        type: "clip",
        src: "/videos/projects/led-cube/demo.mp4",
        poster: "/videos/projects/led-cube/demo.webp",
        alt: "The finished LED cube in its wooden enclosure cycling through its colour wipe, RGB fade, fire and rainbow animations",
        caption: "The cube running through its four animation modes",
      },
      { type: "h2", text: "How it fits together" },
      {
        type: "p",
        text: "Every LED in the cube sits on one data chain. The Arduino sends colour data out of pin D6 into the first LED and each WS2812B passes the rest of the stream on to the next, so 64 LEDs need only one signal wire. The data-out pad of each layer joins the data-in pad of the layer above, which turns four separate 16-LED grids into one continuous strip as far as the firmware is concerned.",
      },
      {
        type: "diagram",
        code: `flowchart LR
    PSU["5 V DC supply<br/>2 A minimum"] --> CAP["1000 µF capacitor<br/>across 5 V and GND"]
    CAP --> LEDS["64 WS2812B LEDs<br/>4 layers of 16"]
    PSU --> UNO["Arduino Uno<br/>ATmega328P"]
    UNO -- "D6 data" --> LEDS
    PWR["Power button"] -- "D2" --> UNO
    MODE["Mode button"] -- "D3" --> UNO
    LDR["LDR and 10 kΩ divider"] -- "A0" --> UNO
    UNO -- "D4" --> BUZ["Active buzzer"]
    UNO -- "USB serial, 9600 baud" --> MON["Serial Monitor"]`,
        caption: "Power and signal flow: the LEDs take 5 V straight from the supply while the Uno drives the single data line",
      },
      {
        type: "table",
        headers: ["Pin", "Component", "Role"],
        rows: [
          ["D2", "Power button", "Toggles the whole system on and off"],
          ["D3", "Mode button", "Steps through the four patterns, only while the cube is on"],
          ["D4", "Active buzzer", "Beeps on every power toggle"],
          ["D6", "NeoPixel data", "Single-wire data line into the first LED, kept short"],
          ["A0", "LDR", "Voltage divider with a 10 kΩ resistor for ambient light"],
        ],
        caption: "Pin mapping on the Arduino Uno",
      },
      { type: "h3", text: "Power" },
      {
        type: "p",
        text: "Power was the part I had to plan rather than guess. A WS2812B can draw about 60 mA at full white, so 64 of them could pull roughly 3.8 A in the worst case. In normal mixed-colour use the cube draws closer to 1.5 to 2 A. The LEDs take 5 V directly from the supply, the Arduino and the LED rail share a common ground (without it the data signal is unreadable) and a 1000 µF electrolytic capacitor sits across 5 V and GND as close to the first LED as possible to soak up the current spikes when many LEDs switch at once.",
      },
      { type: "h2", text: "The build" },
      {
        type: "p",
        text: "The physical build was the most demanding part of the project. Soldering 64 LEDs onto a three-dimensional copper frame while keeping every LED facing outward and every joint solid meant building a jig from a drilled wooden block before any soldering started. I soldered one 4x4 layer at a time, checking polarity and data direction on every LED, then powered that layer alone with a test sketch to confirm all 16 LEDs responded before moving on. Catching a bad joint at layer level is easy. Finding it inside a finished cube is not.",
      },
      {
        type: "image",
        src: "/images/projects/led-cube/build-layer.webp",
        alt: "One 4x4 layer of WS2812B LEDs soldered onto copper wire, viewed from above",
        caption: "A single layer on the jig before stacking",
      },
      {
        type: "p",
        text: "With the four layers stacked and chained, the Arduino and breadboard went into the base of the wooden enclosure. I measured and cut the enclosure around the finished frame with clearance for heat and drilled the front panel for the power button, the mode button and a window for the LDR.",
      },
      {
        type: "image",
        src: "/images/projects/led-cube/internals-1.webp",
        alt: "Inside the enclosure: the Arduino Uno and breadboard wired to the buttons, buzzer and LDR",
        caption: "The Uno and breadboard inside the enclosure base",
      },
      { type: "h2", text: "Firmware" },
      {
        type: "p",
        text: "The sketch uses the Adafruit NeoPixel library and a single loop. Each pass reads both buttons and looks for a press edge, reads the LDR, sets the brightness, draws one frame of the active pattern and prints the readings over serial. Every pattern keeps its own position in static variables and draws only one frame per call, so control returns to the loop between frames and a button press is picked up straight away.",
      },
      {
        type: "diagram",
        code: `stateDiagram-v2
    [*] --> Off
    Off --> On: power button
    On --> Off: power button, LEDs cleared
    state On {
        [*] --> ColourWipe
        ColourWipe --> RGBFade: mode button
        RGBFade --> Fire: mode button
        Fire --> Rainbow: mode button
        Rainbow --> ColourWipe: mode button
    }`,
        caption: "Animation state machine: powering on always starts at Colour Wipe and the mode button only works while the cube is on",
      },
      {
        type: "table",
        headers: ["Mode", "Pattern", "How it works"],
        rows: [
          ["0", "Colour Wipe", "Lights LEDs 0 to 63 one at a time in red, then green, then blue, one LED every 50 ms using millis() timing. Handy for spotting a dead LED or a bad joint"],
          ["1", "Smooth RGB Fade", "All 64 LEDs fade in and out together in red, then green, then blue"],
          ["2", "Fire Effect", "Each LED holds a heat value. Every frame cools each cell, drifts heat upward and sparks new heat near the base, then maps heat to colour from dark red through orange to a whitish yellow"],
          ["3", "Rainbow Cycle", "Spreads a full colour wheel across the 64 LEDs and shifts the starting hue each frame so the rainbow rotates"],
        ],
        caption: "The four animation modes",
      },
      { type: "h3", text: "Adaptive brightness" },
      {
        type: "p",
        text: "The LDR reads ambient light at 10-bit resolution. I mapped it inversely so a dark room gives full brightness and a bright room dims the cube, which cuts glare and power draw. The floor of 20 keeps the cube visible in any light.",
      },
      {
        type: "code",
        lang: "cpp",
        text: `int lightValue = analogRead(LDR_PIN);               // 0 (dark) to 1023 (bright)
int brightness = map(lightValue, 0, 1023, 255, 20); // inverted: brighter room, dimmer cube
brightness = constrain(brightness, 20, 255);
strip.setBrightness(brightness);`,
      },
      { type: "h3", text: "Buttons, buzzer and serial" },
      {
        type: "p",
        text: "Both buttons use edge detection: the firmware compares the current pin state with the last one and acts only on the transition, with a 200 ms debounce window after each press. The power button works at all times. The mode button is ignored while the cube is off so the pattern cannot change behind a dark display. A 100 ms buzzer beep confirms each power toggle. Over serial the sketch reports power changes, the active pattern name when it changes and the raw LDR value with the mapped brightness on every pass, which made the brightness mapping easy to tune by covering the sensor and watching the numbers.",
      },
      {
        type: "callout",
        tone: "note",
        text: "Only the Colour Wipe is fully timed with millis(). The other three patterns pause for a few milliseconds per frame (3 ms for the fade, 15 ms for the fire, 20 ms for the rainbow). That is short enough that the buttons still feel instant, but moving every pattern onto millis() timing is the first change I would make.",
      },
      { type: "h2", text: "Testing" },
      {
        type: "ul",
        items: [
          "The power button toggles the system and the mode button cycles all four patterns in order",
          "Brightness changes in real time as the LDR is covered and uncovered",
          "All 64 LEDs respond in every mode, with no flicker or data corruption at the start of any layer",
          "The buzzer sounds on each power toggle and serial output reports power state, pattern and brightness",
        ],
      },
      { type: "h2", text: "What I would add next" },
      {
        type: "p",
        text: "The documentation lists the next steps: wireless control over BLE or Wi-Fi, audio-reactive patterns from a microphone, more volumetric 3D animations and a companion app so the cube can be controlled without a serial cable.",
      },
    ],
    references: [
      { title: "WS2812B datasheet (Worldsemi)", url: "https://cdn-shop.adafruit.com/datasheets/WS2812B.pdf", note: "Timing, power and pinout of the addressable LEDs in the cube" },
      { title: "Adafruit NeoPixel Uberguide", url: "https://learn.adafruit.com/adafruit-neopixel-uberguide", note: "Best practice for powering NeoPixels, the bulk capacitor and the data line" },
      { title: "Adafruit NeoPixel library", url: "https://github.com/adafruit/Adafruit_NeoPixel", note: "The library the sketch uses to drive the LED chain" },
      { title: "Arduino Uno Rev3 documentation", url: "https://docs.arduino.cc/hardware/uno-rev3/", note: "The board that runs the firmware" },
      { title: "Arduino millis() reference", url: "https://docs.arduino.cc/language-reference/en/functions/time/millis/", note: "The timing function behind the non-blocking Colour Wipe" },
    ],
  }

export default _led_cube
