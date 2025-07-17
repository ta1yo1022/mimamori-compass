import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 認証が必要なページのパス
const protectedPaths = ["/elder/dashboard"]; 


export function middleware(request: NextRequest) {
  const session = request.cookies.get("auth-cookie");
  const { pathname } = request.nextUrl;

  // ログイン済みユーザーがサインイン・サインアップページにアクセスした場合、ダッシュボードにリダイレクト
  if (session && (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"))) {
    return NextResponse.redirect(new URL("/elder/dashboard", request.url));
  }

  // 認証が必要なページへのアクセス制御
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!session) {
      // 認証されていない場合はサインインページにリダイレクト
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // その他のパスは現状維持
  return NextResponse.next();
}

export const config = {
  // api, _next/static, _next/image, favicon.ico を除くすべてのパスでミドルウェアを実行
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};