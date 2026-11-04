import { NextRequest, NextResponse } from "next/server";
import { ADMIN_AUTH_COOKIE, createAdminSessionToken } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const validEmail =
      process.env.ADMIN_EMAIL ||
      (process.env.NODE_ENV === "production" ? "" : "admin@komorebi.id");
    const validPassword =
      process.env.ADMIN_PASSWORD ||
      (process.env.NODE_ENV === "production" ? "" : "adminpassword123");
    const sessionToken = createAdminSessionToken();

    if (!validEmail || !validPassword || !sessionToken) {
      return NextResponse.json(
        { success: false, error: "Autentikasi admin belum dikonfigurasi." },
        { status: 503 }
      );
    }

    if (email === validEmail && password === validPassword) {
      const response = NextResponse.json({
        success: true,
        user: { email, role: "admin", name: "Head Barista & Admin" },
      });

      // Set auth cookie
      response.cookies.set(ADMIN_AUTH_COOKIE, sessionToken, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: "Email atau kata sandi admin tidak cocok" },
      { status: 401 }
    );
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: "Permintaan tidak valid." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Gagal memproses permintaan login." },
      { status: 500 }
    );
  }
}
