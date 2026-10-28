"use client";

import type { RingData } from "@/registry/charts/ring-context";

import { Ring } from "@/registry/charts/ring";
import { RingCenter } from "@/registry/charts/ring-center";
import { RingChart } from "@/registry/charts/ring-chart";

// Sample session data
const sessionsData: RingData[] = [
  { color: "#0ea5e9", label: "Organic", maxValue: 5000, value: 4250 },
  { color: "#a855f7", label: "Paid", maxValue: 5000, value: 3120 },
  { color: "#f59e0b", label: "Email", maxValue: 5000, value: 2100 },
  { color: "#10b981", label: "Social", maxValue: 5000, value: 1580 },
  { color: "#ef4444", label: "Referral", maxValue: 5000, value: 1050 },
  { color: "#6366f1", label: "Direct", maxValue: 5000, value: 747 },
];

export function Particle() {
  return (
    <RingChart data={sessionsData} size={280}>
      {sessionsData.map((item, index) => (
        <Ring index={index} key={item.label} />
      ))}
      <RingCenter />
    </RingChart>
  );
}
