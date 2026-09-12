import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "My Applications" };

interface Application {
  id: string;
  status: string;
  applied_at: string;
  title: string;
  organization: string;
  slug: string;
  location: string | null;
  job_status: string;
  application_deadline: string | null;
  category: string;
}

export default async function ApplicationsPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;

  let applications: Application[] = [];
  if (userId) {
    try {
      applications = await query<Application>(
        `SELECT a.id, a.status, a.applied_at,
                j.title, j.organization, j.slug, j.location, j.status as job_status,
                j.application_deadline, j.category
         FROM applications a
         JOIN jobs j ON j.id = a.job_id
         WHERE a.user_id = $1
         ORDER BY a.applied_at DESC`,
        [userId]
      );
    } catch { /* empty */ }
  }

  return (
    <div className="container">
      <div className="page-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: "var(--font-size-xl)" }}>My Applications</h1>
          <Link href="/dashboard" className="btn btn-secondary btn-sm">← Dashboard</Link>
        </div>

        {applications.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {applications.map((app) => (
              <div key={app.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: 16, background: "#fff", border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-lg)", gap: 16, flexWrap: "wrap",
              }}>
                <div>
                  <Link href={`/jobs/${app.slug}`} style={{
                    fontSize: "var(--font-size-base)", fontWeight: 600,
                    color: "var(--primary-700)", textDecoration: "none",
                  }}>
                    {app.title}
                  </Link>
                  <p style={{ fontSize: "var(--font-size-sm)", color: "var(--text-secondary)", marginTop: 2 }}>
                    {app.organization} {app.location ? `• ${app.location}` : ""}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexShrink: 0 }}>
                  <span className={`badge ${app.job_status === "published" ? "badge-success" : "badge-gray"}`}>
                    {app.job_status}
                  </span>
                  <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>
                    Applied {formatDate(app.applied_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center", padding: 48, background: "#fff",
            borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-color)",
          }}>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)", marginBottom: 16 }}>
              No applications tracked yet. When you click &quot;Apply&quot; on a job, it will be tracked here.
            </p>
            <Link href="/jobs" className="btn btn-primary btn-sm">Browse Jobs</Link>
          </div>
        )}
      </div>
    </div>
  );
}
