"use client";

import { SocketManagerProvider } from "@/websocket/SocketManagerProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { RecoilRoot } from "recoil";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "YAMB!",
  description: "Yet Another yamb game!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RecoilRoot>
          <SocketManagerProvider>{children} </SocketManagerProvider>
        </RecoilRoot>
      </body>
    </html>
  );
}
