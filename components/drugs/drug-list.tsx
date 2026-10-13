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

interface DrugItem {
  id: string;
  genericName: string;
  brandName: string | null;
  categoryName: string | null;
  targetSpecies: { code: string; name: string }[];
  indications: string | null;
  requiresPrescription: boolean;
  isDemo: boolean;
}

interface PageData {
  items: DrugItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function DrugList() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [species, setSpecies] = useState("all");
  const [indication, setIndication] = useState("");
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState<
    { id: string; name: string }[]
  >([]);
  const [data, setData] = useState<PageData | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  const debouncedSearch = useDebounce(search, 350);
  const debouncedIndication = useDebounce(indication, 350);

  useEffect(() => {
    fetch("/api/meta")
      .then((r) => r.json())
      .then((m) => setCategories(m.drugCategories ?? []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, debouncedIndication, category, species]);

  const load = useCallback(() => {
    setIsFetching(true);
    const params = new URLSearchParams({
      page: String(page),
      pageSize: "10",
    });
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (debouncedIndication) params.set("indication", debouncedIndication);
    if (category !== "all") params.set("category", category);
    if (species !== "all") params.set("species", species);

    fetch(`/api/drugs?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setData(null))
      .finally(() => setIsFetching(false));
  }, [debouncedSearch, debouncedIndication, category, species, page]);

  useEffect(() => {
    load();
  }, [load]);

  const isInitialLoading = data === null && isFetching;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索通用名、商品名…"
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="全部类别" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类别</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <div className="relative sm:col-span-2">
          <Input
            value={indication}
            onChange={(e) => setIndication(e.target.value)}
            placeholder="按适应症筛选，如：呼吸道、腹泻…"
          />
        </div>
      </div>

      {isInitialLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="rounded-lg border py-12 text-center text-muted-foreground">
          未找到匹配的药物
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
                  <TableHead>通用名</TableHead>
                  <TableHead>商品名</TableHead>
                  <TableHead>类别</TableHead>
                  <TableHead>适用动物</TableHead>
                  <TableHead>处方药</TableHead>
                  <TableHead className="hidden md:table-cell">适应症</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((d) => (
                  <TableRow
                    key={d.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/drugs/${d.id}`)}
                  >
                    <TableCell className="font-medium">
                      <span className="hover:text-primary hover:underline">
                        {d.genericName}
                      </span>
                      {d.isDemo && (
                        <DemoBadge label="演示" className="ml-2" />
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {d.brandName ?? "—"}
                    </TableCell>
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
                      {d.requiresPrescription ? (
                        <Badge>处方药</Badge>
                      ) : (
                        <Badge variant="outline">非处方</Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden max-w-[280px] truncate text-muted-foreground md:table-cell">
                      {d.indications ?? "—"}
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
