import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Default admin credentials
    const validEmail = process.env.ADMIN_EMAIL || "admin@komorebi.id";
    const validPassword = process.env.ADMIN_PASSWORD || "adminpassword123";

    if (email === validEmail && password === validPassword) {
      const response = NextResponse.json({
        success: true,
        user: { email, role: "admin", name: "Head Barista & Admin" },
      });

      // Set auth cookie
      response.cookies.set("komorebi_admin_auth", "true", {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: "lax",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: "Email atau kata sandi admin tidak cocok" },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

