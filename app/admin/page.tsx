import type { Metadata } from "next";

import { AdminPanel } from "@/components/admin/admin-panel";

export const metadata: Metadata = {
  title: "后台管理",
};

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">后台管理</h1>
      <AdminPanel />
    </div>
  );
}
