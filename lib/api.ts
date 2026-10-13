import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { error: message, ...(details ? { details } : {}) },
    { status }
  );
}

export function serverError(e: unknown) {
  if (e instanceof ZodError) {
    return NextResponse.json(
      { error: "参数校验失败", details: e.flatten().fieldErrors },
      { status: 400 }
    );
  }
  console.error("[api error]", e);
  return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
}

/** 将对象中的空字符串转换为 null（用于可选文本字段入库） */
export function emptyToNull<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = v === "" ? null : v;
  }
  return out as T;
}
