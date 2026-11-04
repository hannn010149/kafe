import React from "react";
import OrdersManagerClient from "@/components/admin/OrdersManagerClient";
import { getOrders } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-auth";

export default async function AdminOrdersPage() {
  await requireAdminSession();
  const orders = await getOrders();
  return <OrdersManagerClient initialOrders={orders} />;
}
