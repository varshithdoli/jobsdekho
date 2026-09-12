import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { query, queryOne } from "@/lib/db";
import type { Job } from "@/lib/types";
import { SITE_NAME } from "@/lib/constants";
import JobCard from "@/components/jobs/JobCard";
import Breadcrumb from "@/components/layout/Breadcrumb";

interface Company {
  id: string;
  name: string;
  slug: string;
  industry: string | null;
  company_type: string | null;
  location: string | null;
  website: string | null;
  logo_url: string | null;
  description: string | null;
  employee_count: string | null;
  founded_year: number | null;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = await queryOne<Company>("SELECT * FROM companies WHERE slug = $1", [slug]);
  if (!company) return { title: "Company Not Found" };
  return {
    title: `${company.name} - Jobs & Careers | ${SITE_NAME}`,
    description: company.description || `Browse job openings at ${company.name}. Find career opportunities and apply.`,
  };
}

export default async function CompanyDetailPage({ params }: Props) {
  const { slug } = await params;
  const company = await queryOne<Company>("SELECT * FROM companies WHERE slug = $1", [slug]);
  if (!company) notFound();

  let jobs: Job[] = [];
  try {
    jobs = await query<Job>(
      `SELECT * FROM jobs WHERE company_id = $1 AND status = 'published' ORDER BY published_at DESC`,
      [company.id]
    );
  } catch { /* empty */ }

  return (
    <div className="container">
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Companies", href: "/companies" },
        { label: company.name },
      ]} />

      <div className="page-section" style={{ paddingTop: 0 }}>
        {/* Company Header */}
        <div style={{
          display: "flex", gap: 20, padding: 24, background: "#fff",
          border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)",
          marginBottom: 24, alignItems: "center", flexWrap: "wrap",
        }}>
          {/* Logo */}
          <div style={{
            width: 72, height: 72, borderRadius: "var(--radius-lg)", flexShrink: 0,
            background: company.logo_url ? `url(${company.logo_url}) center/cover` : "var(--primary-100)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.5rem", fontWeight: 800, color: "var(--primary-600)",
          }}>
            {!company.logo_url && company.name.slice(0, 2).toUpperCase()}
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 style={{ fontSize: "var(--font-size-2xl)", fontWeight: 700, marginBottom: 4 }}>
              {company.name}
            </h1>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: "var(--font-size-sm)", color: "var(--text-secondary)" }}>
              {company.industry && <span>🏭 {company.industry}</span>}
              {company.company_type && <span>📋 {company.company_type}</span>}
              {company.location && <span>📍 {company.location}</span>}
              {company.employee_count && <span>👥 {company.employee_count} employees</span>}
              {company.founded_year && <span>📅 Founded {company.founded_year}</span>}
            </div>
          </div>

          {company.website && (
            <a href={company.website} target="_blank" rel="noopener noreferrer"
              className="btn btn-outline btn-sm" style={{ flexShrink: 0 }}>
              🌐 Visit Website
            </a>
          )}
        </div>

        {/* Description */}
        {company.description && (
          <div style={{
            padding: 20, background: "#fff", border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)", marginBottom: 24,
          }}>
            <h2 style={{ fontSize: "var(--font-size-lg)", fontWeight: 700, marginBottom: 8 }}>About {company.name}</h2>
            <p style={{ fontSize: "var(--font-size-sm)", color: "var(--text-secondary)", lineHeight: 1.8 }}>
              {company.description}
            </p>
          </div>
        )}

        {/* Jobs */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: "var(--font-size-lg)", fontWeight: 700 }}>
              Open Positions ({jobs.length})
            </h2>
          </div>

          {jobs.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: "center", padding: 48, background: "#fff",
              borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-color)",
            }}>
              <p style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)", marginBottom: 16 }}>
                No active job openings at {company.name} right now.
              </p>
              <Link href="/jobs" className="btn btn-primary btn-sm">Browse All Jobs</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
