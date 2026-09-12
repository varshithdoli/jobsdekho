import type { Metadata } from "next";
import CategoryPage, { getCategoryJobs } from "@/components/CategoryPage";

export const metadata: Metadata = { title: "Bank Jobs in India", description: "Latest bank jobs — IBPS, SBI, RBI, NABARD and other banking sector recruitment across India." };

export default async function BankJobsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));
  const { jobs, total } = await getCategoryJobs("bank", page);
  return <CategoryPage category="bank" label="Bank Jobs" description="Banking & Financial sector opportunities" slug="bank-jobs" jobs={jobs} total={total} page={page} />;
}
