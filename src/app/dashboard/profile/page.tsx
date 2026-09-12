import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { queryOne } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "My Profile" };

interface ProfileData {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  phone: string | null;
  location: string | null;
  creator_status: string;
  reputation_score: number;
  created_at: string;
}

export default async function ProfilePage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;

  let profile: ProfileData | null = null;
  if (userId) {
    try {
      profile = await queryOne<ProfileData>(
        "SELECT * FROM profiles WHERE id = $1", [userId]
      );
    } catch { /* empty */ }
  }

  return (
    <div className="container">
      <div className="page-section" style={{ maxWidth: 700 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: "var(--font-size-xl)" }}>My Profile</h1>
          <Link href="/dashboard" className="btn btn-secondary btn-sm">← Dashboard</Link>
        </div>

        {profile ? (
          <div style={{
            background: "#fff", border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)", overflow: "hidden",
          }}>
            {/* Profile Header */}
            <div style={{
              background: "linear-gradient(135deg, #1a2332 0%, #2d3a4a 100%)",
              padding: "28px 24px", display: "flex", alignItems: "center", gap: 16,
            }}>
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt=""
                  width={64}
                  height={64}
                  style={{ borderRadius: "50%", border: "3px solid rgba(255,255,255,0.2)" }}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "var(--primary-500)", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.5rem", fontWeight: 700,
                  border: "3px solid rgba(255,255,255,0.2)",
                }}>
                  {profile.full_name?.[0] || profile.email[0].toUpperCase()}
                </div>
              )}
              <div>
                <h2 style={{ color: "#fff", fontSize: "var(--font-size-lg)", fontWeight: 700, marginBottom: 2 }}>
                  {profile.full_name || "User"}
                </h2>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "var(--font-size-sm)" }}>
                  {profile.email}
                </p>
              </div>
            </div>

            {/* Profile Details */}
            <div style={{ padding: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)", fontWeight: 500 }}>Role</span>
                  <p style={{ fontSize: "var(--font-size-sm)", fontWeight: 600, textTransform: "capitalize" }}>
                    {profile.role}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)", fontWeight: 500 }}>Member Since</span>
                  <p style={{ fontSize: "var(--font-size-sm)", fontWeight: 600 }}>
                    {formatDate(profile.created_at)}
                  </p>
                </div>
                {profile.phone && (
                  <div>
                    <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)", fontWeight: 500 }}>Phone</span>
                    <p style={{ fontSize: "var(--font-size-sm)", fontWeight: 600 }}>{profile.phone}</p>
                  </div>
                )}
                {profile.location && (
                  <div>
                    <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)", fontWeight: 500 }}>Location</span>
                    <p style={{ fontSize: "var(--font-size-sm)", fontWeight: 600 }}>{profile.location}</p>
                  </div>
                )}
                {profile.creator_status !== "none" && (
                  <div>
                    <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)", fontWeight: 500 }}>Creator Status</span>
                    <p style={{ fontSize: "var(--font-size-sm)", fontWeight: 600, textTransform: "capitalize" }}>
                      {profile.creator_status}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            textAlign: "center", padding: 48, background: "#fff",
            borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-color)",
          }}>
            <p style={{ color: "var(--text-secondary)" }}>Profile not found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
