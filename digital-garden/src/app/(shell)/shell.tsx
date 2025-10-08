"use client";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...classes: Array<string | undefined | false | null>) {
  return twMerge(clsx(classes));
}

export function Card(props: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-[var(--surface)]/95 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.35)] border border-[var(--border)] backdrop-saturate-150",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

export function Toolbar(props: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex items-center gap-2 p-2 rounded-full bg-[var(--surface)]/90 border border-[var(--border)] shadow", props.className)}>
      {props.children}
    </div>
  );
}

export function Chip(props: { active?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <button
      className={cn(
        "px-3 py-1.5 rounded-full text-sm transition border",
        props.active
          ? "bg-black text-white border-[var(--border)]"
          : "bg-[var(--surface)] hover:bg-[var(--surface-2)] border-[var(--border)]",
        props.className
      )}
    >
      {props.children}
    </button>
  );
}


