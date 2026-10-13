import {
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldAlert,
} from "lucide-react";

import { DemoBadge } from "@/components/demo-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MatchResult } from "@/types";

const SEVERITY_LABEL: Record<string, string> = {
  high: "高风险",
  medium: "中风险",
  low: "低风险",
};

export function MatchResultView({ result }: { result: MatchResult }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">匹配对象：</span>
        <Badge variant="secondary">{result.speciesName}</Badge>
        <Badge>{result.disease.name}</Badge>
        {result.disease.category && (
          <Badge variant="outline">{result.disease.category}</Badge>
        )}
      </div>

      {result.warning && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>提示</AlertTitle>
          <AlertDescription>{result.warning}</AlertDescription>
        </Alert>
      )}

      {!result.warning && result.recommendations.length === 0 && (
        <Alert>
          <Info className="size-4" />
          <AlertTitle>暂无候选药物</AlertTitle>
          <AlertDescription>
            未找到符合条件的候选药物，请调整筛选条件或咨询执业兽医。
          </AlertDescription>
        </Alert>
      )}

      {result.recommendations.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">
            推荐候选药物（{result.recommendations.length}）
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {result.recommendations.map((r) => (
              <Card key={r.drugId} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <CardTitle className="text-base">
                        {r.genericName}
                      </CardTitle>
                      {r.brandName && (
                        <CardDescription>{r.brandName}</CardDescription>
                      )}
                    </div>
                    <Badge>{r.recommendLevel}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {r.categoryName && (
                      <Badge variant="secondary">{r.categoryName}</Badge>
                    )}
                    {r.requiresPrescription && (
                      <Badge variant="outline">处方药</Badge>
                    )}
                    <DemoBadge />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-3 text-sm">
                  {r.indications && (
                    <div>
                      <span className="font-medium text-muted-foreground">
                        适应症：
                      </span>
                      <span className="leading-relaxed">
                        {r.indications}
                      </span>
                    </div>
                  )}

                  {r.reason && (
                    <div>
                      <span className="font-medium text-muted-foreground">
                        推荐原因：
                      </span>
                      <span>{r.reason}</span>
                    </div>
                  )}

                  {r.contraindications.length > 0 ? (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-red-800">
                      <p className="font-medium">禁忌：</p>
                      <ul className="mt-1 list-disc pl-5">
                        {r.contraindications.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-green-800">
                      无已知禁忌。
                    </div>
                  )}

                  {r.risks.length > 0 && (
                    <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
                      <p className="font-medium">注意事项：</p>
                      <ul className="mt-1 list-disc pl-5">
                        {r.risks.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    {r.requiresVetGuidance ? (
                      <Badge variant="destructive">
                        <ShieldAlert className="size-3" /> 需要兽医指导
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <CheckCircle2 className="size-3" /> 常规参考
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {result.excluded.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">
            已排除药物（{result.excluded.length}）
          </h2>
          <div className="space-y-2">
            {result.excluded.map((e) => (
              <div
                key={e.drugId}
                className="flex flex-col gap-1 rounded-md border px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-medium">{e.genericName}</span>
                <span className="text-muted-foreground">{e.reason}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {result.interactions.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">
            药物相互作用提示（{result.interactions.length}）
          </h2>
          <div className="space-y-2">
            {result.interactions.map((it, i) => (
              <div
                key={i}
                className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
              >
                <span className="font-medium">
                  {it.drugA} ↔ {it.drugB}
                </span>{" "}
                （{SEVERITY_LABEL[it.severity] ?? it.severity}）：
                {it.description}
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="text-center text-sm text-muted-foreground">
        {result.disclaimer}
      </p>
    </div>
  );
}
