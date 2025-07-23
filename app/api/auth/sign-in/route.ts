import { authAdmin } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: "ID token is required" }, { status: 400 });
    }

    // セッションCookieの有効期限（例: 5日間）
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await authAdmin.createSessionCookie(idToken, { expiresIn });

    const options = {
      name: "__session", // Cookie名
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true, // JavaScriptからのアクセスを禁止
      secure: process.env.NODE_ENV === "production", // 本番環境ではHTTPSのみ
      path: "/",
    };

    const response = NextResponse.json({ status: "success" });
    response.cookies.set(options);

    return response;
  } catch (error) {
    console.error("Error creating session cookie:", error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 401 });
  }
}
