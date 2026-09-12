"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, INDIAN_STATES } from "@/lib/constants";
import styles from "@/styles/components/admin.module.css";

export default function CreatorSubmitPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {};
    form.forEach((value, key) => {
      if (key === "skills") {
        data[key] = (value as string).split(",").map(s => s.trim()).filter(Boolean);
      } else {
        data[key] = value || null;
      }
    });

    try {
      const res = await fetch("/api/creator/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Submission failed");
      }

      router.push("/creator?submitted=1");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-section" style={{ maxWidth: 900 }}>
        <h1 style={{ marginBottom: 8 }}>Submit a Job Listing</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 16, fontSize: "var(--font-size-sm)" }}>
          Submit a verified job opportunity for review. Our team will review and publish approved submissions.
        </p>
        <div className="disclaimer-box" style={{ marginBottom: 24 }}>
          <strong>Guidelines:</strong> Only submit genuine, verified opportunities from official sources.
          Include the official apply URL and notification link. Submissions with inaccurate information will be rejected.
        </div>

        {error && (
          <div className="disclaimer-box" style={{ marginBottom: 16, borderColor: "var(--danger-500)" }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={`form-group ${styles.fullWidth}`}>
              <label className="form-label">Job Title *</label>
              <input name="title" required className="form-input" placeholder="e.g., Software Developer at TCS" />
            </div>

            <div className="form-group">
              <label className="form-label">Organization *</label>
              <input name="organization" required className="form-input" placeholder="e.g., Tata Consultancy Services" />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select name="category" required className="form-select">
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c.category} value={c.category}>{c.label}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Work Mode</label>
              <select name="work_mode" className="form-select">
                <option value="">Select</option>
                <option value="onsite">On-site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="work-from-home">Work from Home</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">State</label>
              <select name="state" className="form-select">
                <option value="">Select state</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">City</label>
              <input name="city" className="form-input" placeholder="e.g., Mumbai" />
            </div>

            <div className="form-group">
              <label className="form-label">Location Display</label>
              <input name="location" className="form-input" placeholder="e.g., Mumbai, Maharashtra" />
            </div>

            <div className="form-group">
              <label className="form-label">Min Salary (₹)</label>
              <input name="salary_min" type="number" className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Max Salary (₹)</label>
              <input name="salary_max" type="number" className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Salary Period</label>
              <select name="salary_period" defaultValue="yearly" className="form-select">
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Education</label>
              <input name="education" className="form-input" placeholder="e.g., B.Tech / B.E." />
            </div>

            <div className="form-group">
              <label className="form-label">Vacancies</label>
              <input name="vacancies" type="number" className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Application Deadline</label>
              <input name="application_deadline" type="date" className="form-input" />
            </div>

            <div className={`form-group ${styles.fullWidth}`}>
              <label className="form-label">Official Apply URL *</label>
              <input name="official_apply_url" type="url" required className="form-input" placeholder="https://..." />
            </div>

            <div className={`form-group ${styles.fullWidth}`}>
              <label className="form-label">Official Notification URL</label>
              <input name="official_notification_url" type="url" className="form-input" placeholder="https://..." />
            </div>

            <div className={`form-group ${styles.fullWidth}`}>
              <label className="form-label">Description</label>
              <textarea name="description" className="form-textarea" rows={5} placeholder="Job description..." />
            </div>

            <div className={`form-group ${styles.fullWidth}`}>
              <label className="form-label">Eligibility Summary</label>
              <textarea name="eligibility_summary" className="form-textarea" rows={3} />
            </div>

            <div className={`form-group ${styles.fullWidth}`}>
              <label className="form-label">Skills (comma-separated)</label>
              <input name="skills" className="form-input" placeholder="JavaScript, React, Node.js" />
            </div>

            <div className="form-group">
              <label className="form-label">Source</label>
              <input name="source" className="form-input" placeholder="Official notification / Company website" />
            </div>
          </div>

          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "Submit for Review"}
            </button>
            <button type="button" onClick={() => router.back()} className="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
