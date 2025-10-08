import { cn } from "./shell";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-[var(--surface-2)]", className)} />;
}

export function EmptyState({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
      <p className="text-[var(--muted-foreground)]">{title}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
      <p className="text-red-600">{message}</p>
      {retry && (
        <button onClick={retry} className="mt-3 px-4 py-2 rounded-full bg-black text-white">
          Retry
        </button>
      )}
    </div>
  );
}


