import type { Metadata } from "next";
import CategoryPage, { getCategoryJobs } from "@/components/CategoryPage";

export const metadata: Metadata = { title: "IT Jobs in India", description: "Latest IT jobs — Software Engineer, Data Scientist, Cloud, DevOps, Full Stack and more tech roles across India." };

export default async function ITJobsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));
  const { jobs, total } = await getCategoryJobs("it", page);
  return <CategoryPage category="it" label="IT Jobs" description="Software, Data, Cloud & Tech roles" slug="it-jobs" jobs={jobs} total={total} page={page} />;
}
