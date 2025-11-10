import type {
  AdminRequest,
  CalendarSession,
  ClubEvent,
  FeatureCard,
  LeaderboardEntry,
  ProjectInterestRequest,
  ShowcaseProject,
} from "@/types";

export const heroStats = [
  { label: "Active Members", value: "320+", detail: "product builders" },
  { label: "Projects Shipped", value: "58", detail: "community builds" },
  { label: "Workshops / yr", value: "42", detail: "hands-on labs" },
  { label: "Partner Mentors", value: "24", detail: "industry experts" },
];

export const featureCards: FeatureCard[] = [
  {
    title: "Collaborative Projects",
    description:
      "Squad up with designers, devs, and mentors to ship community products with modern stacks.",
    highlight: "Ship multi-week builds with real users.",
    icon: "Code2",
  },
  {
    title: "Tech Events",
    description:
      "Workshops, hack nights, and lightning talks crafted by engineers, product folks, and alumni.",
    highlight: "Stay future-proof with weekly sessions.",
    icon: "CalendarDays",
  },
  {
    title: "Expert Mentorship",
    description:
      "Access mentors from FAANG, YC startups, and research labs for reviews, mock interviews, and more.",
    highlight: "1:1 office hours + async feedback.",
    icon: "Sparkles",
  },
  {
    title: "Gamified Growth",
    description:
      "Earn badges, stack points, and climb custom leaderboards that celebrate deep work and impact.",
    highlight: "Track learning across seasons.",
    icon: "Trophy",
  },
];

export const techStack = [
  "React",
  "Next.js",
  "TypeScript",
  "Firebase",
  "Node.js",
  "Python",
  "MongoDB",
  "Docker",
  "AWS",
  "GitHub",
];

export const journeySteps = [
  {
    title: "01 · Submit Your Story",
    summary:
      "Introduce yourself, your stack, and what you want to build with the club.",
    micro: ["Pick interest tracks", "Share GitHub or dribbble", "Tell us your goal"],
  },
  {
    title: "02 · Login & Explore",
    summary:
      "Track project needs, request to join squads, and RSVP to events through the portal.",
    micro: ["Review live projects", "Claim open tasks", "Track deliverables"],
  },
  {
    title: "03 · Collaborate & Earn",
    summary:
      "Pair with mentors, contribute code, get awarded points, and climb the leaderboard.",
    micro: ["Sync with mentors", "Demo your work", "Unlock club perks"],
  },
];

export const showcaseProjects: ShowcaseProject[] = [
  {
    id: "geetansh-project",
    title: "Dev Club Portal",
    description:
      "Modern club management system with project tracking, event RSVPs, and member dashboard.",
    status: "active",
    members: 1,
    tech: ["Next.js", "Firebase", "TypeScript", "Tailwind"],
    owner: "Geetansh Goyal",
    ownerId: "geetansh-1", // Match user ID for ownership check
  },
  // Add more projects here as needed
];

export const upcomingEvents: ClubEvent[] = [
  {
    id: "react-ignite",
    title: "React Ignite Workshop",
    summary: "Advanced patterns with React Server Components + streaming UI.",
    date: "2025-01-18",
    time: "18:00",
    location: "Innovation Lab · Block C",
    capacity: 40,
    attendees: 28,
    type: "workshop",
  },
  {
    id: "hack-impact",
    title: "Hack for Impact 2025",
    summary: "48-hour campus hackathon building tools for education & sustainability.",
    date: "2025-02-02",
    time: "09:00",
    location: "Makerspace Arena",
    capacity: 120,
    attendees: 76,
    type: "hackathon",
  },
  {
    id: "mentor-round",
    title: "Mentor Roundtables",
    summary: "Ask-me-anything with alumni devs from YC-backed startups.",
    date: "2025-01-26",
    time: "17:30",
    location: "Studio 3 • Dev Hub",
    capacity: 25,
    attendees: 19,
    type: "talk",
  },
];

export const calendarSessions: CalendarSession[] = [
  {
    id: "html-foundations",
    date: "2025-11-12",
    title: "HTML Foundations Live",
    type: "Workshop",
    focus:
      "What is HTML, hyper text, inline vs block elements, semantic tags, fun projects overview, box model.",
  },
  {
    id: "css-core-01",
    date: "2025-11-14",
    title: "CSS Core Concepts I",
    type: "Workshop",
    focus: "Inline vs internal vs external CSS, structuring styles for club projects.",
  },
  {
    id: "css-core-02",
    date: "2025-11-19",
    title: "CSS Core Concepts II",
    type: "Workshop",
    focus: "Classes, IDs, specificity + preference, creating shapes (circle demo).",
  },
];

export const leaderboardPreview: LeaderboardEntry[] = [
  { id: "geetansh", rank: 1, name: "Geetansh Goyal", role: "mentor", points: 1800, badges: 7 },
  { id: "utsav", rank: 2, name: "Utsav", role: "student", points: 1200, badges: 4 },
  { id: "user3", rank: 3, name: "User Three", role: "student", points: 800, badges: 2 },
  { id: "user4", rank: 4, name: "User Four", role: "student", points: 600, badges: 1 },
];

export const adminQueue: AdminRequest[] = [
  {
    id: "req-1",
    name: "Rahul Sharma",
    email: "rahul@campus.dev",
    requestedAt: "2025-11-10",
    role: "student",
    interests: ["Web Development", "AI/ML"],
    portfolio: "https://github.com/rahulsharma",
  },
  {
    id: "req-2",
    name: "Priya Patel",
    email: "priya@campus.dev",
    requestedAt: "2025-11-09",
    role: "student",
    interests: ["Mobile Apps", "Design Systems"],
    portfolio: "https://priya.design",
  },
  {
    id: "req-3",
    name: "Amit Kumar",
    email: "amit@campus.dev",
    requestedAt: "2025-11-08",
    role: "mentor",
    interests: ["DevOps", "Cloud Infrastructure"],
    portfolio: "https://github.com/amitkumar",
  },
];

export const availableInterests = [
  "AI/ML",
  "Web Apps",
  "Design Systems",
  "Product Strategy",
  "Mobile",
  "DevOps",
  "Cloud",
  "Cybersecurity",
];

export const projectInterestRequests: ProjectInterestRequest[] = [
  {
    id: "interest-1",
    projectId: "geetansh-project",
    projectName: "Dev Club Portal",
    userId: "utsav-1",
    userName: "Utsav",
    userEmail: "utsav@nstswc.com",
    requestedAt: "2025-11-10",
    status: "pending",
  },
  // Add more as users request to join projects
];
