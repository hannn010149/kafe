import { NextRequest, NextResponse } from "next/server";
import { getTables, createTable } from "@/lib/db";

export async function GET() {
  try {
    const tables = await getTables();
    return NextResponse.json({ success: true, count: tables.length, tables });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.table_number || !body.name || !body.capacity) {
      return NextResponse.json({ success: false, error: "Nomor meja, nama, dan kapasitas wajib diisi" }, { status: 400 });
    }
    const table = await createTable(body);
    return NextResponse.json({ success: true, table }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

