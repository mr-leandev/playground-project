"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, Chip } from "../../(shell)/shell";

const categories = [
  { key: "material", label: "Material" },
  { key: "measurement", label: "Measurement" },
  { key: "machine", label: "Machine" },
  { key: "environment", label: "Environment" },
  { key: "people", label: "People" },
  { key: "process", label: "Process" },
] as const;

type Cause = { category: string; note: string };

export function AlertDetailClient({ id }: { id: string }) {
  const [causes, setCauses] = useState<Cause[]>([]);
  const [severity, setSeverity] = useState<"info" | "warning" | "critical">("warning");
  const [observations, setObservations] = useState<string>("");

  // Load existing analysis from stub
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/alerts/${id}/analysis`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!active) return;
        setSeverity(data.severity ?? "warning");
        setObservations(data.output ?? "");
        const f = data.factors || {};
        const entries = Object.entries(f) as Array<[string, string]>;
        setCauses(entries.filter(([, v]) => v).map(([k, v]) => ({ category: k, note: v })));
      } catch {
        // ignore
      }
    })();
    return () => { active = false; };
  }, [id]);

  const save = async () => {
    const payload = {
      severity,
      output: observations,
      factors: causes.reduce<Record<string, string>>((acc, c) => { if (c.note) acc[c.category] = c.note; return acc; }, {}),
    };
    await fetch(`/api/alerts/${id}/analysis`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  const addCause = (category: string) => setCauses((c) => [...c, { category, note: "" }]);
  const updateCause = (idx: number, note: string) => setCauses((c) => c.map((x, i) => (i === idx ? { ...x, note } : x)));
  const removeCause = (idx: number) => setCauses((c) => c.filter((_, i) => i !== idx));

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Alert #{id}</h1>
              <p className="text-[var(--muted-foreground)]">Series: Items Count — Breach of UCL</p>
            </div>
            <Chip className="text-xs">{severity}</Chip>
          </div>
          <div className="mt-4 rounded-xl bg-[var(--surface-2)] p-3 border border-[var(--border)] h-[200px]">Chart placeholder</div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold">Fishbone (Ishikawa) Analysis</h2>
          <p className="text-[var(--muted-foreground)] mt-1">Capture root causes across the 6 factors of production.</p>

          <div className="mt-4">
            <label className="text-sm font-medium">Output (general observations)</label>
            <textarea
              placeholder="Summarize the observed outcome/event."
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3"
              rows={3}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
            />
          </div>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            {categories.map((c) => (
              <button key={c.key} onClick={() => addCause(c.key)} className="px-3 py-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-left">Add cause in {c.label}</button>
            ))}
          </div>

          {causes.length > 0 && (
            <div className="mt-4 grid gap-3">
              {causes.map((c, idx) => (
                <div key={idx} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3">
                  <div className="flex items-center justify-between">
                    <b className="text-sm">{categories.find((x) => x.key === c.category)?.label}</b>
                    <button onClick={() => removeCause(idx)} className="text-sm text-[var(--muted-foreground)]">Remove</button>
                  </div>
                  <textarea
                    placeholder="Describe the contributing factor..."
                    className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2"
                    rows={3}
                    value={c.note}
                    onChange={(e) => updateCause(idx, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <Link href="/alerts" className="px-4 py-2 rounded-full border border-[var(--border)]">Back</Link>
            <button onClick={save} className="px-4 py-2 rounded-full bg-black text-white">Save analysis</button>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="font-semibold">Meta</h3>
          <div className="mt-2 grid gap-1 text-sm">
            <div><b>Detected</b>: 2025-08-10</div>
            <div><b>Chart</b>: Items Count</div>
            <div><b>Point</b>: 2025-08-09</div>
            <div><b>Value</b>: 124</div>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold">Actions</h3>
          <div className="mt-2 grid gap-2">
            <button onClick={() => setSeverity("info")} className="px-3 py-2 rounded-full border border-[var(--border)]">Mark as info</button>
            <button onClick={() => setSeverity("warning")} className="px-3 py-2 rounded-full border border-[var(--border)]">Mark as warning</button>
            <button onClick={() => setSeverity("critical")} className="px-3 py-2 rounded-full border border-[var(--border)]">Mark as critical</button>
          </div>
        </Card>
      </div>
    </div>
  );
}


