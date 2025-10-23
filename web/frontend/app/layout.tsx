import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Free AI Humanizer - Convert AI Text to Human-Like Content | 100% Free",
  description: "Transform AI-generated text into natural, human-like content with our free AI humanizer. Bypass AI detection, improve readability, and make your content sound more authentic. Supports text and document uploads (PDF, DOCX, PPTX).",
  keywords: [
    "AI humanizer",
    "AI text humanizer",
    "free AI humanizer",
    "humanize AI text",
    "AI to human text converter",
    "bypass AI detection",
    "AI content rewriter",
    "natural text generator",
    "AI text detector bypass",
    "ChatGPT humanizer",
    "GPT text humanizer",
    "academic writing humanizer",
    "essay humanizer",
    "AI detection remover"
  ],
  authors: [{ name: "AI Humanizer Team" }],
  creator: "AI Humanizer",
  publisher: "AI Humanizer",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourdomain.com",
    siteName: "Free AI Humanizer",
    title: "Free AI Humanizer - Convert AI Text to Human-Like Content",
    description: "Transform AI-generated text into natural, human-like content. 100% free tool to bypass AI detection and improve content authenticity.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Humanizer Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Humanizer - Convert AI Text to Human-Like Content",
    description: "Transform AI-generated text into natural, human-like content. 100% free and easy to use.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://yourdomain.com",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
