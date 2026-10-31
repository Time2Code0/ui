"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ChartTooltip } from "@/registry/charts/chart-tooltip/chart-tooltip";
import { LiveLine } from "@/registry/charts/live-line-chart/live-line";
import {
  LiveLineChart,
  type LiveLinePoint,
} from "@/registry/charts/live-line-chart/live-line-chart";
import { LiveXAxis } from "@/registry/charts/live-line-chart/live-x-axis";
import { LiveYAxis } from "@/registry/charts/live-line-chart/live-y-axis";

// Live line chart: minimal hook for streaming demo data
function useLiveData(
  initialPrice: number,
  intervalMs: number,
  paused = false
): { data: LiveLinePoint[]; value: number } {
  const [data, setData] = useState<LiveLinePoint[]>([]);
  const [value, setValue] = useState(initialPrice);
  const priceRef = useRef(initialPrice);
  const momentumRef = useRef(0);
  const isPaused = paused;
  const pausedRef = useRef(isPaused);

  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const nowSec = Date.now() / 1000;
    const seed: LiveLinePoint[] = [];
    let p = initialPrice;
    let mom = 0;
    for (let i = 40; i > 0; i--) {
      mom = mom * 0.92 + (Math.random() - 0.48) * 0.012;
      p *= 1 + mom;
      p = Math.max(p, 1);
      seed.push({
        time: nowSec - i * (intervalMs / 1000),
        value: Math.round(p * 100) / 100,
      });
    }
    priceRef.current = p;
    momentumRef.current = mom;
    setData(seed);
    setValue(p);
  }, [initialPrice, intervalMs]);

  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) {
        return;
      }
      momentumRef.current =
        momentumRef.current * 0.88 + (Math.random() - 0.48) * 0.008;
      momentumRef.current *= 0.995;
      priceRef.current *= 1 + momentumRef.current;
      priceRef.current = Math.max(priceRef.current, 1);
      const rounded = Math.round(priceRef.current * 100) / 100;
      setData((prev) => {
        const cutoff = Date.now() / 1000 - 120;
        return [
          ...prev.filter((p) => p.time >= cutoff),
          { time: Date.now() / 1000, value: rounded },
        ];
      });
      setValue(rounded);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return { data, value };
}

export function Particle() {
  const { data, value } = useLiveData(0.002_34, 500);
  const formatSats = useCallback((v: number) => `${v.toFixed(5)} BTC`, []);
  return (
    <LiveLineChart
      data={data}
      exaggerate
      margin={{ bottom: 40, left: 36, right: 8, top: 20 }}
      nowOffsetUnits={1}
      style={{ height: 220 }}
      value={value}
      window={20}
    >
      <LiveLine
        dataKey="value"
        dotSize={4}
        formatValue={formatSats}
        stroke="var(--color-chart-3)"
      />
      <ChartTooltip
        content={({ point }) => (
          <div className="px-3 py-2.5 text-sm tabular-nums">
            {formatSats((point.value as number) ?? 0)}
          </div>
        )}
        showDatePill={false}
      />
      <LiveXAxis />
      <LiveYAxis formatValue={formatSats} position="left" />
    </LiveLineChart>
  );
}
