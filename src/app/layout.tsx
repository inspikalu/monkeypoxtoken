import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SolanaProviders } from './providers'
import { Toaster } from 'react-hot-toast';
import NavBar from "@/components/NavBar";
import React from "react";
import motion from "framer-motion"
import Background from "@/components/Background";
import Footer from "@/components/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "MoonLambo",
  description: "MoonLambo is a platform featuring the Astro NFT collection and the $MOONL token, built around the MPL 404 program for a gamified Solana ecosystem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-blue-950`}
      >
        <SolanaProviders>
          <Toaster position="top-right" />
          <NavBar />
          <div className="mt-[4rem]"></div>
          <Background />
          {children}
          <Footer />
        </SolanaProviders>
      </body>
    </html>
  );
}
