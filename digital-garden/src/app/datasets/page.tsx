import Link from "next/link";
import { Card, Chip, Toolbar } from "../(shell)/shell";
import { Tabs } from "../(shell)/Tabs";
import { createClient } from "../../lib/supabase/server";

export default async function DatasetsPage() {
  const supabase = await createClient();
  const { data: datasets, error } = await supabase
    .from("datasets")
    .select("id,name")
    .order("name");
  if (error) {
    console.error("[datasets] list error", error);
  }

  return (
    <div className="space-y-6">
      <Tabs tabs={[{ href: "/data", label: "Ingest" }, { href: "/datasets", label: "Datasets" }]} />
      <Toolbar>
        <Chip active>All</Chip>
        <Chip>SPC</Chip>
        <Chip>Operational</Chip>
        <Chip>Finance</Chip>
      </Toolbar>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {(datasets || []).map((d) => (
          <Card key={d.id} className="p-6">
            <div className="flex items-center justify-between">
              <Link href={`/datasets/${d.id}`} className="font-semibold underline-offset-2 hover:underline">{d.name}</Link>
              <span className="text-xs text-[var(--muted-foreground)]">Dataset</span>
            </div>
            <div className="mt-4">
              <Link href={`/datasets/${d.id}`} className="text-sm underline">Open dataset</Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}


