"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <AlertTriangle className="size-12 text-destructive" />
      <h1 className="text-2xl font-bold">出错了</h1>
      <p className="text-muted-foreground">页面加载出现异常，请重试。</p>
      <Button onClick={reset}>重试</Button>
    </div>
  );
}
