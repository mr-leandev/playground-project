"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../../lib/supabase/client";
import DatasetGrid from "./DatasetGrid";
import AddSeriesForm from "./AddSeriesForm";

type Series = { id: string; name: string; unit?: string | null };
type Row = { id?: string; ts: string; value: number | null; numerator: number | null; denominator: number | null };

export default function DatasetSeriesClient({
  datasetId,
  datasetType,
  unit,
  initialSeries,
  initialRows,
}: {
  datasetId: string;
  datasetType: string;
  unit?: string | null;
  initialSeries: Series[];
  initialRows: Row[];
}) {
  const [series, setSeries] = useState<Series[]>(initialSeries);
  const [activeSeriesId, setActiveSeriesId] = useState<string | undefined>(initialSeries[0]?.id);
  const [rows, setRows] = useState<Row[]>(initialRows);
  const supabase = createClient();

  useEffect(() => {
    if (!activeSeriesId) return;
    (async () => {
      console.debug("[dataset] load readings", { activeSeriesId });
      const { data, error } = await supabase
        .from("readings")
        .select("id, timestamp, value")
        .eq("series_id", activeSeriesId)
        .order("timestamp", { ascending: false })
        .limit(200);
      if (error) {
        console.error("[dataset] client fetch readings error", { activeSeriesId, error });
      }
      console.debug("[dataset] readings loaded", data?.length ?? 0);
      setRows(
        (data ?? []).map((p: any) => ({
          id: p.id as string,
          ts: new Date(p.timestamp as string).toISOString().slice(0, 16),
          value: p.value as number | null,
          numerator: null,
          denominator: null,
        }))
      );
    })();
  }, [activeSeriesId]);

  async function addSeries() {
    const name = prompt("New series name");
    if (!name) return;
    console.debug("[dataset] add series", { datasetId, name });
    const { data, error } = await supabase
      .from("series")
      .insert({ dataset_id: datasetId, name, unit })
      .select("id, name, unit")
      .single();
    if (error || !data) {
      console.error("[dataset] add series error", error);
      alert(error.message);
      return;
    }
    console.debug("[dataset] series added", data);
    const next = [...series, (data as any) as Series].sort((a, b) => a.name.localeCompare(b.name));
    setSeries(next);
    setActiveSeriesId(data.id);
  }

  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-4">
      <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 h-max">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Series</h3>
        </div>
        <ul className="space-y-1">
          {series.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => setActiveSeriesId(s.id)}
                className={`w-full text-left px-2 py-1 rounded ${activeSeriesId===s.id?"bg-[var(--foreground)] text-[var(--background)]":"hover:bg-black/5"}`}
              >
                {s.name}
              </button>
            </li>
          ))}
          {series.length===0 && <li className="text-sm text-[var(--muted-foreground)]">No series yet</li>}
        </ul>
        <div className="mt-3">
          <AddSeriesForm
            datasetId={datasetId}
            onCreated={(s) => {
              const next = [...series, s].sort((a, b) => a.name.localeCompare(b.name));
              setSeries(next);
              setActiveSeriesId(s.id);
            }}
          />
        </div>
      </aside>
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-3">
        {activeSeriesId ? (
          <DatasetGrid
            seriesId={activeSeriesId}
            datasetType={datasetType}
            unit={unit}
            initialRows={rows}
          />
        ) : (
          <div className="text-sm text-[var(--muted-foreground)]">Select or add a series to begin.</div>
        )}
      </div>
    </div>
  );
}


