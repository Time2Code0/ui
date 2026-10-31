"use client";

import { useEffect, useState } from "react";

/**
 * @param watch - An array of element ids to watch
 * @returns Active anchor
 */
export function useActiveAnchor(watch: string[]): string | undefined {
  const [activeAnchor, setActiveAnchor] = useState<string>();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setActiveAnchor((f) => {
          for (const entry of entries) {
            // if above half of viewport
            const aboveHalf =
              window.innerHeight / 2 > entry.boundingClientRect.y;
            const active = aboveHalf && entry.isIntersecting;

            if (active) {
              return entry.target.id;
            }
          }

          return f ?? watch[0];
        });
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    for (const heading of watch) {
      const element = document.getElementById(heading);

      if (element !== null) {
        observer.observe(element);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [watch]);

  return activeAnchor;
}
