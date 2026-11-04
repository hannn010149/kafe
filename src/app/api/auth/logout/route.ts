import { NextResponse } from "next/server";
import { ADMIN_AUTH_COOKIE } from "@/lib/admin-auth";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set(ADMIN_AUTH_COOKIE, "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
