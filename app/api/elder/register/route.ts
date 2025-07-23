import { NextRequest, NextResponse } from 'next/server';
import { dbAdmin, authAdmin } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { FieldValue } from 'firebase-admin/firestore';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_ACCESS_KEY!,
  },
});

const BUCKET_NAME = 'mimamori-compass';

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('Authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ error: '認証トークンがありません' }, { status: 401 });
    }
    const token = authorization.split('Bearer ')[1];

    // Firebase Admin SDKでIDトークンを検証
    const decodedClaims = await authAdmin.verifyIdToken(token);
    const uid = decodedClaims.uid;

    // FormDataを取得
    const formData = await request.formData();
    
    // フォームフィールドを取得
    const lastName = formData.get('lastName') as string;
    const firstName = formData.get('firstName') as string;
    const prefecture = formData.get('prefecture') as string;
    const city = formData.get('city') as string;
    const notificationEmail = formData.get('notificationEmail') as string;
    const age = formData.get('age') as string;
    const medicalConditions = formData.get('medicalConditions') as string;
    const physicalCharacteristics = formData.get('physicalCharacteristics') as string;
    
    // ファイルを取得
    const files = formData.getAll('files') as File[];

    // バリデーション
    if (!lastName || !firstName || !prefecture || !city || !notificationEmail || !age) {
      return NextResponse.json({ error: '必須フィールドが不足しています' }, { status: 400 });
    }

    if (files.length > 3) {
      return NextResponse.json({ error: '写真は3枚まで登録できます' }, { status: 400 });
    }

    // ファイルアップロード処理
    let photoUrls: string[] = [];
    if (files.length > 0) {
      const uploadPromises = files.map(async (file, index) => {
        const buffer = await file.arrayBuffer();
        const fileName = `clothing/${Date.now()}-${index}-${file.name}`;

        const command = new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: fileName,
          Body: new Uint8Array(buffer),
          ContentType: file.type,
        });

        await s3Client.send(command);
        return `${process.env.IMAGE_HOST_URL}/${fileName}`;
      });

      photoUrls = await Promise.all(uploadPromises);
    }

    // eldersコレクションに新しいドキュメントを作成
    const elderDocRef = dbAdmin.collection('elders').doc();
    const elderId = elderDocRef.id;
    
    // Firestoreに保存するデータを準備
    const dataToSave = {
      id: elderId,
      guardianId: uid,
      name: `${lastName} ${firstName}`,
      prefecture,
      city,
      notificationEmail,
      age: Number(age),
      medicalConditions: medicalConditions || '',
      physicalCharacteristics: physicalCharacteristics || '',
      clothingPhotos: photoUrls,
      createdAt: new Date(),
    };

    await elderDocRef.set(dataToSave);

    // usersドキュメントにmanagedElderIdsを追加（更新または作成）
    const userDocRef = dbAdmin.collection('users').doc(uid);
    await userDocRef.set({
      managedElderIds: FieldValue.arrayUnion(elderId),
    }, { merge: true });

    return NextResponse.json({ 
      success: true, 
      elderId,
      message: '高齢者情報が正常に登録されました' 
    }, { status: 201 });

  } catch (error) {
    console.error('Elder registration error:', error);
    return NextResponse.json({ 
      error: '情報の登録に失敗しました。もう一度お試しください。' 
    }, { status: 500 });
  }
}