import React from "react";
import ReportsClient from "@/components/admin/ReportsClient";
import { getReportsData, getOrders, getBookings } from "@/lib/db";

export default async function AdminReportsPage() {
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
