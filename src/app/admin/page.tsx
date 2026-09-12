import type { Metadata } from "next";
import Link from "next/link";
import { query } from "@/lib/db";
import styles from "@/styles/components/admin.module.css";

export const metadata: Metadata = { title: "Admin Dashboard", description: "Admin panel for managing jobs and content." };

async function getStats() {
  try {
    const [totalJobs, published, draft, expired, pendingSubmissions, totalUsers, totalMessages] = await Promise.all([
      query<{ count: string }>("SELECT COUNT(*) as count FROM jobs"),
      query<{ count: string }>("SELECT COUNT(*) as count FROM jobs WHERE status = 'published'"),
      query<{ count: string }>("SELECT COUNT(*) as count FROM jobs WHERE status = 'draft'"),
      query<{ count: string }>("SELECT COUNT(*) as count FROM jobs WHERE status = 'published' AND application_deadline < NOW()"),
      query<{ count: string }>("SELECT COUNT(*) as count FROM creator_submissions WHERE status = 'pending'"),
      query<{ count: string }>("SELECT COUNT(*) as count FROM profiles"),
      query<{ count: string }>("SELECT COUNT(*) as count FROM contact_messages WHERE status = 'unread'"),
    ]);
    return {
      totalJobs: parseInt(totalJobs[0]?.count || "0"),
      published: parseInt(published[0]?.count || "0"),
      draft: parseInt(draft[0]?.count || "0"),
      expired: parseInt(expired[0]?.count || "0"),
      pendingSubmissions: parseInt(pendingSubmissions[0]?.count || "0"),
      totalUsers: parseInt(totalUsers[0]?.count || "0"),
      totalMessages: parseInt(totalMessages[0]?.count || "0"),
    };
  } catch {
    return { totalJobs: 0, published: 0, draft: 0, expired: 0, pendingSubmissions: 0, totalUsers: 0, totalMessages: 0 };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="container">
      <div className="page-section">
        <h1 style={{ marginBottom: 24 }}>Admin Dashboard</h1>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{stats.totalJobs}</span>
            <span className={styles.statLabel}>Total Jobs</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum} style={{ color: "var(--success-600)" }}>{stats.published}</span>
            <span className={styles.statLabel}>Published</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum} style={{ color: "var(--warning-600)" }}>{stats.draft}</span>
            <span className={styles.statLabel}>Drafts</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum} style={{ color: "var(--danger-600)" }}>{stats.expired}</span>
            <span className={styles.statLabel}>Expired</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum} style={{ color: "var(--primary-600)" }}>{stats.pendingSubmissions}</span>
            <span className={styles.statLabel}>Pending Reviews</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{stats.totalUsers}</span>
            <span className={styles.statLabel}>Users</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{stats.totalMessages}</span>
            <span className={styles.statLabel}>Unread Messages</span>
          </div>
        </div>

        <div className={styles.quickActions}>
          <h2 style={{ marginBottom: 16 }}>Quick Actions</h2>
          <div className={styles.actionGrid}>
            <Link href="/admin/jobs/new" className={styles.actionCard}>
              <span>➕</span> Add New Job
            </Link>
            <Link href="/admin/ai-creator" className={styles.actionCard}>
              <span>🤖</span> AI Job Creator
            </Link>
            <Link href="/admin/jobs" className={styles.actionCard}>
              <span>📋</span> Manage Jobs
            </Link>
            <Link href="/admin/submissions" className={styles.actionCard}>
              <span>📝</span> Review Submissions
            </Link>
            <Link href="/admin/messages" className={styles.actionCard}>
              <span>💬</span> View Messages
            </Link>
            <Link href="/admin/users" className={styles.actionCard}>
              <span>👥</span> Manage Users
            </Link>
            <Link href="/admin/bulk-import" className={styles.actionCard}>
              <span>📦</span> Bulk Import
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
