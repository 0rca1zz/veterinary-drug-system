"use client";

import { BookOpen, Link2, PawPrint, Pill, type LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { useCountUp } from "@/hooks/use-count-up";
import type { Stats } from "@/services/stats";

const ITEMS: {
  key: keyof Stats;
  label: string;
  desc: string;
  icon: LucideIcon;
}[] = [
  { key: "diseases", label: "疾病总数", desc: "收录动物疾病资料", icon: BookOpen },
  { key: "drugs", label: "兽药信息", desc: "收录兽药资料", icon: Pill },
  { key: "animals", label: "支持动物", desc: "覆盖动物种类", icon: PawPrint },
  { key: "links", label: "疾病药物关联", desc: "疾病与药物关联", icon: Link2 },
];

function StatCard({
  value,
  icon: Icon,
  label,
  desc,
}: {
  value: number;
  icon: LucideIcon;
  label: string;
  desc: string;
}) {
  const count = useCountUp(value);

  return (
    <Card className="group h-full rounded-xl border py-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
      <div className="flex items-center gap-4 px-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-6" />
        </div>
        <div className="min-w-0">
          <div className="text-3xl font-bold tabular-nums">{count}</div>
          <div className="text-sm font-medium">{label}</div>
          <div className="truncate text-xs text-muted-foreground">{desc}</div>
        </div>
      </div>
    </Card>
  );
}

export function StatsCards({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {ITEMS.map((it) => (
        <StatCard
          key={it.key}
          value={stats[it.key]}
          icon={it.icon}
          label={it.label}
          desc={it.desc}
        />
      ))}
    </div>
  );
}
