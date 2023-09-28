import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/styles/globals.css";

import ThemeProvider from "@/components/ThemeProvider";
import Providers from "@/components/Providers";
import Navbar from "../components/header/Navbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tabnews - CLONE",
  description: "Clone do tabnews para estudo",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-Br" className={inter.className}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Providers>
            <Navbar />
            <div className="py-4">{children}</div>
          </Providers>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
