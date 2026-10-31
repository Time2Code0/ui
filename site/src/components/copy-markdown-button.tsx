"use client";

import { useCallback, useState } from "react";

import { Copy01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import { AnimatePresence, motion } from "motion/react";

import { useCopyToClipboard } from "@/registry/hooks/use-copy-to-clipboard";
import { Button } from "@/registry/ui/button";
import { Icon } from "@/registry/ui/icon";

const cache = new Map<string, string>();

export function CopyMarkdownButton({ markdownUrl }: { markdownUrl: string }) {
  const { copied, copyToClipboard } = useCopyToClipboard();
  const [isLoading, setLoading] = useState(false);

  const handleCopy = useCallback(async () => {
    const cached = cache.get(markdownUrl);
    if (cached) {
      return navigator.clipboard.writeText(await cached);
    }

    setLoading(true);

    try {
      const markdown = await fetch(markdownUrl).then((res) => res.text());
      cache.set(markdownUrl, markdown);
      copyToClipboard(markdown);
    } finally {
      setLoading(false);
    }
  }, [markdownUrl, copyToClipboard]);

  return (
    <Button disabled={isLoading} onClick={handleCopy} variant="secondary">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
          exit={{ filter: "blur(4px)", opacity: 0, scale: 0.25 }}
          initial={{ filter: "blur(4px)", opacity: 0, scale: 0.25 }}
          key={copied ? "copied" : "copy"}
          transition={{
            bounce: 0,
            duration: 0.3,
            type: "spring",
          }}
        >
          <Icon icon={copied ? Tick01Icon : Copy01Icon} />
        </motion.div>
      </AnimatePresence>
      <span>Copy Markdown</span>
    </Button>
  );
}
