import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

export interface UserProps {
  user: User | null;
}

// Elder：認知症高齢者情報
export interface Elder {
  id: string;
  uid: string; // 登録したユーザーのUID
  name: string;
  age: number;
  prefecture: string;
  city: string;
  clothingColor: string;
  notificationEmail: string;
  medicalConditions?: string; // 任意
  physicalCharacteristics?: string; // 任意
  photoURL?: string; // 任意
  qrId?: string; // QRコード生成後に紐付け
  createdAt: Timestamp;
  clothingImageURLs?: string[]; // 服の画像のURLを最大3つまで格納
}
