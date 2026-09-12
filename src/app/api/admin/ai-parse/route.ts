import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `You are a job listing parser for an Indian job portal called JobsDekho.

Given unstructured text about a job posting, extract structured data. Return ONLY valid JSON with these fields:

{
  "title": "Job title",
  "organization": "Company/organization name",
  "category": "one of: government, it, non-it, bank, railway, defence, internship, apprenticeship, walkin, fresher, remote, scholarship, exam",
  "work_mode": "one of: onsite, remote, hybrid, work-from-home, or null",
  "location": "City, State or null",
  "state": "Indian state or null",
  "city": "City name or null",
  "salary_min": number or null,
  "salary_max": number or null,
  "salary_period": "yearly or monthly or null",
  "experience_min": number or null,
  "experience_max": number or null,
  "education": "Education requirement or null",
  "vacancies": number or null,
  "age_limit": "Age requirement string or null",
  "application_deadline": "YYYY-MM-DD or null",
  "official_apply_url": "URL or null",
  "official_notification_url": "URL or null",
  "description": "Job description text",
  "eligibility_summary": "Eligibility criteria summary or null",
  "skills": ["skill1", "skill2"] or null,
  "selection_process": "Selection process description or null",
  "application_fee": "Application fee details or null",
  "who_should_apply": "Editorial summary of ideal candidates or null",
  "source": "Source information or null",
  "conflicts": ["list of any conflicting information found"] or []
}

RULES:
- Extract ONLY information present in the input. Never invent data.
- If info is missing, use null.
- Convert salary to annual INR numbers (e.g., "4 LPA" → salary_min: 400000).
- If salary is monthly like "₹25,000/month", set salary_period to "monthly".
- Extract all URLs found in the text.
- If conflicting information exists, note it in the "conflicts" array.
- The "who_should_apply" field is editorial — write a brief helpful summary.
- Return ONLY the JSON object, no markdown or explanation.`;

export async function POST(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized — Admin only" }, { status: 403 });
  }

  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
  }

  try {
    const { text } = await req.json();
    if (!text?.trim()) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    if (text.length > 10000) {
      return NextResponse.json({ error: "Text too long (max 10,000 characters)" }, { status: 400 });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: SYSTEM_PROMPT },
              { text: `Parse this job posting:\n\n${text}` },
            ],
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 2000,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", errorData);
      return NextResponse.json({ error: "AI parsing failed — check API key" }, { status: 500 });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return NextResponse.json({ error: "AI returned no output" }, { status: 500 });
    }

    // Parse the JSON response
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      // Try to extract JSON from markdown code blocks
      const match = rawText.match(/```json?\s*([\s\S]*?)\s*```/);
      if (match) {
        parsed = JSON.parse(match[1]);
      } else {
        return NextResponse.json({ error: "AI returned invalid JSON", raw: rawText }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, parsed });
  } catch (error) {
    console.error("AI parse error:", error);
    return NextResponse.json({ error: "AI parsing failed" }, { status: 500 });
  }
}
