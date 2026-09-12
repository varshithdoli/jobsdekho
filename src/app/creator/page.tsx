import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import type { SessionWithRole } from "@/lib/auth";
import styles from "@/styles/components/admin.module.css";

export const metadata: Metadata = { title: "Creator Portal" };

export default async function CreatorPortalPage() {
  const session = await auth();
  const user = (session as unknown as SessionWithRole)?.user;

  let stats = { total: 0, pending: 0, approved: 0, rejected: 0 };
  let submissions: { id: string; status: string; submitted_at: string; job_title?: string }[] = [];

  if (user?.id) {
    try {
      const [totalR, pendingR, approvedR, rejectedR] = await Promise.all([
        query<{ count: string }>("SELECT COUNT(*) as count FROM creator_submissions WHERE creator_id = $1", [user.id]),
        query<{ count: string }>("SELECT COUNT(*) as count FROM creator_submissions WHERE creator_id = $1 AND status = 'pending'", [user.id]),
        query<{ count: string }>("SELECT COUNT(*) as count FROM creator_submissions WHERE creator_id = $1 AND status = 'approved'", [user.id]),
        query<{ count: string }>("SELECT COUNT(*) as count FROM creator_submissions WHERE creator_id = $1 AND status = 'rejected'", [user.id]),
      ]);
      stats = {
        total: parseInt(totalR[0]?.count || "0"),
        pending: parseInt(pendingR[0]?.count || "0"),
        approved: parseInt(approvedR[0]?.count || "0"),
        rejected: parseInt(rejectedR[0]?.count || "0"),
      };

      submissions = await query<{ id: string; status: string; submitted_at: string; job_title?: string }>(
        `SELECT cs.id, cs.status, cs.submitted_at, j.title as job_title
         FROM creator_submissions cs LEFT JOIN jobs j ON cs.job_id = j.id
         WHERE cs.creator_id = $1 ORDER BY cs.submitted_at DESC LIMIT 20`,
        [user.id]
      );
    } catch { /* empty */ }
  }

  return (
    <div className="container">
      <div className="page-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1>Creator Portal</h1>
          <Link href="/creator/submit" className="btn btn-primary btn-sm">+ Submit New Job</Link>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{stats.total}</span>
            <span className={styles.statLabel}>Total Submissions</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum} style={{ color: "var(--warning-600)" }}>{stats.pending}</span>
            <span className={styles.statLabel}>Pending Review</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum} style={{ color: "var(--success-600)" }}>{stats.approved}</span>
            <span className={styles.statLabel}>Approved</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum} style={{ color: "var(--danger-600)" }}>{stats.rejected}</span>
            <span className={styles.statLabel}>Rejected</span>
          </div>
        </div>

        <h2 style={{ marginBottom: 16 }}>Your Submissions</h2>
        {submissions.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table className={styles.jobTable}>
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Status</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.job_title || "Untitled"}</td>
                    <td>
                      <span className={s.status === "approved" ? styles.statusPublished : s.status === "rejected" ? styles.statusArchived : styles.statusDraft}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ fontSize: "var(--font-size-xs)" }}>
                      {new Date(s.submitted_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: 48, background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-color)" }}>
            <p style={{ color: "var(--text-secondary)", marginBottom: 16 }}>You haven&apos;t submitted any jobs yet.</p>
            <Link href="/creator/submit" className="btn btn-primary">Submit Your First Job</Link>
          </div>
        )}
      </div>
    </div>
  );
}
