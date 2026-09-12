import type { Metadata } from "next";
import CategoryPage, { getCategoryJobs } from "@/components/CategoryPage";

export const metadata: Metadata = { title: "Non-IT Jobs in India", description: "Latest Non-IT jobs — Marketing, Sales, HR, Operations, Management and more across India." };

export default async function NonITJobsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));
  const { jobs, total } = await getCategoryJobs("non-it", page);
  return <CategoryPage category="non-it" label="Non-IT Jobs" description="Marketing, Sales, HR & more" slug="non-it-jobs" jobs={jobs} total={total} page={page} />;
}
