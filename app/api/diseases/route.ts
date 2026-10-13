import type { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api";
import { diseaseQuerySchema } from "@/lib/validations";
import { getDiseases } from "@/services/disease";

// GET /api/diseases —— 疾病列表（搜索/分页/排序/筛选）
export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = diseaseQuerySchema.safeParse(params);
  if (!parsed.success) {
    return fail("参数校验失败", 400, parsed.error.flatten().fieldErrors);
  }
  try {
    const result = await getDiseases(parsed.data);
    return ok(result);
  } catch (e) {
    return fail("查询疾病失败", 500, String(e));
  }
}
