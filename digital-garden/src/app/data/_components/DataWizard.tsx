"use client";

import { useMemo, useState } from "react";
import { Card, Chip } from "../../(shell)/shell";

type Step = "source" | "mapping" | "validate" | "schedule" | "summary";

export function DataWizard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<Step>("source");
  const [fileName, setFileName] = useState<string>("");
  const [headers, setHeaders] = useState<string[]>(["timestamp", "value", "series", "note"]);
  const [mapping, setMapping] = useState<Record<string, string>>({ timestamp: "timestamp", value: "value" });
  const [schedule, setSchedule] = useState<"manual" | "daily" | "weekly">("manual");

  if (!open) return null;

  const proceed = () => {
    const order: Step[] = ["source", "mapping", "validate", "schedule", "summary"];
    const idx = order.indexOf(step);
    if (idx < order.length - 1) setStep(order[idx + 1]);
  };

  const back = () => {
    const order: Step[] = ["source", "mapping", "validate", "schedule", "summary"];
    const idx = order.indexOf(step);
    if (idx > 0) setStep(order[idx - 1]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-3xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">New dataset</h2>
          <button onClick={onClose} className="text-sm text-[var(--muted-foreground)]">Close</button>
        </div>

        <div className="mt-4 flex gap-2 flex-wrap">
          {(["source","mapping","validate","schedule","summary"] as Step[]).map(s => (
            <Chip key={s} active={s===step} className="text-xs capitalize">{s}</Chip>
          ))}
        </div>

        {step === "source" && (
          <div className="mt-6 grid gap-4">
            <p className="text-[var(--muted-foreground)]">Upload a CSV file. We’ll detect headers and suggest mappings.</p>
            <label className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 cursor-pointer">
              <input type="file" accept=".csv" className="hidden" onChange={(e)=>{
                const f = e.target.files?.[0];
                if (f) setFileName(f.name);
                setHeaders(["timestamp","value","series","note"]);
              }} />
              <span>{fileName || "Choose CSV..."}</span>
            </label>
            <div className="flex justify-end gap-2">
              <button onClick={proceed} className="px-4 py-2 rounded-full bg-black text-white">Next</button>
            </div>
          </div>
        )}

        {step === "mapping" && (
          <div className="mt-6 grid gap-4">
            <p className="text-[var(--muted-foreground)]">Map CSV columns to fields.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {(["timestamp","value","series","note"]).map((field)=> (
                <div key={field} className="grid gap-1">
                  <label className="text-sm text-[var(--muted-foreground)]">{field}</label>
                  <select className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3" value={mapping[field] || ""} onChange={(e)=>setMapping(prev=>({...prev,[field]:e.target.value}))}>
                    <option value="">—</option>
                    {headers.map(h=> <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <button onClick={back} className="px-4 py-2 rounded-full border border-[var(--border)]">Back</button>
              <button onClick={proceed} className="px-4 py-2 rounded-full bg-black text-white">Next</button>
            </div>
          </div>
        )}

        {step === "validate" && (
          <div className="mt-6 grid gap-4">
            <p className="text-[var(--muted-foreground)]">Validation preview (first 5 rows). We’ll flag timestamp or numeric issues.</p>
            <div className="rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[var(--surface-2)]">
                  <tr>
                    {headers.map(h => <th key={h} className="text-left p-2 border-b border-[var(--border)]">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({length:5}).map((_,i)=> (
                    <tr key={i} className="odd:bg-[color:rgba(0,0,0,0.02)]">
                      {headers.map(h => <td key={h} className="p-2 border-b border-[var(--border)]">sample</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between">
              <button onClick={back} className="px-4 py-2 rounded-full border border-[var(--border)]">Back</button>
              <button onClick={proceed} className="px-4 py-2 rounded-full bg-black text-white">Next</button>
            </div>
          </div>
        )}

        {step === "schedule" && (
          <div className="mt-6 grid gap-4">
            <p className="text-[var(--muted-foreground)]">Choose how this dataset is updated.</p>
            <div className="flex gap-2">
              {(["manual","daily","weekly"] as const).map(s => (
                <button key={s} onClick={()=>setSchedule(s)} className={`px-3 py-2 rounded-full border ${schedule===s?"bg-black text-white":"bg-[var(--surface-2)] border-[var(--border)]"}`}>{s}</button>
              ))}
            </div>
            <div className="flex justify-between">
              <button onClick={back} className="px-4 py-2 rounded-full border border-[var(--border)]">Back</button>
              <button onClick={proceed} className="px-4 py-2 rounded-full bg-black text-white">Next</button>
            </div>
          </div>
        )}

        {step === "summary" && (
          <div className="mt-6 grid gap-3">
            <p className="text-[var(--muted-foreground)]">Review and confirm.</p>
            <div className="rounded-xl bg-[var(--surface-2)] p-3 border border-[var(--border)]">
              <div><b>File</b>: {fileName || "(not set)"}</div>
              <div><b>Mapping</b>: {JSON.stringify(mapping)}</div>
              <div><b>Schedule</b>: {schedule}</div>
            </div>
            <div className="flex justify-between">
              <button onClick={back} className="px-4 py-2 rounded-full border border-[var(--border)]">Back</button>
              <button onClick={onClose} className="px-4 py-2 rounded-full bg-black text-white">Finish</button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}


