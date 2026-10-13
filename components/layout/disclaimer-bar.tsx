import { AlertTriangle } from "lucide-react";

/** 全站免责声明条：所有页面均显示 */
export function DisclaimerBar() {
  return (
    <div className="border-b border-blue-100 bg-blue-50 text-blue-900">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-1.5 text-xs sm:text-sm">
        <AlertTriangle className="size-4 shrink-0" />
        <p className="font-medium">
          本系统仅供动物医学学习和临床辅助参考，不替代执业兽医诊断。
        </p>
      </div>
    </div>
  );
}
