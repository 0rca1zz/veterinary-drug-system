"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { DiseaseDetail } from "@/types";
import { SPECIES_CODES, SPECIES_LABELS } from "@/types";

const schema = z.object({
  name: z.string().trim().min(1, "疾病名称不能为空"),
  speciesCode: z.enum(SPECIES_CODES),
  category: z.string().optional(),
  description: z.string().optional(),
  cause: z.string().optional(),
  symptoms: z.string().optional(),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  examinations: z.string().optional(),
  recommendedDrugCategories: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const emptyValues: FormValues = {
  name: "",
  speciesCode: "dog",
  category: "",
  description: "",
  cause: "",
  symptoms: "",
  diagnosis: "",
  treatment: "",
  examinations: "",
  recommendedDrugCategories: "",
  notes: "",
};

export function DiseaseFormDialog({
  open,
  onOpenChange,
  onSaved,
  initial,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSaved: () => void;
  initial: DiseaseDetail | null;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (open) {
      form.reset(
        initial
          ? {
              name: initial.name,
              speciesCode: initial.speciesCode,
              category: initial.category ?? "",
              description: initial.description ?? "",
              cause: initial.cause ?? "",
              symptoms: initial.symptoms ?? "",
              diagnosis: initial.diagnosis ?? "",
              treatment: initial.treatment ?? "",
              examinations: initial.examinations ?? "",
              recommendedDrugCategories:
                initial.recommendedDrugCategories ?? "",
              notes: initial.notes ?? "",
            }
          : emptyValues
      );
    }
  }, [open, initial, form]);

  async function onSubmit(values: FormValues) {
    const url = initial
      ? `/api/admin/diseases/${initial.id}`
      : "/api/admin/diseases";
    const method = initial ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "保存失败");
        return;
      }
      toast.success(initial ? "疾病已更新" : "疾病已新增");
      onSaved();
      onOpenChange(false);
    } catch {
      toast.error("网络错误，请稍后重试");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initial ? "编辑疾病" : "新增疾病"}</DialogTitle>
          <DialogDescription>
            填写疾病资料。所有新增内容均标记为演示数据。
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>疾病名称 *</FormLabel>
                    <FormControl>
                      <Input placeholder="如：犬细小病毒性肠炎" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="speciesCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>所属动物 *</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>分类</FormLabel>
                    <FormControl>
                      <Input placeholder="如：传染病 / 皮肤病" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recommendedDrugCategories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>推荐药物类别（逗号分隔）</FormLabel>
                    <FormControl>
                      <Input placeholder="抗生素,止泻/肠道调节剂" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {(
              [
                ["description", "疾病简介"],
                ["cause", "病因"],
                ["symptoms", "临床症状"],
                ["diagnosis", "诊断依据"],
                ["treatment", "治疗原则（仅原则）"],
                ["examinations", "推荐检查"],
                ["notes", "注意事项"],
              ] as const
            ).map(([name, label]) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                取消
              </Button>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
