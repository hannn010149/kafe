import { NextRequest, NextResponse } from "next/server";
import { getCategories, createCategory } from "@/lib/db";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ success: false, error: "Nama dan slug kategori wajib diisi" }, { status: 400 });
    }
    const newCategory = await createCategory(body);
    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

