import { NextRequest, NextResponse } from "next/server";
import { getCafeSettings, updateCafeSettings } from "@/lib/db";

export async function GET() {
  try {
    const settings = await getCafeSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = await updateCafeSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

