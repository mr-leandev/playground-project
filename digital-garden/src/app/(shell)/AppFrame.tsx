"use client";

import { useEffect, useState } from "react";
import HeaderClient from "./HeaderClient";
import { Sidebar } from "./Sidebar";
import { Breadcrumbs } from "./Breadcrumbs";

export default function AppFrame({ children, rightSlot }: { children: React.ReactNode; rightSlot?: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem("sidebarCollapsed");
    if (stored) setCollapsed(stored === "1");
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  return (
    <>
      <HeaderClient rightSlot={rightSlot} onToggleSidebar={() => setCollapsed((v) => !v)} sidebarCollapsed={collapsed} />
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1280px] px-4 py-4 text-[var(--foreground)] flex gap-4">
          <Sidebar variant="inline" collapsed={collapsed} />
          <div className="flex-1 min-w-0">
            <Breadcrumbs />
            {children}
          </div>
        </div>
      </div>
    </>
  );
}


