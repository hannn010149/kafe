import React from "react";
import ReportsClient from "@/components/admin/ReportsClient";
import { getReportsData, getOrders, getBookings } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-auth";

export default async function AdminReportsPage() {
  await requireAdminSession();
  const [reportsData, orders, bookings] = await Promise.all([
    getReportsData(),
    getOrders(),
    getBookings(),
  ]);

  return (
    <ReportsClient
      reportsData={reportsData}
      orders={orders}
      bookings={bookings}
    />
  );
}
