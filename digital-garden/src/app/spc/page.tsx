"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import SpcChart from "./_components/SpcChart";
import { computeILimits, computePLimits, generateISamples, generatePSamples, generateNPSamples, computeNPLimits, generateCSamples, computeCLimits, generateUSamples, computeULimits, generateXbarRSamples, computeXbarLimits } from "../../lib/spc";
import SkillsRadar from "../study/_components/SkillsRadar";

export default function SpcPage() {
  const [windowDays, setWindowDays] = useState<number>(30);
  const [sigmaMultiplier, setSigmaMultiplier] = useState<number>(1.5);

  const iSamples = useMemo(() => generateISamples(windowDays, "day", 30), [windowDays]);
  const pSamples = useMemo(() => generatePSamples(windowDays, "day", 100), [windowDays]);
  const npSamples = useMemo(() => generateNPSamples(windowDays, "day", 100), [windowDays]);
  const cSamples = useMemo(() => generateCSamples(windowDays, "day", 4), [windowDays]);
  const uSamples = useMemo(() => generateUSamples(windowDays, "day"), [windowDays]);
  const xrSamples = useMemo(() => generateXbarRSamples(Math.max(10, Math.floor(windowDays / 3)), 5, "day"), [windowDays]);

  const iValues = iSamples.map((s) => s.y);
  const pValues = pSamples.map((s) => s.y);
  const iLimits = computeILimits(iValues, sigmaMultiplier);
  const pLimits = computePLimits(pSamples, sigmaMultiplier);
  const npLimits = computeNPLimits(npSamples, sigmaMultiplier);
  const cLimits = computeCLimits(cSamples.map((s) => s.y), sigmaMultiplier);
  const uLimits = computeULimits(uSamples, sigmaMultiplier);
  const xrLimits = computeXbarLimits(xrSamples, 5);

  // mock statuses for flagged points (just mark last out-of-control if any)
  const iMeta = iValues.map((v) => ({ status: "ok" as const }));
  const pMeta = pValues.map((v) => ({ status: "ok" as const }));
  const lastI = iValues.findLastIndex((v) => v > iLimits.ucl || v < iLimits.lcl);
  const lastP = pValues.findLastIndex((v) => v > pLimits.ucl || v < pLimits.lcl);
  const lastNP = npSamples.map((s) => s.y).findLastIndex((v) => v > npLimits.ucl || v < npLimits.lcl);
  const lastC = cSamples.map((s) => s.y).findLastIndex((v) => v > cLimits.ucl || v < cLimits.lcl);
  const lastU = uSamples.map((s) => s.y).findLastIndex((v) => v > uLimits.ucl || v < uLimits.lcl);
  if (lastI >= 0) iMeta[lastI] = { status: "needs", href: "/alerts/1" };
  if (lastP >= 0) pMeta[lastP] = { status: "inprogress", href: "/alerts/1" };
  const npMeta = npSamples.map(() => ({ status: "ok" as const }));
  const cMeta = cSamples.map(() => ({ status: "ok" as const }));
  const uMeta = uSamples.map(() => ({ status: "ok" as const }));
  if (lastNP >= 0) npMeta[lastNP] = { status: "needs", href: "/alerts/1" };
  if (lastC >= 0) cMeta[lastC] = { status: "needs", href: "/alerts/1" };
  if (lastU >= 0) uMeta[lastU] = { status: "inprogress", href: "/alerts/1" };

  return (
    <div className="min-h-[100svh] w-full bg-gradient-to-br from-orange-500 via-rose-400 to-blue-600 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="px-3 py-2 rounded-full bg-white/80 text-black text-sm shadow">Home</Link>
          <nav className="flex gap-2">
            {[7, 14, 30, 60].map((d) => (
              <button key={d} className="px-3 py-2 rounded-full bg-white/80 text-black text-sm shadow hover:bg-white" onClick={() => setWindowDays(d)}>{d} Days</button>
            ))}
            <button className="px-3 py-2 rounded-full bg-white/90 text-black text-sm shadow font-medium">All</button>
          </nav>
          <nav className="flex gap-2">
            {[1, 1.5, 2, 3].map((s) => (
              <button key={s} className={`px-3 py-2 rounded-full text-sm shadow ${sigmaMultiplier===s?"bg-black text-white":"bg-white/80 text-black hover:bg-white"}`} onClick={() => setSigmaMultiplier(s)}>{s}σ</button>
            ))}
          </nav>
        </header>

        <div className="mt-6 grid gap-6">
          <div className="rounded-3xl bg-white/80 p-4 text-sm">
            <p className="text-[var(--muted-foreground)]">Goal orientation: choose whether higher values are desirable (“up is good”) or lower values are desirable (“down is good”). This will affect default colors and summaries for alerts.</p>
          </div>
          <SpcChart title="Items Count (I-Chart)" labels={iSamples.map((s) => s.x)} values={iValues} center={iLimits.center} ucl={iLimits.ucl} lcl={iLimits.lcl} meta={iMeta} />
          <SpcChart title="Defect Rate % (P-Chart)" labels={pSamples.map((s) => s.x)} values={pValues} center={pLimits.center} ucl={pLimits.ucl} lcl={pLimits.lcl} meta={pMeta} />
          <SpcChart title="Defectives (np-Chart)" labels={npSamples.map((s) => s.x)} values={npSamples.map((s) => s.y)} center={npLimits.center} ucl={npLimits.ucl} lcl={npLimits.lcl} meta={npMeta} />
          <SpcChart title="Defects (c-Chart)" labels={cSamples.map((s) => s.x)} values={cSamples.map((s) => s.y)} center={cLimits.center} ucl={cLimits.ucl} lcl={cLimits.lcl} meta={cMeta} />
          <SpcChart title="Defects per Unit (u-Chart)" labels={uSamples.map((s) => s.x)} values={uSamples.map((s) => s.y)} center={uLimits.center} ucl={uLimits.ucl} lcl={uLimits.lcl} meta={uMeta} />
          <SpcChart title="X̄ Chart" labels={xrSamples.map((s) => s.x)} values={xrSamples.map((s) => s.xbar)} center={xrLimits.xbar.center} ucl={xrLimits.xbar.ucl} lcl={xrLimits.xbar.lcl} />
          <SpcChart title="R Chart" labels={xrSamples.map((s) => s.x)} values={xrSamples.map((s) => s.r)} center={xrLimits.r.center} ucl={xrLimits.r.ucl} lcl={xrLimits.r.lcl} />
          <div className="rounded-3xl bg-white/80 p-4">
            <h2 className="text-lg font-medium mb-2">Critical Skills Matrix (Radar)</h2>
            {/* @ts-expect-error client component */}
            <SkillsRadar title="Team A – Capability vs Target" />
          </div>
        </div>
      </div>
    </div>
  );
}


