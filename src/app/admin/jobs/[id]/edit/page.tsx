import { query } from "@/lib/db";
import type { Job } from "@/lib/types";
import JobForm from "@/components/admin/JobForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: Props) {
  const { id } = await params;

  const jobs = await query<Job>("SELECT * FROM jobs WHERE id = $1", [id]);
  const job = jobs[0];

  if (!job) {
    return (
      <div className="container">
        <div className="page-section">
          <h1>Job Not Found</h1>
          <p>The job you're trying to edit doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-section" style={{ maxWidth: 900 }}>
        <h1 style={{ marginBottom: 24 }}>Edit Job</h1>
        <JobForm job={job} mode="edit" />
      </div>
    </div>
  );
}
