import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { query, queryOne, execute } from "@/lib/db";
import type { Job } from "@/lib/types";
import { formatDate, formatSalary, getDeadlineStatus, getCategoryLabel, getCategorySlug, generateMetaDescription } from "@/lib/utils";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ShareButtons from "@/components/jobs/ShareButtons";
import JobCard from "@/components/jobs/JobCard";
import styles from "@/styles/components/jobdetail.module.css";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getJob(slug: string): Promise<Job | null> {
  return queryOne<Job>("SELECT * FROM jobs WHERE slug = $1 AND status = 'published'", [slug]);
}

async function getRelatedJobs(job: Job): Promise<Job[]> {
  try {
    return await query<Job>(
      `SELECT * FROM jobs WHERE status = 'published' AND category = $1 AND id != $2 ORDER BY published_at DESC LIMIT 4`,
      [job.category, job.id]
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) return { title: "Job Not Found" };

  const description = generateMetaDescription(job);
  return {
    title: job.meta_title || `${job.title} at ${job.organization}`,
    description: job.meta_description || description,
    openGraph: {
      title: `${job.title} at ${job.organization}`,
      description,
      type: "article",
      url: `${SITE_URL}/jobs/${job.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${job.title} at ${job.organization}`,
      description,
    },
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) notFound();

  // Increment view count (fire-and-forget)
  execute("UPDATE jobs SET views_count = views_count + 1 WHERE id = $1", [job.id]).catch(() => {});

  const relatedJobs = await getRelatedJobs(job);
  const deadlineStatus = getDeadlineStatus(job.application_deadline);
  const salary = formatSalary(job.salary_min, job.salary_max, job.salary_period);
  const faq = (job.faq || []) as { question: string; answer: string }[];
  const importantDates = (job.important_dates || []) as { label: string; date: string }[];
  const categoryLabel = getCategoryLabel(job.category);
  const categorySlug = getCategorySlug(job.category);

  // JSON-LD Structured Data
  const jobPostingLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description || job.eligibility_summary || job.title,
    datePosted: job.published_at || job.created_at,
    ...(job.application_deadline ? { validThrough: job.application_deadline } : {}),
    hiringOrganization: {
      "@type": "Organization",
      name: job.organization,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
        ...(job.state ? { addressRegion: job.state } : {}),
        ...(job.city ? { addressLocality: job.city } : {}),
      },
    },
    ...(job.salary_min ? {
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: "INR",
        value: {
          "@type": "QuantitativeValue",
          minValue: job.salary_min,
          ...(job.salary_max ? { maxValue: job.salary_max } : {}),
          unitText: job.salary_period === "yearly" ? "YEAR" : "MONTH",
        },
      },
    } : {}),
  };

  const faqLd = faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}

      <div className="container">
        <Breadcrumb items={[
          { label: "Home", href: "/" },
          { label: categoryLabel, href: `/${categorySlug}` },
          { label: job.title },
        ]} />

        <div className={styles.layout}>
          {/* Main Content */}
          <article className={styles.main}>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.badges}>
                <span className="badge badge-primary">{categoryLabel}</span>
                {job.is_verified && <span className="badge badge-success">✓ Verified</span>}
                {job.is_featured && <span className="badge badge-warning">⭐ Featured</span>}
                {job.is_urgent && <span className="badge badge-danger">🔥 Urgent</span>}
                {job.is_sponsored && <span className="badge badge-gray">Sponsored</span>}
              </div>
              <h1 className={styles.title}>{job.title}</h1>
              <p className={styles.org}>{job.organization}</p>

              {deadlineStatus === "expired" && (
                <div className="disclaimer-box" style={{ marginTop: 12 }}>
                  <strong>⚠️ This opportunity has expired.</strong> The application deadline has passed. Check related opportunities below.
                </div>
              )}
            </div>

            {/* Quick Info Grid */}
            <div className={styles.infoGrid}>
              {job.location && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>📍 Location</span>
                  <span className={styles.infoValue}>{job.location}</span>
                </div>
              )}
              {job.work_mode && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>🏢 Work Mode</span>
                  <span className={styles.infoValue}>{job.work_mode.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</span>
                </div>
              )}
              {(job.experience_min !== null || job.experience_max !== null) && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>💼 Experience</span>
                  <span className={styles.infoValue}>{job.experience_min || 0}–{job.experience_max || "5+"} years</span>
                </div>
              )}
              {salary !== "Not disclosed" && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>💰 Salary</span>
                  <span className={styles.infoValue}>{salary}</span>
                </div>
              )}
              {job.education && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>🎓 Education</span>
                  <span className={styles.infoValue}>{job.education}</span>
                </div>
              )}
              {job.vacancies && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>👥 Vacancies</span>
                  <span className={styles.infoValue}>{job.vacancies}</span>
                </div>
              )}
              {job.application_deadline && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>📅 Deadline</span>
                  <span className={`${styles.infoValue} ${deadlineStatus === "urgent" ? styles.urgentText : ""}`}>
                    {formatDate(job.application_deadline)}
                    {deadlineStatus === "urgent" && " (Closing Soon!)"}
                  </span>
                </div>
              )}
              {job.age_limit && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>📋 Age Limit</span>
                  <span className={styles.infoValue}>{job.age_limit}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {job.description && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>About This Opportunity</h2>
                <div className={styles.prose}>{job.description}</div>
              </section>
            )}

            {/* Who Should Apply */}
            {job.who_should_apply && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Who Should Apply</h2>
                <div className={styles.prose}>{job.who_should_apply}</div>
                <p className={styles.editorial}>
                  <em>ℹ️ This section is editorial content added by {SITE_NAME} to help you understand the opportunity better.</em>
                </p>
              </section>
            )}

            {/* Eligibility */}
            {job.eligibility_summary && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Eligibility Summary</h2>
                <div className={styles.prose}>{job.eligibility_summary}</div>
              </section>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Skills Required</h2>
                <div className={styles.skillTags}>
                  {job.skills.map((skill, i) => (
                    <span key={i} className="badge badge-gray">{skill}</span>
                  ))}
                </div>
              </section>
            )}

            {/* Selection Process */}
            {job.selection_process && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Selection Process</h2>
                <div className={styles.prose}>{job.selection_process}</div>
              </section>
            )}

            {/* Application Fee */}
            {job.application_fee && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Application Fee</h2>
                <div className={styles.prose}>{job.application_fee}</div>
              </section>
            )}

            {/* Important Dates */}
            {importantDates.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Important Dates</h2>
                <table className={styles.datesTable}>
                  <tbody>
                    {importantDates.map((d, i) => (
                      <tr key={i}>
                        <td className={styles.dateLabel}>{d.label}</td>
                        <td className={styles.dateValue}>{formatDate(d.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {/* FAQ */}
            {faq.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
                <div className={styles.faqList}>
                  {faq.map((f, i) => (
                    <details key={i} className={styles.faqItem}>
                      <summary className={styles.faqQuestion}>{f.question}</summary>
                      <div className={styles.faqAnswer}>{f.answer}</div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Source & Verification */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Source & Verification</h2>
              <div className={styles.verificationBox}>
                {job.is_verified && (
                  <p>✅ <strong>Verified</strong> — Last verified: {formatDate(job.last_verified_at || job.verified_at)}</p>
                )}
                {!job.is_verified && (
                  <p>⚠️ <strong>Unverified</strong> — This listing has not been independently verified by {SITE_NAME}.</p>
                )}
                {job.source && <p>📌 Source: {job.source}</p>}
                {job.submitted_by_creator && (
                  <p>👤 Submitted by a community creator — reviewed and approved by {SITE_NAME} editorial team.</p>
                )}
              </div>
            </section>

            {/* Disclaimer */}
            <div className="disclaimer-box">
              <strong>Disclaimer:</strong> {SITE_NAME} provides this information for informational purposes only.
              We do not guarantee employment or the accuracy of any listing. Always verify details
              on the official website before applying. Never pay anyone for a job or interview.
            </div>
          </article>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            {/* Apply Card */}
            <div className={styles.applyCard}>
              <h3 className={styles.applyTitle}>Apply Now</h3>
              {job.application_deadline && (
                <p className={styles.applyDeadline}>
                  Deadline: <strong>{formatDate(job.application_deadline)}</strong>
                </p>
              )}
              <a
                href={job.official_apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success btn-lg"
                style={{ width: "100%" }}
              >
                Apply on Official Website →
              </a>
              {job.official_notification_url && (
                <a
                  href={job.official_notification_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ width: "100%", marginTop: 8 }}
                >
                  📄 View Official Notification
                </a>
              )}
              <p className={styles.applyNote}>
                You will be redirected to the official website. {SITE_NAME} does not collect applications.
              </p>
            </div>

            {/* Share */}
            <div className={styles.shareCard}>
              <h3 className={styles.shareTitle}>Share this opportunity</h3>
              <ShareButtons title={job.title} slug={job.slug} />
            </div>

            {/* Report */}
            <div className={styles.reportCard}>
              <Link href={`/contact?report=${job.slug}`} className={styles.reportLink}>
                🚩 Report incorrect information
              </Link>
            </div>
          </aside>
        </div>

        {/* Related Jobs */}
        {relatedJobs.length > 0 && (
          <section className="page-section">
            <h2 className={styles.sectionTitle} style={{ marginBottom: 16 }}>Related Opportunities</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {relatedJobs.map((rj) => (
                <JobCard key={rj.id} job={rj} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
