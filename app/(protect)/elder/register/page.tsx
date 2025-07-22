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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
// import { AddressSelector } from "@/components/AddressSelector";
import { prefectures, cities } from "@/lib/address-data";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Zodスキーマでフォームのバリデーションルールを定義
const formSchema = z.object({
  name: z.string().min(1, { message: "姓名は必須です。" }),
  prefecture: z.string().min(1, { message: "都道府県を選択してください。" }),
  city: z.string().min(1, { message: "市区町村を選択してください。" }),
  notificationEmail: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください。" }),
  clothingColor: z.string().min(1, { message: "服の色は必須です。" }),
  age: z.coerce
    .number()
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
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      prefecture: "",
      city: "",
      notificationEmail: "",
      clothingColor: "",
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

    form.setValue("clothingPhotos", [...selectedFiles, ...validFiles]);
  };

  const removePhoto = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    form.setValue("clothingPhotos", selectedFiles.filter((_, i) => i !== index));
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      setError("ログインしていません。");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // users/{uid}/eldersコレクションへの参照を作成し、新しいドキュメントIDを自動生成
      const elderDocRef = doc(collection(db, "users", user.uid, "elders"));
      const elderId = elderDocRef.id;

      // 画像のアップロードとURLの取得
      const photoUrls = await Promise.all(
        selectedFiles.map(async (file) => {
          // Handle file upload logic here or remove this block if unnecessary
          throw new Error("Storage functionality is not implemented.");
        })
      );

      // 保存するデータにIDと画像URLを追加
      const dataToSave = {
        ...values,
        id: elderId,
        uid: user.uid,
        createdAt: new Date(),
        clothingPhotoUrls: photoUrls,
      };

      // Firestoreにデータを保存
      await setDoc(elderDocRef, dataToSave);

      // 登録成功後、ダッシュボードにリダイレクト
      router.push("/elder/dashboard");
    } catch (e) {
      console.error("Error adding document: ", e);
      setError("情報の登録に失敗しました。もう一度お試しください。");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center sm:mt-5 bg-background p-4">
      <Card className="w-full max-w-2xl border-none sm:border shadow-none sm:shadow">
        <CardHeader>
          <CardTitle className="text-2xl">みまもられる方の情報登録</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          姓名<span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="山田 太郎" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          年齢<span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="80" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="prefecture"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            都道府県<span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setSelectedPrefecture(e.target.value);
                                form.setValue("city", "");
                              }}
                            >
                              <option value="">選択してください</option>
                              {prefectures.map((pref) => (
                                <option key={pref} value={pref}>
                                  {pref}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            市区町村<span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                              disabled={!selectedPrefecture}
                            >
                              <option value="">選択してください</option>
                              {selectedPrefecture &&
                                cities[selectedPrefecture]?.map((city) => (
                                  <option key={city} value={city}>
                                    {city}
                                  </option>
                                ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <FormItem>
                  <FormLabel>普段着ている服の写真（最大3枚）</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileChange}
                        disabled={selectedFiles.length >= 3}
                        className="cursor-pointer"
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
                  <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
              )}

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "登録中..." : "登録する"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
