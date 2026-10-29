"use client";

import { useEffect, useState } from "react";

function sameKeys(a: readonly unknown[], b: readonly unknown[]): boolean {
  return a.length === b.length && a.every((value, i) => Object.is(value, b[i]));
}

/**
 * Enter-reveal lifecycle for charts without the loading phase machine.
 *
 * `isLoaded` turns true `delayMs` after mount (enables interaction and marks
 * the enter animation as done). Whenever a value in `replayKey` changes, the
 * chart resets to not-loaded and bumps `revealEpoch` so children replay their
 * enter animation. The reset is adjusted during render ("store previous props
 * in state") instead of in an effect, so a replay costs one render rather than
 * a commit plus a cascading re-render. While `hold` is true the timer does not
 * start (e.g. a loading skeleton waiting for data).
 */
export function useRevealReplay({
  delayMs,
  hold = false,
  replayKey,
}: {
  delayMs: number;
  hold?: boolean;
  replayKey: readonly unknown[];
}): { isLoaded: boolean; revealEpoch: number } {
  const [isLoaded, setIsLoaded] = useState(false);
  const [revealEpoch, setRevealEpoch] = useState(1);
  const [prevKey, setPrevKey] = useState(replayKey);
  if (!sameKeys(prevKey, replayKey)) {
    setPrevKey(replayKey);
    setRevealEpoch((n) => n + 1);
    setIsLoaded(false);
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: prevKey changes exactly when the replay key does — restart the timer
  useEffect(() => {
    if (hold) {
      return;
    }
    const timer = setTimeout(() => setIsLoaded(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs, hold, prevKey]);

  return { isLoaded, revealEpoch };
}
