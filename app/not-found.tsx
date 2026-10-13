import Link from "next/link";
import { FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <FileQuestion className="size-12 text-muted-foreground" />
      <h1 className="text-2xl font-bold">404</h1>
      <p className="text-muted-foreground">未找到您要访问的页面。</p>
      <Button asChild>
        <Link href="/">返回首页</Link>
      </Button>
    </div>
  );
}
