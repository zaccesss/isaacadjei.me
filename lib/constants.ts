export const ROUTES = {
  home: "/",
  about: "/about",
  projects: "/projects",
  experience: "/experience",
  skills: "/skills",
  blog: "/blog",
  notes: "/notes",
  lab: "/lab",
  contact: "/contact",
  links: "/links",
  now: "/now",
  uses: "/uses",
  colophon: "/colophon",
  changelog: "/changelog",
  consumed: "/consumed",
  newsletter: "/newsletter",
  hallOfFame: "/hall-of-fame",
  allPages: "/all-pages",
  researchPublications: "/respub",
  til: "/til",
} as const

export const NAV_LINKS = [
  { label: "About", href: ROUTES.about },
  { label: "Experience", href: ROUTES.experience },
  { label: "Projects", href: ROUTES.projects },
  { label: "Blog", href: ROUTES.blog },
  { label: "TIL", href: ROUTES.til },
  { label: "Notes", href: ROUTES.notes },
  { label: "Newsletter", href: ROUTES.newsletter },
  { label: "Contact", href: ROUTES.contact },
  { label: "Links", href: ROUTES.links },
] as const

export const BOOKING_URL = "https://cal.com/isaacadjei.me/chat"

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.isaacadjei.me"
