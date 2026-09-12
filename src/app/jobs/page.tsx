import type { Metadata } from "next";
import Link from "next/link";
import { query } from "@/lib/db";
import type { Job } from "@/lib/types";
import { CATEGORIES, ITEMS_PER_PAGE, INDIAN_STATES } from "@/lib/constants";
import JobCard from "@/components/jobs/JobCard";
import Breadcrumb from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "All Jobs & Opportunities",
  description:
    "Browse all verified job opportunities, internships, scholarships and career openings across India. Government, IT, Bank, Railway, Defence and more.",
};

interface Props {
  searchParams: Promise<{
    page?: string; category?: string; location?: string;
    mode?: string; sort?: string; experience?: string;
  }>;
}

function buildQueryString(params: Record<string, string | undefined>, overrides: Record<string, string>) {
  const merged = { ...params, ...overrides };
  const qs = Object.entries(merged)
    .filter(([, v]) => v && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
    .join("&");
  return qs ? `?${qs}` : "";
}

async function getJobs(page: number, filters: Record<string, string | undefined>) {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const conditions: string[] = ["status = 'published'"];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (filters.category) {
    conditions.push(`category = $${paramIndex++}`);
    params.push(filters.category);
  }
  if (filters.location) {
    conditions.push(`(state ILIKE $${paramIndex} OR city ILIKE $${paramIndex} OR location ILIKE $${paramIndex})`);
    params.push(`%${filters.location}%`);
    paramIndex++;
  }
  if (filters.mode) {
    conditions.push(`work_mode = $${paramIndex++}`);
    params.push(filters.mode);
  }
  if (filters.experience) {
    const exp = parseInt(filters.experience);
    if (!isNaN(exp)) {
      conditions.push(`(experience_min IS NULL OR experience_min <= $${paramIndex})`);
      params.push(exp);
      paramIndex++;
    }
  }

  const where = conditions.join(" AND ");

  let orderBy = "is_featured DESC, published_at DESC NULLS LAST";
  if (filters.sort === "deadline") orderBy = "application_deadline ASC NULLS LAST";
  if (filters.sort === "salary") orderBy = "salary_max DESC NULLS LAST";
  if (filters.sort === "views") orderBy = "views_count DESC";

  try {
    const [jobs, countResult] = await Promise.all([
      query<Job>(
        `SELECT * FROM jobs WHERE ${where} ORDER BY ${orderBy} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
        [...params, ITEMS_PER_PAGE, offset]
      ),
      query<{ count: string }>(
        `SELECT COUNT(*) as count FROM jobs WHERE ${where}`,
        params
      ),
    ]);
    return { jobs, total: parseInt(countResult[0]?.count || "0") };
  } catch {
    return { jobs: [], total: 0 };
  }
}

export default async function JobsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));
  const { jobs, total } = await getJobs(page, sp);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // Active filters for chips
  const activeFilters: { key: string; label: string }[] = [];
  if (sp.category) activeFilters.push({ key: "category", label: CATEGORIES.find(c => c.category === sp.category)?.label || sp.category });
  if (sp.location) activeFilters.push({ key: "location", label: sp.location });
  if (sp.mode) activeFilters.push({ key: "mode", label: sp.mode.replace(/-/g, " ") });
  if (sp.experience) activeFilters.push({ key: "experience", label: `${sp.experience}+ yrs exp` });

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "All Jobs" }]} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, paddingBottom: 48 }}>

        {/* Top Bar: Result count + Sort */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: "var(--font-size-xl)", fontWeight: 700 }}>All Jobs & Opportunities</h1>
            <span style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>
              {total} opportunities found
            </span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>Sort:</span>
            <Link href={`/jobs${buildQueryString(sp, { sort: "", page: "1" })}`}
              className={`btn btn-sm ${!sp.sort ? "btn-primary" : "btn-secondary"}`}>Latest</Link>
            <Link href={`/jobs${buildQueryString(sp, { sort: "deadline", page: "1" })}`}
              className={`btn btn-sm ${sp.sort === "deadline" ? "btn-primary" : "btn-secondary"}`}>Deadline</Link>
            <Link href={`/jobs${buildQueryString(sp, { sort: "salary", page: "1" })}`}
              className={`btn btn-sm ${sp.sort === "salary" ? "btn-primary" : "btn-secondary"}`}>Salary</Link>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFilters.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>Active filters:</span>
            {activeFilters.map(f => (
              <Link key={f.key} href={`/jobs${buildQueryString(sp, { [f.key]: "", page: "1" })}`}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  padding: "4px 12px", fontSize: "var(--font-size-xs)", fontWeight: 600,
                  background: "var(--primary-50)", color: "var(--primary-700)",
                  borderRadius: "var(--radius-full)", textDecoration: "none",
                }}>
                {f.label} ✕
              </Link>
            ))}
            <Link href="/jobs" style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>Clear all</Link>
          </div>
        )}

        {/* Layout: Sidebar + Results */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>

          {/* Sidebar Filters */}
          <form method="GET" action="/jobs" style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
            gap: 12, background: "#ffffff", border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)", padding: 16,
          }}>
            {/* Preserve sort */}
            {sp.sort && <input type="hidden" name="sort" value={sp.sort} />}

            <div className="form-group">
              <label className="form-label" style={{ fontSize: "var(--font-size-xs)" }}>Category</label>
              <select name="category" defaultValue={sp.category || ""} className="form-select" style={{ fontSize: "var(--font-size-sm)" }}>
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c.category} value={c.category}>{c.label}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: "var(--font-size-xs)" }}>Work Mode</label>
              <select name="mode" defaultValue={sp.mode || ""} className="form-select" style={{ fontSize: "var(--font-size-sm)" }}>
                <option value="">All Modes</option>
                <option value="onsite">On-site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="work-from-home">Work from Home</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: "var(--font-size-xs)" }}>Location</label>
              <input name="location" defaultValue={sp.location || ""} placeholder="City or State"
                className="form-input" style={{ fontSize: "var(--font-size-sm)" }} />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: "var(--font-size-xs)" }}>Experience</label>
              <select name="experience" defaultValue={sp.experience || ""} className="form-select" style={{ fontSize: "var(--font-size-sm)" }}>
                <option value="">Any</option>
                <option value="0">Freshers</option>
                <option value="1">1+ years</option>
                <option value="2">2+ years</option>
                <option value="3">3+ years</option>
                <option value="5">5+ years</option>
                <option value="10">10+ years</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button type="submit" className="btn btn-primary btn-sm" style={{ width: "100%" }}>
                Apply Filters
              </button>
            </div>
          </form>

          {/* Job Results */}
          {jobs.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: "center", padding: "48px 20px", color: "var(--text-secondary)",
              fontSize: "var(--font-size-sm)", background: "var(--gray-50)",
              borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-color)",
            }}>
              <p>No opportunities found matching your filters. Try broadening your search.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            {page > 1 && (
              <Link href={`/jobs${buildQueryString(sp, { page: String(page - 1) })}`} className="pagination-btn">← Previous</Link>
            )}
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = page <= 4 ? i + 1 : page + i - 3;
              if (p < 1 || p > totalPages) return null;
              return (
                <Link key={p} href={`/jobs${buildQueryString(sp, { page: String(p) })}`}
                  className={`pagination-btn ${p === page ? "active" : ""}`}>
                  {p}
                </Link>
              );
            })}
            {page < totalPages && (
              <Link href={`/jobs${buildQueryString(sp, { page: String(page + 1) })}`} className="pagination-btn">Next →</Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
