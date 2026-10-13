import { ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getDiseaseCategories } from "@/services/disease";
import { getDrugCategories } from "@/services/drug";

// GET /api/meta —— 动物种类与分类（供表单/筛选下拉使用）
export async function GET() {
  const [animals, drugCategories, diseaseCategories] = await Promise.all([
    prisma.animal.findMany({ orderBy: { name: "asc" } }),
    getDrugCategories(),
    getDiseaseCategories(),
  ]);
  return ok({ animals, drugCategories, diseaseCategories });
}
