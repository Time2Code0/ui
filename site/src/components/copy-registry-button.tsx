"use client";

import { useCallback } from "react";

import { McpServerIcon, Tick01Icon } from "@hugeicons/core-free-icons";
import { AnimatePresence, motion } from "motion/react";

import { useCopyToClipboard } from "@/registry/hooks/use-copy-to-clipboard";
import { Button } from "@/registry/ui/button";
import { Icon } from "@/registry/ui/icon";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/registry/ui/tooltip";

export function CopyRegistryButton({
  value,
  ...props
}: React.ComponentProps<typeof Button> & { value: string }) {
  const { copied, copyToClipboard } = useCopyToClipboard();

  const handleCopy = useCallback(
    () => copyToClipboard(value),
    [copyToClipboard, value]
  );

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            aria-label={copied ? "Copied" : "Copy registry URL"}
            data-slot="copy-button"
            onClick={handleCopy}
            size="icon-sm"
            variant="outline"
            {...props}
          >
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
                <Icon icon={copied ? Tick01Icon : McpServerIcon} />
              </motion.div>
            </AnimatePresence>
          </Button>
        }
      />
      <TooltipPopup>{copied ? "Copied" : "Copy registry URL"}</TooltipPopup>
    </Tooltip>
  );
}
