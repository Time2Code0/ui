"use client";

import { useEffect, useRef } from "react";

/**
 * Hook for creating an interval that invokes a callback function at a specified delay.
 * @param {() => void} callback - The function to be invoked at each interval.
 * @param {number | null} delay - The time, in milliseconds, between each invocation of the callback. Use `null` to clear the interval.
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {
      return;
    }

    const interval = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => {
      clearInterval(interval);
    };
  }, [delay]);
}
