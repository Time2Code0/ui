"use client";

import type { MotionValue } from "motion/react";

import { motion } from "motion/react";

const BASE_ROTATIONS = {
  "to-bottom": 180,
  "to-left": 270,
  "to-right": 90,
  "to-top": 0,
} as const;

type Direction = keyof typeof BASE_ROTATIONS;

interface LinearMaskParams {
  direction?: Direction;
  opacities?: number[];
  positions?: (number | string)[];
  rotate?: number;
}

interface CustomLinearMaskParams {
  direction?: Direction;
  opacityFn: (position: number) => number;
  rotate?: number;
  stops?: number;
}

interface CircleMaskParams {
  opacities?: number[];
  positions?: number[];
}

interface EllipseMaskParams {
  opacities?: number[];
  positions?: number[];
}

const inferPositions = (length: number) => {
  if (length < 2) {
    throw new Error("Length must be at least 2");
  }

  const positions: number[] = [];
  for (let i = 0; i < length; i += 1) {
    positions.push(i / (length - 1));
  }

  return positions;
};

const masks = {
  circle: ({ opacities = [1, 0], positions }: CircleMaskParams): string => {
    if (!positions || positions.length !== opacities.length) {
      positions = inferPositions(opacities.length);
    }

    const stops = positions.map(
      (p, i) => `rgba(255, 255, 255, ${opacities[i]}) ${p * 100}%`
    );

    return `radial-gradient(closest-side circle, ${stops.join(", ")})`;
  },
  customLinear: ({
    opacityFn,
    stops = 10,
    direction = "to-right",
    rotate = 0,
  }: CustomLinearMaskParams) => {
    const baseRotation = BASE_ROTATIONS[direction];
    const positions = Array.from({ length: stops }, (_, i) => i / (stops - 1));
    const opacities = positions.map(opacityFn);
    const gradientStops = positions.map(
      (pos, index) => `rgba(255, 255, 255, ${opacities[index]}) ${pos * 100}%`
    );

    return `linear-gradient(${baseRotation + rotate}deg, ${gradientStops.join(", ")})`;
  },
  ellipse: ({ opacities = [1, 0], positions }: EllipseMaskParams): string => {
    if (!positions || positions.length !== opacities.length) {
      positions = inferPositions(opacities.length);
    }

    const stops = positions.map(
      (p, i) => `rgba(255, 255, 255, ${opacities[i]}) ${p * 100}%`
    );

    return `radial-gradient(closest-side, ${stops.join(", ")})`;
  },
  linear: ({
    direction = "to-right",
    opacities = [1, 0],
    positions,
    rotate = 0,
  }: LinearMaskParams): string => {
    const baseRotation = BASE_ROTATIONS[direction];

    if (!positions || positions.length !== opacities.length) {
      positions = inferPositions(opacities.length);
    }

    const stops = positions.map(
      (p, i) =>
        `rgba(255, 255, 255, ${opacities[i]}) ${
          typeof p === "number" ? `${p * 100}%` : p
        }`
    );

    return `linear-gradient(${baseRotation + rotate}deg, ${stops.join(", ")})`;
  },
};

interface MaskProps extends React.ComponentPropsWithRef<typeof motion.div> {
  image: string | MotionValue<string>;
  size?: string | MotionValue<string>;
}

function Mask({ image, size, style, ...props }: MaskProps) {
  return (
    <motion.div
      style={{
        maskImage: image,
        maskSize: size,
        WebkitMaskImage: image,
        WebkitMaskSize: size,
        ...style,
      }}
      {...props}
    />
  );
}

export type { Direction };
export { Mask, masks };
