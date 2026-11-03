import { NextRequest, NextResponse } from "next/server";
import { updateBookingStatus } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status, rejection_reason } = body;

    const updated = await updateBookingStatus(id, status, rejection_reason);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Reservasi tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, booking: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

