"use client";

import React from "react";
import Image from "next/image";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

// import { Button } from "@/components/ui/button"
// import {
//     Form,
//     FormControl,
//     FormDescription,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
import Link from "next/link";



export default function Page() {
    const router = useRouter();

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
      const idToken = await user.getIdToken();

      // サーバーにIDトークンを送信してセッションCookieを生成
      await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      // ユーザーが新規か既存かを確認
      const response = await fetch("/api/auth/check", {
                method: "GET",
                headers: {
                    Authorization: idToken,
                },
            });
    
            if (response.status === 200) {
                router.push("/elder/dashboard");
            } else if (response.status === 404) {
                router.push("/setup/account");
            } else {
                router.push("/");
            }
        } catch {
            console.error("予期せぬエラーが発生しました");
            router.push("/");
        }
      };

    // const signInWithEmail = async (data: FormData) => {
    //     try {
    //         const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    //         const user = userCredential.user;

    //         Cookies.set("user", JSON.stringify(user), { expires: 7 });
    //         router.push("/dashboard");
    //     } catch (error: any) {
    //         console.error("サインアップエラー:", error);
    //         alert("サインアップに失敗しました: " + error.message);
    //     }
    // };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <section className="bg-white py-10 px-5 sm:px-10 rounded-sm sm:w-auto sm:h-auto w-full h-full flex flex-col justify-start items-center">
                <div className="relative h-20 w-20">
                    <Image
                        className="object-fill"
                        src="/logo/mimamori-compass_mark.svg"
                        alt="みまもりコンパスのロゴ"
                        fill
                    />
                </div>
                <h1 className="mt-8 text-xl mb-2 font-bold">
                    サインアップ
                </h1>

                <button
                    className="bg-gray-100 hover:bg-gray-200 flex justify-center items-center space-x-2 h-14 rounded-sm mt-5 w-full sm:w-100 cursor-pointer"
                    onClick={signInWithGoogle}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 48 48"
                    >
                        <path
                            fill="#FFC107"
                            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                        ></path>
                        <path
                            fill="#FF3D00"
                            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                        ></path>
                        <path
                            fill="#4CAF50"
                            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                        ></path>
                        <path
                            fill="#1976D2"
                            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                        ></path>
                    </svg>
                    <span>Googleで続ける</span>
                </button>

                {/* <p className="my-5">または</p> */}

                {/* <Form {...form}>
                    <form onSubmit={form.handleSubmit(signInWithEmail)} className="space-y-8 w-full">
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>姓</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-14 w-full"
                                                placeholder="田中" {...field} />
                                        </FormControl>
                                        <FormMessage className="h-5"/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>名</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-14 w-full"
                                                placeholder="太郎" {...field} />
                                        </FormControl>
                                        <FormMessage className="h-5"/>
                                    </FormItem>
                                )}
                            />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>メールアドレス</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            className="h-14 w-full"
                                            placeholder="メールアドレス" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>パスワード</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            className="h-14"
                                            placeholder="パスワード" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer w-full h-14">ログイン</Button>
                    </form>
                </Form> */}

                <p className="mt-5 text-gray-500 w-full sm:w-100 text-sm">サインアップを完了することで、本システムの <span className="text-black">利用規約</span> および <span className="text-black">プライバシーポリシー</span> に同意したものとみなされます。</p>

                <Link href="/sign-in" className="mt-5 border-b border-black">アカウントをお持ちの場合はこちら</Link>
            </section>
        </div>
    );
}