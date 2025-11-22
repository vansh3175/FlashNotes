import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/app/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteURL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "FlashNotes — AI Lecture Summaries, Flashcards & Quizzes",
    template: "%s | FlashNotes",
  },
  description:
    "Upload lectures and get AI-generated summaries, flashcards and quizzes. Study smarter with FlashNotes.",
  applicationName: "FlashNotes",
  authors: [{ name: "FlashNotes" }],
  viewport: "width=device-width, initial-scale=1",
  keywords: [
    "flashnotes",
    "lecture summaries",
    "ai summaries",
    "flashcards",
    "quiz",
    "study",
  ],
  openGraph: {
    title: "FlashNotes — AI Lecture Summaries",
    description:
      "Upload lectures and get AI-generated summaries, flashcards and quizzes. Study smarter with FlashNotes.",
    url: siteURL,
    siteName: "FlashNotes",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlashNotes — AI Lecture Summaries",
    description:
      "Upload lectures and get AI-generated summaries, flashcards and quizzes. Study smarter with FlashNotes.",
    images: [`${siteURL}/og-image.png`],
  },
  metadataBase: new URL(siteURL),
  alternates: {
    canonical: siteURL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-50 dark:bg-gray-900` }
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster position="top-center"/>
            <Providers>
              {children}
            </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
