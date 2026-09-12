import Link from "next/link";
import type { Job } from "@/lib/types";
import { formatDate, formatSalary, getDeadlineStatus, truncate, getCategorySlug } from "@/lib/utils";
import styles from "@/styles/components/jobcard.module.css";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const deadlineStatus = getDeadlineStatus(job.application_deadline);
  const salary = formatSalary(job.salary_min, job.salary_max, job.salary_period);

  return (
    <article className={`card ${styles.jobCard}`}>
      <Link href={`/jobs/${job.slug}`} className={styles.cardLink}>
        <div className={styles.cardTop}>
          <div className={styles.badges}>
            <span className={`badge badge-primary`}>
              {getCategoryLabel(job.category)}
            </span>
            {job.is_verified && (
              <span className={`badge badge-success`}>✓ Verified</span>
            )}
            {job.is_featured && (
              <span className={`badge badge-warning`}>⭐ Featured</span>
            )}
            {job.is_urgent && (
              <span className={`badge badge-danger`}>🔥 Urgent</span>
            )}
            {job.is_sponsored && (
              <span className={`badge badge-gray`}>Sponsored</span>
            )}
          </div>
        </div>

        <div className="card-body">
          <h3 className={styles.title}>{job.title}</h3>
          <p className={styles.org}>{job.organization}</p>

          <div className={styles.meta}>
            {job.location && (
              <span className={styles.metaItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {job.location}
              </span>
            )}
            {job.work_mode && (
              <span className={styles.metaItem}>
                {job.work_mode === "remote" || job.work_mode === "work-from-home" ? "🏠" : "🏢"}{" "}
                {job.work_mode.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            )}
            {(job.experience_min !== null || job.experience_max !== null) && (
              <span className={styles.metaItem}>
                💼 {job.experience_min || 0}–{job.experience_max || "5+"}yr
              </span>
            )}
          </div>

          <div className={styles.details}>
            {salary !== "Not disclosed" && (
              <span className={styles.salary}>{salary}</span>
            )}
            {job.vacancies && (
              <span className={styles.vacancies}>{job.vacancies} vacancies</span>
            )}
          </div>

          <div className={styles.footer}>
            {job.application_deadline && (
              <span className={`${styles.deadline} ${deadlineStatus === "urgent" ? styles.deadlineUrgent : ""} ${deadlineStatus === "expired" ? styles.deadlineExpired : ""}`}>
                {deadlineStatus === "expired"
                  ? "Expired"
                  : `Deadline: ${formatDate(job.application_deadline)}`}
              </span>
            )}
            <span className={styles.apply}>View & Apply →</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    government: "Govt",
    it: "IT",
    "non-it": "Non-IT",
    bank: "Bank",
    railway: "Railway",
    defence: "Defence",
    internship: "Internship",
    apprenticeship: "Apprenticeship",
    walkin: "Walk-in",
    fresher: "Fresher",
    remote: "Remote",
    scholarship: "Scholarship",
    exam: "Exam",
  };
  return labels[category] || category;
}
