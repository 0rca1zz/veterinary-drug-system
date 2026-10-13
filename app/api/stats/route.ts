import { ok } from "@/lib/api";
import { getStats } from "@/services/stats";

// 实时统计（每次请求从数据库读取）
export const dynamic = "force-dynamic";

// GET /api/stats —— 首页 Dashboard 统计数据
export async function GET() {
  return ok(await getStats());
}
