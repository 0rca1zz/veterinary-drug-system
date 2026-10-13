import type { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api";
import { drugQuerySchema } from "@/lib/validations";
import { getDrugs } from "@/services/drug";

// GET /api/drugs —— 药物列表（搜索/分类/动物/适应症筛选、分页、排序）
export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = drugQuerySchema.safeParse(params);
  if (!parsed.success) {
    return fail("参数校验失败", 400, parsed.error.flatten().fieldErrors);
  }
  try {
    const result = await getDrugs(parsed.data);
    return ok(result);
  } catch (e) {
    return fail("查询药物失败", 500, String(e));
  }
}
