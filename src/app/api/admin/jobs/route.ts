import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { execute, queryOne } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const data = await req.json();

    if (!data.title?.trim() || !data.organization?.trim() || !data.category || !data.official_apply_url?.trim()) {
      return NextResponse.json({ error: "Title, organization, category, and apply URL are required" }, { status: 400 });
    }

    const slug = slugify(data.title);

    // Check for duplicate slug
    const existing = await queryOne("SELECT id FROM jobs WHERE slug = $1", [slug]);
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const result = await queryOne<{ id: string }>(
      `INSERT INTO jobs (
        title, slug, organization, category, status, work_mode, state, city, location,
        salary_min, salary_max, salary_period, experience_min, experience_max, vacancies,
        education, age_limit, application_deadline, official_apply_url, official_notification_url,
        description, eligibility_summary, who_should_apply, selection_process, application_fee,
        skills, source, is_verified, is_featured, is_urgent, is_sponsored,
        meta_title, meta_description, published_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25,
        $26, $27, $28, $29, $30, $31,
        $32, $33, $34
      ) RETURNING id`,
      [
        data.title.trim(), finalSlug, data.organization.trim(), data.category,
        data.status || "draft", data.work_mode || null, data.state || null, data.city || null,
        data.location || null, data.salary_min || null, data.salary_max || null,
        data.salary_period || "yearly", data.experience_min || null, data.experience_max || null,
        data.vacancies || null, data.education || null, data.age_limit || null,
        data.application_deadline || null, data.official_apply_url.trim(),
        data.official_notification_url || null, data.description || null,
        data.eligibility_summary || null, data.who_should_apply || null,
        data.selection_process || null, data.application_fee || null,
        data.skills || null, data.source || null,
        data.is_verified || false, data.is_featured || false, data.is_urgent || false,
        data.is_sponsored || false, data.meta_title || null, data.meta_description || null,
        data.status === "published" ? new Date().toISOString() : null,
      ]
    );

    // Revalidate all pages that display jobs
    revalidatePath("/");
    revalidatePath("/jobs");
    revalidatePath(`/${data.category ? data.category + "-jobs" : ""}`);

    return NextResponse.json({ success: true, slug: finalSlug, id: result?.id });
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
