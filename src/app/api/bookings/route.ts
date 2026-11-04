import { NextRequest, NextResponse } from "next/server";
import { getBookings, createBooking, checkTableAvailability } from "@/lib/db";
import { ADMIN_AUTH_COOKIE, isValidAdminSession } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  if (!isValidAdminSession(request.cookies.get(ADMIN_AUTH_COOKIE)?.value)) {
    return NextResponse.json({ success: false, error: "Autentikasi admin diperlukan." }, { status: 401 });
  }

  try {
    const bookings = await getBookings();
    return NextResponse.json({ success: true, count: bookings.length, bookings });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memuat data reservasi.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer_name, customer_phone, booking_date, booking_time, guest_count } = body;

    if (!customer_name || !customer_phone || !booking_date || !booking_time || !guest_count) {
      return NextResponse.json(
        { success: false, error: "Mohon lengkapi nama, nomor WhatsApp, tanggal, jam, dan jumlah tamu" },
        { status: 400 }
      );
    }

    // Check availability to prevent double booking
    if (body.table_id) {
      const { available } = await checkTableAvailability(booking_date, booking_time, body.table_id);
      if (!available) {
        return NextResponse.json(
          {
            success: false,
            error: "Maaf, meja yang dipilih sudah dipesan untuk jam tersebut. Silakan pilih meja atau jam lain.",
            conflict: true,
          },
          { status: 409 }
        );
      }
    }

    const booking = await createBooking(body);
    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal membuat reservasi.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
