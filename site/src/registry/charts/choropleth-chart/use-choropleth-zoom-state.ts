"use client";

import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/** 2D affine transform, as in SVG `matrix(scaleX, skewY, skewX, scaleY, translateX, translateY)`. */
export interface TransformMatrix {
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;
  translateX: number;
  translateY: number;
}

export interface ZoomPoint {
  x: number;
  y: number;
}

export interface ChoroplethZoomInstance {
  /** Zoomed point → map point (svg px). */
  applyInverseToPoint: (point: ZoomPoint) => ZoomPoint;
  /** Map point (svg px) → zoomed point. */
  applyToPoint: (point: ZoomPoint) => ZoomPoint;
  /** Pan so the map point under the view centre moves to the centre. */
  center: () => void;
  /** Attach to the `<svg>` that receives drag, wheel and pinch gestures. */
  containerRef: RefObject<SVGSVGElement | null>;
  initialTransformMatrix: TransformMatrix;
  isDragging: boolean;
  /** Back to `initialTransformMatrix`. */
  reset: () => void;
  /** Zoom by a factor around `point` (default: the view centre). */
  scale: (options: {
    scaleX: number;
    scaleY?: number;
    point?: ZoomPoint;
  }) => void;
  /** Replace the transform (ignored when its scale is out of bounds). */
  setTransformMatrix: (matrix: TransformMatrix) => void;
  /** `matrix(…)` string for an SVG `transform` attribute. */
  toString: () => string;
  transformMatrix: TransformMatrix;
  /** Pan by a delta in zoomed units. */
  translate: (delta: { translateX: number; translateY: number }) => void;
  /** Pan so the map point `point` sits at the top-left. */
  translateTo: (point: ZoomPoint) => void;
}

export interface ChoroplethZoomOptions {
  height: number;
  initialTransformMatrix: TransformMatrix;
  scaleMax: number;
  scaleMin: number;
  /** Zoom factor for one wheel event. */
  wheelDelta: (event: WheelEvent) => number;
  width: number;
}

/** Pointer travel (px) before a press becomes a drag, so clicks still land. */
const DRAG_THRESHOLD_PX = 3;

function multiply(a: TransformMatrix, b: TransformMatrix): TransformMatrix {
  return {
    scaleX: a.scaleX * b.scaleX + a.skewX * b.skewY,
    scaleY: a.skewY * b.skewX + a.scaleY * b.scaleY,
    skewX: a.scaleX * b.skewX + a.skewX * b.scaleY,
    skewY: a.skewY * b.scaleX + a.scaleY * b.skewY,
    translateX: a.scaleX * b.translateX + a.skewX * b.translateY + a.translateX,
    translateY: a.skewY * b.translateX + a.scaleY * b.translateY + a.translateY,
  };
}

function invert(m: TransformMatrix): TransformMatrix {
  const det = m.scaleX * m.scaleY - m.skewY * m.skewX;
  return {
    scaleX: m.scaleY / det,
    scaleY: m.scaleX / det,
    skewX: -m.skewX / det,
    skewY: -m.skewY / det,
    translateX: (m.skewX * m.translateY - m.scaleY * m.translateX) / det,
    translateY: (m.skewY * m.translateX - m.scaleX * m.translateY) / det,
  };
}

function apply(m: TransformMatrix, { x, y }: ZoomPoint): ZoomPoint {
  return {
    x: m.scaleX * x + m.skewX * y + m.translateX,
    y: m.skewY * x + m.scaleY * y + m.translateY,
  };
}

function affine(
  scaleX: number,
  scaleY: number,
  translateX: number,
  translateY: number
): TransformMatrix {
  return { scaleX, scaleY, skewX: 0, skewY: 0, translateX, translateY };
}

