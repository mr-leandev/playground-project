import { Card, Chip } from "../(shell)/shell";

export default function BillingPage() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="p-6 md:col-span-2">
        <h2 className="text-xl font-semibold">Invoices</h2>
        <div className="mt-4 grid gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-[var(--surface-2)] p-3 border border-[var(--border)] flex items-center justify-between">
              <span className="text-[var(--muted-foreground)]">INV-00{i + 1}</span>
              <span>$ {(99 + i * 5).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-6">
        <h2 className="text-xl font-semibold">Plan</h2>
        <p className="opacity-70 mt-1">Professional</p>
        <div className="mt-3 flex gap-2">
          <Chip className="text-xs">10 users</Chip>
          <Chip className="text-xs">100 datasets</Chip>
        </div>
        <button className="mt-4 px-4 py-2 rounded-full bg-black text-white">Manage</button>
      </Card>
    </div>
  );
}


