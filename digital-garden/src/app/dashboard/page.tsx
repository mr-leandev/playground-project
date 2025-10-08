import { Card } from "../(shell)/shell";
import { createClient } from "../../lib/supabase/server";
import SpcChart from "../spc/_components/SpcChart";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ area?: string }> }) {
  const sp = await searchParams;
  const areaId = sp?.area || "";
  const supabase = await createClient();
  const { data: charts } = await supabase
    .from("charts")
    .select("id,title,subtitle,type,sigma,goal,granularity,subgroup_size,config")
    .eq("area_id", areaId)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        {!areaId && <p className="text-[var(--muted-foreground)] mt-2">Provide an area id in the URL, e.g. /dashboard?area=...</p>}
      </Card>
      <div className="grid gap-6">
        {(charts || []).map((c) => (
          <SpcChart key={c.id} title={c.title} labels={["1","2","3","4","5"]} values={[10,20,30,25,22]} center={20} ucl={30} lcl={10} />
        ))}
      </div>
    </div>
  );
}