/** Pointer position in the svg's pixel space. */
function svgPoint(svg: SVGSVGElement, event: PointerEvent | WheelEvent) {
  const rect = svg.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

/**
 * Pan / zoom state for the choropleth: drag to pan, wheel to zoom at the
 * pointer, two-finger pinch to zoom at the fingers' midpoint. A transform
 * whose scale leaves `[scaleMin, scaleMax]` is ignored.
 */
export function useChoroplethZoomState({
  height,
  initialTransformMatrix,
  scaleMax,
  scaleMin,
  wheelDelta,
  width,
}: ChoroplethZoomOptions): ChoroplethZoomInstance {
  const containerRef = useRef<SVGSVGElement>(null);
  const [transformMatrix, setMatrixState] = useState(initialTransformMatrix);
  // Gesture handlers read the latest matrix between renders.
  const matrixRef = useRef(initialTransformMatrix);
  const [isDragging, setIsDragging] = useState(false);

  const setTransformMatrix = useCallback(
    (next: TransformMatrix) => {
      const outOfBounds = [next.scaleX, next.scaleY].some(
        (s) => s < scaleMin || s > scaleMax
      );
      if (!outOfBounds) {
        matrixRef.current = next;
        setMatrixState(next);
      }
    },
    [scaleMax, scaleMin]
  );

  const scale = useCallback<ChoroplethZoomInstance["scale"]>(
    ({
      scaleX: sx,
      scaleY: sy = sx,
      point = { x: width / 2, y: height / 2 },
    }) => {
      const { current } = matrixRef;
      const anchor = apply(invert(current), point);
      setTransformMatrix(
        multiply(
          multiply(current, affine(sx, sy, anchor.x, anchor.y)),
          affine(1, 1, -anchor.x, -anchor.y)
        )
      );
    },
    [height, setTransformMatrix, width]
  );

  const translate = useCallback<ChoroplethZoomInstance["translate"]>(
    ({ translateX: dx, translateY: dy }) =>
      setTransformMatrix(multiply(matrixRef.current, affine(1, 1, dx, dy))),
    [setTransformMatrix]
  );

  const translateTo = useCallback<ChoroplethZoomInstance["translateTo"]>(
    (point) => {
      const target = apply(invert(matrixRef.current), point);
      setTransformMatrix({
        ...matrixRef.current,
        translateX: target.x,
        translateY: target.y,
      });
    },
    [setTransformMatrix]
  );

  const center = useCallback(() => {
    const middle = { x: width / 2, y: height / 2 };
    const inverse = apply(invert(matrixRef.current), middle);
    translate({
      translateX: inverse.x - middle.x,
      translateY: inverse.y - middle.y,
    });
  }, [height, translate, width]);

  const reset = useCallback(
    () => setTransformMatrix(initialTransformMatrix),
    [initialTransformMatrix, setTransformMatrix]
  );

  const wheelDeltaRef = useRef(wheelDelta);
  wheelDeltaRef.current = wheelDelta;

  useEffect(() => {
    const svg = containerRef.current;
    if (!(svg instanceof SVGSVGElement)) {
      return;
    }

    const pointers = new Map<number, ZoomPoint>();
    let drag: {
      origin: ZoomPoint;
      pointerId: number;
      startTranslate: ZoomPoint;
      active: boolean;
    } | null = null;
    let pinchDistance = 0;

    const pinchState = () => {
      const [a, b] = [...pointers.values()];
      if (!(a && b)) {
        return null;
      }
      return {
        distance: Math.hypot(a.x - b.x, a.y - b.y),
        midpoint: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      };
    };

    const endDrag = () => {
      if (drag?.active) {
        setIsDragging(false);
      }
      drag = null;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }
      pointers.set(event.pointerId, svgPoint(svg, event));
      if (pointers.size === 1) {
        const { translateX, translateY } = matrixRef.current;
        drag = {
          active: false,
          origin: svgPoint(svg, event),
          pointerId: event.pointerId,
          startTranslate: { x: translateX, y: translateY },
        };
      } else if (pointers.size === 2) {
        // A second finger turns the drag into a pinch.
        endDrag();
        pinchDistance = pinchState()?.distance ?? 0;
        svg.setPointerCapture(event.pointerId);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!pointers.has(event.pointerId)) {
        return;
      }
      // Released outside the svg before the drag captured the pointer.
      if (event.pointerType === "mouse" && event.buttons === 0) {
        onPointerEnd(event);
        return;
      }
      const point = svgPoint(svg, event);
      pointers.set(event.pointerId, point);
      if (pointers.size === 2) {
        pinchMove();
      } else if (drag?.pointerId === event.pointerId) {
        dragMove(drag, event.pointerId, point);
      }
    };

    const pinchMove = () => {
      const pinch = pinchState();
      if (pinch && pinchDistance > 0) {
        scale({
          point: pinch.midpoint,
          scaleX: pinch.distance / pinchDistance,
        });
      }
      pinchDistance = pinch?.distance ?? 0;
    };

    const dragMove = (
      current: NonNullable<typeof drag>,
      pointerId: number,
      point: ZoomPoint
    ) => {
      const dx = point.x - current.origin.x;
      const dy = point.y - current.origin.y;
      if (!current.active) {
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) {
          return;
        }
        // Capture only once it is a drag, so a plain click still reaches
        // the feature under the pointer.
        current.active = true;
        svg.setPointerCapture(pointerId);
        setIsDragging(true);
      }
      setTransformMatrix({
        ...matrixRef.current,
        translateX: current.startTranslate.x + dx,
        translateY: current.startTranslate.y + dy,
      });
    };

    function onPointerEnd(event: PointerEvent) {
      pointers.delete(event.pointerId);
      if (drag?.pointerId === event.pointerId || pointers.size === 0) {
        endDrag();
      }
      if (pointers.size < 2) {
        pinchDistance = 0;
      }
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const factor = wheelDeltaRef.current(event);
      scale({ point: svgPoint(svg, event), scaleX: factor });
    };

    svg.addEventListener("pointerdown", onPointerDown);
    svg.addEventListener("pointermove", onPointerMove);
    svg.addEventListener("pointerup", onPointerEnd);
    svg.addEventListener("pointercancel", onPointerEnd);
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      svg.removeEventListener("pointerdown", onPointerDown);
      svg.removeEventListener("pointermove", onPointerMove);
      svg.removeEventListener("pointerup", onPointerEnd);
      svg.removeEventListener("pointercancel", onPointerEnd);
      svg.removeEventListener("wheel", onWheel);
    };
  }, [scale, setTransformMatrix]);

  return {
    applyInverseToPoint: (point) => apply(invert(transformMatrix), point),
    applyToPoint: (point) => apply(transformMatrix, point),
    center,
    containerRef,
    initialTransformMatrix,
    isDragging,
    reset,
    scale,
    setTransformMatrix,
    toString: () => {
      const m = transformMatrix;
      return `matrix(${m.scaleX}, ${m.skewY}, ${m.skewX}, ${m.scaleY}, ${m.translateX}, ${m.translateY})`;
    },
    transformMatrix,
    translate,
    translateTo,
  };
}
