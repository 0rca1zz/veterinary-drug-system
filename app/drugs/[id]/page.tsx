import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Info } from "lucide-react";

import { DemoBadge } from "@/components/demo-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDrugById } from "@/services/drug";
import { formatDateTime, splitList } from "@/utils/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const d = await getDrugById(id);
  return { title: d?.genericName ?? "药物详情" };
}

export default async function DrugDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const d = await getDrugById(id);
  if (!d) notFound();

  const contraindications = splitList(d.contraindications);
  const adverseEffects = splitList(d.adverseEffects);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/drugs"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        返回药物列表
      </Link>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold sm:text-3xl">{d.genericName}</h1>
        {d.brandName && (
          <span className="text-lg text-muted-foreground">{d.brandName}</span>
        )}
      </div>

      {/* 标签行 */}
      <div className="mb-6 flex flex-wrap gap-2">
        {d.requiresPrescription ? (
          <Badge variant="destructive">处方药</Badge>
        ) : (
          <Badge variant="outline">非处方药</Badge>
        )}
        {d.isDemo && <DemoBadge />}
        {d.categoryName && <Badge variant="secondary">{d.categoryName}</Badge>}
      </div>

      {/* 适用动物 */}
      <div className="mb-6">
        <span className="text-sm font-medium text-muted-foreground">
          适用动物：
        </span>
        <div className="mt-1 flex flex-wrap gap-2">
          {d.targetSpecies.map((s) => (
            <Badge key={s.code} variant="secondary">
              {s.name}
            </Badge>
          ))}
        </div>
      </div>

      {d.isDemo && (
        <Alert className="mb-6">
          <Info className="size-4" />
          <AlertDescription>
            本页内容为演示数据，仅供动物医学学习参考，不替代执业兽医诊断与处方。
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {/* 基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">基本信息</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                通用名
              </dt>
              <dd className="mt-1 text-sm">{d.genericName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                商品名
              </dt>
              <dd className="mt-1 text-sm">{d.brandName ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                药物类别
              </dt>
              <dd className="mt-1 text-sm">{d.categoryName ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                更新时间
              </dt>
              <dd className="mt-1 text-sm">{formatDateTime(d.updatedAt)}</dd>
            </div>
          </CardContent>
        </Card>

        {/* 适应症 */}
        {d.indications && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">适应症</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {d.indications}
              </p>
            </CardContent>
          </Card>
        )}

        {/* 禁忌症（红色标签） */}
        {contraindications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">禁忌症</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {contraindications.map((c, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="border-red-200 bg-red-50 text-red-700"
                >
                  {c}
                </Badge>
              ))}
            </CardContent>
          </Card>
        )}

        {/* 常见副作用（黄色标签） */}
        {adverseEffects.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">常见副作用</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {adverseEffects.map((c, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="border-amber-200 bg-amber-50 text-amber-700"
                >
                  {c}
                </Badge>
              ))}
            </CardContent>
          </Card>
        )}

        {/* 妊娠期警示 */}
        {d.pregnancyWarning && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">妊娠期警示</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant="outline"
                className="border-red-200 bg-red-50 text-red-700"
              >
                {d.pregnancyWarning}
              </Badge>
            </CardContent>
          </Card>
        )}

        {/* 注意事项 */}
        {d.description && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">注意事项</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {d.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* 禁忌规则 */}
        {d.contraindicationRules.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                禁忌规则（{d.contraindicationRules.length}）
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {d.contraindicationRules.map((c, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-md border px-3 py-2 text-sm"
                >
                  <Badge
                    variant={c.severity === "禁用" ? "destructive" : "secondary"}
                  >
                    {c.severity}
                  </Badge>
                  <span className="leading-relaxed">{c.description}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
