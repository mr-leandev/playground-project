"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  spc: "Charts",
  data: "Data",
  datasets: "Datasets",
  alerts: "Alerts",
  study: "Study",
  team: "Team",
  billing: "Billing",
  settings: "Settings",
  help: "Help",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = (pathname || "/").split("/").filter(Boolean);
  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label = LABELS[seg] || decodeURIComponent(seg);
    return { href, label };
  });

  if (crumbs.length === 0) return null;

  return (
    <div className="text-sm text-[var(--muted-foreground)] flex items-center gap-2" aria-label="Breadcrumb">
      <Link href="/" className="hover:underline">Home</Link>
      {crumbs.map((c, i) => (
        <span key={c.href} className="flex items-center gap-2">
          <span>/</span>
          {i < crumbs.length - 1 ? (
            <Link href={c.href} className="hover:underline">{c.label}</Link>
          ) : (
            <span aria-current="page" className="font-medium text-[var(--foreground)]">{c.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}


