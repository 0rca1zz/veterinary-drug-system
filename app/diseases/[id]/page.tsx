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
import { getDiseaseById } from "@/services/disease";
import { splitList } from "@/utils/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const d = await getDiseaseById(id);
  return { title: d?.name ?? "疾病详情" };
}

export default async function DiseaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const d = await getDiseaseById(id);
  if (!d) notFound();

  const sections = [
    { label: "疾病简介", value: d.description },
    { label: "病因", value: d.cause },
    { label: "临床症状", value: d.symptoms },
    { label: "诊断依据", value: d.diagnosis },
    { label: "治疗原则（仅原则，非处方）", value: d.treatment },
    { label: "推荐检查", value: d.examinations },
    { label: "注意事项", value: d.notes },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/diseases"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        返回疾病列表
      </Link>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold sm:text-3xl">{d.name}</h1>
        {d.isDemo && <DemoBadge />}
      </div>

      {d.isDemo && (
        <Alert className="mb-6">
          <Info className="size-4" />
          <AlertDescription>
            本页内容为演示数据，仅供动物医学学习参考，不替代执业兽医诊断与处方。
          </AlertDescription>
        </Alert>
      )}

      {/* 元信息 */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border px-4 py-3">
          <dt className="text-xs text-muted-foreground">所属动物</dt>
          <dd className="mt-1 font-medium">{d.speciesName}</dd>
        </div>
        <div className="rounded-lg border px-4 py-3">
          <dt className="text-xs text-muted-foreground">疾病分类</dt>
          <dd className="mt-1 font-medium">{d.category ?? "—"}</dd>
        </div>
        <div className="rounded-lg border px-4 py-3">
          <dt className="text-xs text-muted-foreground">数据来源</dt>
          <dd className="mt-1 font-medium">演示数据</dd>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map(
          (s) =>
            s.value && (
              <Card key={s.label}>
                <CardHeader>
                  <CardTitle className="text-base">{s.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {s.value}
                  </p>
                </CardContent>
              </Card>
            )
        )}

        {d.recommendedDrugCategories && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">推荐药物类别</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {splitList(d.recommendedDrugCategories).map((c) => (
                <Badge key={c}>{c}</Badge>
              ))}
            </CardContent>
          </Card>
        )}

        {d.drugs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                推荐药物（{d.drugs.length}）
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {d.drugs.map((dd) => (
                <Link
                  key={dd.drugId}
                  href={`/drugs/${dd.drugId}`}
                  className="flex flex-col gap-2 rounded-md border px-4 py-3 transition-colors hover:bg-accent sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{dd.genericName}</span>
                    {dd.brandName && (
                      <span className="text-sm text-muted-foreground">
                        {dd.brandName}
                      </span>
                    )}
                    {dd.categoryName && (
                      <Badge variant="secondary">{dd.categoryName}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {dd.reason && (
                      <span className="text-xs text-muted-foreground">
                        {dd.reason}
                      </span>
                    )}
                    <Badge>{dd.recommendLevel}</Badge>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
