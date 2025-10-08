import Link from "next/link";
import { Card } from "../(shell)/shell";
import { Tabs } from "../(shell)/Tabs";
import { EmptyState } from "../(shell)/states";

export default function StudyPage() {
  return (
    <div className="space-y-6">
      <Tabs tabs={[{ href: "/alerts", label: "Alerts" }, { href: "/study", label: "Study" }]} />
      <Card className="p-6">
        <h1 className="text-2xl font-semibold">Study</h1>
        <p className="text-[var(--muted-foreground)] mt-2">A workspace for analyses and continuous improvement artifacts (PDSA ‘Study’).</p>
        <div className="mt-4 grid gap-3">
          <Link href="/alerts/1" className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 hover:bg-[var(--surface)]">Example alert analysis →</Link>
          <Link href="/study/skills" className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 hover:bg-[var(--surface)]">Critical skills matrix (radar) →</Link>
        </div>
      </Card>
    </div>
  );
}


