import type { Metadata } from "next";
import CategoryPage, { getCategoryJobs } from "@/components/CategoryPage";

export const metadata: Metadata = { title: "Competitive Exams in India", description: "Latest competitive exam notifications — UPSC, SSC, Banking, Railway, State PSC and more exam updates." };

export default async function ExamsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));
  const { jobs, total } = await getCategoryJobs("exam", page);
  return <CategoryPage category="exam" label="Competitive Exams" description="Upcoming competitive exam notifications" slug="exams" jobs={jobs} total={total} page={page} />;
}
