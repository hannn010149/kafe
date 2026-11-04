import { NextRequest, NextResponse } from "next/server";
import { createOrder, CreateOrderInput, getOrders, OrderStorageError } from "@/lib/db";
import { ADMIN_AUTH_COOKIE, isValidAdminSession } from "@/lib/admin-auth";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCreateOrderInput(value: unknown): value is CreateOrderInput {
  if (!isRecord(value) || !Array.isArray(value.items)) return false;
  const amounts = [value.subtotal, value.tax_amount, value.service_amount, value.total_amount];
  return (
    (value.order_type === "dine_in" || value.order_type === "takeaway") &&
    (value.payment_method === "qris" ||
      value.payment_method === "bank_transfer" ||
      value.payment_method === "cashier") &&
    typeof value.customer_name === "string" &&
    typeof value.customer_phone === "string" &&
    (value.table_number === undefined || typeof value.table_number === "string") &&
    (value.customer_email === undefined || typeof value.customer_email === "string") &&
    (value.notes === undefined || typeof value.notes === "string") &&
    amounts.every((amount) => typeof amount === "number" && Number.isFinite(amount)) &&
    value.items.every((item) =>
      isRecord(item) &&
      (typeof item.product_id === "string" || item.product_id === null) &&
      typeof item.product_name === "string" &&
      (item.product_image === undefined || typeof item.product_image === "string") &&
      typeof item.price === "number" &&
      typeof item.quantity === "number" &&
      typeof item.subtotal === "number" &&
      (item.options === undefined || isRecord(item.options))
    )
  );
}

function errorResponse(error: unknown) {
  if (error instanceof OrderStorageError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.statusCode }
    );
  }
  console.error("Orders API failed:", error);
  return NextResponse.json(
    { success: false, error: "Terjadi kesalahan saat memproses pesanan." },
    { status: 500 }
  );
}

export async function GET(request: NextRequest) {
  if (!isValidAdminSession(request.cookies.get(ADMIN_AUTH_COOKIE)?.value)) {
    return NextResponse.json({ success: false, error: "Autentikasi admin diperlukan." }, { status: 401 });
  }

  try {
    const orders = await getOrders();
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Format data pesanan tidak valid." },
      { status: 400 }
    );
  }

  if (!isCreateOrderInput(body)) {
    return NextResponse.json(
      { success: false, error: "Mohon lengkapi item keranjang, nominal, nama pemesan, dan nomor WhatsApp." },
      { status: 400 }
    );
  }

  try {
    const order = await createOrder(body);
    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
