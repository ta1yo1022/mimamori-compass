import { authAdmin, dbAdmin } from "@/lib/firebase-admin";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const authToken = req.headers.get("Authorization");

    if (!authToken) {
        return NextResponse.json({ message: "認証トークンが不足しています。" }, { status: 400 });
    }

    console.log("Received auth token:", authToken);

    try {
        const decodedToken = await authAdmin.verifyIdToken(authToken);
        const uid = decodedToken.uid;

        const userRef = dbAdmin.collection("users").doc(uid);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            return NextResponse.json({message: "ユーザーが存在します。"}, { status: 200 });
        } else {
            return NextResponse.json({ message: "ユーザーが存在しません。"}, { status: 404 });
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "予期せぬエラーが発生しました。" }, { status: 500 });
    }
}