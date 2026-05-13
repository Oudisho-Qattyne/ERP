import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppLayoutClient } from "./AppLayout.client";
import "./globals.css";
import { InfrastructureProvider } from "@/modules/shared/infrastructure/InfrastructureProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "حسياء - نظام الإدارة الموحد",
  description: "المدينة الصناعية في حسياء – ERP + CRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
      <InfrastructureProvider>
          <AppLayoutClient>{children}</AppLayoutClient>
        </InfrastructureProvider>
      </body>
    </html>
  );
}