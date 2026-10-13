import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** 统一的“演示数据”标签（灰色） */
export function DemoBadge({
  label = "演示数据",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("border-gray-200 bg-gray-100 text-gray-600", className)}
    >
      {label}
    </Badge>
  );
}
