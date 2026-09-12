import type { Metadata } from "next";
import { query } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import styles from "@/styles/components/admin.module.css";

export const metadata: Metadata = { title: "Contact Messages" };

export default async function AdminMessagesPage() {
  let messages: { id: string; name: string; email: string; subject: string; message: string; status: string; created_at: string }[] = [];

  try {
    messages = await query(
      "SELECT id, name, email, subject, message, status, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 50"
    );
  } catch { /* empty */ }

  const subjectLabels: Record<string, string> = {
    incorrect_info: "Incorrect Info",
    scam: "Scam Report",
    broken_link: "Broken Link",
    suggestion: "Suggestion",
    creator: "Creator Request",
    business: "Business",
    other: "Other",
  };

  return (
    <div className="container">
      <div className="page-section">
        <h1 style={{ marginBottom: 24 }}>Contact Messages ({messages.length})</h1>
        <div style={{ overflowX: "auto" }}>
          <table className={styles.jobTable}>
            <thead>
              <tr>
                <th>From</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id}>
                  <td>
                    <span style={{ fontWeight: 600 }}>{m.name}</span><br />
                    <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>{m.email}</span>
                  </td>
                  <td><span className="badge badge-gray">{subjectLabels[m.subject] || m.subject}</span></td>
                  <td style={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.message}</td>
                  <td>
                    <span className={m.status === "unread" ? styles.statusDraft : m.status === "replied" ? styles.statusPublished : styles.statusArchived}>
                      {m.status}
                    </span>
                  </td>
                  <td style={{ fontSize: "var(--font-size-xs)" }}>{formatDate(m.created_at)}</td>
                </tr>
              ))}
              {messages.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>No messages yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
