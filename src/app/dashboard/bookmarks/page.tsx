import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import type { Job } from "@/lib/types";
import JobCard from "@/components/jobs/JobCard";

export const metadata: Metadata = { title: "Saved Jobs" };

export default async function BookmarksPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;

  let bookmarks: Job[] = [];
  if (userId) {
    try {
      bookmarks = await query<Job>(
        `SELECT j.* FROM jobs j
         INNER JOIN bookmarks b ON j.id = b.job_id
         WHERE b.user_id = $1
         ORDER BY b.created_at DESC`,
        [userId]
      );
    } catch { /* empty */ }
  }

  return (
    <div className="container">
      <div className="page-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: "var(--font-size-xl)" }}>Saved Jobs ({bookmarks.length})</h1>
          <Link href="/dashboard" className="btn btn-secondary btn-sm">← Dashboard</Link>
        </div>

        {bookmarks.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
            {bookmarks.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center", padding: 48, background: "#fff",
            borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-color)",
          }}>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)", marginBottom: 16 }}>
              You haven&apos;t saved any jobs yet. Browse jobs and save ones you&apos;re interested in.
            </p>
            <Link href="/jobs" className="btn btn-primary btn-sm">Browse Jobs</Link>
          </div>
        )}
      </div>
    </div>
  );
}
