import type { NextRequest } from "next/server";

import { emptyToNull, fail, ok, serverError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { adminDrugSchema } from "@/lib/validations";

// POST /api/admin/drugs —— 新增药物
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = adminDrugSchema.safeParse(body);
  if (!parsed.success) {
    return fail("参数校验失败", 400, parsed.error.flatten().fieldErrors);
  }

  const { targetSpeciesCodes, categoryId, ...rest } = parsed.data;

  try {
    const d = await prisma.drug.create({
      data: {
        ...emptyToNull(rest),
        categoryId: categoryId || null,
        isDemo: true,
        targetSpecies: {
          connect: targetSpeciesCodes.map((code) => ({ code })),
        },
      },
    });
    return ok(d, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
