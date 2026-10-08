// Single source of content. Every value below was provided by Thota Naga Manikanta
// (no résumé PDF was supplied) or read from his public GitHub repositories / live demo.
// Sections with no data (Certifications, Achievements, Education) are intentionally absent.

export type Profile = {
  name: string;
  firstName: string;
  initials: string;
  role: string;
  email: string;
  phone: string;
  phoneHref: string;
  whatsapp: string;
  location: string;
  summary: string;
  extraLine: string;
  github: string;
  instagram: string;
  business: string;
};

export const PROFILE: Profile = {
  name: "Thota Naga Manikanta",
  firstName: "Manikanta",
  initials: "TNM",
  role: "AI Automation Developer",
  email: "thotamanikanta20975@gmail.com",
  phone: "+91 90595 66039",
  phoneHref: "tel:+919059566039",
  whatsapp: "https://wa.me/919059566039",
  location: "Amalapuram, Andhra Pradesh, India",
  summary:
    "I'm an AI Automation Developer from Amalapuram, Andhra Pradesh. Most of my work runs on n8n: WhatsApp assistants that answer people and book appointments, and workflows that connect Google Sheets, Google Calendar, Telegram and AI models.",
  extraLine:
    "I also build web apps and computer vision projects with Next.js, Python, OpenCV and MediaPipe, and I run Manikanta Automations, where I set these systems up for clinics and businesses.",
  github: "https://github.com/thotamanikanta20975-png",
  instagram: "https://www.instagram.com/justt.manikanta",
  business: "Manikanta Automations",
};

export type NavItem = { id: string; label: string };
export const NAV: NavItem[] = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export type Skill = { sym: string; name: string; family: string; logo?: string; concept?: string; usedIn: string[] };
export const SKILL_GROUPS = ["Languages", "Web", "Automation", "Integrations", "AI", "Data", "Tools"] as const;
export const SKILLS: Skill[] = [
  { sym: "Py", name: "Python", family: "Languages", logo: "python", usedIn: ["AirType"] },
  { sym: "Jv", name: "Java", family: "Languages", logo: "openjdk", usedIn: [] },
  { sym: "Ht", name: "HTML", family: "Web", logo: "html5", usedIn: ["FoodRescue", "This portfolio"] },
  { sym: "Cs", name: "CSS", family: "Web", concept: "css", usedIn: ["FoodRescue", "This portfolio"] },
  { sym: "Ts", name: "TypeScript", family: "Web", logo: "typescript", usedIn: ["FoodRescue", "This portfolio"] },
  { sym: "Nx", name: "Next.js", family: "Web", logo: "nextdotjs", usedIn: ["FoodRescue", "This portfolio"] },
  { sym: "Tw", name: "Tailwind CSS", family: "Web", logo: "tailwindcss", usedIn: ["FoodRescue", "This portfolio"] },
  { sym: "N8", name: "n8n", family: "Automation", logo: "n8n", usedIn: ["Hospital AI Receptionist", "Dental Desk Bot", "Morning Rounds"] },
  { sym: "Wh", name: "Webhooks", family: "Automation", concept: "webhooks", usedIn: ["Hospital AI Receptionist"] },
  { sym: "Ap", name: "REST APIs", family: "Automation", concept: "api", usedIn: ["Hospital AI Receptionist"] },
  { sym: "Wa", name: "WhatsApp Cloud API", family: "Integrations", logo: "whatsapp", usedIn: ["Hospital AI Receptionist"] },
  { sym: "Tg", name: "Telegram Bots", family: "Integrations", logo: "telegram", usedIn: ["Hospital AI Receptionist", "Dental Desk Bot", "Morning Rounds"] },
  { sym: "Gs", name: "Google Sheets", family: "Integrations", logo: "googlesheets", usedIn: ["Hospital AI Receptionist", "Morning Rounds"] },
  { sym: "Gc", name: "Google Calendar", family: "Integrations", logo: "googlecalendar", usedIn: ["Hospital AI Receptionist"] },
  { sym: "Gm", name: "Google Gemini", family: "AI", logo: "googlegemini", usedIn: ["Hospital AI Receptionist", "Dental Desk Bot"] },
  { sym: "Ag", name: "AI Agents", family: "AI", concept: "agent", usedIn: ["Hospital AI Receptionist"] },
  { sym: "Pe", name: "Prompt Design", family: "AI", concept: "prompt", usedIn: ["Hospital AI Receptionist"] },
  { sym: "Cv", name: "OpenCV", family: "AI", logo: "opencv", usedIn: ["AirType"] },
  { sym: "Mp", name: "MediaPipe", family: "AI", logo: "mediapipe", usedIn: ["AirType"] },
  { sym: "Pr", name: "Prisma", family: "Data", logo: "prisma", usedIn: ["FoodRescue"] },
  { sym: "Pg", name: "PostgreSQL", family: "Data", logo: "postgresql", usedIn: ["FoodRescue"] },
  { sym: "Sb", name: "Supabase", family: "Data", logo: "supabase", usedIn: ["FoodRescue"] },
  { sym: "Vc", name: "Vercel", family: "Tools", logo: "vercel", usedIn: ["FoodRescue"] },
  { sym: "Gh", name: "Git & GitHub", family: "Tools", logo: "github", usedIn: ["AirType", "FoodRescue"] },
];

export type Project = {
  id: string;
  index: string;
  title: string;
  spine: string;
  kicker: string;
  description: string;
  features: string[];
  tech: { label: string; logo: string }[];
  github?: string;
  demo?: string;
  viz: "screenshot" | "food" | "keyboard" | "chat" | "list";
};

