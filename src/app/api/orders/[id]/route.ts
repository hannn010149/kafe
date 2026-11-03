import { NextRequest, NextResponse } from "next/server";
import { getOrderByCode, updateOrderStatus } from "@/lib/db";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const order = await getOrderByCode(id);
    if (!order) {
      return NextResponse.json({ success: false, error: "Pesanan tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status } = body;

    const updated = await updateOrderStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Pesanan tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

