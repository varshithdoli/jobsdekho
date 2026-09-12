"use client";

import { useState, useEffect } from "react";
import { CATEGORIES, INDIAN_STATES, WORK_MODES } from "@/lib/constants";

interface Alert {
  id: string;
  category: string | null;
  work_mode: string | null;
  state: string | null;
  keyword: string | null;
  frequency: string;
  is_active: boolean;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Form state
  const [category, setCategory] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [state, setState] = useState("");
  const [keyword, setKeyword] = useState("");
  const [frequency, setFrequency] = useState("daily");

  useEffect(() => {
    fetch("/api/alerts").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setAlerts(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: category || null,
          work_mode: workMode || null,
          state: state || null,
          keyword: keyword || null,
          frequency,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      setMessage("Alert created!");
      setCategory(""); setWorkMode(""); setState(""); setKeyword("");

      // Refresh alerts
      const refreshed = await fetch("/api/alerts").then(r => r.json());
      if (Array.isArray(refreshed)) setAlerts(refreshed);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to create alert");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch("/api/alerts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setAlerts(alerts.filter(a => a.id !== id));
    } catch { /* empty */ }
  };

  const getCategoryLabel = (cat: string | null) => {
    if (!cat) return "All categories";
    return CATEGORIES.find(c => c.category === cat)?.label || cat;
  };

  if (loading) return <div className="container"><div className="page-section"><p>Loading...</p></div></div>;

  return (
    <div className="container">
      <div className="page-section" style={{ maxWidth: 700 }}>
        <h1 style={{ marginBottom: 8 }}>Job Alerts</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
          Get notified when new jobs matching your criteria are posted.
        </p>

        {/* Existing alerts */}
        {alerts.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: "var(--font-size-lg)", marginBottom: 12 }}>Your Alerts ({alerts.length}/10)</h2>
            {alerts.map(alert => (
              <div key={alert.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 16px", background: "var(--bg-card)", border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)", marginBottom: 8,
              }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: "var(--font-size-sm)" }}>
                    {getCategoryLabel(alert.category)}
                    {alert.state ? ` · ${alert.state}` : ""}
                    {alert.keyword ? ` · "${alert.keyword}"` : ""}
                  </span>
                  <span style={{ display: "block", fontSize: "var(--font-size-xs)", color: "var(--text-muted)", marginTop: 2 }}>
                    {alert.frequency} alerts
                    {alert.work_mode ? ` · ${alert.work_mode}` : ""}
                  </span>
                </div>
                <button onClick={() => handleDelete(alert.id)} style={{
                  background: "none", border: "none", color: "var(--danger-600)",
                  cursor: "pointer", fontSize: "var(--font-size-sm)", fontWeight: 600,
                }}>Remove</button>
              </div>
            ))}
          </div>
        )}

        {/* Create new alert */}
        {alerts.length < 10 && (
          <form onSubmit={handleCreate}>
            <h2 style={{ fontSize: "var(--font-size-lg)", marginBottom: 12 }}>Create New Alert</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="form-select">
                  <option value="">All categories</option>
                  {CATEGORIES.map(c => <option key={c.category} value={c.category}>{c.label}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Work Mode</label>
                <select value={workMode} onChange={e => setWorkMode(e.target.value)} className="form-select">
                  <option value="">Any</option>
                  {WORK_MODES.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">State</label>
                <select value={state} onChange={e => setState(e.target.value)} className="form-select">
                  <option value="">All India</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Frequency</label>
                <select value={frequency} onChange={e => setFrequency(e.target.value)} className="form-select">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="instant">Instant</option>
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Keyword (optional)</label>
                <input value={keyword} onChange={e => setKeyword(e.target.value)} className="form-input" placeholder="e.g., developer, SSC, UPSC" />
              </div>
            </div>

            {message && (
              <p style={{ marginTop: 8, fontSize: "var(--font-size-sm)", color: message.includes("created") ? "var(--success-600)" : "var(--danger-600)" }}>
                {message}
              </p>
            )}

            <button type="submit" className="btn btn-primary" style={{ marginTop: 16 }} disabled={saving}>
              {saving ? "Creating..." : "Create Alert"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
