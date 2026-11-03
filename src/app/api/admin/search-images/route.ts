import { NextRequest, NextResponse } from "next/server";
import { searchProductImages } from "@/lib/image-search";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q") || request.nextUrl.searchParams.get("query") || "";

    if (!query) {
      return NextResponse.json({ success: true, count: 0, images: [] });
    }

    const images = await searchProductImages(query);
    return NextResponse.json({ success: true, count: images.length, images });
  } catch (error: any) {
    console.error("Image search API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to search images" },
      { status: 500 }
    );
  }
}

