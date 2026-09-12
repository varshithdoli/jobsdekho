"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubmissionActions({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: "approve" | "reject") => {
    if (action === "reject" && !confirm("Are you sure you want to reject this submission?")) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Action failed");
        return;
      }
      router.refresh();
    } catch {
      alert("Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: 4 }}>
      <button
        onClick={() => handleAction("approve")}
        disabled={loading}
        style={{
          padding: "4px 10px", fontSize: "12px", fontWeight: 600,
          background: "var(--success-100)", color: "var(--success-700)",
          border: "none", borderRadius: "6px", cursor: "pointer",
        }}
      >
        ✓ Approve
      </button>
      <button
        onClick={() => handleAction("reject")}
        disabled={loading}
        style={{
          padding: "4px 10px", fontSize: "12px", fontWeight: 600,
          background: "var(--danger-100)", color: "var(--danger-600)",
          border: "none", borderRadius: "6px", cursor: "pointer",
        }}
      >
        ✕ Reject
      </button>
    </div>
  );
}
