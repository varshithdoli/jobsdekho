import type { Metadata } from "next";
import Link from "next/link";
import { query } from "@/lib/db";
import type { Job } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import styles from "@/styles/components/admin.module.css";

export const metadata: Metadata = { title: "Manage Jobs" };

export default async function AdminJobsPage({ searchParams }: { searchParams: Promise<{ page?: string; status?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));
  const status = sp.status || "";
  const limit = 20;
  const offset = (page - 1) * limit;

  let jobs: Job[] = [];
  let total = 0;

  try {
    const validStatuses = ["draft", "pending", "published", "expired", "archived", "rejected"];
    const safeStatus = validStatuses.includes(status) ? status : "";
    const condition = safeStatus ? "WHERE status = $3" : "";
    const baseParams = safeStatus ? [limit, offset, safeStatus] : [limit, offset];
    const [jobsResult, countResult] = await Promise.all([
      query<Job>(`SELECT * FROM jobs ${condition} ORDER BY created_at DESC LIMIT $1 OFFSET $2`, baseParams),
      query<{ count: string }>(`SELECT COUNT(*) as count FROM jobs ${condition}`, safeStatus ? [safeStatus] : []),
    ]);
    jobs = jobsResult;
    total = parseInt(countResult[0]?.count || "0");
  } catch { /* empty */ }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container">
      <div className="page-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h1>Manage Jobs ({total})</h1>
          <Link href="/admin/jobs/new" className="btn btn-primary btn-sm">+ Add New Job</Link>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <Link href="/admin/jobs" className={`btn btn-sm ${!status ? "btn-primary" : "btn-outline"}`}>All</Link>
          <Link href="/admin/jobs?status=published" className={`btn btn-sm ${status === "published" ? "btn-primary" : "btn-outline"}`}>Published</Link>
          <Link href="/admin/jobs?status=draft" className={`btn btn-sm ${status === "draft" ? "btn-primary" : "btn-outline"}`}>Drafts</Link>
          <Link href="/admin/jobs?status=archived" className={`btn btn-sm ${status === "archived" ? "btn-primary" : "btn-outline"}`}>Archived</Link>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className={styles.jobTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Verified</th>
                <th>Views</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <Link href={`/admin/jobs/${job.id}/edit`} style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                      {job.title}
                    </Link>
                    <br />
                    <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>{job.organization}</span>
                  </td>
                  <td><span className="badge badge-gray">{job.category}</span></td>
                  <td>
                    <span className={job.status === "published" ? styles.statusPublished : job.status === "draft" ? styles.statusDraft : styles.statusArchived}>
                      {job.status}
                    </span>
                  </td>
                  <td>{job.is_verified ? "✅" : "—"}</td>
                  <td>{job.views_count || 0}</td>
                  <td style={{ fontSize: "var(--font-size-xs)" }}>{formatDate(job.created_at)}</td>
                  <td>
                    <div className={styles.tableActions}>
                      <Link href={`/admin/jobs/${job.id}/edit`} className={`${styles.tableBtn} ${styles.editBtn}`}>Edit</Link>
                      <Link href={`/jobs/${job.slug}`} className={styles.tableBtn} target="_blank" style={{ background: "var(--gray-100)", color: "var(--text-primary)" }}>View</Link>
                    </div>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>No jobs found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination" style={{ marginTop: 24 }}>
            {page > 1 && <Link href={`/admin/jobs?page=${page - 1}&status=${status}`} className="pagination-btn">← Prev</Link>}
            <span style={{ padding: "8px 12px", fontSize: "var(--font-size-sm)" }}>Page {page} of {totalPages}</span>
            {page < totalPages && <Link href={`/admin/jobs?page=${page + 1}&status=${status}`} className="pagination-btn">Next →</Link>}
          </div>
        )}
      </div>
    </div>
  );
}
