"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProtectHeader from "@/components/ProtectHeader";

export default function ProtectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    // 読み込み中でもなく、ユーザーもいない場合はサインインページにリダイレクト
    if (!loading && !user) {
      router.push("/sign-in");
    }
    // エラーがあればコンソールに出力
    if (error) {
      console.error("Authentication error:", error);
    }
  }, [user, loading, router, error]);

  // 読み込み中、またはユーザーがいない（リダイレクト待ち）間はローディング表示
  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // ユーザーがいれば子コンポーネントを表示
  return (
    <>
      <ProtectHeader />
      <main>{children}</main>
    </>
  );
}