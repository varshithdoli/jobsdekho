import type { Metadata } from "next";
import CategoryPage, { getCategoryJobs } from "@/components/CategoryPage";

export const metadata: Metadata = { title: "Walk-in Interviews in India", description: "Latest walk-in interview opportunities — Direct interview openings across India. No prior application needed." };

export default async function WalkinPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));
  const { jobs, total } = await getCategoryJobs("walkin", page);
  return <CategoryPage category="walkin" label="Walk-in Interviews" description="Direct walk-in interview opportunities" slug="walk-in-interviews" jobs={jobs} total={total} page={page} />;
}
