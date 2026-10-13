import type { Metadata } from "next";

import { DiseaseList } from "@/components/diseases/disease-list";

export const metadata: Metadata = {
  title: "疾病列表",
};

export default async function DiseasesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    species?: string;
    category?: string;
  }>;
}) {
  const sp = await searchParams;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">疾病列表</h1>
      <DiseaseList
        initialSearch={sp.search ?? ""}
        initialSpecies={sp.species ?? "all"}
        initialCategory={sp.category ?? "all"}
      />
    </div>
  );
}
