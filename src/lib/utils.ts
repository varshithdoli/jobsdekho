export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatSalary(
  min: number | null,
  max: number | null,
  period: string | null
): string {
  if (!min && !max) return "Not disclosed";

  const fmt = (n: number) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
    return `₹${n.toLocaleString("en-IN")}`;
  };

  const periodLabel = period === "yearly" ? "/yr" : period === "monthly" ? "/mo" : "";

  if (min && max && min !== max) return `${fmt(min)} – ${fmt(max)}${periodLabel}`;
  if (min) return `${fmt(min)}${periodLabel}`;
  if (max) return `Up to ${fmt(max)}${periodLabel}`;
  return "Not disclosed";
}

export function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getDeadlineStatus(
  dateStr: string | null
): "expired" | "urgent" | "upcoming" | "open" | null {
  const days = daysUntil(dateStr);
  if (days === null) return null;
  if (days < 0) return "expired";
  if (days <= 3) return "urgent";
  if (days <= 7) return "upcoming";
  return "open";
}

export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + "…";
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    government: "Government Jobs",
    it: "IT Jobs",
    "non-it": "Non-IT Jobs",
    bank: "Bank Jobs",
    railway: "Railway Jobs",
    defence: "Defence Jobs",
    internship: "Internships",
    apprenticeship: "Apprenticeships",
    walkin: "Walk-in Interviews",
    fresher: "Fresher Jobs",
    remote: "Remote Jobs",
    scholarship: "Scholarships",
    exam: "Competitive Exams",
  };
  return labels[category] || category;
}

export function getCategorySlug(category: string): string {
  const slugs: Record<string, string> = {
    government: "government-jobs",
    it: "it-jobs",
    "non-it": "non-it-jobs",
    bank: "bank-jobs",
    railway: "railway-jobs",
    defence: "defence-jobs",
    internship: "internships",
    apprenticeship: "apprenticeships",
    walkin: "walk-in-interviews",
    fresher: "fresher-jobs",
    remote: "remote-jobs",
    scholarship: "scholarships",
    exam: "exams",
  };
  return slugs[category] || category;
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

export function generateMetaDescription(job: {
  title: string;
  organization: string;
  location?: string | null;
  application_deadline?: string | null;
}): string {
  let desc = `${job.title} at ${job.organization}`;
  if (job.location) desc += ` in ${job.location}`;
  if (job.application_deadline)
    desc += `. Apply before ${formatDate(job.application_deadline)}`;
  desc += ". Check eligibility, salary, selection process & apply online.";
  return truncate(desc, 160);
}
