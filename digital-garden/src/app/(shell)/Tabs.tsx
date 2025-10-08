"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type Tab = { href: string; label: string };

export function Tabs({ tabs }: { tabs: Tab[] }) {
  const pathname = usePathname() || "";
  return (
    <div role="tablist" aria-label="Page tabs" className="flex items-center gap-1 mt-2">
      {tabs.map((t) => {
        const active = pathname === t.href || pathname.startsWith(t.href + "/");
        return (
          <Link
            key={t.href}
            href={t.href}
            role="tab"
            aria-selected={active}
            className={
              "px-3 py-2 rounded-full text-sm border " +
              (active
                ? "bg-black text-white border-transparent"
                : "bg-[var(--surface)] hover:bg-[var(--surface-2)] border-[var(--border)]")
            }
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}


