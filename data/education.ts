export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string | "Present"
  description?: string
  grade?: string
  modules?: string[]
  url?: string
  links?: { label: string; href: string }[]
}

export const education: Education[] = [
  {
    id: "aston",
    url: "https://www.aston.ac.uk",
    institution: "Aston University, Birmingham, United Kingdom",
    degree: "BEng (Hons)",
    field: "Electronic Engineering and Computer Science",
    startDate: "Oct 2024",
    endDate: "Jul 2028",
    grade: "Predicted: First Class",
    description:
      "Working towards a First Class with a strong focus on software engineering, electronics, AI and applied computing.",
    modules: [
      "Embedded Systems and C",
      "Digital Design",
      "Data Structures, Algorithms and Object-Oriented Programming",
      "Electronics 1 and 2",
      "Analogue and Power Electronics",
      "Communications Systems",
      "Control Systems",
      "AI, Data Science and Robotics",
      "Internet Applications and Databases",
      "Engineering Mathematics",
      "Electronic Engineering Team Project",
    ],
  },
  {
    id: "stanmore",
    url: "https://www.stanmore.ac.uk",
    institution: "Stanmore College, London, United Kingdom",
    degree: "Pearson BTEC Level 3 National Extended Diploma in Engineering",
    field: "",
    startDate: "Sep 2022",
    endDate: "Jul 2024",
    grade: "D*DD (Distinction*, Distinction, Distinction)",
    description:
      "Completed BTEC Engineering with strong practical training across design, microcontrollers, electronics and engineering maths.",
    links: [
      { label: "My alumni profile at Stanmore College", href: "https://stanmore.ac.uk/alumni/#:~:text=Zac%2C%20Engineering" },
      { label: "Thank You, Stanmore", href: "/blog/thank-you-stanmore" },
    ],
    modules: [
      "Microcontroller Systems",
      "Electronic Devices and Circuits",
      "Computer Aided Design",
      "Product Design and Manufacture",
      "Specialist Engineering Project",
    ],
  },
  {
    id: "adisadel",
    url: "https://adisadelcollege.net",
    institution: "Adisadel College, Cape Coast, Ghana",
    degree: "West African Senior School Certificate (WASSCE)",
    field: "General Arts",
    startDate: "Sep 2019",
    endDate: "Mar 2022",
    description:
      "Core subjects: English Language, Mathematics, Social Studies and Integrated Science. I served as Vice President of APOSA after a few months as its Secretary and took part in the Scripture Union and the Debate Society.",
    modules: [
      "Mathematics",
      "Economics",
      "Geography",
      "Government",
      "ICT",
    ],
  },
]
