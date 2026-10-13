"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import type { DrugDetail } from "@/types";
import { SPECIES_CODES, SPECIES_LABELS } from "@/types";

const schema = z.object({
  genericName: z.string().trim().min(1, "通用名不能为空"),
  brandName: z.string().optional(),
  categoryId: z.string().optional(),
  targetSpeciesCodes: z
    .array(z.enum(SPECIES_CODES))
    .min(1, "至少选择一种适用动物"),
  indications: z.string().optional(),
  contraindications: z.string().optional(),
  adverseEffects: z.string().optional(),
  pregnancyWarning: z.string().optional(),
  requiresPrescription: z.boolean(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const emptyValues: FormValues = {
  genericName: "",
  brandName: "",
  categoryId: "",
  targetSpeciesCodes: [],
  indications: "",
  contraindications: "",
  adverseEffects: "",
  pregnancyWarning: "",
  requiresPrescription: false,
  description: "",
};

export function DrugFormDialog({
  open,
  onOpenChange,
  onSaved,
  initial,
  categories,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSaved: () => void;
  initial: DrugDetail | null;
  categories: { id: string; name: string }[];
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
              genericName: initial.genericName,
              brandName: initial.brandName ?? "",
              categoryId: initial.categoryId ?? "",
              targetSpeciesCodes: initial.targetSpecies.map((s) => s.code),
              indications: initial.indications ?? "",
              contraindications: initial.contraindications ?? "",
              adverseEffects: initial.adverseEffects ?? "",
              pregnancyWarning: initial.pregnancyWarning ?? "",
              requiresPrescription: initial.requiresPrescription,
              description: initial.description ?? "",
            }
          : emptyValues
      );
    }
  }, [open, initial, form]);

  async function onSubmit(values: FormValues) {
    const url = initial ? `/api/admin/drugs/${initial.id}` : "/api/admin/drugs";
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
      toast.success(initial ? "药物已更新" : "药物已新增");
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
          <DialogTitle>{initial ? "编辑药物" : "新增药物"}</DialogTitle>
          <DialogDescription>
            填写药物资料。所有新增内容均标记为演示数据。
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="genericName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>通用名 *</FormLabel>
                    <FormControl>
                      <Input placeholder="如：阿莫西林" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brandName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>商品名</FormLabel>
                    <FormControl>
                      <Input placeholder="如：阿莫仙" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>药物类别</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="选择类别" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">无分类</SelectItem>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="targetSpeciesCodes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>适用动物 *</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-4">
                      {SPECIES_CODES.map((code) => {
                        const checked = field.value.includes(code);
                        return (
                          <label
                            key={code}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(c) => {
                                const next = c
                                  ? [...field.value, code]
                                  : field.value.filter((v) => v !== code);
                                field.onChange(next);
                              }}
                            />
                            {SPECIES_LABELS[code]}
                          </label>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="requiresPrescription"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 pt-6">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(c) => field.onChange(!!c)}
                      />
                    </FormControl>
                    <FormLabel>处方药</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pregnancyWarning"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>妊娠期警示</FormLabel>
                    <FormControl>
                      <Input placeholder="如：孕期禁用" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {(
              [
                ["indications", "适应症"],
                ["contraindications", "禁忌症"],
                ["adverseEffects", "常见副作用"],
                ["description", "注意事项 / 说明"],
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
