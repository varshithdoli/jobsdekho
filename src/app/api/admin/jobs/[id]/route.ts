import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { execute, queryOne } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await context.params;

  try {
    const job = await queryOne("SELECT * FROM jobs WHERE id = $1", [id]);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    return NextResponse.json(job);
  } catch (error) {
    console.error("Get job error:", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await context.params;

  try {
    const data = await req.json();

    if (!data.title?.trim() || !data.organization?.trim() || !data.category || !data.official_apply_url?.trim()) {
      return NextResponse.json({ error: "Title, organization, category, and apply URL are required" }, { status: 400 });
    }

    // Get existing job to check status transition
    const existing = await queryOne<{ status: string; published_at: string | null; slug: string }>(
      "SELECT status, published_at, slug FROM jobs WHERE id = $1", [id]
    );
    if (!existing) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Set published_at when transitioning to published
    let publishedAt = existing.published_at;
    if (data.status === "published" && existing.status !== "published") {
      publishedAt = new Date().toISOString();
    }

    await execute(
      `UPDATE jobs SET
        title = $1, organization = $2, category = $3, status = $4,
        work_mode = $5, state = $6, city = $7, location = $8,
        salary_min = $9, salary_max = $10, salary_period = $11,
        experience_min = $12, experience_max = $13, vacancies = $14,
        education = $15, age_limit = $16, application_deadline = $17,
        official_apply_url = $18, official_notification_url = $19,
        description = $20, eligibility_summary = $21, who_should_apply = $22,
        selection_process = $23, application_fee = $24,
        skills = $25, source = $26,
        is_verified = $27, is_featured = $28, is_urgent = $29, is_sponsored = $30,
        meta_title = $31, meta_description = $32, published_at = $33,
        updated_at = NOW()
      WHERE id = $34`,
      [
        data.title.trim(), data.organization.trim(), data.category,
        data.status || "draft", data.work_mode || null, data.state || null,
        data.city || null, data.location || null,
        data.salary_min || null, data.salary_max || null, data.salary_period || "yearly",
        data.experience_min || null, data.experience_max || null, data.vacancies || null,
        data.education || null, data.age_limit || null, data.application_deadline || null,
        data.official_apply_url.trim(), data.official_notification_url || null,
        data.description || null, data.eligibility_summary || null,
        data.who_should_apply || null, data.selection_process || null,
        data.application_fee || null, data.skills || null, data.source || null,
        data.is_verified || false, data.is_featured || false,
        data.is_urgent || false, data.is_sponsored || false,
        data.meta_title || null, data.meta_description || null,
        publishedAt, id,
      ]
    );

    // Revalidate
    revalidatePath("/");
    revalidatePath("/jobs");
    revalidatePath(`/jobs/${existing.slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update job error:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await context.params;

  try {
    // Soft delete — archive instead of hard delete
    await execute(
      "UPDATE jobs SET status = 'archived', updated_at = NOW() WHERE id = $1",
      [id]
    );

    revalidatePath("/");
    revalidatePath("/jobs");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete job error:", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
