# GEMINI.md

## プロジェクト概要

**みまもりコンパス（mimamori-compass）**は、認知症高齢者の徘徊や行方不明を早期に発見・対応するためのWebアプリケーションです。  
本人が装着するQRコードを通じて、発見者が情報を送信すると家族に即時通知され、SNSで地域に協力を呼びかけることもできます。  
地域全体で認知症高齢者を支える仕組みを目指しています。

---

## 社会課題と目的

認知症による徘徊は、深刻な事故や長時間の捜索につながる重大な社会課題です。  
現状では家族や警察に大きな負担がかかり、早期発見が難しいケースもあります。  
**みまもりコンパス**は、地域住民がQRコードを読み取るだけで支援に参加できる仕組みを提供し、迅速な対応と安心感を実現します。

---

## 主な機能

- **QRコード発行機能：**  
  認知症高齢者ごとにユニークなQRコードを生成し、身につけることで識別を可能にします。

- **発見者報告機能：**  
  QRを読み取ると、本人のプロフィールページに遷移し、以下の選択肢を報告できます：
  - 一緒に待機している
  - 警察に引き渡した
  - 報告のみ（居場所のみ）

- **リアルタイム通知機能：**  
  家族に位置・時刻・発見者メモなどを即時通知します。

- **チャット機能：**  
  発見者と家族がアプリ上で直接やりとり可能です。

- **SNS連携・共有ページ生成：**  
  家族がワンクリックでSNS（X）に投稿できる共有ページを動的に作成します。

---

## 技術スタック

- **フレームワーク：** Next.js 15.2.4  
- **言語：** TypeScript  
- **認証：** Firebase Authentication  
- **データベース：** Firebase Firestore  
- **チャット：** Firebase Realtime Database または Firestore  
- **ホスティング：** Vercel  
- **UI：** React 19, Tailwind CSS 4, shadcn/ui, lucide-react  
- **フォーム：** React Hook Form + Zod  
- **スタイリング：** Tailwind CSS + PostCSS + `tw-animate-css`  
- **リント：** ESLint  
- **パッケージ管理：** npm  

---

## アプリケーション構成図

```
[QRコード] → [発見ページ表示] → [発見報告フォーム]
                               ↓
                       [家族へ通知・チャット]
                               ↓
                   [共有ページ自動生成 → SNS投稿]
```

---

## ディレクトリ構成

```
/app/
  (notProtect)/     → 公開ページ（QRスキャン用）
  /q/[qrId]         → 高齢者プロフィール
  /share/[qrId]     → SNS拡散用ページ
  (protect)/        → 認証後のみ閲覧可能（ダッシュボードなど）
  (setup)/          → 初期設定、ログイン、登録
  /api/             → APIルート

/components/        → コンポーネント群
  /ui/              → shadcn/uiを使用

/lib/               → Firebase初期化・ユーティリティ
/public/            → 静的ファイル（画像・QR等）
types.ts            → TypeScript型定義
```

---

## コアデータモデル（TypeScript形式）

```ts
// Elder：認知症高齢者情報
{
  id: string;
  name: string;
  age: number;
  prefecture: string;
  city: string;
  clothingColor: string;
  medicalConditions: string[];
  photoURL: string;
  qrId: string;
}

// QRCode：Elderと紐づいたコード
{
  qrId: string;
  elderId: string;
}

// FinderReport：発見報告
{
  id: string;
  elderId: string;
  location: string;
  timestamp: Date;
  actionTaken: "waiting" | "police" | "report_only";
  note: string;
}

// Post：共有用ページ情報
{
  id: string;
  elderId: string;
  url: string;
  description: string;
  xQueryURL: string;
}
```

---

## 認証とルーティング

- Firebase Authentication によってログイン管理。
- `app/(protect)` 以下は認証済ユーザーのみアクセス可。
- セッション情報は `js-cookie` を利用して管理。

---

## SNS連携（X/Twitter 投稿例）

```ts
const tweetURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
  `🚨 認知症の父（78歳・灰色の服）が奈良市で行方不明になりました。\n発見された方はご連絡ください。\n詳細ページ：https://mimamori.app/share/abc123`
)}`
```

---

## 開発手順（ローカル環境構築）

```bash
# パッケージインストール
npm install

# 環境変数ファイルを作成
cp .env.local.example .env.local
# FirebaseのAPIキーなどを設定

# 開発サーバー起動
npm run dev
```

---

## ビルドとデプロイ

```bash
# 本番ビルド
npm run build

# 本番サーバー起動
npm run start

# Lintチェック
npm run lint
```

**推奨デプロイ先：** [Vercel](https://vercel.com)