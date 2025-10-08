'use client'

import { useMemo } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export type SkillsRadarProps = {
  title?: string;
  labels?: string[];
  current?: number[];
  target?: number[];
};

export default function SkillsRadar(props: SkillsRadarProps) {
  const labels = props.labels || [
    "SPC",
    "Lean Principles",
    "Problem Solving",
    "5S",
    "Kaizen",
    "TPM",
    "Safety",
    "Communication",
  ];

  const current = props.current || [3, 4, 2, 3, 2, 3, 4, 3];
  const target = props.target || [5, 5, 4, 4, 4, 4, 5, 4];

  const data = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          label: "Current",
          data: current,
          borderColor: "rgba(59,130,246,0.9)",
          backgroundColor: "rgba(59,130,246,0.2)",
          pointBackgroundColor: "rgba(59,130,246,1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(59,130,246,1)",
        },
        {
          label: "Target",
          data: target,
          borderColor: "rgba(16,185,129,0.9)",
          backgroundColor: "rgba(16,185,129,0.15)",
          pointBackgroundColor: "rgba(16,185,129,1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(16,185,129,1)",
        },
      ],
    };
  }, [labels, current, target]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            color: "var(--foreground)",
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      scales: {
        r: {
          beginAtZero: true,
          min: 0,
          max: 5,
          ticks: {
            stepSize: 1,
            color: "var(--muted-foreground)",
            showLabelBackdrop: false,
          },
          grid: {
            color: "rgba(148,163,184,0.2)",
          },
          angleLines: {
            color: "rgba(148,163,184,0.2)",
          },
          pointLabels: {
            color: "var(--muted-foreground)",
            font: {
              size: 12,
            },
          },
        },
      },
    };
  }, []);

  return (
    <div className="w-full" style={{ height: 380 }}>
      {props.title ? (
        <div className="mb-2 text-sm text-[var(--muted-foreground)]">{props.title}</div>
      ) : null}
      <Radar data={data} options={options} />
    </div>
  );
}



