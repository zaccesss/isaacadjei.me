import type { Project } from "../index"

const _avr_zac: Project = {
    id: "avr-zac",
    title: "avr-zac: Bare Metal AVR in C",
    description:
      "ATmega644P projects in bare metal C, writing straight to the registers with no framework: GPIO, interrupts, PWM, ADC and timers, building up to a nine-mode state machine.",
    longDescription:
      "avr-zac is my personal project for learning bare metal AVR C, writing directly to hardware registers without Arduino or any abstraction layer. The ATmega644P runs at 20 MHz on a custom PCB designed by Richard Reeves, a lab technician at Aston University, with an external crystal, an LM317T voltage regulator and 10-way headers breaking out all 32 I/O pins. Richard also provided components and guidance throughout. I program it with a Pololu USB AVR Programmer v2.1 over STK500v2 and build with either PlatformIO in VS Code or Microchip Studio 7.\n\nThe point is to understand what microcontroller code is actually doing before using tools that hide it. Working without a HAL means reading the datasheet for every peripheral before writing a line. Knowing why EICRA sets the interrupt sense, why EIMSK enables that interrupt and why sei() has to come last builds intuition that carries over to any MCU. Each project in the repo is a new concept understood at that level, not just code that happens to work.\n\nSeven projects progress from a fuse check and a blink through GPIO, polling, interrupts and software PWM to a nine-mode state machine with a reaction game and a Tetris melody played on a buzzer. Alongside the code the repo carries a full build and flash workflow, wiring and hardware notes, the original PCB schematic, the ATmega644P datasheet and eight session notes with lab exercises. It is MIT licensed and I am still extending it.",
    technologies: ["C", "Embedded C", "ATmega644P", "AVR", "PlatformIO", "Microchip Studio", "avrdude", "Interrupts", "PWM", "ADC"],
    category: "embedded",
    featured: false,
    cover: "/images/projects/avr-zac/cover.webp",
    order: 10,
    status: "in-progress",
    ongoing: true,
    images: [
      "/images/projects/avr-zac/chip.svg",
      "/images/projects/avr-zac/main.svg",
      "/images/projects/avr-zac/statemachine.svg",
    ],
    github: "https://github.com/zaccesss/avr-zac",
    getInvolved: {},
    date: "2026 - Present",
    highlights: [
      "Seven projects from 00_fuse_test to 06_state_machine, all bare metal register access with no framework",
      "Nine-mode state machine: Chase, Blink All, Alternate, PWM Fade, Knight Rider, Binary Counter, Random, Reaction Game and Tetris Melody",
      "Custom AVR Project PCB designed by Richard Reeves (Aston University) with an LM317T regulator, 20 MHz crystal and ISP header",
      "Pololu USB AVR Programmer v2.1 over STK500v2, buildable in PlatformIO or Microchip Studio 7",
      "Buzzer notes played at their real frequency with Timer1 in CTC mode",
      "Eight session notes with lab exercises: AVR C, bit shifting, interrupts, timers, hardware PWM, UART and ADC",
    ],
    links: [
      { label: "Build and flash workflow", url: "https://github.com/zaccesss/avr-zac/blob/main/WORKFLOW.md" },
      { label: "PCB reference", url: "https://github.com/zaccesss/avr-zac/blob/main/hardware/pcb_notes.md" },
      { label: "Nine-mode state machine source", url: "https://github.com/zaccesss/avr-zac/blob/main/projects/learning_projects/06_state_machine/06_state_machine.c" },
    ],
    sections: [
      { type: "h2", text: "The hardware" },
      {
        type: "p",
        text: "The board is the AVR Project PCB designed by Richard Reeves for use at Aston University. It takes any of four DIP-40 parts (ATmega164P, 324P, 644P or 1284P) and I run the ATmega644P, with 64 KB of flash, 4 KB of RAM and 2 KB of EEPROM. A 12 V input feeds an LM317T regulator that gives 5 V (3.3 V with a jumper fitted) behind a 1N4007 for reverse polarity protection. A 20 MHz crystal with its 22 pF load capacitors is soldered on the board. The four ports each come out on a 10-way header, there is a 6-way ISP header for the programmer and a separate UART header.",
      },
      {
        type: "table",
        headers: ["Item", "Detail"],
        rows: [
          ["MCU", "ATmega644P DIP-40, 20 MHz external crystal"],
          ["PCB", "AVR Project PCB by Richard Reeves, LM317T regulator"],
          ["Programmer", "Pololu USB AVR Programmer v2.1 via STK500v2"],
          ["Fuses", "Low 0xFF, high 0xD1, extended 0xFF: external crystal, no clock divide, SPI programming on, JTAG off"],
          ["Toolchain", "PlatformIO (atmelavr, no framework) or Microchip Studio 7, built with -Os"],
        ],
        caption: "Setup",
      },
      {
        type: "p",
        text: "The LEDs, button and buzzer live on a breadboard that changes between sessions, so the wiring reference in the repo always reflects the current connections and header pins.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "The Pololu programmer times out at the default ISP speed. avrdude needs -B 40, which slows the ISP bit clock to about 25 kHz, together with -b 57600. Both flags live in upload_flags in platformio.ini so every build flashes the same way.",
      },
      { type: "h2", text: "The learning path" },
      {
        type: "table",
        headers: ["#", "Project", "What it teaches"],
        rows: [
          ["0", "00_fuse_test", "Fuse bits, clock source and restoring fuses with the avrdude -F flag"],
          ["1", "01_blink", "A double blink on PB0 that proves the toolchain: DDRB, PORTB and _delay_ms"],
          ["2", "02_led_cycle", "Five LEDs cycling on PORTB with bit shifting"],
          ["3", "03_button_polling", "Reading PIND to drive an active buzzer"],
          ["4", "04_interrupt_buzzer", "Replacing polling with an INT0 ISR: EICRA, EIMSK and sei()"],
          ["5", "05_state_machine_basic", "A four-mode machine with an enum, an ISR and software debounce"],
          ["6", "06_state_machine", "The full nine-mode build with PWM, ADC, a reaction game and a melody"],
        ],
        caption: "Seven projects, each adding one concept",
      },
      { type: "h2", text: "The nine-mode state machine" },
      {
        type: "p",
        text: "The final project cycles through nine modes on each button press. The button is on INT0 (PD2), configured for a falling edge. The ISR waits out the contact bounce, checks the button is still held, then advances a volatile mode variable, clears the LEDs and beeps. The main loop just switches on that variable, so the mode can change mid-pattern without any polling.",
      },
      {
        type: "diagram",
        code: `stateDiagram-v2
    [*] --> Startup
    Startup --> Chase: chase and triple flash done
    Chase --> BlinkAll: INT0 press
    BlinkAll --> Alternate: INT0 press
    Alternate --> PWMFade: INT0 press
    PWMFade --> KnightRider: INT0 press
    KnightRider --> BinaryCounter: INT0 press
    BinaryCounter --> Random: INT0 press
    Random --> ReactionGame: INT0 press
    ReactionGame --> TetrisMelody: INT0 press
    TetrisMelody --> Chase: INT0 press`,
        caption: "Each press fires the INT0 ISR, which moves to the next mode and wraps from Tetris Melody back to Chase",
      },
      {
        type: "table",
        headers: ["Mode", "Name", "Behaviour"],
        rows: [
          ["0", "Chase", "LEDs light one by one in sequence"],
          ["1", "Blink All", "All five LEDs blink together"],
          ["2", "Alternate", "Odd and even LEDs alternate"],
          ["3", "PWM Fade", "All LEDs fade up and down with software PWM"],
          ["4", "Knight Rider", "A single LED sweeps left to right and back"],
          ["5", "Binary Counter", "The five LEDs count 0 to 31 in binary"],
          ["6", "Random", "Random patterns seeded from ADC noise on a floating pin"],
          ["7", "Reaction Game", "LEDs cycle randomly: press when the green one is lit to win"],
          ["8", "Tetris Melody", "The Tetris theme on the buzzer with LEDs synced to each note"],
        ],
        caption: "The nine modes",
      },
      {
        type: "p",
        text: "The Random mode reads the low byte of an ADC conversion on a floating pin, which is noisy enough to act as a seed. The reaction game reuses the button flag the ISR sets: a hit flashes every LED with a long beep and a miss gives three short beeps.",
      },
      { type: "h3", text: "Making the buzzer play real notes" },
      {
        type: "p",
        text: "My first tone() toggled the buzzer at a fixed 2 kHz and only used the frequency to work out the note length, so the melody had the right rhythm and the wrong pitch. The fix uses Timer1 in CTC mode with a prescaler of 8, which gives 2.5 MHz ticks at 20 MHz. OCR1A holds the half period of the note, so 440 Hz needs about 2,840 ticks. Polling the compare flag makes the timing independent of how long the loop body takes.",
      },
      {
        type: "code",
        lang: "c",
        text: `OCR1A = (uint16_t)((F_CPU / 8UL) / (2UL * freq) - 1);   // ticks per half period
TIFR1 = (1<<OCF1A);                                      // clear any stale compare flag
TCCR1B = (1<<WGM12) | (1<<CS11);                         // CTC mode, prescaler 8`,
      },
      {
        type: "p",
        text: "Two other bugs taught me something about the toolchain. The PWM Fade never changed its duty cycle, so the LEDs sat at one dim level until I ramped the on time from 0 to 255 and back. And _delay_ms needs a compile-time constant once optimisation is on, so the Tetris rests now repeat a fixed 1 ms delay instead of passing a variable.",
      },
      { type: "h2", text: "Documentation and session notes" },
      {
        type: "p",
        text: "The repo is meant to be followed, not just read. WORKFLOW.md covers IDE setup, switching projects, build tasks and troubleshooting. The hardware notes cover fuses, ISP clock speed, the register map and ADC setup. The PCB reference lists every component, connector and the soldering order. Eight sessions each have a notes file and a hands-on lab: AVR C fundamentals, bit shifting and data types, inputs and interrupts, timers, hardware PWM, UART transmission, ADC and UART reception.",
      },
      { type: "h2", text: "Next" },
      {
        type: "p",
        text: "The repo already has empty folders for lab, personal, practice and other projects, ready for the work that follows the learning path. The project is still being extended as I go.",
      },
    ],
    references: [
      { title: "ATmega164P/324P/644P datasheet (Microchip)", url: "https://ww1.microchip.com/downloads/en/DeviceDoc/ATmega164P-324P-644P-Data-Sheet-40002071A.pdf", note: "Every register used in the projects, from EICRA to TCCR1B" },
      { title: "AVRDUDE documentation", url: "https://avrdudes.github.io/avrdude/", note: "The flash and fuse tool, including the -B and -F flags" },
      { title: "Pololu USB AVR Programmer v2.1", url: "https://www.pololu.com/product/3172", note: "The STK500v2-compatible programmer" },
      { title: "Pololu USB AVR Programmer v2 user's guide", url: "https://www.pololu.com/docs/0J67", note: "Setup, ISP frequency and the built-in serial bridge" },
      { title: "AVR Libc reference manual", url: "https://avrdudes.github.io/avr-libc/", note: "The ISR macro, util/delay.h and the standard AVR headers" },
      { title: "PlatformIO Atmel AVR platform", url: "https://docs.platformio.org/en/latest/platforms/atmelavr.html", note: "The bare metal build environment" },
    ],
  }

export default _avr_zac
