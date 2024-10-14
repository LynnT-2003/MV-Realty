"use client";

import { metadata } from "./metadata";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import { Toast } from "@/components/ui/toast";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/Profile";

  return (
    <html lang="en">
      <Head>
        {/* Ensure the title and meta description are strings */}
        <title>{String(metadata.title)}</title>
        <meta name="description" content={String(metadata.description)} />
        {/* Add other meta tags as needed */}
      </Head>
      <body className={inter.className}>
        {!hideNavbar && <Navbar />}
        {/* Ensure the ToastProvider wraps your layout */}
        {children}
      </body>
    </html>
  );
}
``;
