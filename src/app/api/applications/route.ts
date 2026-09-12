import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query, queryOne, execute } from "@/lib/db";

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const applications = await query(
      `SELECT a.*, j.title, j.organization, j.slug, j.location, j.status as job_status,
              j.application_deadline, j.category
       FROM applications a
       JOIN jobs j ON j.id = a.job_id
       WHERE a.user_id = $1
       ORDER BY a.applied_at DESC`,
      [userId]
    );
    return NextResponse.json(applications);
  } catch (error) {
    console.error("Get applications error:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { job_id, apply_url } = await req.json();
    if (!job_id) {
      return NextResponse.json({ error: "job_id is required" }, { status: 400 });
    }

    // Check if already applied
    const existing = await queryOne(
      "SELECT id FROM applications WHERE user_id = $1 AND job_id = $2",
      [userId, job_id]
    );

    if (existing) {
      return NextResponse.json({ message: "Already tracked" });
    }

    await execute(
      `INSERT INTO applications (user_id, job_id, status, apply_url)
       VALUES ($1, $2, 'applied_external', $3)`,
      [userId, job_id, apply_url || null]
    );

    // Record analytics event
    await execute(
      `INSERT INTO analytics_events (event_type, job_id, user_id)
       VALUES ('apply_click', $1, $2)`,
      [job_id, userId]
    ).catch(() => {}); // Non-critical

    // Increment clicks_count
    await execute(
      "UPDATE jobs SET clicks_count = clicks_count + 1 WHERE id = $1",
      [job_id]
    ).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Track application error:", error);
    return NextResponse.json({ error: "Failed to track application" }, { status: 500 });
  }
}
