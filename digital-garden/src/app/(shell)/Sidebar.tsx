"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav";
import { ChartLine, Database, LayoutDashboard, Bell, BookOpen, Users, ReceiptText, Settings, HelpCircle } from "lucide-react";

type SidebarProps = {
  variant?: "inline" | "drawer";
  onNavigate?: () => void;
  collapsed?: boolean;
};

export function Sidebar({ variant = "inline", onNavigate, collapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const idToIcon: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    charts: ChartLine,
    data: Database,
    datasets: LayoutDashboard,
    alerts: Bell,
    study: BookOpen,
    team: Users,
    billing: ReceiptText,
    settings: Settings,
    help: HelpCircle,
  };
  return (
    <nav
      aria-label="Primary"
      className={
        variant === "inline"
          ? (collapsed
              ? "fixed left-4 top-20 w-16 shrink-0 p-3 rounded-3xl bg-[var(--surface)]/90 border border-[var(--border)] hidden md:block"
              : "fixed left-4 top-20 w-60 shrink-0 p-3 rounded-3xl bg-[var(--surface)]/90 border border-[var(--border)] hidden md:block")
          : "w-[84vw] max-w-[320px] p-3 rounded-r-3xl bg-[var(--surface)]/95 border-r border-[var(--border)] h-full"
      }
    >
      <ul className="grid gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = idToIcon[item.id] ?? ChartLine;
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-sm border whitespace-nowrap overflow-hidden " +
                  (isActive
                    ? "bg-black text-white border-transparent"
                    : "bg-[var(--surface)] hover:bg-[var(--surface-2)] border-[var(--border)]")
                }
              >
                <Icon size={18} className="opacity-80" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}


