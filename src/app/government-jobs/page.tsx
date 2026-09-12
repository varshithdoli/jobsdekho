import type { Metadata } from "next";
import CategoryPage, { getCategoryJobs } from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "Government Jobs in India",
  description: "Latest verified government job vacancies — Central & State Government, PSU, SSC, UPSC, Railway, Defence and more. Apply online with official links.",
};

export default async function GovernmentJobsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));
  const { jobs, total } = await getCategoryJobs("government", page);
  return <CategoryPage category="government" label="Government Jobs" description="Central & State Government vacancies" slug="government-jobs" jobs={jobs} total={total} page={page} />;
}
