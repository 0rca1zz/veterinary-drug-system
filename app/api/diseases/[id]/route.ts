import type { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api";
import { getDiseaseById } from "@/services/disease";

// GET /api/diseases/:id —— 疾病详情
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const d = await getDiseaseById(id);
  if (!d) return fail("未找到该疾病", 404);
  return ok(d);
}
