"use client";

import type { CurveFactory } from "d3-shape";
import type { ChartPhase, LoadingStyle } from "./chart-phase";

import { useCallback, useEffect, useId, useState } from "react";

import { animate, motion, useMotionValue, useTransform } from "motion/react";

import { chartCssVars, useChartStable } from "./chart-context";
import {
  fadeGradientStops,
  resolveFadeSides,
  viewportFadeGradientAttrs,
} from "./fade-edges";
import {
  LINE_LOADING_LOOP_PAUSE_MS,
  LINE_LOADING_PULSE_CYCLE_S,
  LINE_LOADING_PULSE_EASE,
} from "./line-loading-timing";
import { LineLoadingSweep } from "./loading-sweep";

const CLIP_PADDING = 10;

export type LineLoadingPulseMode = "loop" | "exit" | "enter";

export function resolveLineLoadingPulseMode(
  phase: ChartPhase
): LineLoadingPulseMode | null {
  switch (phase) {
    case "loading":
      return "loop";
    case "exiting":
      return "exit";
    case "revealingLoading":
      return "enter";
    default:
      return null;
  }
}

export interface LineLoadingPulseStrokeProps {
  /** Bumps to restart loop cycles without remounting the stroke. */
  loopEpoch?: number;
  mode?: LineLoadingPulseMode;
  onCycleComplete?: () => void;
  pathD: string;
  stroke?: string;
  /** Stroke opacity for the animated segment. Default: 0.5 */
  strokeOpacity?: number;
  strokeWidth?: number;
}

