"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Search } from "lucide-react";
import { z } from "zod";

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
import { SPECIES_CODES, SPECIES_LABELS } from "@/types";

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
  sex: z.enum(["male", "female"]),
  pregnant: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface DiseaseOption {
  id: string;
  name: string;
}

export function SearchForm() {
  const router = useRouter();
  const [diseases, setDiseases] = useState<DiseaseOption[]>([]);
  const [loadingDiseases, setLoadingDiseases] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      speciesCode: "dog",
      diseaseId: "",
      weightKg: undefined,
      ageWeeks: undefined,
      sex: "male",
      pregnant: false,
    },
  });

  const speciesCode = useWatch({ control: form.control, name: "speciesCode" });

  useEffect(() => {
    let cancelled = false;
    setLoadingDiseases(true);
    form.setValue("diseaseId", "");
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
  }, [speciesCode, form]);

  function onSubmit(values: FormValues) {
    const params = new URLSearchParams({
      speciesCode: values.speciesCode,
      diseaseId: values.diseaseId,
      weightKg: String(values.weightKg),
      ageWeeks: String(values.ageWeeks),
      pregnant: String(values.pregnant),
    });
    router.push(`/match?${params.toString()}`);
  }

  return (
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
              <Select value={field.value} onValueChange={field.onChange}>
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
              <FormLabel>疾病选择</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
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
          name="sex"
          render={({ field }) => (
            <FormItem>
              <FormLabel>性别</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex gap-6"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="male" id="sex-male" />
                    <Label htmlFor="sex-male">公</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="female" id="sex-female" />
                    <Label htmlFor="sex-female">母</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pregnant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>妊娠状态</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onValueChange={(v) => field.onChange(v === "yes")}
                  className="flex gap-6"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="no" id="preg-no" />
                    <Label htmlFor="preg-no">未妊娠</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="yes" id="preg-yes" />
                    <Label htmlFor="preg-yes">妊娠</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="sm:col-span-2">
          <Search className="size-4" />
          搜索
        </Button>

        {loadingDiseases && (
          <div className="flex gap-2 sm:col-span-2">
            <Skeleton className="h-9 w-full" />
          </div>
        )}
      </form>
    </Form>
  );
}
