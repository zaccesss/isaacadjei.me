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
      "Analogue and Power Electronics",
      "Communications Systems",
      "Control Systems and Robotics",
      "AI and Robotics",
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
      "Completed BTEC Engineering with strong practical training across design, microcontrollers, electronics and engineering maths. Named Best and Most Hardworking Student.",
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
      "Core subjects: English Language, Mathematics, Social Studies and Integrated Science. Active in Robotics Club, APOSA (Secretary), Scripture Union and Debate Society.",
    modules: [
      "Mathematics",
      "Economics",
      "Geography",
      "Government",
      "ICT",
    ],
  },
]
