"use client";

import { useCallback, useState } from "react";

/**
 * @param delay - Timeout delay in milliseconds
 */
export function useCopyToClipboard(delay = 1500) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setError(null);
        setTimeout(() => {
          setCopied(false);
        }, delay);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err : new Error("Failed to copy!"));
      }
    },
    [delay]
  );

  return { copied, copyToClipboard, error };
}
