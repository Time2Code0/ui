"use client";

import { motion } from "motion/react";

import { radarCssVars, useRadarStable } from "./radar-context";

export interface RadarLabelsProps {
  /** Additional class name */
  className?: string;
  /** Font size for labels. Default: 11 */
  fontSize?: number;
  /** Enable interactive hover on labels. Default: false */
  interactive?: boolean;
  /** Distance from the chart edge. Default: 24 */
  offset?: number;
}

export function RadarLabels({
  offset = 24,
  fontSize = 11,
  interactive = false,
  className = "",
}: RadarLabelsProps) {
  const { metrics, radius, levels, getAngle, animate } = useRadarStable();

  // Label animation delay (starts after grid begins)
  const gridStagger = 0.08;
  const labelDelay = levels * gridStagger * 0.5;

  const labelRadius = radius + offset;

  return (
    <g className={className}>
      {metrics.map((metric, i) => {
        const angle = getAngle(i);
        const x = labelRadius * Math.cos(angle);
        const y = labelRadius * Math.sin(angle);

        return (
          <motion.g
            animate={{ opacity: 1, x, y }}
            initial={
              animate ? { opacity: 0, x: 0, y: 0 } : { opacity: 1, x, y }
            }
            key={`label-${metric.key}`}
            transition={{
              opacity: {
                delay: animate ? labelDelay + i * 0.08 : 0,
                duration: 0.5,
              },
              x: { damping: 15, stiffness: 80, type: "spring" },
              y: { damping: 15, stiffness: 80, type: "spring" },
            }}
          >
            <text
              className={
                interactive
                  ? "cursor-pointer transition-opacity duration-150 hover:opacity-100"
                  : ""
              }
              dominantBaseline="middle"
              fontSize={fontSize}
              fontWeight={500}
              opacity={interactive ? 0.8 : 1}
              style={{ fill: radarCssVars.label }}
              textAnchor="middle"
              x={0}
              y={0}
            >
              {metric.label}
            </text>
          </motion.g>
        );
      })}
    </g>
  );
}

RadarLabels.displayName = "RadarLabels";
