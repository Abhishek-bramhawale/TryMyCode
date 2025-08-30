import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from 'next/font/google'
import "./globals.css";
import Header from '@/components/header'
import { ThemeProvider } from '@/components/theme-provider'
import { HydrationProvider } from '@/components/hydration-provider'

const inter = Inter({ subsets: ['latin'] })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Collaborative Code Editor",
  description: "Real-time collaborative code editing web app by Abhi b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <HydrationProvider>
            <div className="min-h-screen bg-background">
              {children}
            </div>
          </HydrationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
