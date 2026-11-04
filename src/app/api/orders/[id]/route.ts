import { NextRequest, NextResponse } from "next/server";
import { getOrderByCode, OrderStorageError, updateOrderStatus } from "@/lib/db";
import { ADMIN_AUTH_COOKIE, isValidAdminSession } from "@/lib/admin-auth";
import { OrderStatus } from "@/types";

const orderStatuses: OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"];

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const order = await getOrderByCode(id);
    if (!order) {
      return NextResponse.json({ success: false, error: "Pesanan tidak ditemukan" }, { status: 404 });
    }
    const trackingOrder = {
      order_code: order.order_code,
      order_type: order.order_type,
      table_number: order.table_number,
      status: order.status,
      created_at: order.created_at,
      items: order.items.map(({ product_name, quantity, subtotal }) => ({
        product_name,
        quantity,
        subtotal,
      })),
      total_amount: order.total_amount,
    };
    return NextResponse.json({ success: true, order: trackingOrder });
  } catch (error) {
    if (error instanceof OrderStorageError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }
    console.error("Order tracking API failed:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat status pesanan." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isValidAdminSession(request.cookies.get(ADMIN_AUTH_COOKIE)?.value)) {
    return NextResponse.json({ success: false, error: "Autentikasi admin diperlukan." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body: unknown = await request.json();
    if (
      typeof body !== "object" ||
      body === null ||
      !("status" in body) ||
      typeof body.status !== "string" ||
      !orderStatuses.includes(body.status as OrderStatus)
    ) {
      return NextResponse.json({ success: false, error: "Status pesanan tidak valid." }, { status: 400 });
    }

    const updated = await updateOrderStatus(id, body.status as OrderStatus);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Pesanan tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    if (error instanceof OrderStorageError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }
    console.error("Order update API failed:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui status pesanan." },
      { status: 500 }
    );
  }
}
