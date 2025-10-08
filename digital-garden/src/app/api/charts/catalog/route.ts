import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { ChartConfig } from "@/src/lib/contracts/charts";

const DATA_DIR = path.join(process.cwd(), "digital-garden", ".data");
const FILE = path.join(DATA_DIR, "charts.json");

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, JSON.stringify({ charts: [] }, null, 2));
  }
}

export async function GET() {
  await ensureFile();
  const raw = await fs.readFile(FILE, "utf8");
  return new Response(raw, { headers: { "Content-Type": "application/json" } });
}

export async function POST(req: NextRequest) {
  await ensureFile();
  const body = (await req.json()) as ChartConfig;
  const raw = await fs.readFile(FILE, "utf8");
  const json = JSON.parse(raw) as { charts: ChartConfig[] };
  json.charts.push(body);
  await fs.writeFile(FILE, JSON.stringify(json, null, 2));
  return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
}

export async function DELETE(req: NextRequest) {
  await ensureFile();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ ok: false, error: "missing id" }), { status: 400 });
  const raw = await fs.readFile(FILE, "utf8");
  const json = JSON.parse(raw) as { charts: ChartConfig[] };
  json.charts = json.charts.filter((c) => c.id !== id);
  await fs.writeFile(FILE, JSON.stringify(json, null, 2));
  return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
}


