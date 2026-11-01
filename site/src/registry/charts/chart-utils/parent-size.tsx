"use client";

import {
  type CSSProperties,
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

export interface ElementSize {
  height: number;
  width: number;
}

const ZERO_SIZE: ElementSize = { height: 0, width: 0 };

export interface ElementSizeOptions {
  /** Quiet period (ms) before a size change applies. @default 300 */
  debounceTime?: number;
  /**
   * Apply the first change of a burst at once (in the next animation frame).
   * `false` waits for `debounceTime` of quiet before every update, so brief
   * layout blips never reach the chart. @default true
   */
  leading?: boolean;
}

/**
 * Content-box size of `ref`'s element, `0×0` until the first `ResizeObserver`
 * notification. Updates are applied in the next animation frame, so the enter
 * animations keep the timing they were tuned on, and debounced (see
 * {@link ElementSizeOptions}).
 */
export function useElementSize(
  ref: RefObject<HTMLElement | null>,
  { debounceTime = 300, leading = true }: ElementSizeOptions = {}
): ElementSize {
  const [size, setSize] = useState(ZERO_SIZE);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === "undefined") {
      return;
    }

    let frame = 0;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let pending: ElementSize | null = null;
    const apply = (next: ElementSize) =>
      setSize((prev) =>
        prev.width === next.width && prev.height === next.height ? prev : next
      );
    // Debounce: fire now (when `leading`), then once more with the latest
    // size after `debounceTime` of quiet.
    const resize = (next: ElementSize) => {
      if (leading && timeout === undefined) {
        apply(next);
      } else {
        pending = next;
      }
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = undefined;
        if (pending) {
          apply(pending);
          pending = null;
        }
      }, debounceTime);
    };

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) {
        return;
      }
      const { width, height } = entry.contentRect;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => resize({ height, width }));
    });
    observer.observe(element);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [ref, debounceTime, leading]);

  return size;
}

export interface ChartParentSizeProps {
  children: (size: ElementSize) => ReactNode;
  className?: string;
  debounceTime?: number;
  style?: CSSProperties;
}

/**
 * Sizes its children to the parent, without an `overflow: hidden` measuring
 * layer, so tooltips, markers, and strokes at the chart edge aren't clipped.
 */
export function ParentSize({
  children,
  className,
  debounceTime,
  style,
}: ChartParentSizeProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const size = useElementSize(parentRef, { debounceTime });
  return (
    <div
      className={className}
      style={{ height: "100%", position: "relative", width: "100%", ...style }}
    >
      <div ref={parentRef} style={{ inset: 0, position: "absolute" }}>
        {children(size)}
      </div>
    </div>
  );
}
