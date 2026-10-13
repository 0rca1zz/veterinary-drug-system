import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type {
  DrugDetail,
  DrugSummary,
  PageResult,
  SortOrder,
  SpeciesCode,
} from "@/types";

export interface DrugQueryParams {
  search?: string;
  category?: string;
  species?: SpeciesCode;
  indication?: string;
  sort?: "genericName" | "updatedAt" | "createdAt";
  order?: SortOrder;
  page?: number;
  pageSize?: number;
}

/** 药物列表：支持模糊搜索、分类/动物/适应症筛选、分页、排序 */
export async function getDrugs(
  params: DrugQueryParams
): Promise<PageResult<DrugSummary>> {
  const {
    search,
    category,
    species,
    indication,
    sort = "genericName",
    order = "asc",
    page = 1,
    pageSize = 10,
  } = params;

  const where: Prisma.DrugWhereInput = {};

  if (search) {
    where.OR = [
      { genericName: { contains: search } },
      { brandName: { contains: search } },
      { indications: { contains: search } },
    ];
  }
  if (category) {
    where.category = { name: category };
  }
  if (species) {
    where.targetSpecies = { some: { code: species } };
  }
  if (indication) {
    where.indications = { contains: indication };
  }

  const [total, rows] = await prisma.$transaction([
    prisma.drug.count({ where }),
    prisma.drug.findMany({
      where,
      include: { category: true, targetSpecies: true },
      orderBy: { [sort]: order },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const items: DrugSummary[] = rows.map((d) => ({
    id: d.id,
    genericName: d.genericName,
    brandName: d.brandName,
    categoryName: d.category?.name ?? null,
    targetSpecies: d.targetSpecies.map((s) => ({
      code: s.code as SpeciesCode,
      name: s.name,
    })),
    indications: d.indications,
    requiresPrescription: d.requiresPrescription,
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

/** 药物详情 */
export async function getDrugById(id: string): Promise<DrugDetail | null> {
  const d = await prisma.drug.findUnique({
    where: { id },
    include: {
      category: true,
      targetSpecies: true,
      contraindicationRules: true,
    },
  });

  if (!d) return null;

  return {
    id: d.id,
    genericName: d.genericName,
    brandName: d.brandName,
    categoryId: d.categoryId,
    categoryName: d.category?.name ?? null,
    targetSpecies: d.targetSpecies.map((s) => ({
      code: s.code as SpeciesCode,
      name: s.name,
    })),
    indications: d.indications,
    contraindications: d.contraindications,
    adverseEffects: d.adverseEffects,
    pregnancyWarning: d.pregnancyWarning,
    requiresPrescription: d.requiresPrescription,
    description: d.description,
    isDemo: d.isDemo,
    updatedAt: d.updatedAt,
    contraindicationRules: d.contraindicationRules.map((c) => ({
      type: c.type,
      description: c.description,
      severity: c.severity,
    })),
  };
}

/** 药物分类列表（含药物数量，用于筛选） */
export async function getDrugCategories(): Promise<
  { id: string; name: string; count: number }[]
> {
  const rows = await prisma.drugCategory.findMany({
    include: { _count: { select: { drugs: true } } },
    orderBy: { name: "asc" },
  });
  return rows.map((c) => ({ id: c.id, name: c.name, count: c._count.drugs }));
}
