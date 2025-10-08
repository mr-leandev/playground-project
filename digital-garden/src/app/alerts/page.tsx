import Link from "next/link";
import { Card, Chip } from "../(shell)/shell";
import { Tabs } from "../(shell)/Tabs";
import { EmptyState } from "../(shell)/states";

export default function AlertsPage() {
  const items = Array.from({ length: 8 }).map((_, i) => ({
    title: `Rule violation on Items Count (${i + 1})`,
    severity: ["info", "warning", "critical"][i % 3],
    time: new Date(Date.now() - i * 36e5).toLocaleString(),
  }));

  return (
    <div className="space-y-6">
      <Tabs tabs={[{ href: "/alerts", label: "Alerts" }, { href: "/study", label: "Study" }]} />
      {items.length === 0 ? (
        <EmptyState title="No alerts right now." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((it, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-center justify-between">
                <Link href={`/alerts/${i + 1}`} className="font-semibold hover:underline">
                  {it.title}
                </Link>
                <Chip className="text-xs">{it.severity}</Chip>
              </div>
              <p className="text-[var(--muted-foreground)] mt-1">{it.time}</p>
              <div className="mt-3 rounded-xl bg-[var(--surface-2)] p-3 border border-[var(--border)]">
                Sparkline placeholder
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


