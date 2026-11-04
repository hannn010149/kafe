import { NextRequest, NextResponse } from "next/server";
import { updateBookingStatus } from "@/lib/db";
import { ADMIN_AUTH_COOKIE, isValidAdminSession } from "@/lib/admin-auth";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isValidAdminSession(request.cookies.get(ADMIN_AUTH_COOKIE)?.value)) {
    return NextResponse.json({ success: false, error: "Autentikasi admin diperlukan." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status, rejection_reason } = body;

    const updated = await updateBookingStatus(id, status, rejection_reason);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Reservasi tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, booking: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui reservasi.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
