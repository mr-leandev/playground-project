import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import Link from "next/link";
import DatasetSeriesClient from "@/app/datasets/_components/DatasetSeriesClient";

type PageProps = { params: Promise<{ id: string }> };

export default async function DatasetDetailPage(props: PageProps) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: dataset, error: datasetError } = await supabase
    .from("datasets")
    .select("id,name,type,unit,granularity")
    .eq("id", id)
    .single();

  if (datasetError) {
    console.error("[dataset] fetch dataset error", { id, datasetError });
  }
  if (!dataset) return notFound();

  const { data: allSeries, error: seriesError } = await supabase
    .from("series")
    .select("id, name, unit")
    .eq("dataset_id", id)
    .order("name");
  if (seriesError) {
    console.error("[dataset] fetch series error", { id, seriesError });
  }

  const firstSeriesId = allSeries?.[0]?.id as string | undefined;
  let points: any[] = [];
  if (firstSeriesId) {
    const res = await supabase
      .from("readings")
      .select("id, timestamp, value")
      .eq("series_id", firstSeriesId)
      .order("timestamp", { ascending: false })
      .limit(200);
    if (res.error) {
      console.error("[dataset] fetch readings error", { firstSeriesId, error: res.error });
    }
    points = res.data ?? [];
  }
  console.debug("[dataset] SSR loaded", {
    datasetId: dataset.id,
    seriesCount: allSeries?.length ?? 0,
    firstSeriesId,
    pointsCount: points.length,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{dataset.name}</h1>
          <p className="text-sm text-[var(--muted-foreground)]">{dataset.type} • {dataset.unit} • {dataset.granularity}</p>
        </div>
        <Link href="/data" className="text-sm underline">Back to Data</Link>
      </div>

      <DatasetSeriesClient
        datasetId={dataset.id}
        datasetType={dataset.type}
        unit={dataset.unit}
        initialSeries={(allSeries ?? []) as any}
        initialRows={(points ?? []).map((p: any) => ({
          id: p.id as string,
          ts: new Date(p.timestamp as string).toISOString().slice(0, 16),
          value: p.value as number | null,
          numerator: null,
          denominator: null,
        }))}
      />
    </div>
  );
}


