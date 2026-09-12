import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import type { Job } from "@/lib/types";
import JobCard from "@/components/jobs/JobCard";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;
  const userId = (user as { id?: string })?.id;
  const role = (user as { role?: string })?.role;

  let bookmarks: Job[] = [];
  let applicationCount = 0;
  let alertCount = 0;

  if (userId) {
    try {
      const [bk, appRes, alertRes] = await Promise.all([
        query<Job>(
          `SELECT j.* FROM jobs j INNER JOIN bookmarks b ON j.id = b.job_id WHERE b.user_id = $1 ORDER BY b.created_at DESC LIMIT 6`,
          [userId]
        ),
        query<{ count: string }>(
          `SELECT COUNT(*) as count FROM applications WHERE user_id = $1`, [userId]
        ),
        query<{ count: string }>(
          `SELECT COUNT(*) as count FROM job_alerts WHERE user_id = $1 AND is_active = true`, [userId]
        ),
      ]);
      bookmarks = bk;
      applicationCount = parseInt(appRes[0]?.count || "0");
      alertCount = parseInt(alertRes[0]?.count || "0");
    } catch { /* empty */ }
  }

  return (
    <div className="container">
      <div className="page-section">
        {/* Welcome Header */}
        <div style={{
          background: "linear-gradient(135deg, #1a2332 0%, #2d3a4a 100%)",
          borderRadius: "var(--radius-lg)", padding: "28px 24px", color: "#fff",
          marginBottom: 24,
        }}>
          <h1 style={{ fontSize: "var(--font-size-2xl)", fontWeight: 700, marginBottom: 4, color: "#fff" }}>
            Welcome back, {user?.name?.split(" ")[0] || "User"} 👋
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "var(--font-size-sm)" }}>
            {user?.email}
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 12, marginBottom: 32,
        }}>
          <Link href="/dashboard/bookmarks" style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            padding: 20, background: "#fff", border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)", textDecoration: "none", color: "var(--text-primary)",
            transition: "box-shadow 0.2s",
          }}>
            <span style={{ fontSize: "var(--font-size-2xl)", fontWeight: 800, color: "var(--primary-600)" }}>
              {bookmarks.length}
            </span>
            <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)", fontWeight: 500 }}>Saved Jobs</span>
          </Link>

          <Link href="/dashboard/applications" style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            padding: 20, background: "#fff", border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)", textDecoration: "none", color: "var(--text-primary)",
          }}>
            <span style={{ fontSize: "var(--font-size-2xl)", fontWeight: 800, color: "var(--success-600)" }}>
              {applicationCount}
            </span>
            <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)", fontWeight: 500 }}>Applications</span>
          </Link>

          <Link href="/dashboard/alerts" style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            padding: 20, background: "#fff", border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)", textDecoration: "none", color: "var(--text-primary)",
          }}>
            <span style={{ fontSize: "var(--font-size-2xl)", fontWeight: 800, color: "var(--warning-600)" }}>
              {alertCount}
            </span>
            <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)", fontWeight: 500 }}>Active Alerts</span>
          </Link>

          {(role === "admin" || role === "creator") && (
            <Link href={role === "admin" ? "/admin" : "/creator"} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              padding: 20, background: "#fff", border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)", textDecoration: "none", color: "var(--text-primary)",
            }}>
              <span style={{ fontSize: "var(--font-size-2xl)" }}>⚙️</span>
              <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)", fontWeight: 500 }}>
                {role === "admin" ? "Admin Panel" : "Creator Portal"}
              </span>
            </Link>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
          <Link href="/jobs" className="btn btn-primary btn-sm">🔍 Browse Jobs</Link>
          <Link href="/dashboard/bookmarks" className="btn btn-outline btn-sm">📌 Saved Jobs</Link>
          <Link href="/dashboard/applications" className="btn btn-outline btn-sm">📊 My Applications</Link>
          <Link href="/dashboard/alerts" className="btn btn-outline btn-sm">🔔 Job Alerts</Link>
        </div>

        {/* Saved Jobs Preview */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: "var(--font-size-lg)", fontWeight: 700 }}>Saved Jobs</h2>
            {bookmarks.length > 0 && (
              <Link href="/dashboard/bookmarks" style={{ fontSize: "var(--font-size-sm)", color: "var(--primary-600)" }}>
                View all →
              </Link>
            )}
          </div>
          {bookmarks.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
              {bookmarks.slice(0, 6).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: "center", padding: 40, background: "#fff",
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
    </div>
  );
}
