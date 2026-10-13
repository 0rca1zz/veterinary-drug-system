import type { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api";
import { getDrugById } from "@/services/drug";

// GET /api/drugs/:id —— 药物详情
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const d = await getDrugById(id);
  if (!d) return fail("未找到该药物", 404);
  return ok(d);
}
