"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, INDIAN_STATES } from "@/lib/constants";
import type { Job } from "@/lib/types";
import styles from "@/styles/components/admin.module.css";

interface JobFormProps {
  job?: Partial<Job>;
  mode: "create" | "edit";
}

export default function JobForm({ job, mode }: JobFormProps) {
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
      } else if (["is_verified", "is_featured", "is_urgent", "is_sponsored"].includes(key)) {
        data[key] = value === "on";
      } else {
        data[key] = value || null;
      }
    });

    // Ensure checkbox values default to false if not checked
    ["is_verified", "is_featured", "is_urgent", "is_sponsored"].forEach(key => {
      if (!(key in data)) data[key] = false;
    });

    try {
      const url = mode === "create" ? "/api/admin/jobs" : `/api/admin/jobs/${job?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to save job");
      }

      router.push("/admin/jobs");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="disclaimer-box" style={{ marginBottom: 16, color: "var(--danger-600)" }}>{error}</div>}

      <div className={styles.formGrid}>
        {/* Core Fields */}
        <div className={`form-group ${styles.fullWidth}`}>
          <label className="form-label">Job Title *</label>
          <input name="title" defaultValue={job?.title || ""} required className="form-input" placeholder="e.g., Software Developer at TCS" />
        </div>

        <div className="form-group">
          <label className="form-label">Organization *</label>
          <input name="organization" defaultValue={job?.organization || ""} required className="form-input" placeholder="e.g., Tata Consultancy Services" />
        </div>

        <div className="form-group">
          <label className="form-label">Category *</label>
          <select name="category" defaultValue={job?.category || ""} required className="form-select">
            <option value="">Select category</option>
            {CATEGORIES.map(c => <option key={c.category} value={c.category}>{c.label}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select name="status" defaultValue={job?.status || "draft"} className="form-select">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Work Mode</label>
          <select name="work_mode" defaultValue={job?.work_mode || ""} className="form-select">
            <option value="">Select work mode</option>
            <option value="onsite">On-site</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="work-from-home">Work from Home</option>
          </select>
        </div>

        {/* Location */}
        <div className="form-group">
          <label className="form-label">State</label>
          <select name="state" defaultValue={job?.state || ""} className="form-select">
            <option value="">Select state</option>
            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">City</label>
          <input name="city" defaultValue={job?.city || ""} className="form-input" placeholder="e.g., Mumbai" />
        </div>

        <div className="form-group">
          <label className="form-label">Location Display</label>
          <input name="location" defaultValue={job?.location || ""} className="form-input" placeholder="e.g., Mumbai, Maharashtra" />
        </div>

        {/* Salary & Experience */}
        <div className="form-group">
          <label className="form-label">Min Salary (₹)</label>
          <input name="salary_min" type="number" defaultValue={job?.salary_min ?? ""} className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">Max Salary (₹)</label>
          <input name="salary_max" type="number" defaultValue={job?.salary_max ?? ""} className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">Salary Period</label>
          <select name="salary_period" defaultValue={job?.salary_period || "yearly"} className="form-select">
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Min Experience (years)</label>
          <input name="experience_min" type="number" defaultValue={job?.experience_min ?? ""} className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">Max Experience (years)</label>
          <input name="experience_max" type="number" defaultValue={job?.experience_max ?? ""} className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">Vacancies</label>
          <input name="vacancies" type="number" defaultValue={job?.vacancies ?? ""} className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">Education Required</label>
          <input name="education" defaultValue={job?.education || ""} className="form-input" placeholder="e.g., B.Tech / B.E." />
        </div>

        <div className="form-group">
          <label className="form-label">Age Limit</label>
          <input name="age_limit" defaultValue={job?.age_limit || ""} className="form-input" placeholder="e.g., 18-30 years" />
        </div>

        <div className="form-group">
          <label className="form-label">Application Deadline</label>
          <input name="application_deadline" type="date" defaultValue={job?.application_deadline ? new Date(job.application_deadline).toISOString().split("T")[0] : ""} className="form-input" />
        </div>

        {/* URLs */}
        <div className={`form-group ${styles.fullWidth}`}>
          <label className="form-label">Official Apply URL *</label>
          <input name="official_apply_url" type="url" defaultValue={job?.official_apply_url || ""} required className="form-input" placeholder="https://..." />
        </div>

        <div className={`form-group ${styles.fullWidth}`}>
          <label className="form-label">Official Notification URL</label>
          <input name="official_notification_url" type="url" defaultValue={job?.official_notification_url || ""} className="form-input" placeholder="https://..." />
        </div>

        {/* Content */}
        <div className={`form-group ${styles.fullWidth}`}>
          <label className="form-label">Description</label>
          <textarea name="description" defaultValue={job?.description || ""} className="form-textarea" rows={6} placeholder="Job description..." />
        </div>

        <div className={`form-group ${styles.fullWidth}`}>
          <label className="form-label">Eligibility Summary</label>
          <textarea name="eligibility_summary" defaultValue={job?.eligibility_summary || ""} className="form-textarea" rows={4} />
        </div>

        <div className={`form-group ${styles.fullWidth}`}>
          <label className="form-label">Who Should Apply (Editorial)</label>
          <textarea name="who_should_apply" defaultValue={job?.who_should_apply || ""} className="form-textarea" rows={4} />
        </div>

        <div className={`form-group ${styles.fullWidth}`}>
          <label className="form-label">Selection Process</label>
          <textarea name="selection_process" defaultValue={job?.selection_process || ""} className="form-textarea" rows={3} />
        </div>

        <div className={`form-group ${styles.fullWidth}`}>
          <label className="form-label">Application Fee</label>
          <textarea name="application_fee" defaultValue={job?.application_fee || ""} className="form-textarea" rows={2} />
        </div>

        <div className={`form-group ${styles.fullWidth}`}>
          <label className="form-label">Skills (comma-separated)</label>
          <input name="skills" defaultValue={job?.skills?.join(", ") || ""} className="form-input" placeholder="JavaScript, React, Node.js" />
        </div>

        <div className="form-group">
          <label className="form-label">Source</label>
          <input name="source" defaultValue={job?.source || ""} className="form-input" placeholder="Official notification / Company website" />
        </div>

        {/* Flags */}
        <div className={`${styles.fullWidth}`} style={{ display: "flex", gap: 24, flexWrap: "wrap", padding: "12px 0" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" name="is_verified" defaultChecked={job?.is_verified || false} /> Verified
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" name="is_featured" defaultChecked={job?.is_featured || false} /> Featured
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" name="is_urgent" defaultChecked={job?.is_urgent || false} /> Urgent
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" name="is_sponsored" defaultChecked={job?.is_sponsored || false} /> Sponsored
          </label>
        </div>

        {/* SEO */}
        <div className={`form-group ${styles.fullWidth}`}>
          <label className="form-label">Meta Title (SEO)</label>
          <input name="meta_title" defaultValue={job?.meta_title || ""} className="form-input" maxLength={70} />
        </div>

        <div className={`form-group ${styles.fullWidth}`}>
          <label className="form-label">Meta Description (SEO)</label>
          <textarea name="meta_description" defaultValue={job?.meta_description || ""} className="form-textarea" rows={2} maxLength={160} />
        </div>
      </div>

      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : mode === "create" ? "Create Job" : "Update Job"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn btn-secondary">Cancel</button>
      </div>
    </form>
  );
}
