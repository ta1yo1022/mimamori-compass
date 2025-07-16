import { adminAuth, db } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { authToken, firstName, lastName } = await req.json();

    if (!authToken || !firstName || !lastName) {
        return NextResponse.json({ message: "必要な情報が不足しています。" }, { status: 400 });
    }

    try {
        const decodedToken = await adminAuth.verifyIdToken(authToken);
        const uid = decodedToken.uid;

        const userRef = db.collection("users").doc(uid);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            return NextResponse.json({ message: "ユーザーは既に存在します。" }, { status: 409 });
        }

        await userRef.set({
            firstName: firstName,
            lastName: lastName,
            createdAt: FieldValue.serverTimestamp(),
        });

        return NextResponse.json({ message: "ユーザーを作成しました。" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "予期せぬエラーが発生しました。" }, { status: 500 });
    }
}