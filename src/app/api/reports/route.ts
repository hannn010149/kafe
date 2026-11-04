import { NextRequest, NextResponse } from "next/server";
import { getReportsData } from "@/lib/db";
import { ADMIN_AUTH_COOKIE, isValidAdminSession } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  if (!isValidAdminSession(request.cookies.get(ADMIN_AUTH_COOKIE)?.value)) {
    return NextResponse.json({ success: false, error: "Autentikasi admin diperlukan." }, { status: 401 });
  }

  try {
    const data = await getReportsData();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    console.error("Reports API failed:", error);
    return NextResponse.json({ success: false, error: "Gagal memuat laporan." }, { status: 500 });
  }
}
