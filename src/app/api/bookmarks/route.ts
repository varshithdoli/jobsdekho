import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { execute, queryOne } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { jobId } = await req.json();
    if (!jobId) {
      return NextResponse.json({ error: "Job ID required" }, { status: 400 });
    }

    const existing = await queryOne(
      "SELECT id FROM bookmarks WHERE user_id = $1 AND job_id = $2",
      [userId, jobId]
    );

    if (existing) {
      await execute("DELETE FROM bookmarks WHERE user_id = $1 AND job_id = $2", [userId, jobId]);
      return NextResponse.json({ bookmarked: false });
    } else {
      await execute("INSERT INTO bookmarks (user_id, job_id) VALUES ($1, $2)", [userId, jobId]);
      return NextResponse.json({ bookmarked: true });
    }
  } catch (error) {
    console.error("Bookmark error:", error);
    return NextResponse.json({ error: "Failed to bookmark" }, { status: 500 });
  }
}
