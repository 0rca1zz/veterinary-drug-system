import type { Metadata, Viewport } from "next";
import "./globals.css";

import { DisclaimerBar } from "@/components/layout/disclaimer-bar";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "动物疾病与兽药查询系统",
    template: "%s | 动物疾病与兽药查询系统",
  },
  description:
    "动物疾病与兽药信息查询、规则化候选药物筛选与禁忌风险提示。仅供动物医学学习和临床辅助参考，不替代执业兽医诊断。",
  keywords: ["兽药", "动物疾病", "兽医", "临床辅助", "兽药查询", "疾病查询"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="flex min-h-screen flex-col antialiased">
        <Navbar />
        <DisclaimerBar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
