import React from "react";
import OrdersManagerClient from "@/components/admin/OrdersManagerClient";
import { getOrders } from "@/lib/db";

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return <OrdersManagerClient initialOrders={orders} />;
}

