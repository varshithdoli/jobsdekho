import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { execute, query } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

/**
 * Admin bulk import API — accepts JSON array of jobs
 * POST /api/admin/bulk-import
 * Body: { jobs: Job[] }
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { jobs } = await req.json();

    if (!Array.isArray(jobs) || jobs.length === 0) {
      return NextResponse.json({ error: "Provide an array of jobs" }, { status: 400 });
    }

    if (jobs.length > 100) {
      return NextResponse.json({ error: "Maximum 100 jobs per import" }, { status: 400 });
    }

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const job of jobs) {
      try {
        if (!job.title?.trim() || !job.organization?.trim() || !job.category || !job.official_apply_url?.trim()) {
          errors.push(`Skipped: "${job.title || "untitled"}" — missing required fields`);
          skipped++;
          continue;
        }

        const baseSlug = slugify(job.title);
        // Check for existing slug
        const existing = await query<{ id: string }>("SELECT id FROM jobs WHERE slug = $1", [baseSlug]);
        const slug = existing.length > 0 ? `${baseSlug}-${Date.now()}-${imported}` : baseSlug;

        await execute(
          `INSERT INTO jobs (
            title, slug, organization, category, status, work_mode, state, city, location,
            salary_min, salary_max, salary_period, experience_min, experience_max, vacancies,
            education, age_limit, application_deadline, official_apply_url, official_notification_url,
            description, eligibility_summary, who_should_apply, selection_process, application_fee,
            skills, source, is_verified, is_featured, is_urgent, is_sponsored,
            meta_title, meta_description, published_at
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
            $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34
          )`,
          [
            job.title.trim(), slug, job.organization.trim(), job.category,
            job.status || "draft", job.work_mode || null, job.state || null,
            job.city || null, job.location || null,
            job.salary_min || null, job.salary_max || null, job.salary_period || "yearly",
            job.experience_min || null, job.experience_max || null, job.vacancies || null,
            job.education || null, job.age_limit || null, job.application_deadline || null,
            job.official_apply_url.trim(), job.official_notification_url || null,
            job.description || null, job.eligibility_summary || null,
            job.who_should_apply || null, job.selection_process || null,
            job.application_fee || null, job.skills || null, job.source || null,
            job.is_verified || false, job.is_featured || false, job.is_urgent || false,
            job.is_sponsored || false, job.meta_title || null, job.meta_description || null,
            job.status === "published" ? new Date().toISOString() : null,
          ]
        );
        imported++;
      } catch (err) {
        errors.push(`Failed: "${job.title}" — ${err instanceof Error ? err.message : "unknown error"}`);
        skipped++;
      }
    }

    // Revalidate public pages
    if (imported > 0) {
      revalidatePath("/");
      revalidatePath("/jobs");
    }

    return NextResponse.json({ imported, skipped, total: jobs.length, errors: errors.slice(0, 20) });
  } catch (error) {
    console.error("Bulk import error:", error);
    return NextResponse.json({ error: "Bulk import failed" }, { status: 500 });
  }
}
