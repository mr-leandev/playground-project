import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { ChartLine, LayoutDashboard, Settings, Bell, Database, Users, ReceiptText, HelpCircle, BookOpen } from "lucide-react";
import { NAV_ITEMS } from "./(shell)/nav";
import AppFrame from "./(shell)/AppFrame";
import "./globals.css";
import { ThemeToggle } from "./(shell)/ThemeToggle";
import UserMenu from "./(shell)/UserMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeanCharts — SPC Dashboard",
  description: "A relaxing, world-class mock SaaS UI for SPC dashboards",
};

function NavLink({ href, label, icon: Icon }: { href: string; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 px-3 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition">
      <Icon size={18} className="opacity-70" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-orange-500 via-rose-400 to-blue-600 min-h-[100svh]`}>        
        <AppFrame rightSlot={<UserMenu />}>{children}</AppFrame>
      </body>
    </html>
  );
}
