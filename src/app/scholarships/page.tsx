import type { Metadata } from "next";
import CategoryPage, { getCategoryJobs } from "@/components/CategoryPage";

export const metadata: Metadata = { title: "Scholarships in India", description: "Latest education scholarships and fellowships for Indian students — Merit-based, need-based, and government scholarships." };

export default async function ScholarshipsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));
  const { jobs, total } = await getCategoryJobs("scholarship", page);
  return <CategoryPage category="scholarship" label="Scholarships" description="Education scholarships & fellowships" slug="scholarships" jobs={jobs} total={total} page={page} />;
}
