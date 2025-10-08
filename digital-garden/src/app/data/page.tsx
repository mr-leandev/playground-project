import Link from "next/link";
import { DataClient } from "./DataClient";
import { Tabs } from "../(shell)/Tabs";
import { EmptyState } from "../(shell)/states";
import { createClient } from "../../lib/supabase/server";
import AddPointForm from "./_components/AddPointForm";
import DatasetForm from "./_components/DatasetForm";

export default async function DataPage() {
  const supabase = await createClient();
  const { data: areas } = await supabase.from("areas").select("id,name,parent_id").order("name");
  const { data: datasets } = await supabase.from("datasets").select("id,name,area_id,type,unit,granularity").order("name");

  return (
    <div className="space-y-6">
      <Tabs tabs={[{ href: "/data", label: "Ingest" }, { href: "/datasets", label: "Datasets" }]} />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-xl font-semibold">Areas</h2>
          <ul className="mt-3 space-y-2">
            {(areas||[]).map((a:any)=>(
              <li key={a.id} className="flex items-center justify-between">
                <span>{a.name}</span>
                <Link className="text-sm underline" href={`/dashboard?area=${a.id}`}>Open dashboard</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-xl font-semibold">Datasets</h2>
          <ul className="mt-3 space-y-3">
            {(datasets||[]).map((d:any)=>(
              <li key={d.id} className="rounded-xl border border-[var(--border)] p-3">
                <div className="flex items-center justify-between">
                  <Link href={`/datasets/${d.id}`} className="font-medium underline-offset-2 hover:underline">{d.name}</Link>
                  <span className="text-xs text-[var(--muted-foreground)]">{d.type} • {d.unit} • {d.granularity}</span>
                </div>
                <div className="mt-2">
                  <AddPointForm datasetId={d.id} datasetType={d.type||'value'} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <DatasetForm areas={(areas as any[]) || []} />
      <DataClient />
    </div>
  );
}


