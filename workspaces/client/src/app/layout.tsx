"use client";

import { SocketManagerProvider } from "@/websocket/SocketManagerProvider";
import "./globals.css";
import { Inter } from "next/font/google";
import { RecoilRoot } from "recoil";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RecoilRoot>
          <SocketManagerProvider>{children}</SocketManagerProvider>
        </RecoilRoot>
      </body>
    </html>
  );
}
