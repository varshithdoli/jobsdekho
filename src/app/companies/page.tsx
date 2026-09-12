import type { Metadata } from "next";
import Link from "next/link";
import { query } from "@/lib/db";

export const metadata: Metadata = {
  title: "Companies | JobsDekho",
  description: "Browse companies hiring on JobsDekho. Find job openings at top Indian employers.",
};

interface Company {
  id: string;
  name: string;
  slug: string;
  industry: string | null;
  company_type: string | null;
  location: string | null;
  logo_url: string | null;
  description: string | null;
  employee_count: string | null;
  job_count: string;
}

export default async function CompaniesPage() {
  let companies: Company[] = [];
  try {
    companies = await query<Company>(
      `SELECT c.*, COUNT(j.id) as job_count
       FROM companies c
       LEFT JOIN jobs j ON j.company_id = c.id AND j.status = 'published'
       GROUP BY c.id
       ORDER BY COUNT(j.id) DESC, c.name ASC`
    );
  } catch { /* empty */ }

  return (
    <div className="container">
      <div className="page-section">
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: "var(--font-size-2xl)", fontWeight: 700, marginBottom: 4 }}>Companies</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>
            Browse {companies.length} companies hiring on JobsDekho
          </p>
        </div>

        {companies.length > 0 ? (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16,
          }}>
            {companies.map((company) => (
              <Link key={company.id} href={`/companies/${company.slug}`} style={{
                display: "flex", gap: 16, padding: 20, background: "#fff",
                border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)",
                textDecoration: "none", color: "inherit",
                transition: "box-shadow 0.2s, border-color 0.2s",
              }}>
                {/* Logo / Initials */}
                <div style={{
                  width: 56, height: 56, borderRadius: "var(--radius-lg)", flexShrink: 0,
                  background: company.logo_url ? `url(${company.logo_url}) center/cover` : "var(--primary-100)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.25rem", fontWeight: 800, color: "var(--primary-600)",
                }}>
                  {!company.logo_url && company.name.slice(0, 2).toUpperCase()}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: "var(--font-size-base)", fontWeight: 600, marginBottom: 4 }}>
                    {company.name}
                  </h3>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>
                    {company.industry && <span>{company.industry}</span>}
                    {company.location && <span>📍 {company.location}</span>}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <span style={{
                      fontSize: "var(--font-size-xs)", fontWeight: 600,
                      color: parseInt(company.job_count) > 0 ? "var(--primary-600)" : "var(--text-muted)",
                    }}>
                      {company.job_count} active {parseInt(company.job_count) === 1 ? "job" : "jobs"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center", padding: 48, background: "#fff",
            borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-color)",
          }}>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>
              No companies listed yet. Companies will appear here as jobs are added.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
