"use client";

import { useCallback, useEffect, useState } from "react";
import { Link2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { DiseaseFormDialog } from "@/components/admin/disease-form-dialog";
import { DrugFormDialog } from "@/components/admin/drug-form-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  DiseaseDetail,
  DiseaseSummary,
  DrugDetail,
  DrugSummary,
} from "@/types";
import { SPECIES_LABELS } from "@/types";

interface Meta {
  animals: { id: string; name: string; code: string }[];
  drugCategories: { id: string; name: string }[];
}

const RECOMMEND_LEVELS = ["一线", "二线", "辅助"];

export function AdminPanel() {
  const [diseases, setDiseases] = useState<DiseaseSummary[]>([]);
  const [drugs, setDrugs] = useState<DrugSummary[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  const [diseaseDialog, setDiseaseDialog] = useState<{
    open: boolean;
    initial: DiseaseDetail | null;
  }>({ open: false, initial: null });
  const [drugDialog, setDrugDialog] = useState<{
    open: boolean;
    initial: DrugDetail | null;
  }>({ open: false, initial: null });
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "disease" | "drug";
    id: string;
    name: string;
  } | null>(null);

  // 关联管理状态
  const [linkDiseaseId, setLinkDiseaseId] = useState("");
  const [linkedDrugs, setLinkedDrugs] = useState<
    { drugId: string; genericName: string; recommendLevel: string; reason: string | null }[]
  >([]);
  const [linkDrugId, setLinkDrugId] = useState("");
  const [linkLevel, setLinkLevel] = useState("一线");
  const [linkReason, setLinkReason] = useState("");
  const [linkLoading, setLinkLoading] = useState(false);

  const loadData = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/diseases?pageSize=100").then((r) => r.json()),
      fetch("/api/drugs?pageSize=100").then((r) => r.json()),
      fetch("/api/meta").then((r) => r.json()),
    ])
      .then(([d, dr, m]) => {
        setDiseases(d.items ?? []);
        setDrugs(dr.items ?? []);
        setMeta(m);
      })
      .catch(() => toast.error("加载数据失败"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 编辑疾病：先取详情再开弹窗
  async function openEditDisease(id: string) {
    try {
      const d = await fetch(`/api/diseases/${id}`).then((r) => r.json());
      setDiseaseDialog({ open: true, initial: d });
    } catch {
      toast.error("加载疾病详情失败");
    }
  }

  async function openEditDrug(id: string) {
    try {
      const d = await fetch(`/api/drugs/${id}`).then((r) => r.json());
      setDrugDialog({ open: true, initial: d });
    } catch {
      toast.error("加载药物详情失败");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const url =
      deleteTarget.type === "disease"
        ? `/api/admin/diseases/${deleteTarget.id}`
        : `/api/admin/drugs/${deleteTarget.id}`;
    try {
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) {
        toast.error("删除失败");
        return;
      }
      toast.success("已删除");
      setDeleteTarget(null);
      loadData();
    } catch {
      toast.error("网络错误");
    }
  }

  // 关联管理：加载某疾病的关联药物
  useEffect(() => {
    if (!linkDiseaseId) {
      setLinkedDrugs([]);
      return;
    }
    setLinkLoading(true);
    fetch(`/api/diseases/${linkDiseaseId}`)
      .then((r) => r.json())
      .then((d) => setLinkedDrugs(d.drugs ?? []))
      .catch(() => setLinkedDrugs([]))
      .finally(() => setLinkLoading(false));
  }, [linkDiseaseId]);

  async function addLink() {
    if (!linkDiseaseId || !linkDrugId) {
      toast.error("请选择疾病与药物");
      return;
    }
    try {
      const res = await fetch("/api/admin/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diseaseId: linkDiseaseId,
          drugId: linkDrugId,
          recommendLevel: linkLevel,
          reason: linkReason,
        }),
      });
      if (!res.ok) {
        toast.error((await res.json()).error ?? "添加关联失败");
        return;
      }
      toast.success("关联已添加");
      setLinkDrugId("");
      setLinkReason("");
      const d = await fetch(`/api/diseases/${linkDiseaseId}`).then((r) =>
        r.json()
      );
      setLinkedDrugs(d.drugs ?? []);
    } catch {
      toast.error("网络错误");
    }
  }

  async function removeLink(drugId: string) {
    try {
      const res = await fetch(
        `/api/admin/links?diseaseId=${linkDiseaseId}&drugId=${drugId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        toast.error("删除关联失败");
        return;
      }
      toast.success("关联已删除");
      setLinkedDrugs((prev) => prev.filter((l) => l.drugId !== drugId));
    } catch {
      toast.error("网络错误");
    }
  }

  if (loading || !meta) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div>
      <Tabs defaultValue="diseases">
        <TabsList className="mb-4">
          <TabsTrigger value="diseases">疾病管理</TabsTrigger>
          <TabsTrigger value="drugs">药物管理</TabsTrigger>
          <TabsTrigger value="links">关联管理</TabsTrigger>
        </TabsList>

        {/* 疾病管理 */}
        <TabsContent value="diseases">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              共 {diseases.length} 种疾病
            </p>
            <Button onClick={() => setDiseaseDialog({ open: true, initial: null })}>
              <Plus className="size-4" />
              新增疾病
            </Button>
          </div>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>名称</TableHead>
                  <TableHead>动物</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {diseases.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.name}</TableCell>
                    <TableCell>{d.speciesName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{d.category ?? "—"}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDisease(d.id)}
                          aria-label="编辑"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setDeleteTarget({
                              type: "disease",
                              id: d.id,
                              name: d.name,
                            })
                          }
                          aria-label="删除"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* 药物管理 */}
        <TabsContent value="drugs">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              共 {drugs.length} 种药物
            </p>
            <Button onClick={() => setDrugDialog({ open: true, initial: null })}>
              <Plus className="size-4" />
              新增药物
            </Button>
          </div>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>通用名</TableHead>
                  <TableHead>类别</TableHead>
                  <TableHead>适用动物</TableHead>
                  <TableHead>处方药</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drugs.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.genericName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {d.categoryName ?? "—"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {d.targetSpecies.map((s) => (
                          <Badge key={s.code} variant="outline">
                            {s.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {d.requiresPrescription ? "处方药" : "非处方"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDrug(d.id)}
                          aria-label="编辑"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setDeleteTarget({
                              type: "drug",
                              id: d.id,
                              name: d.genericName,
                            })
                          }
                          aria-label="删除"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* 关联管理 */}
        <TabsContent value="links">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Link2 className="size-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                选择疾病，为其建立或维护候选药物关联
              </p>
            </div>

            <Select value={linkDiseaseId} onValueChange={setLinkDiseaseId}>
              <SelectTrigger className="w-full sm:w-96">
                <SelectValue placeholder="选择疾病" />
              </SelectTrigger>
              <SelectContent>
                {diseases.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}（{d.speciesName}）
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {linkDiseaseId && (
              <div className="rounded-lg border p-4">
                <h3 className="mb-3 text-sm font-semibold">
                  已关联药物（{linkedDrugs.length}）
                </h3>
                {linkLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : linkedDrugs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">暂无关联药物</p>
                ) : (
                  <div className="space-y-2">
                    {linkedDrugs.map((l) => (
                      <div
                        key={l.drugId}
                        className="flex flex-col gap-2 rounded-md border px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">{l.genericName}</span>
                          <Badge>{l.recommendLevel}</Badge>
                          {l.reason && (
                            <span className="text-xs text-muted-foreground">
                              {l.reason}
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLink(l.drugId)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                          移除
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <h3 className="mt-5 mb-3 text-sm font-semibold">添加关联</h3>
                <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto]">
                  <Select value={linkDrugId} onValueChange={setLinkDrugId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择药物" />
                    </SelectTrigger>
                    <SelectContent>
                      {drugs.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.genericName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={linkLevel} onValueChange={setLinkLevel}>
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RECOMMEND_LEVELS.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={linkReason}
                    onChange={(e) => setLinkReason(e.target.value)}
                    placeholder="推荐原因（可选）"
                  />
                  <Button onClick={addLink}>添加</Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* 弹窗 */}
      <DiseaseFormDialog
        open={diseaseDialog.open}
        onOpenChange={(v) => setDiseaseDialog((s) => ({ ...s, open: v }))}
        onSaved={loadData}
        initial={diseaseDialog.initial}
      />
      <DrugFormDialog
        open={drugDialog.open}
        onOpenChange={(v) => setDrugDialog((s) => ({ ...s, open: v }))}
        onSaved={loadData}
        initial={drugDialog.initial}
        categories={meta.drugCategories}
      />

      {/* 删除确认 */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定删除「{deleteTarget?.name}」吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
