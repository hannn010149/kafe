import { NextRequest, NextResponse } from "next/server";
import { getProductById, updateProduct, deleteProduct } from "@/lib/db";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ success: false, error: "Produk tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
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
    const updated = await updateProduct(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Produk tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product: updated });
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
    const deleted = await deleteProduct(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Produk tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Produk berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

