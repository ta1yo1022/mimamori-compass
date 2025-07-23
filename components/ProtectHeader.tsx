"use client";

import { auth } from "@/lib/firebase";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut, deleteUser } from "firebase/auth";
import Cookies from "js-cookie";
import Link from "next/link";
import { Noto_Sans_JP } from "next/font/google";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LogOut, Trash2 } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";

const notoSans = Noto_Sans_JP({
  weight: "600",
  subsets: ["latin"],
});

function ProtectHeader() {
  const [user, loading] = useAuthState(auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Cookies.remove("auth-cookie");
      router.push("/");
    } catch (error) {
      console.error("サインアウトエラー", error);
    }
  };

  const handleDelete = async () => {
    if (user) {
      try {
        await deleteUser(user);
        Cookies.remove("auth-cookie");
        router.push("/");
      } catch (error) {
        console.error("アカウント削除エラー", error);
      }
    }
  };

  return (
    <header className="w-full bg-white z-50">
      <div className="mx-auto flex py-7 border-b border-gray-300 items-center gap-8 px-6 lg:px-8 justify-between">
        <Link href="/elder/dashboard" className="flex items-center space-x-4">
          <Image src="/logo/mimamori-compass_mark.png" alt="みまもりコンパスのロゴ" height={40} width={40} />
          <h1 className={notoSans.className}>みまもりコンパス</h1>
        </Link>

        <div className="relative">
          <Avatar className="h-10 w-10 cursor-pointer" onClick={() => setIsModalOpen(!isModalOpen)}>
            {loading ? (
              <AvatarFallback className="animate-pulse bg-gray-200" />
            ) : user && user.photoURL ? (
              <AvatarImage src={user.photoURL} alt="User avatar" />
            ) : (
              <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
            )}
          </Avatar>

          {isModalOpen && user && (
            <Card
              ref={modalRef}
              className="absolute top-full right-0 mt-2 w-[260px] sm:w-[300px] z-10 shadow-lg"
            >
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <Avatar className="h-10 w-10">
                  {user.photoURL ? (
                    <AvatarImage src={user.photoURL} alt={user.displayName || "User avatar"} height={35} width={35} />
                  ) : (
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <h4 className="text-sm font-semibold">
                    {user.displayName || "ゲスト"}
                  </h4>
                  <p className="text-xs text-muted-foreground">{user.email || "No email"}</p>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  サインアウト
                </Button>
                <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-100" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  アカウント消去
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </header>
  );
}

export default ProtectHeader;
