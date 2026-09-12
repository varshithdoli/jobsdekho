import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { execute, query, queryOne } from "@/lib/db";

// GET - fetch user's alerts
export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const alerts = await query(
      "SELECT * FROM job_alerts WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    return NextResponse.json(alerts);
  } catch (error) {
    console.error("Get alerts error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// POST - create or update an alert
export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { category, work_mode, state, keyword, frequency } = await req.json();

    if (!frequency || !["daily", "weekly", "instant"].includes(frequency)) {
      return NextResponse.json({ error: "Invalid frequency" }, { status: 400 });
    }

    // Limit alerts per user
    const count = await queryOne<{ count: string }>(
      "SELECT COUNT(*) as count FROM job_alerts WHERE user_id = $1", [userId]
    );
    if (parseInt(count?.count || "0") >= 10) {
      return NextResponse.json({ error: "Maximum 10 alerts allowed" }, { status: 400 });
    }

    await execute(
      `INSERT INTO job_alerts (user_id, category, work_mode, state, keyword, frequency)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, category || null, work_mode || null, state || null, keyword || null, frequency]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create alert error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// DELETE - remove an alert
export async function DELETE(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();
    await execute(
      "DELETE FROM job_alerts WHERE id = $1 AND user_id = $2",
      [id, userId]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete alert error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
