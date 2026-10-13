import type { NextRequest } from "next/server";

import { emptyToNull, fail, ok, serverError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { adminDiseaseSchema } from "@/lib/validations";

type Params = { params: Promise<{ id: string }> };

// PUT /api/admin/diseases/:id —— 编辑疾病
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = adminDiseaseSchema.safeParse(body);
  if (!parsed.success) {
    return fail("参数校验失败", 400, parsed.error.flatten().fieldErrors);
  }

  const { speciesCode, ...rest } = parsed.data;
  const species = await prisma.animal.findUnique({
    where: { code: speciesCode },
  });
  if (!species) return fail("无效的动物种类", 400);

  try {
    const d = await prisma.disease.update({
      where: { id },
      data: {
        ...emptyToNull(rest),
        speciesId: species.id,
      },
    });
    return ok(d);
  } catch (e) {
    if ((e as { code?: string })?.code === "P2025") {
      return fail("记录不存在", 404);
    }
    return serverError(e);
  }
}

// DELETE /api/admin/diseases/:id —— 删除疾病
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    await prisma.disease.delete({ where: { id } });
    return ok({ success: true });
  } catch (e) {
    if ((e as { code?: string })?.code === "P2025") {
      return fail("记录不存在", 404);
    }
    return serverError(e);
  }
}
