import { cert, initializeApp, getApps, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Firebase-adminを初期化
function decodeSAJson(json: string) {
    return JSON.parse(Buffer.from(json, "base64").toString("utf-8"));
}

const serviceAccountJson = decodeSAJson(process.env.FIREBASE_SA_JSON as string);
const serviceAccount = serviceAccountJson as ServiceAccount;

const firebaseAdminConfig = {
    credential: cert(serviceAccount),
};

function initFirebaseAdmin() {
    if (getApps().length === 0) {
        return initializeApp(firebaseAdminConfig);
    }
    return getApps()[0];
}

const adminInstance = initFirebaseAdmin();
const db = getFirestore(adminInstance);
const adminAuth = getAuth(adminInstance);

// ドキュメントを作る
// 使い方: await writeDoc("コレクション名", "ドキュメント名", { フィールド: データ })
// 返り値: なし
async function writeDoc(collection: string, id: string, data: object) {
    return await db.collection(collection).doc(id).set(data);
}

// ドキュメントを読む
// 使い方: await readDoc("コレクション名", "ドキュメント名")
// 返り値: { ドキュメントのフィールド(データ) }
async function readDoc(collection: string, id: string) {
    return (await db.collection(collection).doc(id).get()).data() || null;
}

// ドキュメントを更新
async function updateDoc(collection: string, id: string, data: object) {
    return await db.collection(collection).doc(id).update(data);
}

// ドキュメントを削除
async function deleteDoc(collection: string, id: string) {
    return await db.collection(collection).doc(id).delete();
}

// サブコレクションのドキュメントを作る
async function writeSubDoc(
    collection: string,
    docId: string,
    subCollection: string,
    subDocId: string,
    data: object
) {
    return await db.collection(collection).doc(docId).collection(subCollection).doc(subDocId).set(data);
}

// サブコレクションのドキュメントを読む
async function readSubDoc(
    collection: string,
    docId: string,
    subCollection: string,
    subDocId: string
) {
    return (await db.collection(collection).doc(docId).collection(subCollection).doc(subDocId).get()).data() || null;
}

// サブコレクションのドキュメントを更新
async function updateSubDoc(
    collection: string,
    docId: string,
    subCollection: string,
    subDocId: string,
    data: object
) {
    return await db.collection(collection).doc(docId).collection(subCollection).doc(subDocId).update(data);
}

// サブコレクションのドキュメントを削除
async function deleteSubDoc(
    collection: string,
    docId: string,
    subCollection: string,
    subDocId: string
) {
    return await db.collection(collection).doc(docId).collection(subCollection).doc(subDocId).delete();
}

// サブコレクションの全ドキュメントを取得
async function readAllSubDocs(collection: string, docId: string, subCollection: string) {
    const snapshot = await db.collection(collection).doc(docId).collection(subCollection).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}



export { db, adminAuth, writeDoc, readDoc, updateDoc, deleteDoc, writeSubDoc, readSubDoc, updateSubDoc, deleteSubDoc, readAllSubDocs, };