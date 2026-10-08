import type { Project } from "../index"

const _goods_lift: Project = {
    id: "goods-lift",
    title: "Goods Lift Control System",
    description:
      "An Arduino-based multi-floor goods lift controller with request queuing, door interlocks, an emergency stop, PWM motor control and an LCD status display.",
    longDescription:
      "I developed a microcontroller-based goods lift controller for multi-floor travel with a layered safety design. Floor tracking uses a software counter that goes up or down on each limit switch trigger. On startup a homing sequence drives the cabin to the bottom limit before accepting any floor requests, so the system has a confirmed reference position every time it powers on. An array-based request queue stores pending calls and dispatches them nearest floor first in the current direction of travel, the same approach real lift controllers use to cut travel time. Duplicate calls to the same floor are merged and unanswered requests expire after a configurable timeout so the queue cannot go stale.\n\nThe motor runs through an H-bridge driver with PWM soft-start and braking routines. Ramping the motor up and down rather than switching it abruptly reduces mechanical shock and gearbox wear over repeated cycles. Door sensors (infrared or reed switch) at both the inner and outer doors gate every move: the firmware will not drive the motor unless both are confirmed closed. Any door opening mid-travel cuts the motor and moves the state to DOOR_OPEN. An E-Stop on a hardware interrupt shuts the motor down in under a millisecond and enters an EMERGENCY state that blocks all floor inputs until an operator resets it after a full safety check. A load cell reading above a configurable threshold also blocks movement and shows OVERLOAD on the display.\n\nAll hold times (the 5 to 10 second door dwell, the pause between floors and the E-Stop lockout countdown) run on millis() timing so sensor polling and the interrupt handlers stay active throughout. A door event or E-Stop press during a timed operation is never missed. The 16x2 LCD shows the current floor, target floor, direction and a live status with custom arrow and warning characters. Distinct tones mark a button press, a door-closing warning before the cabin moves, arrival at the target floor and a continuous tone during E-Stop lockout.",
    technologies: ["Arduino", "C++", "Embedded Systems", "LCD", "Motor Control", "Safety Systems"],
    category: "embedded",
    featured: false,
    cover: "/images/projects/goods-lift/cover.webp",
    order: 15,
    status: "completed",
    images: [
      "/images/projects/goods-lift/main.webp",
      "/images/projects/goods-lift/breadboard.webp",
      "/images/projects/goods-lift/lcd.webp",
    ],
    date: "2025",
    highlights: [
      "Nearest-floor-in-direction dispatch queue with request merging and configurable expiry",
      "PWM soft-start and braking for precise floor alignment and reduced mechanical wear",
      "Door interlocks: movement blocked unless both doors are confirmed closed",
      "Hardware interrupt E-Stop with an EMERGENCY state lockout and mandatory manual reset",
      "Overload detection prevents movement above a configurable weight threshold",
      "All delays use millis() non-blocking timing so the interrupt handlers stay live throughout",
    ],
    sections: [
      { type: "h2", text: "Control flow" },
      {
        type: "p",
        text: "The controller is a state machine with two kinds of exit. Normal operation moves between homing, waiting, travelling and the door dwell. The safety exits (an open door, an overload or the E-Stop) can interrupt any of those and each has its own way back.",
      },
      {
        type: "diagram",
        code: `stateDiagram-v2
    [*] --> Homing
    Homing --> Idle: bottom limit reached
    Idle --> Moving: request queued, doors closed
    Moving --> Arrived: target floor reached
    Arrived --> Idle: door dwell over, queue empty
    Arrived --> Moving: door dwell over, next request
    Moving --> DOOR_OPEN: door opened mid-travel
    DOOR_OPEN --> Idle: both doors closed
    Idle --> OVERLOAD: load above threshold
    OVERLOAD --> Idle: load removed
    Moving --> EMERGENCY: E-Stop
    Idle --> EMERGENCY: E-Stop
    EMERGENCY --> Idle: manual reset after safety check`,
        caption: "Simplified lift state machine with the safety states in capitals",
      },
      { type: "h2", text: "Dispatching requests" },
      {
        type: "p",
        text: "Serving calls in the order they arrive makes a lift bounce up and down. Instead the queue keeps travelling in its current direction and stops at the nearest requested floor on the way, only reversing once nothing is left ahead of it. A second press for a floor that is already queued is merged rather than added again and any request left unanswered for too long expires.",
      },
      {
        type: "table",
        headers: ["Event", "Feedback"],
        rows: [
          ["Button press", "Short confirmation beep"],
          ["Doors about to close", "Repeating warning tone before the cabin moves"],
          ["Target floor reached", "Arrival chime"],
          ["E-Stop lockout", "Continuous tone with a countdown on the LCD"],
          ["Overload", "OVERLOAD status on the LCD and no movement"],
        ],
        caption: "Audio and display feedback for each event",
      },
      {
        type: "image",
        src: "/images/projects/goods-lift/lcd.webp",
        alt: "16x2 LCD showing the current floor, target floor and travel direction with a custom arrow character",
        caption: "Floor, target and direction on the status display",
      },
      { type: "h2", text: "Why the timing matters" },
      {
        type: "p",
        text: "A lift spends most of its time waiting: holding the doors, pausing between floors or counting down a lockout. If any of those waits used delay(), the loop would stop reading the door sensors for seconds at a time. Every wait is instead a millis() comparison, so the door sensors and load cell are polled on every pass and the E-Stop interrupt can fire at any moment.",
      },
      {
        type: "image",
        src: "/images/projects/goods-lift/breadboard.webp",
        alt: "The goods lift controller prototype on a breadboard with buttons, LCD and motor driver",
        caption: "The breadboard prototype",
      },
    ],
    references: [
      { title: "Arduino millis() reference", url: "https://docs.arduino.cc/language-reference/en/functions/time/millis/", note: "The basis of every non-blocking wait" },
      { title: "Arduino attachInterrupt() reference", url: "https://docs.arduino.cc/language-reference/en/functions/external-interrupts/attachInterrupt/", note: "The hardware interrupt behind the E-Stop" },
      { title: "Arduino LiquidCrystal library", url: "https://docs.arduino.cc/libraries/liquidcrystal/", note: "Driving the 16x2 display and defining custom characters" },
      { title: "HD44780U LCD controller datasheet (Hitachi)", url: "https://www.sparkfun.com/datasheets/LCD/HD44780.pdf", note: "The controller inside the 16x2 display" },
    ],
  }

export default _goods_lift
