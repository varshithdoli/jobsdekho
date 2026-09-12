export interface Job {
  id: string;
  slug: string;
  title: string;
  organization: string;
  description: string | null;
  category: JobCategory;
  subcategory: string | null;
  location: string | null;
  state: string | null;
  city: string | null;
  work_mode: WorkMode | null;
  experience_min: number | null;
  experience_max: number | null;
  education: string | null;
  skills: string[] | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_period: SalaryPeriod | null;
  vacancies: number | null;
  application_start: string | null;
  application_deadline: string | null;
  selection_process: string | null;
  application_fee: string | null;
  important_dates: ImportantDate[] | null;
  eligibility_summary: string | null;
  age_limit: string | null;
  official_notification_url: string | null;
  official_apply_url: string;
  source: string | null;
  who_should_apply: string | null;
  faq: FAQ[] | null;
  is_verified: boolean;
  verified_at: string | null;
  last_verified_at: string | null;
  verification_notes: string | null;
  status: JobStatus;
  is_featured: boolean;
  is_urgent: boolean;
  is_sponsored: boolean;
  rejection_reason: string | null;
  published_at: string | null;
  expires_at: string | null;
  views_count: number;
  clicks_count: number;
  shares_count: number;
  created_by: string;
  submitted_by_creator: boolean;
  creator_id: string | null;
  tags: string[] | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export type JobCategory =
  | "government"
  | "it"
  | "non-it"
  | "bank"
  | "railway"
  | "defence"
  | "internship"
  | "apprenticeship"
  | "walkin"
  | "fresher"
  | "remote"
  | "scholarship"
  | "exam";

export type WorkMode = "onsite" | "remote" | "hybrid" | "work-from-home";

export type SalaryPeriod = "monthly" | "yearly" | "stipend";

export type JobStatus =
  | "draft"
  | "pending"
  | "published"
  | "expired"
  | "archived"
  | "rejected";

export interface ImportantDate {
  label: string;
  date: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "user" | "creator" | "admin";
  phone: string | null;
  location: string | null;
  is_email_verified: boolean;
  creator_status: CreatorStatus;
  creator_bio: string | null;
  creator_website: string | null;
  reputation_score: number;
  created_at: string;
  updated_at: string;
}

export type CreatorStatus =
  | "none"
  | "pending"
  | "approved"
  | "suspended"
  | "banned";

export interface Bookmark {
  id: string;
  user_id: string;
  job_id: string;
  created_at: string;
}

export interface Report {
  id: string;
  job_id: string;
  reporter_id: string | null;
  reporter_email: string | null;
  report_type: ReportType;
  description: string | null;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  admin_notes: string | null;
  created_at: string;
  resolved_at: string | null;
}

export type ReportType =
  | "incorrect_info"
  | "scam"
  | "expired"
  | "broken_link"
  | "other";

export interface CreatorSubmission {
  id: string;
  creator_id: string;
  job_id: string | null;
  status: "pending" | "under_review" | "approved" | "rejected";
  reviewer_id: string | null;
  review_notes: string | null;
  submitted_at: string;
  reviewed_at: string | null;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  admin_notes: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  details: Record<string, unknown> | null;
  ip_hash: string | null;
  created_at: string;
}

export interface JobFilters {
  category?: JobCategory;
  location?: string;
  work_mode?: WorkMode;
  experience?: string;
  search?: string;
  status?: JobStatus;
  page?: number;
  limit?: number;
  sort?: "latest" | "deadline" | "views" | "salary";
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
