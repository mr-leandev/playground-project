import { Card } from "../(shell)/shell";

export default function HelpPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6">
        <h2 className="text-xl font-semibold">Documentation</h2>
        <p className="text-[var(--muted-foreground)] mt-2">Quick start, SPC concepts, connectors, and API reference.</p>
      </Card>
      <Card className="p-6">
        <h2 className="text-xl font-semibold">Support</h2>
        <p className="text-[var(--muted-foreground)] mt-2">Chat with us or open a ticket. Typical response under 2 hours.</p>
      </Card>
      <Card className="p-6 md:col-span-2">
        <h2 className="text-xl font-semibold">SPC Chart Glossary</h2>
        <div className="mt-3 grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium">I (Individuals)</h3>
            <p className="text-[var(--muted-foreground)]">One value at a time on a timeline. Use when you just log a single measurement per period. The middle line is the average; the green/red lines show the normal range.</p>
          </div>
          <div>
            <h3 className="font-medium">X̄–R</h3>
            <p className="text-[var(--muted-foreground)]">Small batches measured together. X̄ is the batch average; R is the spread inside each batch. Great when you take 3–5 quick readings each hour/shift.</p>
          </div>
          <div>
            <h3 className="font-medium">p</h3>
            <p className="text-[var(--muted-foreground)]">Percent defective. If you inspect different counts each period, this chart adjusts the limits for the changing sample size.</p>
          </div>
          <div>
            <h3 className="font-medium">np</h3>
            <p className="text-[var(--muted-foreground)]">Number of defectives. Same idea as p‑chart, but the sample size is fixed, so we plot the count instead of the percent.</p>
          </div>
          <div>
            <h3 className="font-medium">c</h3>
            <p className="text-[var(--muted-foreground)]">Defect count per identical unit/area (e.g., scratches per panel). Useful when the inspection opportunity is constant.</p>
          </div>
          <div>
            <h3 className="font-medium">u</h3>
            <p className="text-[var(--muted-foreground)]">Defects per unit when the inspected amount changes. We divide by the opportunity so periods are comparable.</p>
          </div>
        </div>
        <p className="text-[var(--muted-foreground)] mt-4">Tip: set a goal for each chart: “up is good” (e.g., throughput) or “down is good” (e.g., defects). We use this to color and summarize alerts.</p>
      </Card>
    </div>
  );
}


