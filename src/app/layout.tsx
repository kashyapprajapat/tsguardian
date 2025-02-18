import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "TSGuardian 💂🏻",
  description: "Your AI-Powered TypeScript Code Analyst 🚀.AI AGENT",
  keywords: "AI TypeScript Analyzer, TypeScript AI Code Analysis, AI-powered TypeScript Code Optimization, AI TypeScript Code Formatter, TypeScript Code Analyzer, AI Code Optimization Tool, TypeScript Debugging AI, TypeScript Error Detection AI, AI for TypeScript Developers, AI TypeScript Linter, TypeScript Code Review AI, Automated TypeScript Analysis, TypeScript Code Improvement AI, AI Code Insights for TypeScript, AI TypeScript Development Tools, Code Optimization with AI, TSGuardian TypeScript Analyzer, TypeScript Performance Optimizer, AI-powered TS Code Insights, Improve TypeScript Code Quality, TypeScript AI Assistant, AI TypeScript Code Refactor, AI Code Analysis for TypeScript, Intelligent TypeScript Code Analyzer, TypeScript Code Quality AI, AI TypeScript Coding Assistant, TypeScript Linting with AI, AI-driven TypeScript Code Editor, Optimizing TypeScript with AI, AI for TypeScript Developers 2025, Smart TypeScript Analyzer, Advanced TypeScript Code Analyzer, TypeScript Code Suggestions AI, Code Refactor AI for TypeScript, AI-based TypeScript Debugging Tools, Automated TypeScript Code Review, AI-enhanced TypeScript Code Performance, TypeScript Code Metrics AI, Code Syntax Checker for TypeScript, AI Tools for TypeScript Development",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "TSGuardian - AI TypeScript Analyzer",
    description: "Analyze and optimize your TypeScript code using AI.",
    url: "https://tsguardian.vercel.app/", 
    siteName: "TSGuardian",
    images: [
      {
        url: 'public\android-chrome-192x192.png', 
        width: 1200,
        height: 630,
        alt: "TSGuardian is AI TypeScript Analyzer Agent.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TSGuardian - AI TypeScript Analyzer Agent.",
    description: "Analyze and optimize your TypeScript code using AI.",
    images: ["public\android-chrome-192x192.png"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
