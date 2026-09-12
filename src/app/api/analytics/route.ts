import { NextRequest, NextResponse } from "next/server";
import { execute } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { event_type, job_id, session_id, referrer } = await req.json();

    if (!event_type || !["page_view", "apply_click", "share", "search", "bookmark"].includes(event_type)) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }

    // Hash IP for privacy
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    const ipHash = crypto.createHash("sha256").update(ip + "jobsdekho-salt").digest("hex").slice(0, 16);

    // Detect device type from user-agent
    const ua = req.headers.get("user-agent") || "";
    const deviceType = /mobile/i.test(ua) ? "mobile" : /tablet/i.test(ua) ? "tablet" : "desktop";

    // Extract UTM params from referrer
    let utmSource: string | null = null;
    let utmMedium: string | null = null;
    let utmCampaign: string | null = null;
    try {
      if (referrer) {
        const url = new URL(referrer);
        utmSource = url.searchParams.get("utm_source");
        utmMedium = url.searchParams.get("utm_medium");
        utmCampaign = url.searchParams.get("utm_campaign");
      }
    } catch { /* invalid URL */ }

    await execute(
      `INSERT INTO analytics_events (event_type, job_id, session_id, referrer, utm_source, utm_medium, utm_campaign, device_type, ip_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [event_type, job_id || null, session_id || null, referrer || null, utmSource, utmMedium, utmCampaign, deviceType, ipHash]
    );

    // Increment view/click counts on the job
    if (job_id) {
      if (event_type === "page_view") {
        await execute("UPDATE jobs SET views_count = views_count + 1 WHERE id = $1", [job_id]);
      } else if (event_type === "apply_click") {
        await execute("UPDATE jobs SET clicks_count = clicks_count + 1 WHERE id = $1", [job_id]);
      } else if (event_type === "share") {
        await execute("UPDATE jobs SET shares_count = shares_count + 1 WHERE id = $1", [job_id]);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
