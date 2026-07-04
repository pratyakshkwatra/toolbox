import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Toolbox - Premium Free Utilities",
  description: "A premium suite of web utilities for documents, images, and media. No registration, no tracking, just speed. Open-source and privacy-first.",
  keywords: ["pdf tools", "image converter", "video editor", "free utilities", "open source tools", "privacy tools"],
  authors: [{ name: "Pratyaksh Kwatra" }],
  openGraph: {
    title: "Toolbox - Premium Free Utilities",
    description: "Every file tool you'll ever need. Free. Open. Private.",
    url: "https://toolbox.pratyakshkwatra.com",
    siteName: "Toolbox",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/jetbrains-mono@1.0.6/css/jetbrains-mono.min.css" rel="stylesheet" />
      </head>
      <body className={`${inter.className} min-h-screen custom-scrollbar transition-colors duration-300`}>
        <Script src="https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js" strategy="beforeInteractive" />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
