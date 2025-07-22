"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, db } from "@/lib/firebase";
import { collection, query, where } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Elder } from "@/types";

export default function Page() {
  const [user] = useAuthState(auth);

  // Firestoreから現在のユーザーに紐づく高齢者リストを取得
  const eldersRef = user ? collection(db, "users", user.uid, "elders") : null;
  const [elders, loading, error] = useCollectionData(eldersRef);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">みまもり対象者一覧</h1>
        <Button asChild>
          <Link href="/elder/register">新規登録</Link>
        </Button>
      </div>

      {loading && <p>読み込み中...</p>}
      {error && <p className="text-destructive">エラー: {error.message}</p>}

      {!loading && !elders?.length && (
        <div className="text-center py-12">
          <p className="mb-4">まだ誰も登録されていません。</p>
          <p>「新規登録」ボタンから、みまもる方の情報を登録してください。</p>
        </div>
      )}

      {elders && elders.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {elders.map((elder) => (
            <Card key={elder.id}>
              <CardHeader>
                <CardTitle>{elder.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>年齢: {elder.age}歳</p>
                <p>お住まい: {elder.prefecture} {elder.city}</p>
                <p>当日の服装: {elder.clothingColor}</p>
                {/* TODO: 詳細ページへのリンクを追加 */}
                <Button variant="outline" className="w-full mt-4">
                  詳細を見る
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
