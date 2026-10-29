"use client";

import type { CurveFactory } from "d3-shape";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { animate, useReducedMotion } from "motion/react";

import { LINE_LOADING_PULSE_EASE } from "../chart-core/chart-phase";
import {
  type BandSegment,
  bandDataSignature,
  computeBandSegments,
  flattenBandEdges,
  interpolateBandSegments,
  morphBandSegments,
} from "./band-geometry";

export interface UseAnimatedBandOptions {
  chartPhase: string;
  curve: CurveFactory;
  durationMs: number;
  enabled: boolean;
  innerWidth: number;
  lowerKey: string;
  renderData: Record<string, unknown>[];
  upperKey: string;
  xAccessor: (datum: Record<string, unknown>) => Date;
  xScale: (value: Date) => number | undefined;
  yScale: (value: number) => number | undefined;
}

/** Band currently on screen. `polyline` frames render with `curveLinear`. */
export interface DisplayedBand {
  polyline: boolean;
  segments: BandSegment[];
}

type LatestBandInputs = Pick<
  UseAnimatedBandOptions,
  | "renderData"
  | "xAccessor"
  | "xScale"
  | "yScale"
  | "upperKey"
  | "lowerKey"
  | "curve"
>;

function segmentsFor(inputs: LatestBandInputs): BandSegment[] {
  return computeBandSegments(
    inputs.renderData,
    inputs.xAccessor,
    inputs.xScale,
    inputs.yScale,
    inputs.upperKey,
    inputs.lowerKey
  );
}

/**
 * Band counterpart of `useAnimatedSeriesPath`: same trigger signatures,
 * duration (`yDomainTweenDuration`), easing and morph-vs-slide rule, so a
 * band tweens frame-for-frame with the `<Line>`s it is composed with.
 */
export function useAnimatedBand({
  renderData,
  xAccessor,
  xScale,
  yScale,
  upperKey,
  lowerKey,
  curve,
  chartPhase,
  durationMs,
  innerWidth,
  enabled,
}: UseAnimatedBandOptions): DisplayedBand {
  const reducedMotion = useReducedMotion();
  const [animatedBand, setAnimatedBand] = useState<DisplayedBand | null>(null);
  const displayedRef = useRef<DisplayedBand | null>(null);
  const animatingRef = useRef(false);

  const xScaleDomain = useMemo(() => {
    const scaleWithDomain = xScale as { domain?: () => [Date, Date] };
    return scaleWithDomain.domain?.() ?? [new Date(0), new Date(0)];
  }, [xScale]);

  const dataSignature = useMemo(
    () => bandDataSignature(renderData, xAccessor, upperKey, lowerKey),
    [renderData, xAccessor, upperKey, lowerKey]
  );

  const transitionSignature = `${innerWidth}|${xScaleDomain[0]?.getTime?.() ?? 0}|${xScaleDomain[1]?.getTime?.() ?? 0}|${dataSignature}`;

  const targetSegments = useMemo(
    () =>
      segmentsFor({
        curve,
        lowerKey,
        renderData,
        upperKey,
        xAccessor,
        xScale,
        yScale,
      }),
    [renderData, xAccessor, xScale, yScale, upperKey, lowerKey, curve]
  );

  const prevTransitionSignatureRef = useRef(transitionSignature);
  const prevDataSignatureRef = useRef(dataSignature);

  // Live inputs for the running tween — the y-domain tween rebuilds `yScale`
  // every frame, so these must not be effect deps (see useAnimatedSeriesPath).
  const latestRef = useRef<LatestBandInputs>({
    curve,
    lowerKey,
    renderData,
    upperKey,
    xAccessor,
    xScale,
    yScale,
  });
  // Synced in a layout effect declared before the tween effect (not during
  // render) so `renderFrame(0)` and every animation frame see this commit's
  // inputs.
  useLayoutEffect(() => {
    latestRef.current = {
      curve,
      lowerKey,
      renderData,
      upperKey,
      xAccessor,
      xScale,
      yScale,
    };
  });

  const shouldAnimate =
    enabled &&
    !reducedMotion &&
    chartPhase === "ready" &&
    durationMs > 0 &&
    renderData.length > 0;

  // Drop a stale tween frame as soon as animation is no longer allowed —
  // adjusted during render rather than via setState in the effect below.
  if (!shouldAnimate && animatedBand !== null) {
    setAnimatedBand(null);
  }

  // Scales / targets are read live via latestRef: only a new signature should
  // restart the tween (a dep on per-frame `yScale` would stop it each frame).
  useLayoutEffect(() => {
    const computeLatestTarget = () => segmentsFor(latestRef.current);

    const dataChanged = prevDataSignatureRef.current !== dataSignature;
    prevDataSignatureRef.current = dataSignature;

    if (!shouldAnimate) {
      animatingRef.current = false;
      displayedRef.current = {
        polyline: false,
        segments: computeLatestTarget(),
      };
      prevTransitionSignatureRef.current = transitionSignature;
      return;
    }

    if (prevTransitionSignatureRef.current === transitionSignature) {
      return;
    }
    prevTransitionSignatureRef.current = transitionSignature;

    const from = displayedRef.current ?? {
      polyline: false,
      segments: computeLatestTarget(),
    };
    if (from.segments.length === 0) {
      displayedRef.current = {
        polyline: false,
        segments: computeLatestTarget(),
      };
      return;
    }

    animatingRef.current = true;
    const morph = dataChanged || from.polyline;
    const fromPolylines = morph
      ? flattenBandEdges(from.segments, latestRef.current.curve, from.polyline)
      : null;

    const renderFrame = (progress: number) => {
      const currentTarget = computeLatestTarget();
      const next: DisplayedBand = fromPolylines
        ? {
            polyline: true,
            segments: morphBandSegments(
              fromPolylines,
              currentTarget,
              latestRef.current.curve,
              progress
            ),
          }
        : {
            polyline: false,
            segments: interpolateBandSegments(
              from.segments,
              currentTarget,
              progress
            ),
          };
      displayedRef.current = next;
      setAnimatedBand(next);
    };
    renderFrame(0);

    const control = animate(0, 1, {
      duration: durationMs / 1000,
      ease: [...LINE_LOADING_PULSE_EASE],
      onComplete: () => {
        animatingRef.current = false;
        displayedRef.current = {
          polyline: false,
          segments: computeLatestTarget(),
        };
        setAnimatedBand(null);
      },
      onUpdate: renderFrame,
    });

    return () => {
      control.stop();
      animatingRef.current = false;
    };
  }, [
    transitionSignature,
    dataSignature,
    shouldAnimate,
    chartPhase,
    durationMs,
    enabled,
    reducedMotion,
    renderData.length,
  ]);

  // After the tween effect: a data change needs the previously displayed
  // segments as its `from`, not the new target.
  useEffect(() => {
    if (!animatingRef.current) {
      displayedRef.current = { polyline: false, segments: targetSegments };
    }
  }, [targetSegments]);

  return animatedBand ?? { polyline: false, segments: targetSegments };
}
