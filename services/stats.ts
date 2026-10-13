import { prisma } from "@/lib/prisma";

export interface Stats {
  diseases: number;
  drugs: number;
  animals: number;
  links: number;
}

/** 实时统计：疾病数 / 药物数 / 动物种类数 / 疾病-药物关联数 */
export async function getStats(): Promise<Stats> {
  const [diseases, drugs, animals, links] = await Promise.all([
    prisma.disease.count(),
    prisma.drug.count(),
    prisma.animal.count(),
    prisma.diseaseDrug.count(),
  ]);

  return { diseases, drugs, animals, links };
}
