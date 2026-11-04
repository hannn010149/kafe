import { NextRequest, NextResponse } from "next/server";
import { deleteBooking, updateBookingStatus } from "@/lib/db";
import { ADMIN_AUTH_COOKIE, isValidAdminSession } from "@/lib/admin-auth";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isValidAdminSession(request.cookies.get(ADMIN_AUTH_COOKIE)?.value)) {
    return NextResponse.json({ success: false, error: "Autentikasi admin diperlukan." }, { status: 401 });
  }

  try {
    const { id: bookingCode } = await context.params;
    const body = await request.json();
    const { status, rejection_reason } = body;

    const updated = await updateBookingStatus(bookingCode, status, rejection_reason);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Reservasi tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, booking: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui reservasi.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isValidAdminSession(request.cookies.get(ADMIN_AUTH_COOKIE)?.value)) {
    return NextResponse.json({ success: false, error: "Autentikasi admin diperlukan." }, { status: 401 });
  }

  try {
    const { id: bookingCode } = await context.params;
    const deleted = await deleteBooking(bookingCode);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Reservasi tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Reservasi berhasil dihapus" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal menghapus reservasi.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
