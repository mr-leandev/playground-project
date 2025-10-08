"use client";

import { useState } from "react";
import { createClient } from "../../../lib/supabase/client";

export default function AddPointForm({ datasetId, datasetType }: { datasetId: string; datasetType: string }) {
  const [ts, setTs] = useState<string>(new Date().toISOString().slice(0, 16));
  const [value, setValue] = useState<string>("");
  const [num, setNum] = useState<string>("");
  const [den, setDen] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const needsVD = datasetType === "value" || datasetType === "count";
  const needsND = datasetType === "proportion" || datasetType === "rate";

  async function addPoint() {
    const supabase = createClient();
    setBusy(true);
    await supabase.from("dataset_points").insert({
      dataset_id: datasetId,
      ts: new Date(ts).toISOString(),
      value: needsVD ? (value ? Number(value) : null) : null,
      numerator: needsND ? (num ? Number(num) : null) : null,
      denominator: needsND ? (den ? Number(den) : null) : null,
    });
    setBusy(false);
    setValue("");
    setNum("");
    setDen("");
  }

  return (
    <div className="flex flex-wrap gap-2 items-center mt-2">
      <input type="datetime-local" value={ts} onChange={(e)=>setTs(e.target.value)} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2" />
      {needsVD && (
        <input placeholder="value" value={value} onChange={(e)=>setValue(e.target.value)} className="w-28 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2" />
      )}
      {needsND && (
        <>
          <input placeholder="numerator" value={num} onChange={(e)=>setNum(e.target.value)} className="w-28 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2" />
          <input placeholder="denominator" value={den} onChange={(e)=>setDen(e.target.value)} className="w-32 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2" />
        </>
      )}
      <button disabled={busy} onClick={addPoint} className="px-3 py-2 rounded-xl border border-[var(--border)]">{busy?"Saving...":"Add point"}</button>
    </div>
  );
}


