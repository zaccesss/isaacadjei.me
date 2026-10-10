import type { Project } from "../index"

const _cnc_control: Project = {
    id: "cnc-control",
    title: "CNC Milling Machine Control System",
    description:
      "An Arduino Uno prototype of a CNC milling machine controller with a door interlock, an emergency stop, a timed cutting cycle, status LEDs, a buzzer and an LCD.",
    longDescription:
      "I built this prototype in May 2024 as a control system for a CNC milling machine. The requirements were clear: the cutting cycle must not start with the door open, it must run for exactly ten seconds, an emergency stop must halt everything at once and the operator must always know what the machine is doing.\n\nThe prototype runs on an Arduino Uno on a breadboard. A toggle switch stands in for the door sensor, two push buttons are the Start and Emergency Stop controls and a small DC motor stands in for the cutter. Red, yellow and green LEDs show the state, a buzzer sounds on an emergency stop and a 16x2 LCD driven by the LiquidCrystal library prints messages such as \"Close Door to Start\", \"Ready\", \"Cutting...\" and \"Emergency Stop!\". I drew the circuit in Cirkit Designer first, then wired and tested it on the bench.\n\nThe sketch is one polled loop. The door has to be opened and closed once before anything can start. With the door closed the system shows Ready. Pressing Start then runs the cutting cycle. The emergency stop is checked on every pass of the loop and between every step of the cycle. Opening the door during a cycle triggers the same emergency stop routine. After each cycle there is a five-second wait before the door may be opened again.",
    technologies: ["Arduino", "C++", "Embedded Systems", "LCD", "Safety Systems"],
    category: "embedded",
    featured: false,
    cover: "/images/projects/cnc-control/cover.webp",
    order: 14,
    status: "completed",
    images: [
      "/images/projects/cnc-control/main.webp",
      "/images/projects/cnc-control/safety-test.webp",
      "/images/projects/cnc-control/lcd.webp",
    ],
    date: "2024",
    highlights: [
      "Door interlock: the cycle cannot start until the door has been opened and closed. Opening it mid-cycle stops the motor",
      "Ten-second cutting cycle run as 40 steps of 250 ms, with the emergency stop checked between every step",
      "Emergency stop routine that cuts the motor, lights the red LED, sounds the buzzer for two seconds and shows a message",
      "Five-second wait after each cycle before the door may be opened",
      "Red, yellow and green status LEDs plus a 16x2 LCD with plain-English messages",
      "Requirements analysis, test plan, flow chart and build log written alongside the build",
    ],
    sections: [
      { type: "h2", text: "How the sketch works" },
      {
        type: "p",
        text: "I wrote a flow chart and pseudocode before any code, then turned them into a single Arduino sketch. Every pass of the loop checks the emergency stop first, then the door, then the Start button.",
      },
      {
        type: "diagram",
        code: `flowchart TD
    A[Start of loop] --> B{Emergency stop pressed?}
    B -->|Yes| S[Stop motor, red LED, buzzer, message]
    B -->|No| C{Door open?}
    C -->|Yes, no cycle running| D[Red LED, Close Door to Start]
    C -->|Yes, cycle running| S
    C -->|No| E{Door opened once already?}
    E -->|No| A
    E -->|Yes| F[Green LED, Ready]
    F --> G{Start pressed?}
    G -->|Yes| H[Yellow LED, motor on for 40 steps of 250 ms]
    H --> I[Motor off, wait 5 s before the door may open]
    G -->|No| A
    D --> A
    S --> A
    I --> A`,
        caption: "One pass of the control loop, as the sketch runs it",
      },
      { type: "h2", text: "The safety features" },
      {
        type: "table",
        headers: ["Feature", "How the sketch does it"],
        rows: [
          ["Door interlock", "The cycle only starts with the door closed, after it has been opened once. Opening it during a cycle calls the emergency stop routine"],
          ["Emergency stop", "Checked at the top of every loop and between each 250 ms step of the cycle. It cuts the motor, lights the red LED and sounds the buzzer for two seconds"],
          ["Timed cycle", "The motor runs for 40 steps of 250 ms, which is the ten seconds the requirements asked for"],
          ["Door delay", "Five seconds after a cycle ends before the door may be opened"],
          ["Operator feedback", "Green for ready, yellow while cutting and red for a fault, with the same state written on the LCD"],
        ],
        caption: "What each safety requirement became in the sketch",
      },
      {
        type: "image",
        src: "/images/projects/cnc-control/safety-test.webp",
        alt: "The control sketch open in the Arduino IDE, showing the pin definitions, the LCD setup and the start of the loop",
        caption: "The sketch in the Arduino IDE",
      },
      { type: "h2", text: "Testing" },
      {
        type: "p",
        text: "My test plan covered the emergency stop during a cycle, refusing to start with the door open, detecting the door closing again, the Start button and the length of the cutting cycle. Each test had a stated condition and an expected result. My build log records what I fixed between sessions.",
      },
      {
        type: "image",
        src: "/images/projects/cnc-control/lcd.webp",
        alt: "The prototype on a bench next to a laptop running the Arduino IDE, with the breadboard, LEDs, buzzer and motor wired to the Arduino Uno",
        caption: "The prototype on the bench",
      },
      { type: "h2", text: "What I would do differently now" },
      {
        type: "p",
        text: "Looking back after two years of embedded work, the weak spot is that the sketch blocks. The cycle and the five-second wait use delay(), so during a step the board is not looking at anything. The emergency stop is only seen between steps, up to a quarter of a second late. The door is not read at all while the cycle loop runs. Today I would put the emergency stop on a hardware interrupt, time the cycle with millis() so the loop never stops reading inputs and latch the fault until a person resets it. My own planning notes already suggested a watchdog timer and saving the state through a power cut. I did not get to either.",
      },
    ],
    references: [
      { title: "Arduino Uno Rev3", url: "https://docs.arduino.cc/hardware/uno-rev3/", note: "The board the prototype runs on" },
      { title: "LiquidCrystal library", url: "https://docs.arduino.cc/libraries/liquidcrystal/", note: "Driving the 16x2 LCD" },
      { title: "pinMode() and INPUT_PULLUP", url: "https://docs.arduino.cc/language-reference/en/functions/digital-io/pinMode/", note: "How the buttons and the door switch are read" },
      { title: "Blink Without Delay", url: "https://docs.arduino.cc/built-in-examples/digital/BlinkWithoutDelay/", note: "The millis() pattern I would use for the cycle now" },
      { title: "attachInterrupt()", url: "https://docs.arduino.cc/language-reference/en/functions/external-interrupts/attachInterrupt/", note: "How an interrupt-driven emergency stop would work" },
      { title: "Cirkit Designer", url: "https://app.cirkitdesigner.com/", note: "Where I drew the circuit first" },
    ],
  }

export default _cnc_control
