import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { execute, queryOne } from "@/lib/db";
import { slugify } from "@/lib/utils";

/**
 * Creator submissions API
 * POST: Submit a new job for review (creates as draft + creator_submissions record)
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string };
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Creators and admins can submit
  if (user.role !== "creator" && user.role !== "admin") {
    return NextResponse.json({ error: "Only creators can submit jobs" }, { status: 403 });
  }

  try {
    const data = await req.json();

    if (!data.title?.trim() || !data.organization?.trim() || !data.category || !data.official_apply_url?.trim()) {
      return NextResponse.json({
        error: "Required fields: title, organization, category, official_apply_url"
      }, { status: 400 });
    }

    const baseSlug = slugify(data.title);
    const existing = await queryOne<{ id: string }>("SELECT id FROM jobs WHERE slug = $1", [baseSlug]);
    const slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug;

    // Create job as draft (not published until admin approves)
    const jobResult = await queryOne<{ id: string }>(
      `INSERT INTO jobs (
        title, slug, organization, category, status, work_mode, state, city, location,
        salary_min, salary_max, salary_period, experience_min, experience_max, vacancies,
        education, age_limit, application_deadline, official_apply_url, official_notification_url,
        description, eligibility_summary, who_should_apply, selection_process, application_fee,
        skills, source, is_verified, is_featured, is_urgent, is_sponsored
      ) VALUES (
        $1,$2,$3,$4,'draft',$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,
        $20,$21,$22,$23,$24,$25,$26,false,false,false,false
      ) RETURNING id`,
      [
        data.title.trim(), slug, data.organization.trim(), data.category,
        data.work_mode || null, data.state || null, data.city || null, data.location || null,
        data.salary_min ? parseInt(data.salary_min) : null,
        data.salary_max ? parseInt(data.salary_max) : null,
        data.salary_period || "yearly",
        data.experience_min ? parseInt(data.experience_min) : null,
        data.experience_max ? parseInt(data.experience_max) : null,
        data.vacancies ? parseInt(data.vacancies) : null,
        data.education || null, data.age_limit || null, data.application_deadline || null,
        data.official_apply_url.trim(), data.official_notification_url || null,
        data.description || null, data.eligibility_summary || null,
        data.who_should_apply || null, data.selection_process || null,
        data.application_fee || null, data.skills || null, data.source || null,
      ]
    );

    if (!jobResult) {
      return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
    }

    // Create submission record
    await execute(
      `INSERT INTO creator_submissions (creator_id, job_id, status) VALUES ($1, $2, 'pending')`,
      [user.id, jobResult.id]
    );

    return NextResponse.json({ success: true, jobId: jobResult.id });
  } catch (error) {
    console.error("Creator submission error:", error);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
