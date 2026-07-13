import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ForgeOS - Build and operate an AI company in minutes",
  description: "ForgeOS converts a business goal into a coordinated team of AI employees that research a market, design a product, discover prospects, prepare campaigns, request human approval, and produce an investor-ready company plan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      style={{ colorScheme: 'dark' }}
    >
      <body className="min-h-full flex bg-zinc-950 text-zinc-100 font-sans">
        <div className="flex w-full min-h-screen">
          <AppSidebar />
          <main className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen relative">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

