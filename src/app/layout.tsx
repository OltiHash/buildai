import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "BuildAI — Build websites with AI",
    template: "%s | BuildAI",
  },
  description:
    "Describe your idea. Get a complete website instantly. Edit, preview, and deploy with AI-powered tools.",
  keywords: ["AI website builder", "website generator", "no-code", "AI coding"],
  authors: [{ name: "BuildAI" }],
  openGraph: {
    title: "BuildAI — Build websites with AI",
    description: "Describe your idea. Get a complete website instantly.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-[#050505] text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
