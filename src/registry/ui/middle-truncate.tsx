"use client";

import { useCallback, useLayoutEffect, useMemo, useState } from "react";

import { cn } from "cn";

const ELLIPSIS = "…";

const segmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;

let canvasContext: CanvasRenderingContext2D | null = null;

function createMeasurer(element: HTMLElement) {
  canvasContext ??= document.createElement("canvas").getContext("2d");
  const context = canvasContext;
  if (!context) {
    return null;
  }

  const style = getComputedStyle(element);
  context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  context.fontKerning = style.fontKerning as CanvasFontKerning;
  context.letterSpacing =
    style.letterSpacing === "normal" ? "0px" : style.letterSpacing;

  return (text: string) => context.measureText(text).width;
}

function split(graphemes: string[], count: number): [string, string] {
  const tailCount = Math.floor(count / 2);

  return [
    graphemes.slice(0, count - tailCount).join(""),
    graphemes.slice(graphemes.length - tailCount).join(""),
  ];
}

// Binary-searches how many graphemes fit around the ellipsis.
function fit(
  graphemes: string[],
  width: number,
  measure: (text: string) => number
): number {
  let low = 0;
  let high = graphemes.length - 1;

  while (low < high) {
    const mid = Math.ceil((low + high) / 2);

    if (measure(split(graphemes, mid).join(ELLIPSIS)) <= width) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }

  return low;
}

export interface MiddleTruncateProps
  extends Omit<React.ComponentProps<"span">, "children"> {
  value: string;
}

export function MiddleTruncate({
  value,
  className,
  onCopy,
  ref,
  ...props
}: MiddleTruncateProps): React.ReactElement {
  const [container, setContainer] = useState<HTMLSpanElement | null>(null);
  const [count, setCount] = useState<number | null>(null);

  // Graphemes, so emoji and combining marks are never cut in half.
  const graphemes = useMemo(
    () =>
      segmenter
        ? Array.from(segmenter.segment(value), ({ segment }) => segment)
        : Array.from(value),
    [value]
  );

  useLayoutEffect(() => {
    if (!container) {
      return;
    }

    const update = () => {
      // The invisible full-width copy overflows exactly when the value doesn't fit.
      if (container.scrollWidth <= container.clientWidth) {
        setCount(null);
        return;
      }

      const measure = createMeasurer(container);

      if (measure) {
        setCount(fit(graphemes, container.clientWidth, measure));
      }
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(container);

    // Web fonts change glyph widths once they load.
    document.fonts.addEventListener("loadingdone", update);

    return () => {
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", update);
    };
  }, [container, graphemes]);

  const setContainerRef = useCallback(
    (node: HTMLSpanElement | null) => {
      setContainer(node);
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );

  const truncated = count !== null;
  const [head, tail] = truncated ? split(graphemes, count) : [value, ""];
  const hidden = value.slice(head.length, value.length - tail.length);
  const text = truncated ? `${head}${ELLIPSIS}${tail}` : value;

  // The visible text is always `head…tail`, so copying swaps the ellipsis
  // back for the hidden middle of `value`.
  const handleCopy = useCallback(
    (event: React.ClipboardEvent<HTMLSpanElement>) => {
      onCopy?.(event);
      const selection = window.getSelection()?.toString();
      if (
        event.defaultPrevented ||
        !truncated ||
        !selection?.includes(ELLIPSIS)
      ) {
        return;
      }

      event.preventDefault();
      event.clipboardData.setData(
        "text/plain",
        selection.replace(ELLIPSIS, hidden)
      );
    },
    [onCopy, truncated, hidden]
  );

  return (
    <span
      data-slot="middle-truncate"
      data-truncated={truncated || undefined}
      title={truncated ? value : undefined}
      {...props}
      className={cn(
        "relative inline-grid min-w-0 max-w-full overflow-hidden whitespace-nowrap",
        className
      )}
      onCopy={handleCopy}
      ref={setContainerRef}
    >
      {truncated ? <span className="sr-only select-none">{value}</span> : null}
      {/* Reserves the full width so the grid only shrinks when constrained. */}
      <span
        aria-hidden="true"
        className="invisible col-start-1 row-start-1 select-none"
      >
        {value}
      </span>
      <span
        aria-hidden={truncated || undefined}
        className="col-start-1 row-start-1 overflow-hidden"
      >
        {text}
      </span>
    </span>
  );
}
