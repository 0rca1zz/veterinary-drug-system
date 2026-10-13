import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { DISCLAIMER } from "@/lib/validations";
import type {
  DrugInteractionWarning,
  ExcludedDrug,
  MatchInput,
  MatchRecommendation,
  MatchResult,
  SpeciesCode,
} from "@/types";
import { SPECIES_LABELS } from "@/types";

// 推荐级别排序权重
const LEVEL_ORDER: Record<string, number> = {
  一线: 1,
  二线: 2,
  辅助: 3,
};

type DrugWithRules = Prisma.DrugGetPayload<{
  include: {
    category: true;
    targetSpecies: true;
    contraindicationRules: true;
  };
}>;

interface Evaluation {
  disabled: string[];
  cautions: string[];
}

/**
 * 纯规则评估：根据动物种类、年龄、体重、妊娠状态与禁忌规则，
 * 判断某药物是否被排除，或给出慎用/风险提示。
 */
function evaluateDrug(drug: DrugWithRules, input: MatchInput): Evaluation {
  const disabled: string[] = [];
  const cautions: string[] = [];

  for (const rule of drug.contraindicationRules) {
    let matched = false;

    switch (rule.type) {
      case "pregnancy":
        matched = input.pregnant && rule.pregnancy === true;
        break;
      case "age":
        matched =
          (rule.minAgeWeeks != null && input.ageWeeks < rule.minAgeWeeks) ||
          (rule.maxAgeWeeks != null && input.ageWeeks > rule.maxAgeWeeks);
        break;
      case "weight":
        matched =
          (rule.minWeightKg != null && input.weightKg < rule.minWeightKg) ||
          (rule.maxWeightKg != null && input.weightKg > rule.maxWeightKg);
        break;
      case "species":
        matched = rule.species === input.speciesCode;
        break;
      case "other":
        // 无法由输入自动判定的禁忌，作为通用注意事项展示
        cautions.push(rule.description);
        continue;
      default:
        continue;
    }

    if (matched) {
      if (rule.severity === "禁用") {
        disabled.push(rule.description);
      } else {
        cautions.push(rule.description);
      }
    }
  }

  // 妊娠警示兜底（仅当无结构化妊娠规则时，避免重复提示）
  if (input.pregnant && drug.pregnancyWarning) {
    const hasPregnancyRule = drug.contraindicationRules.some(
      (r) => r.type === "pregnancy"
    );
    if (!hasPregnancyRule) {
      const msg = `孕期警示：${drug.pregnancyWarning}`;
      if (drug.pregnancyWarning.includes("禁用")) {
        disabled.push(msg);
      } else {
        cautions.push(msg);
      }
    }
  }

  return {
    disabled: [...new Set(disabled)],
    cautions: [...new Set(cautions)],
  };
}

/**
 * 规则化候选药物匹配：
 *   动物种类过滤 → 年龄过滤 → 体重限制 → 妊娠限制 → 禁忌症 → 药物相互作用
 * 返回推荐候选、被排除药物与风险提示。不生成治疗方案、不自动开处方。
 */
