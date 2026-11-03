import { NextRequest, NextResponse } from "next/server";
import { getOrders, createOrder } from "@/lib/db";

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customer_name, customer_phone, order_type, payment_method } = body;

    if (!items || !items.length || !customer_name || !customer_phone) {
      return NextResponse.json(
        { success: false, error: "Mohon lengkapi item keranjang, nama pemesan, dan nomor WhatsApp" },
        { status: 400 }
      );
    }

    const order = await createOrder(body);
    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

