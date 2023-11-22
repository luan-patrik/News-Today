import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import Providers from "@/components/Providers";
import Navbar from "../components/header/Navbar";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  preload: true,
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Posts - NewsToday",
  description: "NeswToday - Seu site de noticias.",
  icons: {
    icon: "/logo.webp",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-Br" className={inter.variable}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Providers>
            <Navbar />
            {children}
          </Providers>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
