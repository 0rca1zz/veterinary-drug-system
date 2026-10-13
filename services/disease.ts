import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type {
  DiseaseDetail,
  DiseaseSummary,
  PageResult,
  SortOrder,
  SpeciesCode,
} from "@/types";

export interface DiseaseQueryParams {
  search?: string;
  species?: SpeciesCode;
  category?: string;
  sort?: "name" | "category" | "updatedAt" | "createdAt";
  order?: SortOrder;
  page?: number;
  pageSize?: number;
}

/** 疾病列表：支持模糊搜索、动物/分类筛选、分页、排序 */
export async function getDiseases(
  params: DiseaseQueryParams
): Promise<PageResult<DiseaseSummary>> {
  const {
    search,
    species,
    category,
    sort = "name",
    order = "asc",
    page = 1,
    pageSize = 10,
  } = params;

  const where: Prisma.DiseaseWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { symptoms: { contains: search } },
    ];
  }
  if (species) {
    where.species = { code: species };
  }
  if (category) {
    where.category = { contains: category };
  }

  const [total, rows] = await prisma.$transaction([
    prisma.disease.count({ where }),
    prisma.disease.findMany({
      where,
      include: { species: true },
      orderBy: { [sort]: order },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const items: DiseaseSummary[] = rows.map((d) => ({
    id: d.id,
    name: d.name,
    category: d.category,
    speciesName: d.species.name,
    speciesCode: d.species.code as SpeciesCode,
    description: d.description,
    isDemo: d.isDemo,
  }));

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/** 疾病详情（含推荐药物关联） */
export async function getDiseaseById(id: string): Promise<DiseaseDetail | null> {
  const d = await prisma.disease.findUnique({
    where: { id },
    include: {
      species: true,
      drugs: {
        include: {
          drug: { include: { category: true } },
        },
        orderBy: [{ recommendLevel: "asc" }, { drug: { genericName: "asc" } }],
      },
    },
  });

  if (!d) return null;

  return {
    id: d.id,
    name: d.name,
    category: d.category,
    speciesName: d.species.name,
    speciesCode: d.species.code as SpeciesCode,
    description: d.description,
    cause: d.cause,
    symptoms: d.symptoms,
    diagnosis: d.diagnosis,
    treatment: d.treatment,
    examinations: d.examinations,
    recommendedDrugCategories: d.recommendedDrugCategories,
    notes: d.notes,
    isDemo: d.isDemo,
    updatedAt: d.updatedAt,
    drugs: d.drugs.map((dd) => ({
      drugId: dd.drug.id,
      genericName: dd.drug.genericName,
      brandName: dd.drug.brandName,
      categoryName: dd.drug.category?.name ?? null,
      recommendLevel: dd.recommendLevel,
      reason: dd.reason,
    })),
  };
}

/** 疾病分类列表（用于筛选） */
export async function getDiseaseCategories(): Promise<string[]> {
  const rows = await prisma.disease.findMany({
    distinct: ["category"],
    select: { category: true },
    where: { category: { not: null } },
    orderBy: { category: "asc" },
  });
  return rows.map((r) => r.category as string).filter(Boolean);
}
