"use client";

import { useMemo, useState } from "react";
import { createClient } from "../../../lib/supabase/client";

type Row = {
  id?: string;
  ts: string; // ISO string
  value: number | null;
  numerator: number | null;
  denominator: number | null;
};

export default function DatasetGrid({
  seriesId,
  datasetType,
  unit,
  initialRows,
}: {
  seriesId: string;
  datasetType: string;
  unit?: string | null;
  initialRows: Row[];
}) {
  function normalizeDatetimeLocal(input: string): string {
    // Accept ISO with timezone or seconds and convert to input[type=datetime-local] format
    if (!input) return "";
    // If contains timezone marker, use Date to normalize
    if (/[zZ]|[\+\-]\d{2}:?\d{2}$/.test(input)) {
      return new Date(input).toISOString().slice(0, 16);
    }
    // Otherwise trim to minutes
    return input.slice(0, 16);
  }

  const [rows, setRows] = useState<Row[]>(
    initialRows.map((r) => ({
      ...r,
      ts: normalizeDatetimeLocal(r.ts),
    }))
  );
  const [saving, setSaving] = useState(false);

  const needsVD = datasetType === "value" || datasetType === "count";
  const needsND = datasetType === "proportion" || datasetType === "rate";

  function addEmptyRow() {
    const now = new Date();
    const iso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setRows([{ ts: iso, value: null, numerator: null, denominator: null }, ...rows]);
  }

  async function saveChanges() {
    setSaving(true);
    const supabase = createClient();

    const inserts = rows.filter((r) => !r.id);
    const updates = rows.filter((r) => r.id);

    if (inserts.length) {
      console.debug("[grid] inserting readings", inserts.length, { seriesId });
      const { error: insertError } = await supabase.from("readings").insert(
        inserts.map((r) => ({
          series_id: seriesId,
          timestamp: new Date(r.ts).toISOString(),
          value: needsVD ? r.value : null,
        }))
      );
      if (insertError) {
        console.error("[grid] insert error", insertError);
        alert(insertError.message);
      }
    }

    if (updates.length) {
      console.debug("[grid] updating readings", updates.length);
      for (const r of updates) {
        const { error: updateError } = await supabase
          .from("readings")
          .update({
            timestamp: new Date(r.ts).toISOString(),
            value: needsVD ? r.value : null,
          })
          .eq("id", r.id as string);
        if (updateError) {
          console.error("[grid] update error", updateError);
          alert(updateError.message);
        }
      }
    }

    setSaving(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button onClick={addEmptyRow} className="px-3 py-2 rounded bg-[var(--foreground)] text-[var(--background)] text-sm">Add Row</button>
        <button onClick={saveChanges} disabled={saving} className="px-3 py-2 rounded border text-sm disabled:opacity-50">{saving ? "Saving..." : "Save Changes"}</button>
      </div>
      <div className="overflow-auto rounded-xl border border-[var(--border)]">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-[var(--surface-2,rgba(255,255,255,0.5))]">
              <th className="text-left p-2 w-[180px]">Date</th>
              {needsVD && <th className="text-left p-2">Value{unit ? ` (${unit})` : ""}</th>}
              {needsND && <>
                <th className="text-left p-2">Numerator</th>
                <th className="text-left p-2">Denominator</th>
              </>}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.id ?? `new-${idx}`} className="odd:bg-black/0 even:bg-black/5">
                <td className="p-2">
                  <input
                    type="datetime-local"
                    className="w-[180px] rounded border px-2 py-1 bg-transparent"
                    value={r.ts}
                    onChange={(e) => {
                      const copy = [...rows];
                      copy[idx] = { ...r, ts: e.target.value };
                      setRows(copy);
                    }}
                  />
                </td>
                {needsVD && (
                  <td className="p-2">
                    <input
                      type="number"
                      className="w-[140px] rounded border px-2 py-1 bg-transparent"
                      value={r.value ?? ""}
                      onChange={(e) => {
                        const copy = [...rows];
                        copy[idx] = { ...r, value: e.target.value === "" ? null : Number(e.target.value) };
                        setRows(copy);
                      }}
                    />
                  </td>
                )}
                {needsND && (
                  <>
                    <td className="p-2">
                      <input
                        type="number"
                        className="w-[120px] rounded border px-2 py-1 bg-transparent"
                        value={r.numerator ?? ""}
                        onChange={(e) => {
                          const copy = [...rows];
                          copy[idx] = { ...r, numerator: e.target.value === "" ? null : Number(e.target.value) };
                          setRows(copy);
                        }}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        className="w-[120px] rounded border px-2 py-1 bg-transparent"
                        value={r.denominator ?? ""}
                        onChange={(e) => {
                          const copy = [...rows];
                          copy[idx] = { ...r, denominator: e.target.value === "" ? null : Number(e.target.value) };
                          setRows(copy);
                        }}
                      />
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


