import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Free AI Humanizer – Make AI Text Sound Human",
  description:
    "Transform AI-generated content into natural, human-like text. Support text input and document upload (PDF/PPT/DOCX/TXT). 100% free and easy to use.",
  openGraph: {
    title: "Free AI Humanizer – Make AI Text Sound Human",
    description:
      "Transform AI-generated content into natural, human-like text. Support text input and document upload (PDF/PPT/DOCX/TXT). 100% free and easy to use.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Humanizer – Make AI Text Sound Human",
    description:
      "Transform AI-generated content into natural, human-like text. Support text input and document upload (PDF/PPT/DOCX/TXT). 100% free and easy to use.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

