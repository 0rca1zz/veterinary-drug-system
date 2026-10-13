import type { NextRequest } from "next/server";
import { z } from "zod";

import { fail, ok, serverError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

const linkSchema = z.object({
  diseaseId: z.string().min(1, "缺少疾病"),
  drugId: z.string().min(1, "缺少药物"),
  recommendLevel: z.string().min(1, "缺少推荐级别"),
  reason: z.string().optional().or(z.literal("")),
});

// POST /api/admin/links —— 建立/更新 疾病-药物关联
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = linkSchema.safeParse(body);
  if (!parsed.success) {
    return fail("参数校验失败", 400, parsed.error.flatten().fieldErrors);
  }
  const { diseaseId, drugId, recommendLevel, reason } = parsed.data;
  try {
    const link = await prisma.diseaseDrug.upsert({
      where: { diseaseId_drugId: { diseaseId, drugId } },
      update: { recommendLevel, reason: reason || null },
      create: { diseaseId, drugId, recommendLevel, reason: reason || null },
    });
    return ok(link, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}

// DELETE /api/admin/links?diseaseId=&drugId= —— 删除关联
export async function DELETE(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const diseaseId = sp.get("diseaseId") ?? "";
  const drugId = sp.get("drugId") ?? "";
  if (!diseaseId || !drugId) return fail("缺少参数", 400);
  try {
    await prisma.diseaseDrug.delete({
      where: { diseaseId_drugId: { diseaseId, drugId } },
    });
    return ok({ success: true });
  } catch (e) {
    if ((e as { code?: string })?.code === "P2025") {
      return fail("关联不存在", 404);
    }
    return serverError(e);
  }
}
