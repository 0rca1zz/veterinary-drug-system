import Link from "next/link";
import {
  BookOpen,
  Pill,
  ScanSearch,
  Settings2,
  Stethoscope,
} from "lucide-react";

import { GlobalSearch } from "@/components/home/global-search";
import { SearchForm } from "@/components/home/search-form";
import { StatsCards } from "@/components/home/stats-cards";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getStats } from "@/services/stats";

const features = [
  {
    href: "/diseases",
    icon: BookOpen,
    title: "疾病查询",
    description: "查询疾病资料：病因、症状、诊断与治疗原则",
  },
  {
    href: "/drugs",
    icon: Pill,
    title: "药物查询",
    description: "查询兽药资料：适应症、禁忌、副作用与注意事项",
  },
  {
    href: "/match",
    icon: ScanSearch,
    title: "智能匹配",
    description: "按规则筛选候选药物，提示禁忌与风险",
  },
  {
    href: "/admin",
    icon: Settings2,
    title: "后台管理",
    description: "维护疾病、药物与疾病-药物关联",
  },
];

export default async function HomePage() {
  const stats = await getStats();
  const now = new Date();
  const updatedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* 顶部：系统名 + 搜索框 */}
      <section className="rounded-2xl border bg-gradient-to-br from-blue-50 to-white px-6 py-10 text-center">
        <div className="mx-auto flex max-w-md items-center justify-center gap-3">
          <Stethoscope className="size-8 text-primary" />
          <h1 className="text-2xl font-bold sm:text-3xl">
            动物疾病与兽药查询系统
          </h1>
        </div>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          查询疾病与兽药资料，基于规则筛选候选药物并提示禁忌与风险。
        </p>
        <div className="mt-6 flex justify-center">
          <GlobalSearch />
        </div>
      </section>

      {/* 统计信息卡片（Dashboard） */}
      <section className="mt-8">
        <StatsCards stats={stats} />
      </section>

      {/* 功能卡片 */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <Link key={f.href} href={f.href} className="group">
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <f.icon className="size-6 text-primary" />
                <CardTitle>{f.title}</CardTitle>
                <CardDescription>{f.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </section>

      {/* 主体：动物信息表单 */}
      <section className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>动物信息</CardTitle>
            <CardDescription>
              选择动物种类、疾病与生理参数，系统将按规则筛选候选药物。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SearchForm />
          </CardContent>
        </Card>
      </section>

      {/* 底部：免责声明 + 版本信息 */}
      <section className="mt-10 rounded-xl border bg-muted/40 px-6 py-6 text-center">
        <p className="text-sm font-semibold">免责声明</p>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
          本系统仅供动物医学学习和临床辅助参考，不替代执业兽医诊断。数据仅供学习参考。
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span>版本号：V1.1</span>
          <span>最后更新时间：{updatedDate}</span>
        </div>
      </section>
    </div>
  );
}
