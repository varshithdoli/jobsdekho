import type { Metadata } from "next";
import CategoryPage, { getCategoryJobs } from "@/components/CategoryPage";

export const metadata: Metadata = { title: "Apprenticeships in India", description: "Latest apprenticeship openings — Government and private sector apprenticeship programs across India." };

export default async function ApprenticeshipsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));
  const { jobs, total } = await getCategoryJobs("apprenticeship", page);
  return <CategoryPage category="apprenticeship" label="Apprenticeships" description="Government & private apprenticeships" slug="apprenticeships" jobs={jobs} total={total} page={page} />;
}
