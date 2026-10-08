import type { Project } from "../index"

const _cnc_control: Project = {
    id: "cnc-control",
    title: "CNC Milling Machine Control System",
    description:
      "A safety-critical Arduino control system for a CNC milling machine with door interlocks, a hardware emergency stop, state machine firmware and LCD feedback.",
    longDescription:
      "I designed and programmed a safety-critical control system for a CNC milling machine built around an Arduino ATmega328P. The central design constraint was that the machine must be incapable of operating unsafely however it is used, not just that it handles the happy path correctly. Every transition in the finite state machine (INIT, DOOR_OPEN, READY, RUNNING, COOLDOWN and FAULT) is guarded by a full safety check: no state change is permitted unless every relevant condition holds at the same time. A door opening during RUNNING drives the state straight to FAULT rather than back to READY. FAULT can only be left through a deliberate manual reset.\n\nThe emergency stop is a mushroom-head button on a hardware interrupt (INT0), so the ATmega328P reacts in under a millisecond wherever the main loop is. On activation it kills the motor, latches a fault flag in EEPROM so a power cycle cannot silently clear it, sounds the buzzer and blocks all input until an operator holds the reset button for two seconds, confirming that a person has acknowledged the fault. The 10-second cutting cycle and the mandatory 5-second safety delay before the door can open both run on millis() timing, so the ISR and sensor polling keep running and cannot miss an E-Stop or door event mid-cycle.\n\nA TL071 op-amp wired as a Schmitt trigger buffers the reed switch output. Motor switching makes industrial environments electrically noisy and the Schmitt trigger's hysteresis stops slow or noisy edges from causing false triggers before they reach the digital input. A 16x2 HD44780 LCD on a 4-bit parallel interface shows a plain-English status and a countdown during the safety delay. Green, yellow and red LEDs plus a buzzer give the state at a glance and a hardware watchdog restarts the system into FAULT if the main loop ever stalls, so a firmware bug cannot leave the machine stuck in an active state.",
    technologies: ["Arduino", "C++", "Embedded Systems", "TL071", "LCD", "Safety Systems"],
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
      "Finite state machine: INIT, DOOR_OPEN, READY, RUNNING, COOLDOWN and FAULT, with every transition safety-guarded",
      "Hardware interrupt on the E-Stop for sub-millisecond motor shutdown, with the fault latched in EEPROM",
      "Door interlock halts the motor immediately on opening during any active state",
      "Mandatory 5-second post-cycle safety delay before door access is permitted",
      "TL071 Schmitt trigger buffers the sensor signal to isolate the Arduino from industrial noise",
      "Watchdog timer forces a safe shutdown on a firmware crash or a main loop stall",
    ],
    sections: [
      { type: "h2", text: "The state machine" },
      {
        type: "p",
        text: "The firmware is built around one rule: the machine only ever moves to a less safe state when every condition for it is met. It can always fall to FAULT from anywhere. Writing the states out first made it obvious where each check belonged and which transitions should simply not exist, such as going straight from RUNNING back to READY.",
      },
      {
        type: "diagram",
        code: `stateDiagram-v2
    [*] --> INIT
    INIT --> DOOR_OPEN: startup, door open
    INIT --> READY: startup, door closed
    DOOR_OPEN --> READY: door closed
    READY --> DOOR_OPEN: door opened
    READY --> RUNNING: cycle started
    RUNNING --> COOLDOWN: 10 s cycle complete
    COOLDOWN --> READY: 5 s safety delay over
    RUNNING --> FAULT: door opened or E-Stop
    READY --> FAULT: E-Stop
    COOLDOWN --> FAULT: E-Stop
    DOOR_OPEN --> FAULT: E-Stop
    FAULT --> INIT: reset held for 2 s`,
        caption: "Simplified state machine: FAULT is reachable from every active state and only a deliberate reset leaves it",
      },
      { type: "h2", text: "Layers of protection" },
      {
        type: "table",
        headers: ["Layer", "What it protects against"],
        rows: [
          ["E-Stop on INT0", "An operator needing to stop the spindle now, whatever the loop is doing"],
          ["EEPROM fault latch", "A power cycle quietly clearing a fault nobody has acknowledged"],
          ["Two-second reset hold", "An accidental bump clearing a fault"],
          ["Door interlock", "Access to the cutting area while the motor can turn"],
          ["Five-second safety delay", "Opening the door while the spindle is still running down"],
          ["Schmitt trigger input", "Electrical noise causing a false door reading"],
          ["Watchdog timer", "A firmware hang leaving the motor running"],
        ],
        caption: "Each safety measure and the failure it covers",
      },
      {
        type: "p",
        text: "No single measure is trusted on its own. The interrupt handles speed, the latch handles memory, the watchdog handles the firmware itself and the hardware filter handles the signal before the firmware ever sees it.",
      },
      {
        type: "image",
        src: "/images/projects/cnc-control/safety-test.webp",
        alt: "The CNC control circuit on the bench during an emergency stop safety test",
        caption: "Testing the emergency stop",
      },
      { type: "h2", text: "Non-blocking timing" },
      {
        type: "p",
        text: "The cutting cycle and the safety delay could have been written with delay(), but that would freeze the loop for up to ten seconds and the door sensor would go unread. Using millis() comparisons instead lets the loop keep polling the door, refreshing the LCD countdown and running the LEDs while the cycle runs. The E-Stop never depends on the loop at all because it is an interrupt.",
      },
      {
        type: "image",
        src: "/images/projects/cnc-control/lcd.webp",
        alt: "16x2 LCD showing a plain-English machine status message",
        caption: "The status display",
      },
    ],
    references: [
      { title: "ATmega328P datasheet (Microchip)", url: "https://ww1.microchip.com/downloads/en/DeviceDoc/ATmega48A-PA-88A-PA-168A-PA-328-P-DS-DS40002061A.pdf", note: "External interrupts, the watchdog timer and EEPROM" },
      { title: "TL071 datasheet (Texas Instruments)", url: "https://www.ti.com/lit/ds/symlink/tl071.pdf", note: "The op-amp used as the Schmitt trigger" },
      { title: "HD44780U LCD controller datasheet (Hitachi)", url: "https://www.sparkfun.com/datasheets/LCD/HD44780.pdf", note: "The 4-bit parallel interface for the status display" },
      { title: "Arduino attachInterrupt() reference", url: "https://docs.arduino.cc/language-reference/en/functions/external-interrupts/attachInterrupt/", note: "Wiring the E-Stop to INT0" },
      { title: "AVR Libc watchdog timer handling", url: "https://avrdudes.github.io/avr-libc/avr-libc-user-manual/group__avr__watchdog.html", note: "Enabling and resetting the watchdog" },
    ],
  }

export default _cnc_control
