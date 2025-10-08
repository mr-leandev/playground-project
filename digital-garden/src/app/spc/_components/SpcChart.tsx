"use client";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export type SpcPointMeta = { status: "ok" | "needs" | "inprogress" | "resolved"; href?: string };

export default function SpcChart({ title, labels, values, center, ucl, lcl, meta }: { title: string; labels: string[]; values: number[]; center: number; ucl: number; lcl: number; meta?: SpcPointMeta[] }) {
  const pointBackground = values.map((v, i) => {
    if (v > ucl || v < lcl) {
      const m = meta?.[i];
      if (m?.status === "needs") return "#ef4444"; // red
      if (m?.status === "inprogress") return "#f59e0b"; // orange
      if (m?.status === "resolved") return "#10b981"; // green
      return "#ef4444";
    }
    return "#3b82f6";
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Value",
        data: values,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.15)",
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: pointBackground,
        tension: 0.3,
      },
      { label: "Average", data: labels.map(() => center), borderColor: "#111827", borderDash: [6, 6], pointRadius: 0 },
      { label: "UCL", data: labels.map(() => ucl), borderColor: "#059669", borderDash: [4, 6], pointRadius: 0 },
      { label: "LCL", data: labels.map(() => lcl), borderColor: "#dc2626", borderDash: [4, 6], pointRadius: 0 },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" as const }, tooltip: { mode: "index" as const, intersect: false } },
    scales: { x: { grid: { display: false }, ticks: { maxRotation: 0 } }, y: { beginAtZero: true } },
  };

  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3 h-[340px]">
        <Line options={options} data={data} />
      </div>
    </section>
  );
}


