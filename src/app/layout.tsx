import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "../components/layout/ClientLayout";
import Script from "next/script";
import ClientQRCode from "../components/layout/ClientQRCode";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Snap - Quick Commerce",
  description: "Your quick commerce solution for everyday needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Force bootstrap script to load properly */}
        <Script
          id="next-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.__NEXT_DATA__ = window.__NEXT_DATA__ || {};`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen max-w-md mx-auto`}
      >
        <ClientLayout>{children}</ClientLayout>
        <ClientQRCode />
        <Toaster />
      </body>
    </html>
  );
}
