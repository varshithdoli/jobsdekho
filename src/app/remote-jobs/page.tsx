import type { Metadata } from "next";
import CategoryPage, { getCategoryJobs } from "@/components/CategoryPage";

export const metadata: Metadata = { title: "Remote Jobs in India", description: "Latest remote and work-from-home job opportunities across India. Work from anywhere." };

export default async function RemoteJobsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));
  const { jobs, total } = await getCategoryJobs("remote", page);
  return <CategoryPage category="remote" label="Remote Jobs" description="Work from home & remote opportunities" slug="remote-jobs" jobs={jobs} total={total} page={page} />;
}
