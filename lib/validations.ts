import { z } from "zod";

import { SPECIES_CODES } from "@/types";

export const speciesCodeEnum = z.enum(SPECIES_CODES);

export const DISCLAIMER =
  "本系统仅供动物医学学习和临床辅助参考，不替代执业兽医诊断。";

// ---------- 分页 ----------
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

// ---------- 疾病查询 ----------
export const diseaseQuerySchema = paginationSchema.extend({
  search: z.string().trim().optional(),
  species: speciesCodeEnum.optional(),
  category: z.string().trim().optional(),
  sort: z
    .enum(["name", "category", "updatedAt", "createdAt"])
    .optional()
    .default("name"),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
});

// ---------- 药物查询 ----------
export const drugQuerySchema = paginationSchema.extend({
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  species: speciesCodeEnum.optional(),
  indication: z.string().trim().optional(),
  sort: z
    .enum(["genericName", "updatedAt", "createdAt"])
    .optional()
    .default("genericName"),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
});

// ---------- 匹配 ----------
export const matchSchema = z.object({
  speciesCode: speciesCodeEnum,
  diseaseId: z.string().min(1, "请选择疾病"),
  weightKg: z.coerce
    .number({ message: "请输入体重" })
    .positive("体重必须大于 0")
    .max(5000, "体重超出合理范围"),
  ageWeeks: z.coerce
    .number({ message: "请输入年龄" })
    .min(0, "年龄不能为负")
    .max(5000, "年龄超出合理范围"),
  pregnant: z.boolean().default(false),
});

// ---------- 后台：疾病 ----------
export const adminDiseaseSchema = z.object({
  name: z.string().trim().min(1, "疾病名称不能为空"),
  speciesCode: speciesCodeEnum,
  category: z.string().trim().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  cause: z.string().optional().or(z.literal("")),
  symptoms: z.string().optional().or(z.literal("")),
  diagnosis: z.string().optional().or(z.literal("")),
  treatment: z.string().optional().or(z.literal("")),
  examinations: z.string().optional().or(z.literal("")),
  recommendedDrugCategories: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

// ---------- 后台：药物 ----------
export const adminDrugSchema = z.object({
  genericName: z.string().trim().min(1, "通用名不能为空"),
  brandName: z.string().trim().optional().or(z.literal("")),
  categoryId: z.string().optional().nullable(),
  targetSpeciesCodes: z.array(speciesCodeEnum).min(1, "至少选择一种适用动物"),
  indications: z.string().optional().or(z.literal("")),
  contraindications: z.string().optional().or(z.literal("")),
  adverseEffects: z.string().optional().or(z.literal("")),
  pregnancyWarning: z.string().optional().or(z.literal("")),
  requiresPrescription: z.boolean().default(false),
  description: z.string().optional().or(z.literal("")),
});

export type DiseaseQuery = z.infer<typeof diseaseQuerySchema>;
export type DrugQuery = z.infer<typeof drugQuerySchema>;
export type MatchPayload = z.infer<typeof matchSchema>;
export type AdminDiseasePayload = z.infer<typeof adminDiseaseSchema>;
export type AdminDrugPayload = z.infer<typeof adminDrugSchema>;
