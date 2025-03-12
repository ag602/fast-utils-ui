import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "FastUtils - All-in-one Utility Hub",
  description: "A comprehensive suite of tools for JSON formatting, video editing, audio manipulation, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen bg-background`}
      >
        <Navbar />
        <main className="container py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
