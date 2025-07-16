"use client";

import { auth } from "@/lib/firebase";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User, signOut, deleteUser } from "firebase/auth";
import Cookies from "js-cookie";
import Link from "next/link";
import { Noto_Sans_JP } from "next/font/google";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LogOut, Trash2 } from "lucide-react";

const notoSans = Noto_Sans_JP({
  weight: "600",
  subsets: ["latin"],
});

function ProtectHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [useremail, setUseremail] = useState<string | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const cookieData = Cookies.get("auth-cookie");
    if (cookieData) {
      const userData = JSON.parse(cookieData);
      setUsername(userData.displayName);
      setUseremail(userData.email);
      setPhotoURL(userData.photoURL);
    }

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
    const user = auth.currentUser;
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
            {photoURL ? (
              <AvatarImage src={photoURL} alt="User avatar" />
            ) : (
              <AvatarFallback className="animate-pulse bg-gray-200" />
            )}
          </Avatar>

          {isModalOpen && (
            <Card
              ref={modalRef}
              className="absolute top-full right-0 mt-2 w-[260px] sm:w-[300px] z-10 shadow-lg"
            >
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <Avatar className="h-10 w-10">
                  {photoURL ? (
                    <AvatarImage src={photoURL} alt="@username" height={35} width={35} />
                  ) : (
                    <AvatarFallback className="animate-pulse bg-gray-200" />
                  )}
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <h4 className="text-sm font-semibold">
                    {username || "ゲスト"}
                  </h4>
                  <p className="text-xs text-muted-foreground">{useremail || "No email"}</p>
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