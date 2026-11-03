import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const category_id = request.nextUrl.searchParams.get("category_id") || undefined;
    const query = request.nextUrl.searchParams.get("query") || undefined;
    const onlyAvailable = request.nextUrl.searchParams.get("available") === "true";

    const products = await getProducts({ category_id, query, onlyAvailable });
    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.price || !body.image_url) {
      return NextResponse.json(
        { success: false, error: "Nama produk, harga, dan foto wajib diisi" },
        { status: 400 }
      );
    }
    const product = await createProduct(body);
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

