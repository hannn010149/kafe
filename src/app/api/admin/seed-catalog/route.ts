import { NextRequest, NextResponse } from "next/server";
import { ADMIN_AUTH_COOKIE, isValidAdminSession } from "@/lib/admin-auth";
import { importSeedCatalog } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  if (!isValidAdminSession(request.cookies.get(ADMIN_AUTH_COOKIE)?.value)) {
    return NextResponse.json({ success: false, error: "Autentikasi admin diperlukan." }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ success: false, error: "Supabase belum dikonfigurasi." }, { status: 503 });
  }

  try {
    const result = await importSeedCatalog();
    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengimpor data awal.";
    console.error("Seed catalog import failed:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
