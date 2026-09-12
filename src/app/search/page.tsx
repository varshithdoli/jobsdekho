import type { Metadata } from "next";
import Link from "next/link";
import { query } from "@/lib/db";
import type { Job } from "@/lib/types";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import JobCard from "@/components/jobs/JobCard";
import Breadcrumb from "@/components/layout/Breadcrumb";
import styles from "@/styles/components/home.module.css";

export const metadata: Metadata = {
  title: "Search Jobs",
  description: "Search verified job opportunities, internships, scholarships and career openings across India.",
};

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

async function searchJobs(searchQuery: string, page: number) {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  if (!searchQuery.trim()) return { jobs: [], total: 0 };

  try {
    const searchTerm = `%${searchQuery}%`;
    const [jobs, countResult] = await Promise.all([
      query<Job>(
        `SELECT * FROM jobs WHERE status = 'published'
         AND (title ILIKE $1 OR organization ILIKE $1 OR description ILIKE $1 OR location ILIKE $1 OR state ILIKE $1 OR category ILIKE $1)
         ORDER BY is_featured DESC, published_at DESC NULLS LAST LIMIT $2 OFFSET $3`,
        [searchTerm, ITEMS_PER_PAGE, offset]
      ),
      query<{ count: string }>(
        `SELECT COUNT(*) as count FROM jobs WHERE status = 'published'
         AND (title ILIKE $1 OR organization ILIKE $1 OR description ILIKE $1 OR location ILIKE $1 OR state ILIKE $1 OR category ILIKE $1)`,
        [searchTerm]
      ),
    ]);
    return { jobs, total: parseInt(countResult[0]?.count || "0") };
  } catch {
    return { jobs: [], total: 0 };
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = sp.q || "";
  const page = Math.max(1, parseInt(sp.page || "1"));
  const { jobs, total } = await searchJobs(q, page);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Search" }]} />

      <div className="page-section" style={{ paddingTop: 0 }}>
        <h1 className={styles.sectionTitle}>Search Jobs & Opportunities</h1>

        <form method="GET" action="/search" style={{ margin: "16px 0 24px", display: "flex", gap: 8 }}>
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search jobs, companies, exams, locations..."
            className="form-input"
            style={{ flex: 1 }}
            aria-label="Search query"
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        {q && (
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)", marginBottom: 16 }}>
            {total} results for &ldquo;{q}&rdquo;
          </p>
        )}

        {jobs.length > 0 ? (
          <div className={styles.jobGrid}>
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : q ? (
          <div className={styles.emptyState}>
            <p>No results found for &ldquo;{q}&rdquo;. Try different keywords.</p>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>Enter a search term to find jobs, internships, exams, and more.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            {page > 1 && <Link href={`/search?q=${encodeURIComponent(q)}&page=${page - 1}`} className="pagination-btn">← Prev</Link>}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = page <= 3 ? i + 1 : page + i - 2;
              if (p < 1 || p > totalPages) return null;
              return <Link key={p} href={`/search?q=${encodeURIComponent(q)}&page=${p}`} className={`pagination-btn ${p === page ? "active" : ""}`}>{p}</Link>;
            })}
            {page < totalPages && <Link href={`/search?q=${encodeURIComponent(q)}&page=${page + 1}`} className="pagination-btn">Next →</Link>}
          </div>
        )}
      </div>
    </div>
  );
}
