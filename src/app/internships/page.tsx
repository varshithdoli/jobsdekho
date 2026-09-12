import type { Metadata } from "next";
import CategoryPage, { getCategoryJobs } from "@/components/CategoryPage";

export const metadata: Metadata = { title: "Internships in India", description: "Latest paid and unpaid internship opportunities for students and fresh graduates across India." };

export default async function InternshipsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));
  const { jobs, total } = await getCategoryJobs("internship", page);
  return <CategoryPage category="internship" label="Internships" description="Paid & unpaid internship opportunities" slug="internships" jobs={jobs} total={total} page={page} />;
}
