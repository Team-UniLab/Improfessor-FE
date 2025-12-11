import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import GAProvider from "./ga-provider";
import Script from "next/script";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "내가 교수님",
  description: "AI 기반 학습문제 생성 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
  <Script
    async
    src="https://www.googletagmanager.com/gtag/js?id=G-JPHYW9NPWN"
  />

  <Script id="ga-init">
    {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-JPHYW9NPWN');
    `}
  </Script>
</head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased
          bg-white text-gray-900 dark:bg-gray-900 dark:text-white
          transition-colors duration-200`}
      >
        {/* 페이지뷰 자동 전송 */}
        <Suspense fallback={null}>
          <GAProvider />
           </Suspense>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
