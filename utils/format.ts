// 轻量格式化工具

/** 将 Date 格式化为本地日期时间字符串 */
export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "—";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${hh}:${mm}`;
}

/** 将逗号分隔的文本拆成数组（去除空白项） */
export function splitList(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .split(/[,，、;；\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}
