import { cert, initializeApp, getApps, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth"; // admin.auth ではなく firebase-admin/auth を使用

// Base64でエンコードされたサービスアカウントJSONをデコード
function decodeSAJson(json: string) {
  return JSON.parse(Buffer.from(json, "base64").toString("utf-8"));
}

const serviceAccountJson = decodeSAJson(process.env.FIREBASE_SA_JSON as string);
const serviceAccount = serviceAccountJson as ServiceAccount;

// Firebase Admin SDKの初期化設定
const firebaseAdminConfig = {
  credential: cert(serviceAccount),
};

// Firebase Admin SDKの初期化
function initFirebaseAdmin() {
  if (getApps().length === 0) {
    return initializeApp(firebaseAdminConfig);
  }
  return getApps()[0];  // 既に初期化済みの場合はそのインスタンスを返す
}

const adminInstance = initFirebaseAdmin();
const dbAdmin = getFirestore(adminInstance);
const authAdmin = getAuth(adminInstance); // Firebase Admin SDK の認証インスタンスを取得

// ドキュメントを作る
async function writeDoc(collection: string, id: string, data: object) {
  return await dbAdmin.collection(collection).doc(id).set(data);
}

// ドキュメントを読む
async function readDoc(collection: string, id: string) {
  return (await dbAdmin.collection(collection).doc(id).get()).data() || null;
}

// ドキュメントを更新
async function updateDoc(collection: string, id: string, data: object) {
  return await dbAdmin.collection(collection).doc(id).update(data);
}

// ドキュメントを削除
async function deleteDoc(collection: string, id: string) {
  return await dbAdmin.collection(collection).doc(id).delete();
}

// サブコレクションのドキュメントを作る
async function writeSubDoc(
  collection: string,
  docId: string,
  subCollection: string,
  subDocId: string,
  data: object
) {
  return await dbAdmin.collection(collection).doc(docId).collection(subCollection).doc(subDocId).set(data);
}

// サブコレクションのドキュメントを読む
async function readSubDoc(
  collection: string,
  docId: string,
  subCollection: string,
  subDocId: string
) {
  return (await dbAdmin.collection(collection).doc(docId).collection(subCollection).doc(subDocId).get()).data() || null;
}

// サブコレクションのドキュメントを更新
async function updateSubDoc(
  collection: string,
  docId: string,
  subCollection: string,
  subDocId: string,
  data: object
) {
  return await dbAdmin.collection(collection).doc(docId).collection(subCollection).doc(subDocId).update(data);
}

// サブコレクションのドキュメントを削除
async function deleteSubDoc(
  collection: string,
  docId: string,
  subCollection: string,
  subDocId: string
) {
  return await dbAdmin.collection(collection).doc(docId).collection(subCollection).doc(subDocId).delete();
}

// サブコレクションの全ドキュメントを取得
async function readAllSubDocs(collection: string, docId: string, subCollection: string) {
  const snapshot = await dbAdmin.collection(collection).doc(docId).collection(subCollection).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export {
    writeDoc,
    readDoc,
    updateDoc,
    deleteDoc,
    writeSubDoc,
    readSubDoc,
    updateSubDoc,
    deleteSubDoc,
    readAllSubDocs,
    authAdmin,
    dbAdmin,
};