export const PROJECTS: Project[] = [
  {
    id: "hospital", index: "01", title: "Hospital AI Receptionist", spine: "Hospital AI Receptionist", kicker: "WhatsApp · n8n · 2026",
    description:
      "A WhatsApp receptionist for hospitals. Patients chat or send a voice note in Telugu, Hindi or English, and it books, reschedules or cancels appointments in each doctor's Google Calendar.",
    features: ["Voice note understanding", "Calendar booking and rescheduling", "Emergency alerts to staff", "Reminders and feedback requests", "Doctor leave check", "8 AM staff summary"],
    tech: [
      { label: "n8n", logo: "n8n" }, { label: "WhatsApp", logo: "whatsapp" }, { label: "Gemini", logo: "googlegemini" },
      { label: "Calendar", logo: "googlecalendar" }, { label: "Sheets", logo: "googlesheets" }, { label: "Telegram", logo: "telegram" },
    ],
    viz: "screenshot",
  },
  {
    id: "food", index: "02", title: "FoodRescue", spine: "FoodRescue", kicker: "Web app · Next.js",
    description:
      "A platform that connects food donors with verified NGOs and volunteers, so surplus food reaches people instead of the bin. A rule based matching engine scores NGOs by distance, quantity, urgency and reliability.",
    features: ["Smart NGO matching", "Donation status timeline", "Dashboards for every role", "Admin verification of NGOs", "Photo uploads", "Impact tracking"],
    tech: [
      { label: "Next.js", logo: "nextdotjs" }, { label: "TypeScript", logo: "typescript" }, { label: "Tailwind", logo: "tailwindcss" },
      { label: "Prisma", logo: "prisma" }, { label: "Supabase", logo: "supabase" }, { label: "Vercel", logo: "vercel" },
    ],
    github: "https://github.com/thotamanikanta20975-png/TEAM-IT",
    demo: "https://team-it-kappa.vercel.app",
    viz: "food",
  },
  {
    id: "airtype", index: "03", title: "AirType", spine: "AirType Gesture Keyboard", kicker: "Computer vision · Python",
    description:
      "A virtual keyboard you type on in the air. The webcam tracks your hand, your index fingertip becomes the cursor, and a pinch presses the key. A face check unlocks it only for a registered user.",
    features: ["21 point hand tracking", "Pinch to press keys", "Full QWERTY with Shift and Caps", "Face login before use", "Tunable sensitivity", "Types into any window"],
    tech: [{ label: "Python", logo: "python" }, { label: "OpenCV", logo: "opencv" }, { label: "MediaPipe", logo: "mediapipe" }],
    github: "https://github.com/thotamanikanta20975-png/Air-Gesture-Virtual-Keyboard",
    viz: "keyboard",
  },
  {
    id: "dental", index: "04", title: "Dental Desk Bot", spine: "Dental Desk Bot", kicker: "Telegram · n8n",
    description:
      "An AI receptionist for a dental clinic that runs on Telegram. It answers questions, handles bookings and alerts staff, built as a demo of the same receptionist engine.",
    features: ["Clinic FAQ answers", "Appointment handling", "Staff alerts", "Runs on Telegram"],
    tech: [{ label: "n8n", logo: "n8n" }, { label: "Telegram", logo: "telegram" }, { label: "Gemini", logo: "googlegemini" }],
    viz: "chat",
  },
  {
    id: "rounds", index: "05", title: "Morning Rounds", spine: "Morning Rounds", kicker: "Automation · Daily at 8 AM",
    description:
      "Every morning at 8 AM, hospital staff receive the day's appointments on Telegram, grouped by doctor and sorted by time, read straight from the booking sheet.",
    features: ["Runs every day at 8 AM", "Grouped by doctor", "Sorted by time", "No manual work"],
    tech: [{ label: "n8n", logo: "n8n" }, { label: "Sheets", logo: "googlesheets" }, { label: "Telegram", logo: "telegram" }],
    viz: "list",
  },
];

export type Stop = { year: string; title: string; place: string; detail: string };
export const EXPERIENCE: Stop[] = [
  {
    year: "2026 — Present", title: "Founder & AI Automation Developer", place: "Manikanta Automations · Amalapuram",
    detail: "Building WhatsApp AI receptionists for clinics and hospitals: appointment booking in Google Calendar, voice note understanding, reminders, feedback and staff alerts, all running on n8n.",
  },
  {
    year: "Projects", title: "Web apps and computer vision", place: "Independent projects on GitHub",
    detail: "FoodRescue, a food donation platform in Next.js with Supabase and Prisma, and AirType, a webcam gesture keyboard in Python with OpenCV and MediaPipe.",
  },
];
export const EDUCATION: Stop[] = [];
export const CERTIFICATIONS: { title: string; issuer: string }[] = [];
export const ACHIEVEMENTS: { label: string; caption: string; detail: string; value: number }[] = [];

export const ID_CARD = {
  rows: [
    ["Dept.", "AI Automation"],
    ["Base", "Amalapuram, AP"],
    ["Core", "n8n · Python"],
  ] as [string, string][],
  back: [
    "AI Automation Developer working mainly in n8n",
    "Builder of a WhatsApp AI receptionist for hospitals",
    "Built FoodRescue, a food donation platform in Next.js",
    "Built AirType, a gesture keyboard with OpenCV and MediaPipe",
    "Founder of Manikanta Automations",
  ],
};

export const QUICK_FACTS: [string, string][] = [
  ["Location", PROFILE.location],
  ["Focus", "AI automation with n8n"],
  ["Business", PROFILE.business],
  ["Languages", "Python, Java, HTML, CSS"],
  ["Email", PROFILE.email],
];
