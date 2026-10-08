export type Friend = { name: string; url: string; about: string; place?: string; group?: "friend" | "learn" }

export const FRIENDS: Friend[] = [
  {
    name: "Nick Gray",
    url: "https://nickgray.net",
    about: "Runs /friends, the project behind this page, to help people find the small personal websites that make the internet better.",
    place: "Austin, Texas",
  },
  {
    name: "Derek Sivers",
    url: "https://sive.rs",
    about: "Started the /now page movement, which is how I found the small web and how Nick found my site.",
  },
  {
    name: "Louis Mensah",
    url: "https://github.com/Louisomeg",
    about: "Leads LidarSAT, our team research project on GPS-denied drone navigation.",
  },
  {
    name: "Emmanuel Ofori Mensah",
    url: "https://github.com/mannycodes20",
    about: "Builds the data pipeline on LidarSAT.",
  },
  {
    name: "Emmanuel Boachie",
    url: "https://github.com/EB-Glitch08",
    about: "Builds the simulator and terrain matchers on LidarSAT.",
  },
  {
    name: "Simon Willison",
    url: "https://simonwillison.net",
    about: "Co-creator of Django and author of Datasette. His TILs inspired mine.",
    group: "learn",
  },
  {
    name: "Anthony Fu",
    url: "https://antfu.me",
    about: "Core team on Vue, Vite and Nuxt and creator of Vitest, UnoCSS and Slidev.",
    group: "learn",
  },
  {
    name: "swyx",
    url: "https://swyx.io",
    about: "Wrote the Learn in Public essay, a case for sharing what you learn as you learn it.",
    group: "learn",
  },
  {
    name: "Julia Evans",
    url: "https://jvns.ca",
    about: "Explains networking, Linux and Git with zines and plain writing that make hard things approachable.",
    group: "learn",
  },
  {
    name: "Sindre Sorhus",
    url: "https://sindresorhus.com",
    about: "Maintains more than a thousand small open source packages and the Awesome lists.",
    group: "learn",
  },
  {
    name: "Wes Bos",
    url: "https://wesbos.com",
    about: "Teaches JavaScript and web development through courses and the Syntax podcast.",
    group: "learn",
  },
  {
    name: "Michelle Lawson",
    url: "https://www.michellelawson.me",
    about: "Computer science student and founder of Computer Science Girlies, teaching AI and CS to the next generation.",
    group: "learn",
  },
  {
    name: "Linus Torvalds",
    url: "https://github.com/torvalds",
    about: "Created Linux and Git, two tools I use every single day.",
    group: "learn",
  },
]
