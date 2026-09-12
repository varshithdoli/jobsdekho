import Link from "next/link";
import { CATEGORIES, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { query } from "@/lib/db";
import type { Job } from "@/lib/types";
import JobCard from "@/components/jobs/JobCard";
import styles from "@/styles/components/home.module.css";

async function getLatestJobs(): Promise<Job[]> {
  try {
    return await query<Job>(
      `SELECT * FROM jobs WHERE status = 'published' ORDER BY published_at DESC NULLS LAST LIMIT 9`
    );
  } catch {
    return [];
  }
}

async function getFeaturedJobs(): Promise<Job[]> {
  try {
    return await query<Job>(
      `SELECT * FROM jobs WHERE status = 'published' AND is_featured = true ORDER BY published_at DESC NULLS LAST LIMIT 6`
    );
  } catch {
    return [];
  }
}

async function getStats(): Promise<{ total: number; categories: number }> {
  try {
    const result = await query<{ count: string }>(
      "SELECT COUNT(*) as count FROM jobs WHERE status = 'published'"
    );
    return {
      total: parseInt(result[0]?.count || "0"),
      categories: CATEGORIES.length,
    };
  } catch {
    return { total: 0, categories: CATEGORIES.length };
  }
}

export default async function HomePage() {
  const [latestJobs, featuredJobs, stats] = await Promise.all([
    getLatestJobs(),
    getFeaturedJobs(),
    getStats(),
  ]);

  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Discover Verified Career Opportunities Across India
            </h1>
            <p className={styles.heroSubtitle}>
              Government jobs, IT jobs, internships, scholarships & more — curated and verified for you. Free, no signup required.
            </p>
            <div className={styles.heroSearch}>
              <form action="/search" method="GET" className={styles.searchForm}>
                <input
                  type="search"
                  name="q"
                  placeholder="Search jobs, companies, exams..."
                  className={styles.searchInput}
                  aria-label="Search jobs"
                />
                <button type="submit" className="btn btn-primary">
                  Search
                </button>
              </form>
            </div>
            <div className={styles.trustBadges}>
              <span>✅ Free to use</span>
              <span>🔒 No signup required</span>
              <span>📱 Works on mobile</span>
              <span>✓ Verified listings</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      {stats.total > 0 && (
        <section className={styles.statsBar}>
          <div className="container">
            <div className={styles.statsGrid}>
              <div className={styles.stat}>
                <strong>{stats.total}+</strong>
                <span>Active Opportunities</span>
              </div>
              <div className={styles.stat}>
                <strong>{stats.categories}</strong>
                <span>Categories</span>
              </div>
              <div className={styles.stat}>
                <strong>100%</strong>
                <span>Free Access</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories Grid */}
      <section className="page-section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Browse by Category</h2>
            <p className={styles.sectionSub}>Find opportunities that match your career goals</p>
          </div>
          <div className={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/${cat.slug}`} className={styles.categoryCard}>
                <span className={styles.categoryIcon}>{cat.icon}</span>
                <h3 className={styles.categoryName}>{cat.label}</h3>
                <p className={styles.categoryDesc}>{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      {featuredJobs.length > 0 && (
        <section className="page-section" style={{ background: "var(--primary-50)" }}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>⭐ Featured Opportunities</h2>
              <Link href="/jobs?featured=true" className="btn btn-outline btn-sm">View All</Link>
            </div>
            <div className={styles.jobGrid}>
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Jobs */}
      <section className="page-section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Latest Opportunities</h2>
            <Link href="/jobs" className="btn btn-outline btn-sm">View All Jobs</Link>
          </div>
          {latestJobs.length > 0 ? (
            <div className={styles.jobGrid}>
              {latestJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>🚀 We are adding new opportunities daily. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className="container">
          <h2 className={styles.ctaTitle}>Never Miss an Opportunity</h2>
          <p className={styles.ctaSub}>
            Sign in to save jobs, get alerts, and track your applications — completely free.
          </p>
          <div className={styles.ctaActions}>
            <Link href="/jobs" className="btn btn-primary btn-lg">Browse All Jobs</Link>
            <Link href="/login" className="btn btn-secondary btn-lg">Sign In</Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="page-section">
        <div className="container">
          <div className="disclaimer-box">
            <strong>Disclaimer:</strong> {SITE_NAME} is an independent career information platform.
            We are not affiliated with any government body, company, or employer listed on this website.
            Information is sourced from official notifications and verified where possible.
            Always verify details on the official website before applying. We do not guarantee employment
            or the accuracy of any listing.
          </div>
        </div>
      </section>
    </>
  );
}
