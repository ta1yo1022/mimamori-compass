"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
// import { AddressSelector } from "@/components/AddressSelector";
import { prefectures, cities } from "@/lib/address-data";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Zodスキーマでフォームのバリデーションルールを定義
const formSchema = z.object({
  lastName: z.string().min(1, { message: "姓は必須です。" }),
  firstName: z.string().min(1, { message: "名は必須です。" }),
  prefecture: z.string().min(1, { message: "都道府県を選択してください。" }),
  city: z.string().min(1, { message: "市区町村を選択してください。" }),
  notificationEmail: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください。" }),
  age: z.coerce
    .number({ invalid_type_error: "有効な数値を入力してください。" })
    .int({ message: "整数で入力してください。" })
    .positive({ message: "年齢は正の数である必要があります。" })
    .min(1, { message: "年齢は必須です。" }),
  medicalConditions: z.string().optional(),
  physicalCharacteristics: z.string().optional(),
  clothingPhotos: z
    .array(z.instanceof(File))
    .max(3, { message: "写真は3枚まで登録できます。" })
    .optional(),
});

export default function Page() {
  const [user, loading, authError] = useAuthState(auth);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      prefecture: "",
      city: "",
      notificationEmail: "",
      age: undefined,
      medicalConditions: "",
      physicalCharacteristics: "",
      clothingPhotos: undefined,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 3) {
      setError("写真は3枚まで登録できます。");
      return;
    }

    // ファイルのバリデーション
    const validFiles = files.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        setError("ファイルサイズは5MB以下にしてください。");
        return false;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setError("JPG、PNG、WEBPファイルのみアップロード可能です。");
        return false;
      }
      return true;
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);

    // プレビューURLの生成
    validFiles.forEach((file) => {
      const url = URL.createObjectURL(file);
      setPreviewUrls((prev) => [...prev, url]);
    });
  };


  const removePhoto = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (loading) {
      setError("認証情報を確認中です。");
      return;
    }
    
    if (!user) {
      setError("ログインしていません。");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = await user.getIdToken();
      const formData = new FormData();
      
      const { clothingPhotos, ...formValues } = values;
      Object.entries(formValues).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/elder/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '登録に失敗しました');
      }

      router.push("/elder/dashboard");
    } catch (e) {
      console.error("Error adding document: ", e);
      setError(e instanceof Error ? e.message : "情報の登録に失敗しました。もう一度お試しください。");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-start w-full max-w-2xl mx-auto my-8 bg-background">
      <h1 className="text-2xl text-left pb-2 font-medium sm:px-0 px-6">みまもられる方の情報登録</h1>
      <p className="sm:px-0 px-6 pb-6">みまもりを開始するあなたの家族の認知症高齢者の情報を登録しましょう。</p>
      <Card className="w-full border-none sm:border shadow-none sm:shadow pt-0 sm:pt-8 py-0 sm:py-8">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="grid grid-cols-2 md:col-span-3 gap-4 sm:gap-6">
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            姓<span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="山田" {...field} />
                          </FormControl>
                          <FormMessage className="min-h-[1.25rem]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            名<span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="太郎" {...field} />
                          </FormControl>
                          <FormMessage className="min-h-[1.25rem]" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        年齢<span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="80" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage className="min-h-[1.25rem]" />
                    </FormItem>
                  )}
                />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="prefecture"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>
                            都道府県<span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedPrefecture(value);
                              form.setValue("city", "");
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                                className={fieldState.invalid ? "border-red-500 w-full" : "w-full"}
                              >
                                <SelectValue placeholder="選択してください" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {prefectures.map((pref) => (
                                <SelectItem key={pref} value={pref}>
                                  {pref}
                                </SelectItem>
                              ))}
                            </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="min-h-[1.25rem]" />
                        </FormItem>
                      )}
                    />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>
                          市区町村<span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!selectedPrefecture}
                          >
                            <FormControl>
                              <SelectTrigger
                                className={fieldState.invalid ? "border-red-500 w-full" : "w-full"}
                              >
                                <SelectValue placeholder="選択してください" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {selectedPrefecture &&
                                cities[selectedPrefecture]?.map((city) => (
                                  <SelectItem key={city} value={city}>
                                    {city}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          </FormControl>
                          <FormMessage className="min-h-[1.25rem]" />
                        </FormItem>
                      )}
                    />
                  </div>
              
                <FormField
                  control={form.control}
                  name="notificationEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        通知用メールアドレス<span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="example@mail.com" {...field} />
                      </FormControl>
                      <FormMessage className="min-h-[1.25rem]" />
                    </FormItem>
                  )}
                />

              <Separator />

              <div className="space-y-8">
                <FormItem>
                  <FormLabel>普段着ている服の写真（最大3枚）</FormLabel>
                  <FormControl>
                    <div className="">
                      <Input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileChange}
                        disabled={selectedFiles.length >= 3}
                        className="cursor-pointer"
                        multiple
                      />
                      <div className="grid grid-cols-3 gap-4">
                        {previewUrls.map((url, index) => (
                          <div key={index} className="relative">
                            <Image
                              src={url}
                              alt={`服の写真 ${index + 1}`}
                              width={200}
                              height={200}
                              className="rounded-lg object-cover w-full h-40"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    JPG、PNG、WEBP形式の画像（5MB以下）をアップロードしてください。
                  </FormDescription>
                  <FormMessage className="min-h-[1.25rem]" />
                </FormItem>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="medicalConditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>罹患している病気</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="アルツハイマー型認知症、高血圧など"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="min-h-[1.25rem]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="physicalCharacteristics"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>身体的特徴</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="身長160cm、右腕にほくろ、白髪混じりの短髪など"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="min-h-[1.25rem]" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {(error || authError) && (
                <p className="text-sm font-medium text-destructive">
                  {error || authError?.message}
                </p>
              )}

              <Button type="submit" disabled={loading || isLoading} className="w-full">
                {isLoading ? "登録中..." : "登録する"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
