import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin Dashboard | Komorebi Cafe Management",
  description: "Portal pengelolaan kafe, pesanan, reservasi, produk, dan laporan analitik.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-[#FAF7F2] text-[#232724]">
      <AdminSidebar />
      <div className="grow flex flex-col min-w-0 overflow-y-auto max-h-screen">
        <main className="p-4 sm:p-8 grow">{children}</main>
      </div>
    </div>
  );
}

