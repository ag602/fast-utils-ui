import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { defaultMetadata } from "./seo.config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
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
