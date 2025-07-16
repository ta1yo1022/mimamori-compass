"use client"; 

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const formSchema = z.object({
    firstName: z.string().nonempty("名は必須です。"),
    lastName: z.string().nonempty("姓は必須です。"),
    // createTemplate: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function page() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
        },
    });

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage("");
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    const onSubmit = async (data: FormData) => {
        try {
            setIsSubmitting(true)
            const user = auth.currentUser;
            if (!user) {
                setErrorMessage("ログインしていません。");
                setIsSubmitting(false);
                return;
            }
            console.log(user)
            const token = await user.getIdToken();

            const res = await fetch("/api/auth/setup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    authToken: token,
                    firstName: data.firstName,
                    lastName: data.lastName,
                }),
            });

            const responseData = await res.json();

            if (!res.ok) {
                setErrorMessage(responseData.message || "エラーが発生しました。");
            } else {
                console.log("登録成功");
                router.push("/elder/dashboard")
            }
        } catch (error) {
            setErrorMessage("エラーが発生しました。");
            console.error("エラーが発生しました:", error);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="flex flex-col items-center justify-center h-screen sm:w-100 mx-auto px-5 sm:px-0">
            {errorMessage && (
                <Alert variant="destructive" className="absolute top-10 w-80">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>エラー</AlertTitle>
                    <AlertDescription>
                        {errorMessage}
                    </AlertDescription>
                </Alert>
            )}
            <h1 className="text-2xl font-bold">みまもりコンパスへようこそ</h1>
            <p className="mt-2">名前を教えてください</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full mt-10">
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>姓</FormLabel>
                                <FormControl>
                                    <Input
                                        className="h-12"
                                        placeholder="田中" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>名</FormLabel>
                                <FormControl>
                                    <Input
                                        className="h-12"
                                        placeholder="太郎" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* <FormField
                        control={form.control}
                        name="createTemplate"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-1 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        認知症高齢者のテンプレート情報を作成する
                                    </FormLabel>
                                    <p className="text-sm text-muted-foreground">
                                        テンプレートを作成することで、みまもりコンパスの使用方法を知れます。
                                    </p>
                                </div>
                            </FormItem>
                        )}
                    /> */}
                    <Button
                        type="submit"
                        disabled={isSubmitting} // 送信中は無効化
                        className="bg-blue-600 rounded-lg w-full h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "送信中..." : "続行"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
