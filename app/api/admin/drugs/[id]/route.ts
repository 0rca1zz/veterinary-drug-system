import type { NextRequest } from "next/server";

import { emptyToNull, fail, ok, serverError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { adminDrugSchema } from "@/lib/validations";

type Params = { params: Promise<{ id: string }> };

// PUT /api/admin/drugs/:id —— 编辑药物
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = adminDrugSchema.safeParse(body);
  if (!parsed.success) {
    return fail("参数校验失败", 400, parsed.error.flatten().fieldErrors);
  }

  const { targetSpeciesCodes, categoryId, ...rest } = parsed.data;

  try {
    const d = await prisma.drug.update({
      where: { id },
      data: {
        ...emptyToNull(rest),
        categoryId: categoryId || null,
        targetSpecies: {
          set: targetSpeciesCodes.map((code) => ({ code })),
        },
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

// DELETE /api/admin/drugs/:id —— 删除药物
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    await prisma.drug.delete({ where: { id } });
    return ok({ success: true });
  } catch (e) {
    if ((e as { code?: string })?.code === "P2025") {
      return fail("记录不存在", 404);
    }
    return serverError(e);
  }
}
