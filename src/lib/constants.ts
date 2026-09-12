import type { JobCategory } from "./types";

export const SITE_NAME = "JobsDekho";
export const SITE_TAGLINE = "Discover Verified Career Opportunities Across India";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const CATEGORIES: {
  slug: string;
  label: string;
  category: JobCategory;
  description: string;
  icon: string;
}[] = [
  {
    slug: "government-jobs",
    label: "Government Jobs",
    category: "government",
    description: "Central & State Government vacancies",
    icon: "🏛️",
  },
  {
    slug: "it-jobs",
    label: "IT Jobs",
    category: "it",
    description: "Software, Data, Cloud & Tech roles",
    icon: "💻",
  },
  {
    slug: "non-it-jobs",
    label: "Non-IT Jobs",
    category: "non-it",
    description: "Marketing, Sales, HR & more",
    icon: "💼",
  },
  {
    slug: "bank-jobs",
    label: "Bank Jobs",
    category: "bank",
    description: "Banking & Financial sector opportunities",
    icon: "🏦",
  },
  {
    slug: "railway-jobs",
    label: "Railway Jobs",
    category: "railway",
    description: "Indian Railways recruitment",
    icon: "🚂",
  },
  {
    slug: "defence-jobs",
    label: "Defence Jobs",
    category: "defence",
    description: "Army, Navy, Air Force & paramilitary",
    icon: "🎖️",
  },
  {
    slug: "internships",
    label: "Internships",
    category: "internship",
    description: "Paid & unpaid internship opportunities",
    icon: "🎓",
  },
  {
    slug: "apprenticeships",
    label: "Apprenticeships",
    category: "apprenticeship",
    description: "Government & private apprenticeships",
    icon: "🔧",
  },
  {
    slug: "walk-in-interviews",
    label: "Walk-in Interviews",
    category: "walkin",
    description: "Direct walk-in interview opportunities",
    icon: "🚶",
  },
  {
    slug: "fresher-jobs",
    label: "Fresher Jobs",
    category: "fresher",
    description: "Entry-level jobs for fresh graduates",
    icon: "🌱",
  },
  {
    slug: "remote-jobs",
    label: "Remote Jobs",
    category: "remote",
    description: "Work from home & remote opportunities",
    icon: "🏠",
  },
  {
    slug: "scholarships",
    label: "Scholarships",
    category: "scholarship",
    description: "Education scholarships & fellowships",
    icon: "📚",
  },
  {
    slug: "exams",
    label: "Competitive Exams",
    category: "exam",
    description: "Upcoming competitive exam notifications",
    icon: "📝",
  },
];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Chandigarh", "Puducherry", "Jammu & Kashmir", "Ladakh",
  "Andaman & Nicobar Islands", "Dadra & Nagar Haveli and Daman & Diu", "Lakshadweep",
  "All India",
];

export const WORK_MODES = [
  { value: "onsite", label: "On-site" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "work-from-home", label: "Work from Home" },
];

export const EXPERIENCE_OPTIONS = [
  { value: "0", label: "Freshers (0 years)" },
  { value: "1", label: "1 year" },
  { value: "2", label: "2 years" },
  { value: "3", label: "3 years" },
  { value: "5", label: "5+ years" },
  { value: "10", label: "10+ years" },
];

export const ITEMS_PER_PAGE = 20;
