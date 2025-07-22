import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import ReduxProvider from "@/store/reduxProvider";
import AuthEffectClient from "@/components/authenEffect/AuthenEffect";
import "@/utils/fontAwesome";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MIB Studio",
  description: "Professional Architectural & Construction Services",
  icons: {
    icon: "/mib_logo.ico",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
        style={{ backgroundColor: "white" }}
      >
        <ReduxProvider>
          <AuthEffectClient />
          <main className="bg-white">
            {children}
          </main>
        </ReduxProvider>
      </body>
    </html>
  );
}
