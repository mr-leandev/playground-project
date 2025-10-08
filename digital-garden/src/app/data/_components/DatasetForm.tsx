"use client";

import { useState } from "react";
import { createClient } from "../../../lib/supabase/client";

type Area = { id: string; name: string };

export default function DatasetForm({ areas, onCreated }: { areas: Area[]; onCreated?: () => void }) {
  const [name, setName] = useState("");
  const [areaId, setAreaId] = useState<string>(areas[0]?.id || "");
  const [type, setType] = useState<string>("value");
  const [unit, setUnit] = useState<string>("");
  const [gran, setGran] = useState<string>("day");
  const [tz, setTz] = useState<string>("UTC");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!name || !areaId) return;
    setBusy(true);
    const supabase = createClient();
    await supabase.from("datasets").insert({ name, area_id: areaId, type, unit, granularity: gran, tz, meta: {} });
    setBusy(false);
    setName("");
    if (onCreated) onCreated();
  }

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3">
      <h2 className="text-xl font-semibold">New dataset</h2>
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2" value={name} onChange={(e)=>setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">Area</label>
          <select className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2" value={areaId} onChange={(e)=>setAreaId(e.target.value)}>
            {areas.map(a=> <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Type</label>
          <select className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2" value={type} onChange={(e)=>setType(e.target.value)}>
            <option value="value">single value per period</option>
            <option value="proportion">percent yes (numerator/denominator)</option>
            <option value="count">event count</option>
            <option value="rate">rate per exposure (numerator/denominator)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Unit</label>
          <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2" value={unit} onChange={(e)=>setUnit(e.target.value)} placeholder="e.g., items, %" />
        </div>
        <div>
          <label className="block text-sm font-medium">Granularity</label>
          <div className="flex gap-2">
            {["minute","hour","day","week"].map(g => (
              <button key={g} onClick={()=>setGran(g)} className={`px-3 py-2 rounded-full text-sm ${gran===g?"bg-black text-white":"bg-[var(--surface)] border border-[var(--border)]"}`}>{g}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Timezone</label>
          <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2" value={tz} onChange={(e)=>setTz(e.target.value)} placeholder="UTC" />
        </div>
      </div>
      <button disabled={busy} onClick={submit} className="px-4 py-2 rounded-xl bg-black text-white">{busy?"Saving...":"Create dataset"}</button>
    </div>
  );
}


