import type { Metadata } from "next";
import { query } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import styles from "@/styles/components/admin.module.css";

export const metadata: Metadata = { title: "Manage Users" };

export default async function AdminUsersPage() {
  let users: { id: string; email: string; full_name: string; role: string; creator_status: string; created_at: string }[] = [];

  try {
    users = await query(
      "SELECT id, email, full_name, role, creator_status, created_at FROM profiles ORDER BY created_at DESC LIMIT 100"
    );
  } catch { /* empty */ }

  return (
    <div className="container">
      <div className="page-section">
        <h1 style={{ marginBottom: 24 }}>Manage Users ({users.length})</h1>
        <div style={{ overflowX: "auto" }}>
          <table className={styles.jobTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Creator Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.full_name || "—"}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={u.role === "admin" ? styles.statusPublished : u.role === "creator" ? styles.statusDraft : styles.statusArchived}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.creator_status}</td>
                  <td style={{ fontSize: "var(--font-size-xs)" }}>{formatDate(u.created_at)}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>No users yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
