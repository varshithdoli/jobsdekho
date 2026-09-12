import type { Metadata } from "next";
import JobForm from "@/components/admin/JobForm";

export const metadata: Metadata = { title: "Add New Job" };

export default function NewJobPage() {
  return (
    <div className="container">
      <div className="page-section" style={{ maxWidth: 900 }}>
        <h1 style={{ marginBottom: 24 }}>Add New Job</h1>
        <JobForm mode="create" />
      </div>
    </div>
  );
}