export async function matchDrugs(input: MatchInput): Promise<MatchResult> {
  const speciesName = SPECIES_LABELS[input.speciesCode];

  const disease = await prisma.disease.findUnique({
    where: { id: input.diseaseId },
    include: { species: true },
  });

  if (!disease) {
    return {
      speciesCode: input.speciesCode,
      speciesName,
      disease: { id: input.diseaseId, name: "", category: null },
      recommendations: [],
      excluded: [],
      interactions: [],
      warning: "未找到所选疾病，请重新选择。",
      disclaimer: DISCLAIMER,
    };
  }

  // 疾病所属动物与所选动物不一致时，不返回候选
  if (disease.species.code !== input.speciesCode) {
    return {
      speciesCode: input.speciesCode,
      speciesName,
      disease: {
        id: disease.id,
        name: disease.name,
        category: disease.category,
      },
      recommendations: [],
      excluded: [],
      interactions: [],
      warning: `「${disease.name}」所属动物为${disease.species.name}，与所选${speciesName}不一致，请重新选择。`,
      disclaimer: DISCLAIMER,
    };
  }

  const links = await prisma.diseaseDrug.findMany({
    where: { diseaseId: input.diseaseId },
    include: {
      drug: {
        include: {
          category: true,
          targetSpecies: true,
          contraindicationRules: true,
        },
      },
    },
  });

  const recommendations: MatchRecommendation[] = [];
  const excluded: ExcludedDrug[] = [];

  for (const link of links) {
    const drug = link.drug;

    // 1. 动物种类过滤
    const targetsSpecies = drug.targetSpecies.some(
      (s) => s.code === input.speciesCode
    );
    if (!targetsSpecies) {
      excluded.push({
        drugId: drug.id,
        genericName: drug.genericName,
        reason: `不适用于${speciesName}（适用动物不含${speciesName}）`,
      });
      continue;
    }

    // 2-5. 年龄/体重/妊娠/禁忌评估
    const evalResult = evaluateDrug(drug, input);
    if (evalResult.disabled.length > 0) {
      excluded.push({
        drugId: drug.id,
        genericName: drug.genericName,
        reason: evalResult.disabled.join("；"),
      });
      continue;
    }

    recommendations.push({
      drugId: drug.id,
      genericName: drug.genericName,
      brandName: drug.brandName,
      categoryName: drug.category?.name ?? null,
      indications: drug.indications,
      recommendLevel: link.recommendLevel,
      reason: link.reason,
      contraindications: evalResult.cautions,
      risks: [],
      requiresPrescription: drug.requiresPrescription,
      requiresVetGuidance: false,
    });
  }

  // 排序：推荐级别（一线 > 二线 > 辅助），同级按名称
  recommendations.sort((a, b) => {
    const la = LEVEL_ORDER[a.recommendLevel] ?? 99;
    const lb = LEVEL_ORDER[b.recommendLevel] ?? 99;
    if (la !== lb) return la - lb;
    return a.genericName.localeCompare(b.genericName, "zh-CN");
  });

  // 6. 药物相互作用（仅在推荐候选之间检查）
  const recommendedIds = recommendations.map((r) => r.drugId);
  const interactions: DrugInteractionWarning[] = [];

  if (recommendedIds.length > 1) {
    const rows = await prisma.drugInteraction.findMany({
      where: {
        drugAId: { in: recommendedIds },
        drugBId: { in: recommendedIds },
      },
      include: { drugA: true, drugB: true },
    });

    const riskByDrug = new Map<string, string[]>();
    for (const row of rows) {
      interactions.push({
        drugA: row.drugA.genericName,
        drugB: row.drugB.genericName,
        severity: row.severity,
        description: row.description,
      });
      const note = `与${row.drugB.genericName}存在相互作用（${row.severity === "high" ? "高风险" : row.severity === "medium" ? "中风险" : "低风险"}）：${row.description}`;
      riskByDrug.set(row.drugAId, [
        ...(riskByDrug.get(row.drugAId) ?? []),
        note,
      ]);
      const note2 = `与${row.drugA.genericName}存在相互作用（${row.severity === "high" ? "高风险" : row.severity === "medium" ? "中风险" : "低风险"}）：${row.description}`;
      riskByDrug.set(row.drugBId, [
        ...(riskByDrug.get(row.drugBId) ?? []),
        note2,
      ]);
    }

    for (const r of recommendations) {
      r.risks = [...(riskByDrug.get(r.drugId) ?? [])];
    }
  }

  // 需要兽医指导：处方药、存在慎用/风险提示
  for (const r of recommendations) {
    r.requiresVetGuidance =
      r.requiresPrescription ||
      r.contraindications.length > 0 ||
      r.risks.length > 0;
  }

  return {
    speciesCode: input.speciesCode,
    speciesName,
    disease: {
      id: disease.id,
      name: disease.name,
      category: disease.category,
    },
    recommendations,
    excluded,
    interactions,
    warning: null,
    disclaimer: DISCLAIMER,
  };
}
