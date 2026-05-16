import type { Metadata } from "next";
import { Tajawal, Noto_Sans_Arabic } from "next/font/google";
import { AppLayoutClient } from "./AppLayout.client";
import "./globals.css";
import { InfrastructureProvider } from "@/modules/shared/infrastructure/InfrastructureProvider";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
});

const noto = Noto_Sans_Arabic({
  variable: "--font-noto",
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "حسياء - نظام الإدارة الموحد",
  description: "المدينة الصناعية في حسياء – ERP + CRM",
};

import { ThemeProvider } from "@/modules/shared/presentation/context/ThemeContext";
import { LanguageProvider } from "@/modules/shared/presentation/context/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${noto.variable} ${tajawal.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-text transition-colors duration-300">
        <InfrastructureProvider>
          <LanguageProvider>
            <ThemeProvider>
              <AppLayoutClient>{children}</AppLayoutClient>
            </ThemeProvider>
          </LanguageProvider>
        </InfrastructureProvider>
      </body>
    </html>
  );
}