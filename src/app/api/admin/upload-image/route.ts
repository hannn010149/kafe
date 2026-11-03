import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "Tidak ada file yang dipilih" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // If Supabase is configured with a storage bucket 'products', upload there
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const ext = file.name.split(".").pop() || "jpg";
        const fileName = `product-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabaseAdmin.storage
          .from("products")
          .upload(fileName, buffer, {
            contentType: file.type || "image/jpeg",
            upsert: true,
          });

        if (!uploadError) {
          const { data: publicData } = supabaseAdmin.storage
            .from("products")
            .getPublicUrl(fileName);
          return NextResponse.json({ success: true, url: publicData.publicUrl });
        }
      } catch (err) {
        console.warn("Supabase storage upload fallback:", err);
      }
    }

    // Fallback: Base64 data URI format for instant preview and persistence
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({ success: true, url: dataUrl });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

