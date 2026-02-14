export const hackathons = [
  {
    id: 1,
    name: "GVPCOE HackFest",
    date: "2026-03-20",
    duration: "24 hours",
    location: "Campus Lab",
    prize: "INR 5,000",
    mode: "In-person",
    teamSize: "2-4",
    registrationFee: "INR 200",
    eligibility: "Open to all departments (UG/PG)",
    deadline: "2026-03-15",
    status: "Open",
    projectTheme:
      "Build solutions that improve campus life with a clear impact on students and faculty.",
    themes: ["AI for Campus", "EdTech", "Sustainability"],
    requirements: [
      "Bring valid college ID",
      "At least 1 prototype or demo",
      "Final pitch deck (5 slides)"
    ],
    documentsRequired: ["College ID", "Abstract (1 page)", "Team list"],
  },
  {
    id: 2,
    name: "CodeSprint Hyderabad",
    date: "2026-04-10",
    duration: "36 hours",
    location: "Tech Park",
    prize: "Certificates",
    mode: "In-person",
    teamSize: "1-3",
    registrationFee: "Free",
    eligibility: "Open to undergraduate students",
    deadline: "2026-04-05",
    status: "Open",
    projectTheme:
      "Prototype a scalable idea in FinTech, HealthTech, or Smart Cities with a working demo.",
    themes: ["FinTech", "HealthTech", "Smart Cities"],
    requirements: [
      "Working prototype",
      "2-minute demo video",
      "Pitch deck (max 8 slides)"
    ],
    documentsRequired: ["College ID", "Abstract (1 page)"],
  },
  {
    id: 3,
    name: "GreenHackathon",
    date: "2026-05-05",
    duration: "48 hours",
    location: "Online",
    prize: "Certificates + Internship",
    mode: "Online",
    teamSize: "1-5",
    registrationFee: "Free",
    eligibility: "Open to all colleges",
    deadline: "2026-04-30",
    status: "Open",
    projectTheme:
      "Solve climate challenges using tech-enabled solutions with measurable impact.",
    themes: ["Climate", "Circular Economy", "AgriTech"],
    requirements: [
      "Online demo",
      "Impact metrics",
      "Source code link"
    ],
    documentsRequired: ["College ID", "Abstract (1 page)"],
  },
];

export const findHackathonById = (id) =>
  hackathons.find((h) => h.id === parseInt(id, 10));
