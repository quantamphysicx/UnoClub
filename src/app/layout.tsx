import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GameProvider } from "@/context/GameContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UNO CLUB — Your friends. Your cards. Your chaos.",
  description: "A premium private multiplayer card game. Create a private room, share your invite code, and play Classic UNO with friends in real-time.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0B0C10] text-[#F3F4F6] selection:bg-[#7C3AED]/30 selection:text-white">
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  );
}
