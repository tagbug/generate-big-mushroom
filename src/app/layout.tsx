import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import localFont from 'next/font/local'; // 引入 localFont
import I18nProvider from "./i18n-provider";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const geistSans = localFont({
  src: '../fonts/Geist[wght].ttf',
  variable: '--font-geist-sans',
});

const geistMono = localFont({
  src: '../fonts/GeistMono[wght].ttf',
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: '合成大蘑菇',
  description: '合成大蘑菇',
  openGraph: {
    title: '合成大蘑菇',
    description: '合成大蘑菇',
    url: 'https://generate-big-mushroom.vercel.app/',
    siteName: '合成大蘑菇',
    locale: 'zh_CN',
    type: 'website',
    images: [
      {
        url: 'https://generate-big-mushroom.vercel.app/icon.png',
        width: 512,
        height: 512,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '合成大蘑菇',
    description: '合成大蘑菇',
    images: ['https://generate-big-mushroom.vercel.app/icon.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
