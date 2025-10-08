"use client";

import Link from "next/link";
import { useState } from "react";
import { ChartLine, LayoutDashboard, Settings, Bell, Database, Users, ReceiptText, HelpCircle, BookOpen, Menu, X, ChevronsLeft, ChevronsRight } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Sidebar } from "./Sidebar";

function NavLink({ href, label, icon: Icon }: { href: string; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 px-3 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition">
      <Icon size={18} className="opacity-70" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

export default function HeaderClient({ rightSlot, onToggleSidebar, sidebarCollapsed }: { rightSlot?: React.ReactNode; onToggleSidebar?: () => void; sidebarCollapsed?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-[var(--surface)]/70 bg-[var(--surface)]/60 border-b border-[var(--border)]">
        <div className="w-full px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button aria-label="Open menu" onClick={() => setOpen(true)} className="md:hidden p-2 rounded-xl border border-[var(--border)]"><Menu size={18} /></button>
            <button aria-label="Toggle sidebar" onClick={onToggleSidebar} className="hidden md:inline-flex p-2 rounded-xl border border-[var(--border)]">
              {sidebarCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            </button>
            <Link href="/" className="font-semibold tracking-tight">charts.leandev.au</Link>
          </div>
          <nav className="hidden sm:flex items-center gap-1">
            <NavLink href="/spc" label="Charts" icon={ChartLine} />
            <NavLink href="/data" label="Data" icon={Database} />
            <NavLink href="/alerts" label="Alerts" icon={Bell} />
            <NavLink href="/study" label="Study" icon={BookOpen} />
            <NavLink href="/datasets" label="Datasets" icon={LayoutDashboard} />
            <NavLink href="/team" label="Team" icon={Users} />
            <NavLink href="/billing" label="Billing" icon={ReceiptText} />
            <NavLink href="/settings" label="Settings" icon={Settings} />
            <NavLink href="/help" label="Help" icon={HelpCircle} />
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {rightSlot}
          </div>
        </div>
      </header>

      {/* Drawer for mobile */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <button aria-label="Close menu" onClick={() => setOpen(false)} className="fixed inset-0 bg-black/40" />
          <div className="absolute left-0 top-0 bottom-0 w-[84vw] max-w-[320px] bg-[var(--surface)]/95 border-r border-[var(--border)] p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Menu</span>
              <button aria-label="Close" onClick={() => setOpen(false)} className="p-2 rounded-xl border border-[var(--border)]"><X size={16} /></button>
            </div>
            <Sidebar variant="drawer" onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}


