import { NextRequest, NextResponse } from "next/server";
import { updateCategory, deleteCategory } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const updated = await updateCategory(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Kategori tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, category: updated });
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
    const deleted = await deleteCategory(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Kategori tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Kategori berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

