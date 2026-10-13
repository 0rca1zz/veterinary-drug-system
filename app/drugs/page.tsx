import type { Metadata } from "next";

import { DrugList } from "@/components/drugs/drug-list";

export const metadata: Metadata = {
  title: "药物列表",
};

export default function DrugsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">药物列表</h1>
      <DrugList />
    </div>
  );
}
