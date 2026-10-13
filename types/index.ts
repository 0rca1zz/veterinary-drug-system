// ============================================================
// 共享类型定义
// ============================================================

export const SPECIES_CODES = [
  "dog",
  "cat",
  "pig",
  "cattle",
  "sheep",
  "poultry",
] as const;

export type SpeciesCode = (typeof SPECIES_CODES)[number];

export const SPECIES_LABELS: Record<SpeciesCode, string> = {
  dog: "犬",
  cat: "猫",
  pig: "猪",
  cattle: "牛",
  sheep: "羊",
  poultry: "家禽",
};

// ---------- 通用分页 ----------
export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type SortOrder = "asc" | "desc";

// ---------- 疾病 ----------
export interface DiseaseSummary {
  id: string;
  name: string;
  category: string | null;
  speciesName: string;
  speciesCode: SpeciesCode;
  description: string | null;
  isDemo: boolean;
}

export interface DiseaseDrugRef {
  drugId: string;
  genericName: string;
  brandName: string | null;
  categoryName: string | null;
  recommendLevel: string;
  reason: string | null;
}

export interface DiseaseDetail {
  id: string;
  name: string;
  category: string | null;
  speciesName: string;
  speciesCode: SpeciesCode;
  description: string | null;
  cause: string | null;
  symptoms: string | null;
  diagnosis: string | null;
  treatment: string | null;
  examinations: string | null;
  recommendedDrugCategories: string | null;
  notes: string | null;
  isDemo: boolean;
  updatedAt: Date;
  drugs: DiseaseDrugRef[];
}

// ---------- 药物 ----------
export interface DrugSummary {
  id: string;
  genericName: string;
  brandName: string | null;
  categoryName: string | null;
  targetSpecies: { code: SpeciesCode; name: string }[];
  indications: string | null;
  requiresPrescription: boolean;
  isDemo: boolean;
}

export interface DrugDetail {
  id: string;
  genericName: string;
  brandName: string | null;
  categoryId: string | null;
  categoryName: string | null;
  targetSpecies: { code: SpeciesCode; name: string }[];
  indications: string | null;
  contraindications: string | null;
  adverseEffects: string | null;
  pregnancyWarning: string | null;
  requiresPrescription: boolean;
  description: string | null;
  isDemo: boolean;
  updatedAt: Date;
  contraindicationRules: {
    type: string;
    description: string;
    severity: string;
  }[];
}

// ---------- 匹配 ----------
export interface MatchInput {
  speciesCode: SpeciesCode;
  diseaseId: string;
  weightKg: number;
  ageWeeks: number;
  pregnant: boolean;
}

export interface MatchRecommendation {
  drugId: string;
  genericName: string;
  brandName: string | null;
  categoryName: string | null;
  indications: string | null;
  recommendLevel: string;
  reason: string | null;
  contraindications: string[];
  risks: string[];
  requiresPrescription: boolean;
  requiresVetGuidance: boolean;
}

export interface ExcludedDrug {
  drugId: string;
  genericName: string;
  reason: string;
}

export interface DrugInteractionWarning {
  drugA: string;
  drugB: string;
  severity: string;
  description: string;
}

export interface MatchResult {
  speciesCode: SpeciesCode;
  speciesName: string;
  disease: {
    id: string;
    name: string;
    category: string | null;
  };
  recommendations: MatchRecommendation[];
  excluded: ExcludedDrug[];
  interactions: DrugInteractionWarning[];
  warning: string | null;
  disclaimer: string;
}
