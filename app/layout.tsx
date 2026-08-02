import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import React, { Suspense } from "react";
import { AuthProvider } from "@/providers/AuthProvider";
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
  title: "Digital Village ERP",
  description: "Aplikasi Tata Kelola Desa Berbasis Digital & Transparan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50">
        <AuthProvider>
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center text-xs text-slate-400 font-medium">
                Memuat Sistem Digital Village...
              </div>
            }
          >
            {children}
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}

