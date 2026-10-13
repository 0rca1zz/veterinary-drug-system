"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ScanSearch } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { MatchResultView } from "@/components/match/match-result";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { MatchResult } from "@/types";
import { SPECIES_CODES, SPECIES_LABELS, type SpeciesCode } from "@/types";

const schema = z.object({
  speciesCode: z.enum(SPECIES_CODES),
  diseaseId: z.string().min(1, "请选择疾病"),
  weightKg: z.coerce
    .number({ message: "请输入体重" })
    .positive("体重必须大于 0")
    .max(5000, "体重超出合理范围"),
  ageWeeks: z.coerce
    .number({ message: "请输入年龄" })
    .min(0, "年龄不能为负")
    .max(5000, "年龄超出合理范围"),
  pregnant: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface InitialValues {
  speciesCode: SpeciesCode;
  diseaseId: string;
  weightKg?: number;
  ageWeeks?: number;
  pregnant: boolean;
}

interface DiseaseOption {
  id: string;
  name: string;
}

export function MatchClient({ initial }: { initial: InitialValues }) {
  const [diseases, setDiseases] = useState<DiseaseOption[]>([]);
  const [loadingDiseases, setLoadingDiseases] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [matching, setMatching] = useState(false);
  const didAutoRun = useRef(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      speciesCode: initial.speciesCode,
      diseaseId: initial.diseaseId,
      weightKg: initial.weightKg,
      ageWeeks: initial.ageWeeks,
      pregnant: initial.pregnant,
    },
  });

  const speciesCode = useWatch({ control: form.control, name: "speciesCode" });

  useEffect(() => {
    let cancelled = false;
    setLoadingDiseases(true);
    fetch(`/api/diseases?species=${speciesCode}&pageSize=100`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setDiseases(d.items ?? []);
      })
      .catch(() => {
        if (!cancelled) setDiseases([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingDiseases(false);
      });
    return () => {
      cancelled = true;
    };
  }, [speciesCode]);

  async function runMatch(values: FormValues) {
    setMatching(true);
    setResult(null);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "匹配失败");
        return;
      }
      setResult(data);
    } catch {
      toast.error("网络错误，请稍后重试");
    } finally {
      setMatching(false);
    }
  }

  // 若从首页带入完整条件，则自动匹配一次
  useEffect(() => {
    if (!didAutoRun.current && initial.diseaseId) {
      didAutoRun.current = true;
      const values = form.getValues();
      runMatch(values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(values: FormValues) {
    runMatch(values);
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 sm:grid-cols-2"
        >
          <FormField
            control={form.control}
            name="speciesCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>动物种类</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(v) => {
                    field.onChange(v);
                    form.setValue("diseaseId", "");
                    setResult(null);
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择动物种类" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SPECIES_CODES.map((code) => (
                      <SelectItem key={code} value={code}>
                        {SPECIES_LABELS[code]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="diseaseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>疾病</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(v) => {
                    field.onChange(v);
                    setResult(null);
                  }}
                  disabled={loadingDiseases}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择疾病" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {diseases.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weightKg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>体重（kg）</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="如 5.5"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ageWeeks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>年龄（周龄）</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="如 12（1 年 ≈ 52 周）"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pregnant"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>妊娠状态</FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value ? "yes" : "no"}
                    onValueChange={(v) => field.onChange(v === "yes")}
                    className="flex gap-6"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="mpreg-no" />
                      <Label htmlFor="mpreg-no">未妊娠</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="mpreg-yes" />
                      <Label htmlFor="mpreg-yes">妊娠</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            className="sm:col-span-2"
            disabled={matching}
          >
            <ScanSearch className="size-4" />
            {matching ? "匹配中…" : "开始匹配"}
          </Button>
        </form>
      </Form>

      {matching && (
        <div className="space-y-3">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      )}

      {result && !matching && <MatchResultView result={result} />}
    </div>
  );
}
