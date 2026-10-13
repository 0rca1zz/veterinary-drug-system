import type { Metadata } from "next";

import { MatchClient } from "@/components/match/match-client";
import { SPECIES_CODES, type SpeciesCode } from "@/types";

export const metadata: Metadata = {
  title: "智能匹配",
};

export default async function MatchPage({
  searchParams,
}: {
  searchParams: Promise<{
    speciesCode?: string;
    diseaseId?: string;
    weightKg?: string;
    ageWeeks?: string;
    pregnant?: string;
  }>;
}) {
  const sp = await searchParams;

  const speciesCode = (SPECIES_CODES as readonly string[]).includes(
    sp.speciesCode ?? ""
  )
    ? (sp.speciesCode as SpeciesCode)
    : "dog";

  const weightKg = sp.weightKg ? Number(sp.weightKg) : NaN;
  const ageWeeks = sp.ageWeeks ? Number(sp.ageWeeks) : NaN;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">智能匹配</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        选择动物种类、疾病与生理参数，系统将按规则筛选候选药物并提示禁忌与风险（不自动开处方）。
      </p>
      <MatchClient
        initial={{
          speciesCode,
          diseaseId: sp.diseaseId ?? "",
          weightKg:
            Number.isFinite(weightKg) && weightKg > 0 ? weightKg : undefined,
          ageWeeks:
            Number.isFinite(ageWeeks) && ageWeeks >= 0 ? ageWeeks : undefined,
          pregnant: sp.pregnant === "true",
        }}
      />
    </div>
  );
}
