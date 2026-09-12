import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { execute, queryOne } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * Admin submission review API
 * PUT /api/admin/submissions/[id] — approve or reject a creator submission
 * Body: { action: "approve" | "reject", review_notes?: string }
 */
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  const userId = (session?.user as { id?: string })?.id;
  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const { action, review_notes } = await req.json();

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json({ error: "action must be 'approve' or 'reject'" }, { status: 400 });
    }

    // Get submission
    const submission = await queryOne<{ id: string; job_id: string; status: string }>(
      "SELECT id, job_id, status FROM creator_submissions WHERE id = $1",
      [id]
    );

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    if (submission.status !== "pending") {
      return NextResponse.json({ error: "Submission already reviewed" }, { status: 409 });
    }

    const newStatus = action === "approve" ? "approved" : "rejected";

    // Update submission
    await execute(
      `UPDATE creator_submissions SET status = $1, reviewed_by = $2, reviewed_at = NOW(), review_notes = $3 WHERE id = $4`,
      [newStatus, userId, review_notes || null, id]
    );

    // If approved, publish the job
    if (action === "approve" && submission.job_id) {
      await execute(
        `UPDATE jobs SET status = 'published', is_verified = true, published_at = NOW() WHERE id = $1`,
        [submission.job_id]
      );
      revalidatePath("/");
      revalidatePath("/jobs");
    }

    // If rejected, keep job as draft (can be edited)

    revalidatePath("/admin/submissions");

    return NextResponse.json({ success: true, status: newStatus });
  } catch (error) {
    console.error("Review submission error:", error);
    return NextResponse.json({ error: "Review failed" }, { status: 500 });
  }
}
