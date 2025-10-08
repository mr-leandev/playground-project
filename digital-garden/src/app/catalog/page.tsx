"use client";

import { useEffect, useState } from "react";
import { Card } from "../(shell)/shell";
import { ChartType, GoalOrientation, Granularity } from "@/src/lib/contracts/charts";
import { createClient } from "../../lib/supabase/client";

const TYPES: { id: ChartType; name: string; blurb: string }[] = [
  { id: "i", name: "I (Individuals)", blurb: "One number each period (e.g., items produced today, takt time)." },
  { id: "xbar-r", name: "X̄–R (small sample averages)", blurb: "Take a few readings per period; track the average and spread." },
  { id: "p", name: "p (percent yes)", blurb: "Percent of items that meet a condition when sample size can change." },
  { id: "np", name: "np (count yes)", blurb: "Count of items that meet a yes/no condition with constant sample size." },
  { id: "c", name: "c (event count)", blurb: "Count of events per fixed exposure (e.g., interruptions per shift)." },
  { id: "u", name: "u (rate per unit)", blurb: "Events per unit when exposure varies (e.g., incidents per 1,000 units or per hour)." },
];

export default function CatalogPage() {
  const [selected, setSelected] = useState<ChartType>("i");
  const [title, setTitle] = useState<string>("My Chart");
  const [subtitle, setSubtitle] = useState<string>("");
  const [sigma, setSigma] = useState<number>(1.5);
  const [goal, setGoal] = useState<GoalOrientation>("down");
  const [gran, setGran] = useState<Granularity>("day");
  const [subgroupSize, setSubgroupSize] = useState<number>(5);
  const [areas, setAreas] = useState<{ id: string; name: string }[]>([]);
  const [areaId, setAreaId] = useState<string>("");
  const [newArea, setNewArea] = useState<string>("");
  const [items, setItems] = useState<any[]>([]);
  const [datasets, setDatasets] = useState<{ id: string; name: string }[]>([]);
  const [datasetId, setDatasetId] = useState<string>("");

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: a } = await supabase.from("areas").select("id,name").order("name");
      setAreas(a || []);
      if (!areaId && a && a.length) setAreaId(a[0].id);
    })();
  }, []);

  useEffect(() => {
    const supabase = createClient();
    if (!areaId) return;
    (async () => {
      const { data } = await supabase.from("charts").select("*").eq("area_id", areaId).order("created_at", { ascending: false });
      setItems(data || []);
      const { data: ds } = await supabase.from("datasets").select("id,name").eq("area_id", areaId).order("name");
      setDatasets(ds || []);
      if (ds && ds.length) setDatasetId(ds[0].id);
    })();
  }, [areaId]);

  async function addArea() {
    if (!newArea.trim()) return;
    const supabase = createClient();
    const { data, error } = await supabase.from("areas").insert({ name: newArea.trim() }).select("id,name").single();
    if (!error && data) {
      setAreas((prev) => [data, ...prev]);
      setAreaId(data.id);
      setNewArea("");
    }
  }

  async function addChart() {
    if (!areaId) return;
    const supabase = createClient();
    const payload = {
      title,
      subtitle: subtitle || null,
      type: selected,
      sigma,
      goal,
      granularity: gran,
      subgroup_size: selected === "xbar-r" ? subgroupSize : null,
      area_id: areaId,
      dataset_id: datasetId || null,
      config: {},
    };
    await supabase.from("charts").insert(payload);
    const { data } = await supabase.from("charts").select("*").eq("area_id", areaId).order("created_at", { ascending: false });
    setItems(data || []);
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold">Chart Catalog</h1>
        <p className="text-[var(--muted-foreground)] mt-2">Pick a chart, set defaults (sigma, goal, granularity), and save it to your catalog. We’ll use these to build dashboards and define data needs.</p>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="block text-sm font-medium">Title</label>
            <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
            <label className="block text-sm font-medium mt-3">Subtitle</label>
            <input className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
            <label className="block text-sm font-medium mt-3">Area</label>
            <div className="flex gap-2 flex-wrap items-center">
              <select className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2" value={areaId} onChange={(e)=>setAreaId(e.target.value)}>
                <option value="">Select an area</option>
                {areas.map((a)=> (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              <input placeholder="New area" className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2" value={newArea} onChange={(e)=>setNewArea(e.target.value)} />
              <button onClick={addArea} className="px-3 py-2 rounded-xl border border-[var(--border)]">Add</button>
            </div>
            {areaId && (
              <div className="mt-3">
                <label className="block text-sm font-medium">Dataset</label>
                <select className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2" value={datasetId} onChange={(e)=>setDatasetId(e.target.value)}>
                  {datasets.length === 0 ? <option value="">No datasets in area</option> : null}
                  {datasets.map((d)=> (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            )}
            <label className="block text-sm font-medium mt-3">Chart type</label>
            <div className="grid grid-cols-2 gap-2">
              {TYPES.map((t) => (
                <button key={t.id} onClick={() => setSelected(t.id)} className={`text-left rounded-xl border px-3 py-2 ${selected===t.id?"bg-black text-white border-transparent":"bg-[var(--surface)] border-[var(--border)]"}`}>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-[var(--muted-foreground)] text-xs">{t.blurb}</div>
                </button>
              ))}
            </div>
            {selected === "xbar-r" && (
              <div className="mt-3">
                <label className="block text-sm font-medium">Subgroup size</label>
                <input type="number" min={2} max={10} value={subgroupSize} onChange={(e)=>setSubgroupSize(Number(e.target.value))} className="w-32 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2" />
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-sm">
              <div className="font-medium mb-1">Which chart should I pick?</div>
              <ul className="list-disc ml-5 text-[var(--muted-foreground)]">
                <li>One number each period → I chart</li>
                <li>2–5 quick readings per period → X̄–R</li>
                <li>Yes/No outcomes with changing sample sizes → p chart</li>
                <li>Yes/No outcomes with fixed sample size → np chart</li>
                <li>Counting events in a fixed exposure → c chart</li>
                <li>Rate: events per varying exposure (per unit, per hour) → u chart</li>
              </ul>
            </div>
            <label className="block text-sm font-medium">Sigma (control width)</label>
            <div className="flex gap-2">
              {[1,1.5,2,3].map((s)=>(
                <button key={s} onClick={()=>setSigma(s)} className={`px-3 py-2 rounded-full text-sm ${sigma===s?"bg-black text-white":"bg-[var(--surface)] border border-[var(--border)]"}`}>{s}σ</button>
              ))}
            </div>
            <label className="block text-sm font-medium mt-3">Goal</label>
            <div className="flex gap-2">
              {(["up","down"] as GoalOrientation[]).map((g)=>(
                <button key={g} onClick={()=>setGoal(g)} className={`px-3 py-2 rounded-full text-sm ${goal===g?"bg-black text-white":"bg-[var(--surface)] border border-[var(--border)]"}`}>{g === "up"?"Up is good":"Down is good"}</button>
              ))}
            </div>
            <label className="block text-sm font-medium mt-3">Granularity</label>
            <div className="flex gap-2">
              {(["minute","hour","day","week"] as Granularity[]).map((g)=>(
                <button key={g} onClick={()=>setGran(g)} className={`px-3 py-2 rounded-full text-sm capitalize ${gran===g?"bg-black text-white":"bg-[var(--surface)] border border-[var(--border)]"}`}>{g}</button>
              ))}
            </div>
            <button onClick={addChart} className="mt-4 px-4 py-2 rounded-xl bg-black text-white">Add to catalog</button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold">Saved Charts</h2>
        <div className="mt-3 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((it) => (
            <div key={it.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">{it.title}</div>
                {it.subtitle && <div className="text-sm">{it.subtitle}</div>}
                <div className="text-xs text-[var(--muted-foreground)] mt-1">{String(it.type).toUpperCase()} • {it.sigma}σ • {it.goal === "up"?"Up is good":"Down is good"} • {it.granularity}</div>
              </div>
              <button onClick={async()=>{const s=createClient(); await s.from('charts').delete().eq('id', it.id); const {data}=await s.from('charts').select('*').eq('area_id', areaId).order('created_at',{ascending:false}); setItems(data||[]);}} className="px-2 py-1 rounded-lg text-xs border border-[var(--border)]">Delete</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}


