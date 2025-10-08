import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { AlertAnalysisSchema, type AlertAnalysis } from "@/lib/contracts/alerts";

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE_PATH = path.join(DATA_DIR, "alerts.json");

async function readStore(): Promise<Record<string, AlertAnalysis>> {
  try {
    const raw = await fs.readFile(FILE_PATH, "utf8");
    return JSON.parse(raw);
  } catch (e: unknown) {
    if (typeof e === "object" && e && (e as { code?: string }).code === "ENOENT") return {};
    throw e;
  }
}

async function writeStore(data: Record<string, AlertAnalysis>) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = FILE_PATH + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(data, null, 2));
  await fs.rename(tmp, FILE_PATH);
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = await readStore();
  const item = store[id];
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const raw = (await req.json()) as unknown;

  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const partial = raw as Partial<AlertAnalysis>;
  const record: AlertAnalysis = {
    id,
    severity: partial.severity === "critical" || partial.severity === "warning" ? partial.severity : "info",
    output: typeof partial.output === "string" ? partial.output : undefined,
    factors: (partial.factors || {}) as AlertAnalysis["factors"],
    updatedAt: new Date().toISOString(),
    updatedBy: typeof partial.updatedBy === "string" ? partial.updatedBy : undefined,
  };

  // Validate against contract
  const parsed = AlertAnalysisSchema.safeParse(record);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }

  const store = await readStore();
  store[id] = parsed.data;
  await writeStore(store);
  return NextResponse.json({ ok: true, record: parsed.data });
}


