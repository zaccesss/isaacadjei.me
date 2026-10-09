import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  number: 3,
  slug: "issue-03-uart-from-scratch",
  title: "UART from scratch and five small lessons",
  subtitle: "Serial communication without a library, printf over UART, RTOS ticks, NumPy broadcasting, CSRF cookies and how grep skips ahead.",
  tags: ["UART", "Embedded", "AVR", "C", "Serial"],
  date: "2026-06-12",
  published: true,
  intro: [
    { type: "p", text: "This was a fortnight close to the hardware. One long post on the protocol I lean on most when debugging firmware, then a run of small lessons that mostly circle the same theme of seeing what a system is really doing." },
    { type: "h2", text: "What I wrote" },
    { type: "p", text: "[UART From Scratch](/blog/uart-bare-metal) sets up serial communication on an ATmega644P in bare metal C with no library. It explains the frame of start bit, data bits and stop bits, how to calculate the baud rate register and why a couple of percent of error corrupts data. It also covers transmitting and receiving, connecting printf, interrupt-driven receive, double speed mode and reading the line on an oscilloscope. Once UART works, every other piece of firmware gets easier to debug, which is why it came first." },
    { type: "h2", text: "Small things I learned" },
    {
      type: "ul",
      items: [
        "[Retargeting printf to UART](/til/uart-printf-retargeting) lets standard C stdio print debug output on a microcontroller with no terminal.",
        "[pdMS_TO_TICKS in FreeRTOS](/til/freertos-pdms-to-ticks) converts milliseconds to ticks, so a delay means the same time whatever the tick rate.",
        "[NumPy broadcasting](/til/numpy-broadcasting) lines shapes up from the right and stretches size-one dimensions without copying memory.",
        "[The double-submit cookie](/til/csrf-double-submit-cookie) protects against CSRF without storing anything on the server.",
        "[How grep works inside](/til/how-grep-works-internally): Boyer-Moore-Horspool lets it skip most of the input instead of reading every character.",
      ],
    },
    { type: "p", text: "The printf TIL pairs naturally with the UART post. Read together they take you from an empty serial line to readable debug output on real hardware." },
  ],
}

export default issue
