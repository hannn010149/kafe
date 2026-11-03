"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Layers,
  ShoppingBag,
  CalendarDays,
  Armchair,
  Users,
  Receipt,
  BarChart3,
  Settings,
  Languages,
  UserCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Store,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  // If on login page, do not render sidebar
  if (pathname === "/admin/login") return null;

  const navItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: UtensilsCrossed },
    { href: "/admin/categories", label: "Categories", icon: Layers },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
    { href: "/admin/tables", label: "Tables", icon: Armchair },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/transactions", label: "Transactions", icon: Receipt },
    { href: "/admin/reports", label: "Reports", icon: BarChart3 },
    { href: "/admin/settings", label: "Cafe Settings", icon: Settings },
    { href: "/admin/language", label: "Language Settings", icon: Languages },
    { href: "/admin/profile", label: "Admin Profile", icon: UserCheck },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  return (
    <aside
      className={`bg-[#202522] text-[#D8DDD9] border-r border-[#303732] flex flex-col justify-between transition-all duration-300 z-30 shrink-0 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Brand Header */}
      <div>
        <div className="p-4 flex items-center justify-between border-b border-[#303732]">
          <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-[#536B54] text-white flex items-center justify-center font-bold font-serif shrink-0">
              木
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="text-sm font-bold tracking-tight text-white block truncate">
                  Komorebi Admin
                </span>
                <span className="text-[10px] text-[#8E9B90] tracking-widest uppercase block">
                  Management Portal
                </span>
              </div>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg text-[#8E9B90] hover:text-white hover:bg-[#2C332D] transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* View Customer Website Link */}
        <div className="p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#29302B] hover:bg-[#343C36] text-[#A8B2AA] hover:text-white transition-colors"
          >
            <Store className="w-4 h-4 text-[#889E73] shrink-0" />
            {!collapsed && (
              <div className="flex items-center justify-between grow">
                <span>Lihat Website Kafe</span>
                <ExternalLink className="w-3 h-3 text-[#7E8680]" />
              </div>
            )}
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#536B54] text-white shadow-xs font-semibold"
                    : "text-[#A8B2AA] hover:bg-[#2C332D] hover:text-white"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-[#8E9B90]"}`} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Logout */}
      <div className="p-3 border-t border-[#303732] space-y-2">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors cursor-pointer"
          title="Sign out"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Keluar Portal</span>}
        </button>
      </div>
    </aside>
  );
}

