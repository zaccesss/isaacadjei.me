export interface SocietyRole {
  role: string
  period: string
  visibleFrom?: string
}

export interface Society {
  name: string
  roles: SocietyRole[]
  description: string
  url?: string
}

export function isSocietyRoleVisible(role: SocietyRole): boolean {
  return !role.visibleFrom || new Date() >= new Date(role.visibleFrom)
}

export const societies: Society[] = [
  {
    name: "Institution of Engineering and Technology (IET)",
    url: "https://www.theiet.org",
    roles: [{ role: "Student Member", period: "September 2024 - Present" }],
    description:
      "Professional engineering institution membership, advancing engineering knowledge and skills.",
  },
  {
    name: "Aston Computing and Electronics Society (ESOC)",
    url: "https://www.astonsu.com/society/electronicssociety/",
    roles: [
      { role: "Member & Student Representative", period: "September 2024 - Present" },
      { role: "Treasurer", period: "September 2026 - Present", visibleFrom: "2026-09-01" },
    ],
    description:
      "Active member and course representative for the EECS programme at Aston, elected Treasurer for the 2026/27 academic year.",
  },
  {
    name: "Aston Computer Science Society (ACSS)",
    url: "https://www.astonsu.com/society/computerscience/",
    roles: [{ role: "Member", period: "September 2025 - Present" }],
    description: "Active member, engaging with computer science community events and talks.",
  },
  {
    name: "Aston Gaming Society (GS)",
    url: "https://www.astonsu.com/society/gamingsoc/",
    roles: [{ role: "Member", period: "September 2024 - Present" }],
    description: "Participating in gaming events, tournaments and community activities.",
  },
  {
    name: "Aston African-Caribbean Society (ACS)",
    url: "https://www.astonsu.com/society/afrocaribbean/",
    roles: [{ role: "Member", period: "September 2024 - Present" }],
    description: "Active participation in cultural, social and community events.",
  },
  {
    name: "Aston Ghana Society (AGS)",
    url: "https://www.astonsu.com/society/astonghanasoc/",
    roles: [{ role: "Member", period: "September 2024 - Present" }],
    description: "Connecting with Ghanaian students and celebrating cultural heritage.",
  },
]