function useGrowExitClip(
  innerWidth: number,
  mode: LineLoadingPulseMode,
  loopEpoch: number,
  onComplete?: () => void
) {
  const progress = useMotionValue(0);
  const paddedFullWidth = innerWidth + CLIP_PADDING * 2;
  const rightEdge = innerWidth + CLIP_PADDING;

  const clipWidth = useTransform(progress, (p) => {
    if (p <= 0.5) {
      return (p / 0.5) * paddedFullWidth;
    }
    const shrink = (p - 0.5) / 0.5;
    return (1 - shrink) * paddedFullWidth;
  });

  const clipX = useTransform(progress, (p) => {
    if (p <= 0.5) {
      return -CLIP_PADDING;
    }
    const shrink = (p - 0.5) / 0.5;
    return rightEdge - (1 - shrink) * paddedFullWidth;
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: loopEpoch restarts pulse when orchestrator advances
  useEffect(() => {
    if (innerWidth <= 0) {
      return;
    }

    const halfCycleS = LINE_LOADING_PULSE_CYCLE_S / 2;
    let cancelled = false;
    let controls: ReturnType<typeof animate> | undefined;

    const finish = () => {
      if (!cancelled) {
        onComplete?.();
      }
    };

    const runShrink = (from: number) => {
      const shrinkDuration = halfCycleS * ((1 - from) / 0.5);
      controls = animate(progress, 1, {
        duration: Math.max(shrinkDuration, 0.01),
        ease: [...LINE_LOADING_PULSE_EASE],
        onComplete: finish,
      });
    };

    if (mode === "loop") {
      progress.set(0);
      controls = animate(progress, 1, {
        duration: LINE_LOADING_PULSE_CYCLE_S,
        ease: [...LINE_LOADING_PULSE_EASE],
        onComplete: finish,
      });
      return () => {
        cancelled = true;
        controls?.stop();
      };
    }

    if (mode === "exit") {
      const current = progress.get();

      if (current < 0.5) {
        const growDuration = halfCycleS * ((0.5 - current) / 0.5);
        controls = animate(progress, 0.5, {
          duration: Math.max(growDuration, 0.01),
          ease: [...LINE_LOADING_PULSE_EASE],
          onComplete: () => {
            if (!cancelled) {
              runShrink(0.5);
            }
          },
        });
      } else {
        runShrink(current);
      }

      return () => {
        cancelled = true;
        controls?.stop();
      };
    }

    if (mode === "enter") {
      progress.set(0);
      controls = animate(progress, 0.5, {
        duration: halfCycleS,
        ease: [...LINE_LOADING_PULSE_EASE],
        onComplete: finish,
      });
      return () => {
        cancelled = true;
        controls?.stop();
      };
    }
  }, [innerWidth, loopEpoch, mode, onComplete, progress]);

  return { clipWidth, clipX };
}

export function LineLoadingPulseStroke({
  pathD,
  mode = "loop",
  loopEpoch = 0,
  stroke = chartCssVars.foreground,
  strokeOpacity = 0.5,
  strokeWidth = 2.5,
  onCycleComplete,
}: LineLoadingPulseStrokeProps) {
  const { innerWidth, innerHeight } = useChartStable();
  const reactId = useId();
  const clipPathId = `line-loading-clip-${reactId}`;
  const gradientId = `line-loading-gradient-${reactId}`;
  const fadeStops = fadeGradientStops(resolveFadeSides(true));
  const clipHeight = innerHeight + CLIP_PADDING * 2;
  const { clipX, clipWidth } = useGrowExitClip(
    innerWidth,
    mode,
    loopEpoch,
    onCycleComplete
  );

  if (innerWidth <= 0) {
    return null;
  }

  return (
    <>
      <defs>
        <clipPath id={clipPathId}>
          <motion.rect
            height={clipHeight}
            style={{ width: clipWidth, x: clipX }}
            y={-CLIP_PADDING}
          />
        </clipPath>
        <linearGradient
          id={gradientId}
          {...viewportFadeGradientAttrs(innerWidth)}
        >
          {fadeStops.map((stop) => (
            <stop
              key={stop.offset}
              offset={stop.offset}
              stopColor={stroke}
              stopOpacity={stop.opacity}
            />
          ))}
        </linearGradient>
      </defs>
      <path
        clipPath={`url(#${clipPathId})`}
        d={pathD}
        fill="none"
        opacity={strokeOpacity}
        stroke={`url(#${gradientId})`}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
      />
    </>
  );
}

LineLoadingPulseStroke.displayName = "LineLoadingPulseStroke";

/**
 * Loading pulse state for a `Line` / `Area`: which pulse plays (`loading`
 * forces it on or off, `loadingPulseMode` overrides the phase-derived mode)
 * and the epoch that restarts a loop after its pause.
 */
export function useSeriesLoadingPulse({
  chartPhase,
  loading,
  loadingPulseMode,
  notifyLoadingPulseComplete,
  onCycleComplete,
}: {
  chartPhase: ChartPhase;
  loading?: boolean;
  loadingPulseMode?: LineLoadingPulseMode;
  notifyLoadingPulseComplete?: () => void;
  onCycleComplete?: () => void;
}) {
  const phasePulseMode = resolveLineLoadingPulseMode(chartPhase);
  const pulseMode =
    loading === false
      ? null
      : (loadingPulseMode ?? (loading === true ? "loop" : phasePulseMode));
  const [pulseEpoch, setPulseEpoch] = useState(0);

  const handleLoadingPulseComplete = useCallback(() => {
    onCycleComplete?.();
    if (pulseMode === "loop") {
      window.setTimeout(() => {
        setPulseEpoch((epoch) => epoch + 1);
      }, LINE_LOADING_LOOP_PAUSE_MS);
      return;
    }
    notifyLoadingPulseComplete?.();
  }, [notifyLoadingPulseComplete, onCycleComplete, pulseMode]);

  return {
    handleLoadingPulseComplete,
    pulseEpoch,
    pulseMode,
    showLoadingPulse: pulseMode != null,
  };
}

/**
 * Loading overlay for a `Line` / `Area`. The sweep style owns all loading
 * modes (loop + the exit/enter transitions), drawing its own silhouette; the
 * pulse covers the default style.
 */
export function SeriesLoadingOverlays({
  curve,
  handleLoadingPulseComplete,
  innerWidth,
  loadingStroke,
  loadingStrokeOpacity,
  loadingStyle,
  pathD,
  pulseEpoch,
  pulseMode,
  showLoadingPulse,
  strokeWidth,
  withArea = false,
}: {
  curve: CurveFactory;
  handleLoadingPulseComplete: () => void;
  innerWidth: number;
  loadingStroke: string;
  loadingStrokeOpacity: number;
  loadingStyle: LoadingStyle;
  pathD: string | null;
  pulseEpoch: number;
  pulseMode: LineLoadingPulseMode | null;
  showLoadingPulse: boolean;
  strokeWidth: number;
  /** Sweep the filled area silhouette, not just the stroke. */
  withArea?: boolean;
}) {
  const sweepLoading =
    showLoadingPulse && innerWidth > 0 && loadingStyle === "sweep";
  const pulseLoading = showLoadingPulse && innerWidth > 0 && !sweepLoading;

  return (
    <>
      {sweepLoading ? (
        <LineLoadingSweep
          curve={curve}
          key="loading-sweep"
          mode={pulseMode ?? "loop"}
          onTransitionComplete={handleLoadingPulseComplete}
          stroke={loadingStroke}
          strokeOpacity={loadingStrokeOpacity}
          strokeWidth={strokeWidth}
          withArea={withArea}
        />
      ) : null}
      {pulseLoading && pathD ? (
        <LineLoadingPulseStroke
          key="loading-pulse"
          loopEpoch={pulseEpoch}
          mode={pulseMode ?? undefined}
          onCycleComplete={handleLoadingPulseComplete}
          pathD={pathD}
          stroke={loadingStroke}
          strokeOpacity={loadingStrokeOpacity}
          strokeWidth={strokeWidth}
        />
      ) : null}
    </>
  );
}
