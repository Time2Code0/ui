"use client";

import { useEffect, useState } from "react";

export function useResizeObserver(
  elementRef: React.RefObject<Element | null> | null
): ResizeObserverEntry | undefined {
  const [entry, setEntry] = useState<ResizeObserverEntry>();

  useEffect(() => {
    const node = elementRef?.current;
    if (!node) {
      return;
    }

    const observer = new ResizeObserver(
      ([resizeObserverEntry]: ResizeObserverEntry[]): void => {
        setEntry(resizeObserverEntry);
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [elementRef]);

  return entry;
}
