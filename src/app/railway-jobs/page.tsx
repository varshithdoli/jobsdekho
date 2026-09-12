import type { Metadata } from "next";
import CategoryPage, { getCategoryJobs } from "@/components/CategoryPage";

export const metadata: Metadata = { title: "Railway Jobs in India", description: "Latest Indian Railways recruitment — RRB, RRC, IRCTC and other railway sector vacancies." };

export default async function RailwayJobsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));
  const { jobs, total } = await getCategoryJobs("railway", page);
  return <CategoryPage category="railway" label="Railway Jobs" description="Indian Railways recruitment" slug="railway-jobs" jobs={jobs} total={total} page={page} />;
}
