import type { Metadata } from "next";
import Link from "next/link";
import { query } from "@/lib/db";
import type { Job, JobCategory } from "@/lib/types";
import { ITEMS_PER_PAGE, CATEGORIES } from "@/lib/constants";
import JobCard from "@/components/jobs/JobCard";
import Breadcrumb from "@/components/layout/Breadcrumb";
import styles from "@/styles/components/home.module.css";

interface CategoryPageProps {
  category: JobCategory;
  page: number;
}

export function getCategoryMeta(slug: string): { label: string; description: string; category: JobCategory } | null {
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return null;
  return { label: cat.label, description: cat.description, category: cat.category };
}

export async function getCategoryJobs(category: JobCategory, page: number) {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  try {
    const [jobs, countResult] = await Promise.all([
      query<Job>(
        "SELECT * FROM jobs WHERE status = 'published' AND category = $1 ORDER BY is_featured DESC, published_at DESC NULLS LAST LIMIT $2 OFFSET $3",
        [category, ITEMS_PER_PAGE, offset]
      ),
      query<{ count: string }>(
        "SELECT COUNT(*) as count FROM jobs WHERE status = 'published' AND category = $1",
        [category]
      ),
    ]);
    return { jobs, total: parseInt(countResult[0]?.count || "0") };
  } catch {
    return { jobs: [], total: 0 };
  }
}

export default function CategoryPage({
  category,
  label,
  description,
  slug,
  jobs,
  total,
  page,
}: CategoryPageProps & { label: string; description: string; slug: string; jobs: Job[]; total: number }) {
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label }]} />
      <div className="page-section" style={{ paddingTop: 0 }}>
        <div className={styles.sectionHeader}>
          <div>
            <h1 className={styles.sectionTitle}>{label}</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)", marginTop: 4 }}>
              {description} — {total} opportunities found
            </p>
          </div>
        </div>

        {jobs.length > 0 ? (
          <div className={styles.jobGrid}>
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No {label.toLowerCase()} available right now. Check back soon!</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            {page > 1 && (
              <Link href={`/${slug}?page=${page - 1}`} className="pagination-btn">← Previous</Link>
            )}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = page <= 3 ? i + 1 : page + i - 2;
              if (p < 1 || p > totalPages) return null;
              return (
                <Link key={p} href={`/${slug}?page=${p}`} className={`pagination-btn ${p === page ? "active" : ""}`}>
                  {p}
                </Link>
              );
            })}
            {page < totalPages && (
              <Link href={`/${slug}?page=${page + 1}`} className="pagination-btn">Next →</Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
