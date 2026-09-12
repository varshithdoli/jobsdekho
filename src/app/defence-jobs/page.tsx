import type { Metadata } from "next";
import CategoryPage, { getCategoryJobs } from "@/components/CategoryPage";

export const metadata: Metadata = { title: "Defence Jobs in India", description: "Latest defence recruitment — Indian Army, Navy, Air Force, CRPF, BSF, Coast Guard and paramilitary forces." };

export default async function DefenceJobsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));
  const { jobs, total } = await getCategoryJobs("defence", page);
  return <CategoryPage category="defence" label="Defence Jobs" description="Army, Navy, Air Force & paramilitary" slug="defence-jobs" jobs={jobs} total={total} page={page} />;
}
