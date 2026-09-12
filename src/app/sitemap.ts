import type { MetadataRoute } from "next";
import { query } from "@/lib/db";
import { CATEGORIES, SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  // Static pages
  const staticPages = [
    "", "/jobs", "/search", "/about", "/contact",
    "/privacy-policy", "/terms", "/disclaimer", "/login",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  // Category pages
  const categoryPages = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  // Job pages
  let jobPages: MetadataRoute.Sitemap = [];
  try {
    const jobs = await query<{ slug: string; updated_at: string }>(
      "SELECT slug, updated_at FROM jobs WHERE status = 'published' ORDER BY published_at DESC LIMIT 1000"
    );
    jobPages = jobs.map((job) => ({
      url: `${baseUrl}/jobs/${job.slug}`,
      lastModified: new Date(job.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch { /* empty */ }

  // Company pages
  let companyPages: MetadataRoute.Sitemap = [];
  try {
    const companies = await query<{ slug: string }>( 
      "SELECT slug FROM companies ORDER BY name ASC"
    );
    companyPages = companies.map((c) => ({
      url: `${baseUrl}/companies/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch { /* empty */ }

  return [...staticPages, ...categoryPages, ...jobPages, ...companyPages];
}
