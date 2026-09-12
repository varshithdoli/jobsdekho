import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query, queryOne, execute } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const companies = await query(
      `SELECT c.*, COUNT(j.id) as job_count
       FROM companies c
       LEFT JOIN jobs j ON j.company_id = c.id AND j.status = 'published'
       GROUP BY c.id
       ORDER BY c.name ASC`
    );
    return NextResponse.json(companies);
  } catch (error) {
    console.error("Get companies error:", error);
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const data = await req.json();
    if (!data.name?.trim()) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    const slug = slugify(data.name);
    const existing = await queryOne("SELECT id FROM companies WHERE slug = $1", [slug]);
    if (existing) {
      return NextResponse.json({ error: "Company already exists" }, { status: 409 });
    }

    const result = await queryOne<{ id: string }>(
      `INSERT INTO companies (name, slug, industry, company_type, location, website, logo_url, description, employee_count, founded_year)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      [
        data.name.trim(), slug, data.industry || null, data.company_type || null,
        data.location || null, data.website || null, data.logo_url || null,
        data.description || null, data.employee_count || null, data.founded_year || null,
      ]
    );

    revalidatePath("/companies");
    return NextResponse.json({ success: true, id: result?.id, slug });
  } catch (error) {
    console.error("Create company error:", error);
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 });
  }
}
