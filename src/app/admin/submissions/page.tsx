import type { Metadata } from "next";
import Link from "next/link";
import { query } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import styles from "@/styles/components/admin.module.css";
import SubmissionActions from "./SubmissionActions";

export const metadata: Metadata = { title: "Review Submissions" };

interface Submission {
  id: string;
  status: string;
  submitted_at: string;
  reviewed_at: string | null;
  review_notes: string | null;
  job_title: string | null;
  creator_name: string | null;
  creator_email: string | null;
  job_id: string | null;
}

export default async function AdminSubmissionsPage() {
  let submissions: Submission[] = [];

  try {
    submissions = await query<Submission>(
      `SELECT cs.id, cs.status, cs.submitted_at, cs.reviewed_at, cs.review_notes,
              j.title as job_title, j.id as job_id,
              p.full_name as creator_name, p.email as creator_email
       FROM creator_submissions cs
       LEFT JOIN jobs j ON cs.job_id = j.id
       LEFT JOIN profiles p ON cs.creator_id = p.id
       ORDER BY CASE WHEN cs.status = 'pending' THEN 0 ELSE 1 END, cs.submitted_at DESC
       LIMIT 50`
    );
  } catch { /* empty */ }

  const pendingCount = submissions.filter(s => s.status === "pending").length;

  return (
    <div className="container">
      <div className="page-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1>Review Submissions</h1>
            <p style={{ fontSize: "var(--font-size-sm)", color: "var(--text-secondary)" }}>
              {pendingCount} pending review • {submissions.length} total
            </p>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className={styles.jobTable}>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Creator</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.job_title || "Untitled"}</td>
                  <td>
                    <span>{s.creator_name || "Unknown"}</span><br />
                    <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>{s.creator_email}</span>
                  </td>
                  <td>
                    <span className={s.status === "approved" ? styles.statusPublished : s.status === "rejected" ? styles.statusArchived : styles.statusDraft}>
                      {s.status}
                    </span>
                  </td>
                  <td style={{ fontSize: "var(--font-size-xs)" }}>{formatDate(s.submitted_at)}</td>
                  <td>
                    <div className={styles.tableActions}>
                      {s.job_id && (
                        <Link href={`/admin/jobs/${s.job_id}/edit`} className={`${styles.tableBtn} ${styles.editBtn}`}>View</Link>
                      )}
                      {s.status === "pending" && <SubmissionActions id={s.id} />}
                    </div>
                  </td>
                </tr>
              ))}
              {submissions.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>No submissions yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
