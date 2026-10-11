"use client";

import type { COBEOptions } from "cobe";

import { useEffect, useRef, useState } from "react";

import { useSpring } from "@react-spring/web";
import { cn } from "cn";
import createGlobe from "cobe";
import { useInView } from "motion/react";

export const DEFAULT_COBE_OPTIONS: COBEOptions = {
  baseColor: [1, 1, 1],
  dark: 0,
  devicePixelRatio: 2,
  diffuse: 1.2,
  glowColor: [0.8, 0.8, 0.8],
  height: 800,
  mapBrightness: 4,
  mapSamples: 20_000,
  markerColor: [251 / 255, 100 / 255, 21 / 255],
  markers: [],
  onRender: () => null,
  phi: 0,
  theta: 0.15,
  width: 800,
};

export function Globe({
  config = DEFAULT_COBE_OPTIONS,
  className,
}: {
  config?: COBEOptions;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref);

  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = window.document.createElement("canvas");
      const ctx =
        canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");
      if (ctx !== null) {
        (
          ctx as unknown as { getSupportedExtensions: () => void }
        ).getSupportedExtensions();
      }
    } catch {
      // WebGL isn't properly supported
      setWebglSupported(false);
      console.error("WebGL not supported, hiding globe animation...");
    }
  }, []);

  return (
    <div
      className={cn(
        webglSupported
          ? "absolute inset-0 mx-auto aspect-square w-full max-w-[600px]"
          : "hidden",
        className
      )}
      ref={ref}
    >
      {webglSupported && isInView ? <GlobeAnimation config={config} /> : null}
    </div>
  );
}

function GlobeAnimation({ config }: { config: COBEOptions }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [{ r }, api] = useSpring(() => ({
    config: {
      friction: 40,
      mass: 1,
      precision: 0.001,
      tension: 280,
    },
    r: 0,
  }));

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;

    if (canvasRef.current !== null) {
      canvasRef.current.style.cursor = value ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      api.start({ r: delta / 200 });
    }
  };

  useEffect(() => {
    let phi = 0;
    let width = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    if (!canvasRef.current) {
      return;
    }

    const globe = createGlobe(canvasRef.current, {
      ...config,
      height: width * 2,
      onRender: (_state) => {
        const state = _state as { phi: number; width: number; height: number };

        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        phi += 0.002;
        state.phi = phi + r.get();
        state.width = width * 2;
        state.height = width * 2;
      },
      width: width * 2,
    });

    setTimeout(() => {
      if (canvasRef.current !== null) {
        canvasRef.current.style.opacity = "1";
      }
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [config, r]);

  return (
    <canvas
      className={cn(
        "size-full opacity-0 transition-opacity duration-1000 [contain:layout_paint_size]"
      )}
      onMouseMove={(e) => {
        updateMovement(e.clientX);
      }}
      onPointerDown={(e) => {
        updatePointerInteraction(
          e.clientX - pointerInteractionMovement.current
        );
      }}
      onPointerOut={() => {
        updatePointerInteraction(null);
      }}
      onPointerUp={() => {
        updatePointerInteraction(null);
      }}
      onTouchMove={(e) => {
        if (e.touches[0]) {
          updateMovement(e.touches[0].clientX);
        }
      }}
      ref={canvasRef}
    />
  );
}
