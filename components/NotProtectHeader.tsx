"use client";

import { auth } from "@/lib/firebase";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, User } from "firebase/auth";
import Cookies from "js-cookie";
import Link from "next/link";
import { Noto_Sans_JP } from "next/font/google";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const notoSans = Noto_Sans_JP({
  weight: "700",
  subsets: ["latin"],
});

function NotProtectHeader() {
  return (
    <header className="w-full bg-white z-5">
      <div className="mx-auto flex py-7 border-b border-gray-300 items-center gap-8 px-6 lg:px-8 justify-between">
        <Link href="/" className="flex items-center space-x-4 h-12">
          <Image src="/logo/mimamori-compass_mark.svg" alt="みまもりコンパスのロゴ" height={40} width={40} />
          <h1 className={notoSans.className}>みまもりコンパス</h1>
        </Link>

        <div className="relative flex items-center">
          {/* <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Link
                className="block rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 cursor-pointer"
                href="/sign-in"
              >
                ログイン
              </Link>
            </SignInButton>
          </SignedOut> */}

        </div>

      </div >
    </header >
  );
}

export default NotProtectHeader;