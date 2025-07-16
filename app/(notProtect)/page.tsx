"use client";

import { BarChartIcon, Bell, MoveRight, ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// import Hero from "@/components/top/Hero";
// import Problem from "@/components/top/Problem";
// import Solution from "@/components/top/Solution";
// import FreeService from "@/components/top/FreeService";
// import Faq from "@/components/top/Faq";

const features = [
  {
    title: "捜索依頼機能",
    description: "X（旧Twitter）を通じて地域の人々に情報を拡散し、リアルタイムで捜索協力を呼びかけます。",
    icon: <Bell className="w-6 h-6" />,
  },
  {
    title: "常時対応",
    description: "24時間365日サーバーは常に稼働しており、いつでも、通報を受け付け、迅速に家族へ通知します。",
    icon: <BarChartIcon className="w-6 h-6" />,
  },
  {
    title: "プライバシー保護",
    description: "収集した個人情報は厳重にデータベースに保管しています。",
    icon: <ShieldCheckIcon className="w-6 h-6" />,
  },
];

const faqItems = [
  {
    question: "本当に無料で使えるんですか？",
    answer:
      "はい！みまもりコンパスは、どなたでも完全無料でご利用いただけます。初期費用や月額料金、更新料などは一切かかりませんので、安心してお使いください。",
  },
  {
    question: "QRコードはどうやって発行できますか？",
    answer:
      "認知症の方の情報を登録すると、QRコード発行ページからダウンロードできます。シール用紙などに印刷して、衣服や持ち物に貼ってご利用ください。",
  },
  {
    question: "個人情報はちゃんと守られますか？",
    answer:
      "はい、大切な情報はしっかり保護されています。QRコード自体には個人情報は含まれず、発見者には必要最低限の情報だけが表示されます。データは暗号化され、安全に管理されていますのでご安心ください。",
  },
  {
    question: "発見した人は特別なアプリが必要ですか？",
    answer:
      "いいえ、特別なアプリは不要です！スマートフォンのカメラでQRコードを読み取るだけで、発見報告ページが開きます。",
  },
  {
    question: "家族にはどんなふうに通知が届きますか？",
    answer:
      "発見者がQRコードを読み取ると、ご家族の登録メールアドレスに通知が届きます。通知には発見された場所の位置情報が含まれています。",
  },
  {
    question: "QRコードはどこに貼るのがいいですか？",
    answer:
      "衣服の背中側や、持ち物（お財布、バッグなど）に貼るのがおすすめです。目立ちすぎない場所でも、発見者が気づきやすい位置に貼ると安心です。",
  },
  {
    question: "どの地域で利用できますか？",
    answer:
      "日本全国どこでもご利用いただけます！インターネット環境があれば、QRコードはどこでも読み取れます。海外でも技術的には使用可能ですが、日本語対応のため国内利用をおすすめします。",
  },
  {
    question: "登録できる人数に制限はありますか？",
    answer:
      "いいえ、何人でも登録できます！ご家族や親戚の方など、必要な方をすべて登録できますので、ご安心ください。",
  },
];



export default function Home() {
  return (
    <div className="flex flex-col items-center">
        <div className="text-4xl sm:text-6xl text-center mt-20 font-bold space-y-2 sm:space-y-5">
          <h1>認知症高齢者のための</h1>
          <h1>発見共有システム</h1>
        </div>

      <p className="mt-5 px-5 sm:px-0 sm:max-w-xl leading-relaxed text-center">
          みまもりコンパスは、認知症の高齢者が徘徊や行方不明になった際に、早期発見と安全な保護につなげるための見守りシステムです。
          事前に発行したQRコードを身につけておけば、万が一の際に発見者が読み取るだけで、ご家族に直接連絡が届きます。
        </p>

        <div className="flex space-x-0 sm:space-x-5 flex-col sm:flex-row mt-10">
          <Link
            className="bg-black text-white px-4 py-3 rounded-md flex space-x-2 justify-center"
            href="/sign-in"
          >
            <span>今すぐ情報登録</span>
            <MoveRight />
          </Link>
          <Link
            className="bg-white border px-4 py-3 mt-4 sm:mt-0 rounded-md"
            href="/contact"
          >
            団体導入の方はこちら
          </Link>
        </div>

      <div className="mt-20 p-10">
          <h2 className="text-3xl sm:text-5xl text-black text-center font-bold">
            たったの 1 分で<br className="sm:hidden"/>情報を登録
          </h2>
          <p className="sm:text-2xl leading-relaxed text-black text-center mt-3">
            万が一に備えて、1 分で。
          </p>
          <div className="mt-5 sm:mt-10 shadow-sm max-w-7xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-5 pt-5 sm:px-30 sm:pt-20 flex items-end rounded-xl">
            <Image
              src="/top/mimamori-compass_discovery.png"
              height={1500}
              width={1500}
              alt="イメージ"
            />
          </div>

      </div>

      <div className="mt-20 p-10">
        <h2 className="text-3xl sm:text-5xl text-black text-center font-bold">
          QRコードを<br className="sm:hidden"/>読み込んで報告
        </h2>
        <p className="sm:text-2xl leading-relaxed text-black text-center mt-5">
          発見後すぐに通知。
        </p>
        <div className="mt-5 sm:mt-10 shadow-sm max-w-7xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-5 pt-5 sm:px-30 sm:pt-20 flex items-end rounded-xl">
          <Image
            src="/top/mimamori-compass_search.png"
            height={1500}
            width={1500}
            alt="イメージ"
          />
        </div>

      </div>

      <div className="mt-20 p-10">
        <div className="px-4 py-16">
          <div className="max-w-7xl">
            <h2 className="text-3xl sm:text-5xl leading-relaxed text-black font-bold">
              手軽に始める
            </h2>
            <p className="sm:text-2xl leading-relaxed text-black ">
              手軽に、迅速に、認知症高齢者を保護
            </p>

            <Link
              className="bg-black text-white px-4 py-3 rounded-md inline-flex mt-5 space-x-2"
              href="/sign-in"
            >
              <span>今すぐ情報登録</span>
              <MoveRight />
            </Link>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="border rounded-xl p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        


        {/* <div className="mt-5 sm:mt-10 shadow-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-5 pt-5 sm:px-30 sm:pt-20 flex items-end rounded-xl">
          <Image
            src="/top/mimamori-compass_search.png"
            height={1000}
            width={1000}
            alt="イメージ"
          />
        </div> */}

      </div>
    </div >
    
  );
}