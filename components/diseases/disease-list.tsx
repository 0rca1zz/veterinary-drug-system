"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";

import { DemoBadge } from "@/components/demo-badge";
import { Pagination } from "@/components/pagination";
import { Badge } from "@/components/ui/badge";
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
import { useDebounce } from "@/hooks/use-debounce";
import { SPECIES_CODES, SPECIES_LABELS } from "@/types";

interface DiseaseItem {
  id: string;
  name: string;
  category: string | null;
  speciesName: string;
  speciesCode: string;
  description: string | null;
  isDemo: boolean;
}

interface PageData {
  items: DiseaseItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function DiseaseList({
  initialSearch = "",
  initialSpecies = "all",
  initialCategory = "all",
}: {
  initialSearch?: string;
  initialSpecies?: string;
  initialCategory?: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [species, setSpecies] = useState(initialSpecies);
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);
  const [data, setData] = useState<PageData | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  const debouncedSearch = useDebounce(search, 350);

  useEffect(() => {
    fetch("/api/meta")
      .then((r) => r.json())
      .then((m) => setCategories(m.diseaseCategories ?? []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, species, category]);

  const load = useCallback(() => {
    setIsFetching(true);
    const params = new URLSearchParams({
      page: String(page),
      pageSize: "10",
    });
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (species !== "all") params.set("species", species);
    if (category !== "all") params.set("category", category);

    fetch(`/api/diseases?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setData(null))
      .finally(() => setIsFetching(false));
  }, [debouncedSearch, species, category, page]);

  useEffect(() => {
    load();
  }, [load]);

  const isInitialLoading = data === null && isFetching;

  return (
    <div className="space-y-4">
      {/* 筛选区 */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索疾病名称、症状…"
            className="pl-9"
          />
        </div>
        <Select value={species} onValueChange={setSpecies}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="全部动物" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部动物</SelectItem>
            {SPECIES_CODES.map((code) => (
              <SelectItem key={code} value={code}>
                {SPECIES_LABELS[code]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="全部分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部分类</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 列表 */}
      {isInitialLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="rounded-lg border py-12 text-center text-muted-foreground">
          未找到匹配的疾病
        </div>
      ) : (
        <div
          className={`space-y-4 transition-opacity duration-200 ${
            isFetching ? "opacity-60" : "opacity-100"
          }`}
        >
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>疾病名称</TableHead>
                  <TableHead>所属动物</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead className="hidden md:table-cell">简介</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((d) => (
                  <TableRow
                    key={d.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/diseases/${d.id}`)}
                  >
                    <TableCell className="font-medium">
                      <span className="hover:text-primary hover:underline">
                        {d.name}
                      </span>
                      {d.isDemo && (
                        <DemoBadge label="演示" className="ml-2" />
                      )}
                    </TableCell>
                    <TableCell>{d.speciesName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{d.category ?? "—"}</Badge>
                    </TableCell>
                    <TableCell className="hidden max-w-[300px] truncate text-muted-foreground md:table-cell">
                      {d.description ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              共 {data.total} 条 · 第 {data.page} / {data.totalPages} 页
            </p>
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
