"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

interface Suggestion {
  id: string;
  name: string;
  speciesName: string;
}

export function GlobalSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);

  const debouncedQ = useDebounce(q, 250);

  // 实时推荐
  useEffect(() => {
    if (!debouncedQ.trim()) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    let cancelled = false;
    fetch(`/api/diseases?search=${encodeURIComponent(debouncedQ)}&pageSize=8`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) {
          setSuggestions(d.items ?? []);
          setOpen(true);
          setActiveIndex(-1);
        }
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQ]);

  // 点击外部关闭
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function goToDisease(id: string) {
    setOpen(false);
    setQ("");
    router.push(`/diseases/${id}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        e.preventDefault();
        goToDisease(suggestions[activeIndex].id);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      goToDisease(suggestions[activeIndex].id);
      return;
    }
    const query = q.trim();
    router.push(
      query ? `/diseases?search=${encodeURIComponent(query)}` : "/diseases"
    );
    setOpen(false);
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-xl gap-2">
      <div ref={wrapRef} className="relative flex-1">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="搜索疾病名称、症状…"
          className="h-11 bg-background"
        />
        {open && suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-auto rounded-md border bg-popover p-1 shadow-md">
            {suggestions.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => goToDisease(s.id)}
                  className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm transition-colors ${
                    i === activeIndex
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/60"
                  }`}
                >
                  <span>{s.name}</span>
                  <span className="ml-3 shrink-0 text-xs text-muted-foreground">
                    {s.speciesName}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Button type="submit" size="lg" className="h-11 shrink-0">
        <Search className="size-4" />
        搜索
      </Button>
    </form>
  );
}
