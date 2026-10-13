import type { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api";
import { matchSchema } from "@/lib/validations";
import { matchDrugs } from "@/services/match";

// POST /api/match —— 规则化候选药物匹配
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = matchSchema.safeParse(body);
  if (!parsed.success) {
    return fail("参数校验失败", 400, parsed.error.flatten().fieldErrors);
  }
  try {
    const result = await matchDrugs(parsed.data);
    return ok(result);
  } catch (e) {
    return fail("匹配失败", 500, String(e));
  }
}
