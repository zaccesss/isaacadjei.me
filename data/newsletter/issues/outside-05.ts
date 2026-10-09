import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "outside",
  number: 5,
  slug: "outside-05-rust-1-97",
  title: "Rust 1.97 adds bit tricks for embedded code",
  subtitle: "A release with new integer bit methods, quieter Cargo warnings and a new default for symbol names.",
  tags: ["Rust", "Embedded", "Developer Tools"],
  date: "2026-07-17",
  published: true,
  intro: [
    { type: "p", text: "Rust 1.97.0 came out on 9 July 2026, followed by a 1.97.1 point release on 16 July. Three changes stand out. The v0 symbol mangling scheme, designed for Rust itself, is now the default and keeps details such as generic parameter values in symbol names. Cargo can now control how warnings are handled, so a project can silence them, warn on them or deny them without passing compiler flags that invalidate the build cache. Linker messages are also shown as warnings by default, with common false positives filtered out." },
    { type: "p", text: "The standard library gains a set of integer methods for working with individual bits: isolate_highest_one, isolate_lowest_one, highest_one, lowest_one and bit_width, with matching versions for the NonZero types." },
    { type: "h2", text: "Why it matters to engineers" },
    { type: "p", text: "Finding the highest or lowest set bit is everyday work in low-level code. It turns up in priority schedulers, interrupt flag registers, allocators and anything that packs state into a bitmask. Having it in the standard library with clear names means less hand-rolled bit twiddling to review and fewer off-by-one mistakes hiding in a helper function." },
    { type: "p", text: "Most of my firmware is still C on microcontrollers, where the same jobs are done with compiler built-ins and careful masks. Releases like this are a reminder of why Rust keeps gaining ground in embedded: the safe, readable version of a register trick keeps getting easier to write." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[Announcing Rust 1.97.0](https://blog.rust-lang.org/2026/07/09/Rust-1.97.0/)",
        "[The Rust Blog](https://blog.rust-lang.org/)",
      ],
    },
  ],
}

export default issue
