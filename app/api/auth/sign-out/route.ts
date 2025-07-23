import { NextResponse } from "next/server";

export async function POST() {
  const options = {
    name: "__session",
    value: "",
    maxAge: -1, // Cookieを即時失効させる
    path: "/",
  };

  const response = NextResponse.json({ status: "success" });
  response.cookies.set(options);

  return response;
}
