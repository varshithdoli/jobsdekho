"use client";

import { useState, useRef } from "react";
import styles from "@/styles/components/admin.module.css";

interface ParsedRow {
  title: string;
  organization: string;
  category: string;
  official_apply_url: string;
  [key: string]: string;
}

export default function BulkImportPage() {
  const [mode, setMode] = useState<"csv" | "json">("csv");
  const [json, setJson] = useState("");
  const [csvRows, setCsvRows] = useState<ParsedRow[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [result, setResult] = useState<{ imported: number; skipped: number; errors: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string) => {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) { setError("CSV must have a header row and at least one data row"); return; }

    const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
    setCsvHeaders(headers);

    const rows: ParsedRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      // Simple CSV parsing (handles quoted fields with commas)
      const values: string[] = [];
      let current = "";
      let inQuotes = false;
      for (const char of lines[i]) {
        if (char === '"') { inQuotes = !inQuotes; continue; }
        if (char === "," && !inQuotes) { values.push(current.trim()); current = ""; continue; }
        current += char;
      }
      values.push(current.trim());

      const row: Record<string, string> = {};
      headers.forEach((h, idx) => { row[h] = values[idx] || ""; });
      rows.push(row as ParsedRow);
    }
    setCsvRows(rows);
    setError("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (file.name.endsWith(".csv") || file.name.endsWith(".txt")) {
        parseCSV(text);
      } else if (file.name.endsWith(".json")) {
        setMode("json");
        setJson(text);
      } else {
        setError("Unsupported file format. Use .csv or .json");
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      let jobs;
      if (mode === "json") {
        jobs = JSON.parse(json);
        if (!Array.isArray(jobs)) throw new Error("Input must be a JSON array");
      } else {
        // Convert CSV rows to job objects
        jobs = csvRows.map(row => {
          const job: Record<string, unknown> = {};
          Object.entries(row).forEach(([key, value]) => {
            if (!value) return;
            // Convert numeric fields
            if (["salary_min", "salary_max", "experience_min", "experience_max", "vacancies"].includes(key)) {
              job[key] = parseInt(value) || null;
            } else if (["is_verified", "is_featured", "is_urgent", "is_sponsored"].includes(key)) {
              job[key] = value.toLowerCase() === "true" || value === "1";
            } else if (key === "skills") {
              job[key] = value.split(";").map(s => s.trim()).filter(Boolean);
            } else {
              job[key] = value;
            }
          });
          return job;
        });
      }

      const res = await fetch("/api/admin/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobs }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setLoading(false);
    }
  };

  const sampleCSV = `title,organization,category,status,location,salary_min,salary_max,salary_period,education,official_apply_url,description
Software Developer,TCS,it,published,"Mumbai, Maharashtra",400000,800000,yearly,B.Tech,https://careers.tcs.com,TCS is hiring...
Data Analyst,Infosys,it,published,"Bangalore, Karnataka",500000,900000,yearly,B.Tech/MBA,https://careers.infosys.com,Infosys is hiring...`;

  return (
    <div className="container">
      <div className="page-section" style={{ maxWidth: 1000 }}>
        <h1 style={{ marginBottom: 8 }}>📦 Bulk Import Jobs</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 24, fontSize: "var(--font-size-sm)" }}>
          Upload a CSV file or paste JSON. Required fields: title, organization, category, official_apply_url.
        </p>

        {/* Mode Toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <button onClick={() => setMode("csv")} className={`btn btn-sm ${mode === "csv" ? "btn-primary" : "btn-secondary"}`}>
            📄 CSV Upload
          </button>
          <button onClick={() => setMode("json")} className={`btn btn-sm ${mode === "json" ? "btn-primary" : "btn-secondary"}`}>
            📋 JSON Paste
          </button>
        </div>

        {mode === "csv" && (
          <>
            {/* File Upload */}
            <div style={{
              border: "2px dashed var(--border-color)", borderRadius: "var(--radius-lg)",
              padding: 32, textAlign: "center", marginBottom: 16, background: "#fff",
              cursor: "pointer",
            }} onClick={() => fileRef.current?.click()}>
              <input ref={fileRef} type="file" accept=".csv,.txt,.json" onChange={handleFileUpload}
                style={{ display: "none" }} />
              <p style={{ fontSize: "var(--font-size-base)", fontWeight: 600, marginBottom: 4 }}>
                📁 Click to upload CSV file
              </p>
              <p style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>
                Supports .csv and .json files. Max 100 jobs per import.
              </p>
            </div>

            {/* Sample CSV */}
            <details style={{ marginBottom: 16 }}>
              <summary style={{ fontSize: "var(--font-size-sm)", color: "var(--primary-600)", cursor: "pointer", fontWeight: 600 }}>
                View sample CSV format
              </summary>
              <pre style={{
                marginTop: 8, padding: 12, background: "var(--gray-50)", borderRadius: "var(--radius-md)",
                fontSize: "var(--font-size-xs)", overflow: "auto", lineHeight: 1.6,
              }}>{sampleCSV}</pre>
              <button onClick={() => parseCSV(sampleCSV)} className="btn btn-outline btn-sm" style={{ marginTop: 8 }}>
                Load Sample Data
              </button>
            </details>

            {/* CSV Preview Table */}
            {csvRows.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ marginBottom: 8, fontSize: "var(--font-size-base)" }}>
                  Preview ({csvRows.length} rows)
                </h3>
                <div style={{ overflowX: "auto", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)" }}>
                  <table className={styles.jobTable}>
                    <thead>
                      <tr>
                        <th>#</th>
                        {csvHeaders.slice(0, 6).map(h => <th key={h}>{h}</th>)}
                        {csvHeaders.length > 6 && <th>+{csvHeaders.length - 6} more</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {csvRows.slice(0, 10).map((row, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          {csvHeaders.slice(0, 6).map(h => (
                            <td key={h} style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {row[h] || "—"}
                            </td>
                          ))}
                          {csvHeaders.length > 6 && <td style={{ color: "var(--text-muted)" }}>...</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {csvRows.length > 10 && (
                  <p style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)", marginTop: 4 }}>
                    Showing 10 of {csvRows.length} rows
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {mode === "json" && (
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label">JSON Data</label>
            <textarea
              className="form-textarea"
              rows={14}
              value={json}
              onChange={(e) => setJson(e.target.value)}
              placeholder='[{ "title": "...", "organization": "...", "category": "it", "official_apply_url": "https://..." }]'
              style={{ fontFamily: "monospace", fontSize: "var(--font-size-xs)" }}
            />
          </div>
        )}

        {error && (
          <div className="disclaimer-box" style={{ marginBottom: 16, borderColor: "var(--danger-500)" }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={handleImport} className="btn btn-primary"
            disabled={loading || (mode === "json" ? !json.trim() : csvRows.length === 0)}>
            {loading ? "⏳ Importing..." : `Import ${mode === "csv" ? csvRows.length : ""} Jobs`}
          </button>
          {csvRows.length > 0 && (
            <button onClick={() => { setCsvRows([]); setCsvHeaders([]); }} className="btn btn-secondary">
              Clear
            </button>
          )}
        </div>

        {result && (
          <div style={{
            marginTop: 24, padding: 20, background: "#fff",
            borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)",
          }}>
            <h3 style={{ marginBottom: 12 }}>Import Results</h3>
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: "var(--font-size-2xl)", fontWeight: 800, color: "var(--success-600)" }}>
                  {result.imported}
                </span>
                <p style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>Imported</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: "var(--font-size-2xl)", fontWeight: 800, color: "var(--danger-600)" }}>
                  {result.skipped}
                </span>
                <p style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>Skipped</p>
              </div>
            </div>
            {result.errors.length > 0 && (
              <div>
                <h4 style={{ marginBottom: 8, fontSize: "var(--font-size-sm)" }}>Errors:</h4>
                <ul style={{ fontSize: "var(--font-size-xs)", color: "var(--danger-600)", lineHeight: 1.8, paddingLeft: 16 }}>
                  {result.errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
