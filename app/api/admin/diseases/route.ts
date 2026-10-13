import type { NextRequest } from "next/server";

import { emptyToNull, fail, ok, serverError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { adminDiseaseSchema } from "@/lib/validations";

// POST /api/admin/diseases —— 新增疾病
export async function POST(req: NextRequest) {
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
    const d = await prisma.disease.create({
      data: {
        ...emptyToNull(rest),
        speciesId: species.id,
        isDemo: true,
      },
    });
    return ok(d, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
