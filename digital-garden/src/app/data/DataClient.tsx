"use client";

import { useState } from "react";
import { Card, Toolbar, Chip } from "../(shell)/shell";
import { DataWizard } from "./_components/DataWizard";

export function DataClient() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Toolbar>
          <Chip active>All</Chip>
          <Chip>CSV</Chip>
          <Chip>Manual</Chip>
          <Chip>Managed</Chip>
        </Toolbar>
        <button onClick={() => setOpen(true)} className="px-4 py-2 rounded-full bg-black text-white">New dataset</button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold">Recent Imports</h2>
          <p className="text-[var(--muted-foreground)] mt-2">CSV and managed sync events summarized here.</p>
          <div className="mt-4 grid gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-[var(--surface-2)] p-3 border border-[var(--border)] flex items-center justify-between">
                <span className="text-[var(--muted-foreground)]">Dataset #{i + 1}</span>
                <span className="text-sm">{new Date().toISOString().slice(0, 16).replace('T', ' ')}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold">Connectors</h2>
          <p className="text-[var(--muted-foreground)] mt-2">Most users upload CSV. Managed connectors can be added by admins.</p>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {["CSV","Managed","Email","S3","GSheets","API"].map((n)=> (
              <div key={n} className="rounded-xl bg-[var(--surface-2)] p-3 border border-[var(--border)] text-center">{n}</div>
            ))}
          </div>
        </Card>
      </div>

      <DataWizard open={open} onClose={() => setOpen(false)} />
    </div>
  );
}


