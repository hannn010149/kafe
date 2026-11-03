import { NextRequest, NextResponse } from "next/server";
import { updateTable, deleteTable } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const updated = await updateTable(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Meja tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, table: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const deleted = await deleteTable(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Meja tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Meja berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

