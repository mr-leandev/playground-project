"use client";

import { useState } from "react";
import { createClient } from "../../../lib/supabase/client";

type Series = { id: string; name: string; unit?: string | null };

export default function AddSeriesForm({
  datasetId,
  onCreated,
}: {
  datasetId: string;
  onCreated: (series: Series) => void;
}) {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [busy, setBusy] = useState(false);
  const supabase = createClient();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    const { data, error } = await supabase
      .from("series")
      .insert({ dataset_id: datasetId, name: name.trim(), unit: unit.trim() || null })
      .select("id, name, unit")
      .single();
    setBusy(false);
    if (error || !data) {
      console.error("[series] create error", { datasetId, error });
      alert(error.message);
      return;
    }
    setName("");
    setUnit("");
    onCreated(data as Series);
  }

  return (
    <form onSubmit={submit} className="mt-2 flex flex-col gap-2">
      <input
        placeholder="Series name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded border px-2 py-1 bg-transparent"
      />
      <input
        placeholder="Unit (optional)"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        className="rounded border px-2 py-1 bg-transparent"
      />
      <div className="flex gap-2">
        <button disabled={busy} className="px-3 py-1 rounded bg-[var(--foreground)] text-[var(--background)] text-sm disabled:opacity-60">
          {busy ? "Creating…" : "Create"}
        </button>
      </div>
    </form>
  );
}


