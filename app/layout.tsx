import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google"; // ✅ built-in import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskFlow AI",
  description: "Your Intelligent Task Management Hub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
