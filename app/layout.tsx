"use client";

import { metadata } from "./metadata";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Inter } from "next/font/google";
import "./globals.css";

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
      <body className={inter.className}>
        {!hideNavbar && <Navbar />}
        {children}
      </body>
    </html>
  );
}
``;
