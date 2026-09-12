"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, INDIAN_STATES } from "@/lib/constants";
import styles from "@/styles/components/admin.module.css";

interface ParsedJob {
  title?: string;
  organization?: string;
  category?: string;
  work_mode?: string;
  location?: string;
  state?: string;
  city?: string;
  salary_min?: number;
  salary_max?: number;
  salary_period?: string;
  experience_min?: number;
  experience_max?: number;
  education?: string;
  vacancies?: number;
  age_limit?: string;
  application_deadline?: string;
  official_apply_url?: string;
  official_notification_url?: string;
  description?: string;
  eligibility_summary?: string;
  skills?: string[];
  selection_process?: string;
  application_fee?: string;
  who_should_apply?: string;
  source?: string;
  conflicts?: string[];
}

export default function AICreatorPage() {
  const router = useRouter();
  const [rawText, setRawText] = useState("");
  const [parsed, setParsed] = useState<ParsedJob | null>(null);
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"input" | "review">("input");

  const handleParse = async () => {
    setParsing(true);
    setError("");
    try {
      const res = await fetch("/api/admin/ai-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setParsed(data.parsed);
      setStep("review");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Parsing failed");
    } finally {
      setParsing(false);
    }
  };

  const handleSave = async (status: string) => {
    if (!parsed) return;
    setSaving(true);
    setError("");
    try {
      const payload = { ...parsed, status, is_verified: false };
      const res = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/admin/jobs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: unknown) => {
    setParsed((prev) => prev ? { ...prev, [field]: value } : null);
  };

  return (
    <div className="container">
      <div className="page-section" style={{ maxWidth: 900 }}>
        <h1 style={{ marginBottom: 8 }}>🤖 AI Job Creator</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 24, fontSize: "var(--font-size-sm)" }}>
          Paste unstructured job information — the AI will extract structured data for review.
        </p>

        {error && (
          <div className="disclaimer-box" style={{ marginBottom: 16, borderColor: "var(--danger-500)" }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {step === "input" && (
          <>
            <div className="form-group">
              <label className="form-label">Paste job information</label>
              <textarea
                className="form-textarea"
                rows={14}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder={`Example:\n\nTCS is hiring Software Developers in Bangalore.\nB.Tech/BE graduates with 0-2 years experience.\nSkills: Java, Spring Boot, SQL.\nSalary: 4-7 LPA.\nApply at: https://careers.tcs.com\nDeadline: 31 Dec 2026`}
                style={{ fontFamily: "inherit" }}
              />
              <span className="form-hint">{rawText.length}/10,000 characters</span>
            </div>
            <button
              onClick={handleParse}
              className="btn btn-primary"
              disabled={parsing || !rawText.trim()}
              style={{ marginTop: 12 }}
            >
              {parsing ? "⏳ Analyzing with AI..." : "🤖 Parse with AI"}
            </button>
          </>
        )}

        {step === "review" && parsed && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: "var(--font-size-lg)" }}>Review Extracted Data</h2>
              <button onClick={() => { setStep("input"); setParsed(null); }} className="btn btn-secondary btn-sm">
                ← Back to Input
              </button>
            </div>

            {parsed.conflicts && parsed.conflicts.length > 0 && (
              <div className="disclaimer-box" style={{ marginBottom: 16 }}>
                <strong>⚠️ Conflicts Detected:</strong>
                <ul style={{ marginTop: 6, paddingLeft: 20, listStyle: "disc" }}>
                  {parsed.conflicts.map((c, i) => <li key={i} style={{ fontSize: "var(--font-size-sm)" }}>{c}</li>)}
                </ul>
              </div>
            )}

            <div className={styles.formGrid}>
              <div className={`form-group ${styles.fullWidth}`}>
                <label className="form-label">Job Title *</label>
                <input className="form-input" value={parsed.title || ""} onChange={(e) => updateField("title", e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Organization *</label>
                <input className="form-input" value={parsed.organization || ""} onChange={(e) => updateField("organization", e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-select" value={parsed.category || ""} onChange={(e) => updateField("category", e.target.value)}>
                  <option value="">Select</option>
                  {CATEGORIES.map((c) => <option key={c.category} value={c.category}>{c.label}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Work Mode</label>
                <select className="form-select" value={parsed.work_mode || ""} onChange={(e) => updateField("work_mode", e.target.value || null)}>
                  <option value="">Select</option>
                  <option value="onsite">On-site</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="work-from-home">Work from Home</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">State</label>
                <select className="form-select" value={parsed.state || ""} onChange={(e) => updateField("state", e.target.value || null)}>
                  <option value="">Select</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-input" value={parsed.city || ""} onChange={(e) => updateField("city", e.target.value || null)} />
              </div>

              <div className="form-group">
                <label className="form-label">Location Display</label>
                <input className="form-input" value={parsed.location || ""} onChange={(e) => updateField("location", e.target.value || null)} />
              </div>

              <div className="form-group">
                <label className="form-label">Min Salary (₹)</label>
                <input className="form-input" type="number" value={parsed.salary_min ?? ""} onChange={(e) => updateField("salary_min", e.target.value ? Number(e.target.value) : null)} />
              </div>

              <div className="form-group">
                <label className="form-label">Max Salary (₹)</label>
                <input className="form-input" type="number" value={parsed.salary_max ?? ""} onChange={(e) => updateField("salary_max", e.target.value ? Number(e.target.value) : null)} />
              </div>

              <div className="form-group">
                <label className="form-label">Salary Period</label>
                <select className="form-select" value={parsed.salary_period || ""} onChange={(e) => updateField("salary_period", e.target.value || null)}>
                  <option value="">Select</option>
                  <option value="yearly">Yearly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Min Experience (yrs)</label>
                <input className="form-input" type="number" value={parsed.experience_min ?? ""} onChange={(e) => updateField("experience_min", e.target.value ? Number(e.target.value) : null)} />
              </div>

              <div className="form-group">
                <label className="form-label">Max Experience (yrs)</label>
                <input className="form-input" type="number" value={parsed.experience_max ?? ""} onChange={(e) => updateField("experience_max", e.target.value ? Number(e.target.value) : null)} />
              </div>

              <div className="form-group">
                <label className="form-label">Education</label>
                <input className="form-input" value={parsed.education || ""} onChange={(e) => updateField("education", e.target.value || null)} />
              </div>

              <div className="form-group">
                <label className="form-label">Vacancies</label>
                <input className="form-input" type="number" value={parsed.vacancies ?? ""} onChange={(e) => updateField("vacancies", e.target.value ? Number(e.target.value) : null)} />
              </div>

              <div className="form-group">
                <label className="form-label">Age Limit</label>
                <input className="form-input" value={parsed.age_limit || ""} onChange={(e) => updateField("age_limit", e.target.value || null)} />
              </div>

              <div className="form-group">
                <label className="form-label">Deadline</label>
                <input className="form-input" type="date" value={parsed.application_deadline || ""} onChange={(e) => updateField("application_deadline", e.target.value || null)} />
              </div>

              <div className={`form-group ${styles.fullWidth}`}>
                <label className="form-label">Apply URL *</label>
                <input className="form-input" type="url" value={parsed.official_apply_url || ""} onChange={(e) => updateField("official_apply_url", e.target.value)} />
              </div>

              <div className={`form-group ${styles.fullWidth}`}>
                <label className="form-label">Notification URL</label>
                <input className="form-input" type="url" value={parsed.official_notification_url || ""} onChange={(e) => updateField("official_notification_url", e.target.value || null)} />
              </div>

              <div className={`form-group ${styles.fullWidth}`}>
                <label className="form-label">Description</label>
                <textarea className="form-textarea" rows={5} value={parsed.description || ""} onChange={(e) => updateField("description", e.target.value || null)} />
              </div>

              <div className={`form-group ${styles.fullWidth}`}>
                <label className="form-label">Eligibility Summary</label>
                <textarea className="form-textarea" rows={3} value={parsed.eligibility_summary || ""} onChange={(e) => updateField("eligibility_summary", e.target.value || null)} />
              </div>

              <div className={`form-group ${styles.fullWidth}`}>
                <label className="form-label">Who Should Apply (Editorial)</label>
                <textarea className="form-textarea" rows={3} value={parsed.who_should_apply || ""} onChange={(e) => updateField("who_should_apply", e.target.value || null)} />
              </div>

              <div className={`form-group ${styles.fullWidth}`}>
                <label className="form-label">Skills (comma-separated)</label>
                <input className="form-input" value={parsed.skills?.join(", ") || ""} onChange={(e) => updateField("skills", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
              </div>

              <div className={`form-group ${styles.fullWidth}`}>
                <label className="form-label">Selection Process</label>
                <textarea className="form-textarea" rows={2} value={parsed.selection_process || ""} onChange={(e) => updateField("selection_process", e.target.value || null)} />
              </div>

              <div className={`form-group ${styles.fullWidth}`}>
                <label className="form-label">Application Fee</label>
                <input className="form-input" value={parsed.application_fee || ""} onChange={(e) => updateField("application_fee", e.target.value || null)} />
              </div>
            </div>

            <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={() => handleSave("published")} className="btn btn-success" disabled={saving || !parsed.title || !parsed.organization || !parsed.category || !parsed.official_apply_url}>
                {saving ? "Saving..." : "✅ Publish Now"}
              </button>
              <button onClick={() => handleSave("draft")} className="btn btn-secondary" disabled={saving}>
                Save as Draft
              </button>
              <button onClick={() => { setStep("input"); setParsed(null); }} className="btn btn-outline">
                Discard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
