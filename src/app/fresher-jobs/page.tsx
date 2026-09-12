import type { Metadata } from "next";
import CategoryPage, { getCategoryJobs } from "@/components/CategoryPage";

export const metadata: Metadata = { title: "Fresher Jobs in India", description: "Latest entry-level jobs for fresh graduates — No experience required. Start your career today." };

export default async function FresherJobsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));
  const { jobs, total } = await getCategoryJobs("fresher", page);
  return <CategoryPage category="fresher" label="Fresher Jobs" description="Entry-level jobs for fresh graduates" slug="fresher-jobs" jobs={jobs} total={total} page={page} />;
}
