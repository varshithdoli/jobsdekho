import { NextRequest, NextResponse } from "next/server";
import { execute, query } from "@/lib/db";

/**
 * Cron job API — auto-archives expired jobs
 * Called by Vercel Cron or external scheduler
 * GET /api/cron/expire-jobs?key=CRON_SECRET
 */
export async function GET(req: NextRequest) {
  // Verify cron secret
  const key = req.nextUrl.searchParams.get("key");
  if (key !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Archive jobs past deadline
    const expired = await query<{ id: string; title: string }>(
      `UPDATE jobs
       SET status = 'expired', updated_at = NOW()
       WHERE status = 'published'
         AND application_deadline IS NOT NULL
         AND application_deadline < CURRENT_DATE
       RETURNING id, title`
    );

    // Archive very old jobs without deadline (older than 90 days)
    const stale = await query<{ id: string; title: string }>(
      `UPDATE jobs
       SET status = 'archived', updated_at = NOW()
       WHERE status = 'published'
         AND application_deadline IS NULL
         AND published_at < NOW() - INTERVAL '90 days'
       RETURNING id, title`
    );

    console.log(`Cron: expired ${expired.length} jobs, archived ${stale.length} stale jobs`);

    return NextResponse.json({
      expired: expired.length,
      archived: stale.length,
      expiredJobs: expired.map(j => j.title),
      archivedJobs: stale.map(j => j.title),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron expire error:", error);
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}
