"use client";

import type { COBEOptions } from "cobe";

import { DEFAULT_COBE_OPTIONS, Globe } from "@/registry/marketing/globe";

const config: COBEOptions = {
  ...DEFAULT_COBE_OPTIONS,
  markers: [
    { location: [37.7595, -122.4367], size: 0.05 }, // San Francisco
    { location: [40.7128, -74.006], size: 0.1 }, // New York
    { location: [51.5072, -0.1276], size: 0.05 }, // London
    { location: [48.8566, 2.3522], size: 0.05 }, // Paris
    { location: [52.52, 13.405], size: 0.06 }, // Berlin
    { location: [35.6762, 139.6503], size: 0.08 }, // Tokyo
    { location: [-33.8688, 151.2093], size: 0.05 }, // Sydney
  ],
};

export function Particle() {
  return (
    <div className="relative aspect-square w-full max-w-md">
      <Globe config={config} />
    </div>
  );
}
