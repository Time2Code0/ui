"use client";

import { useRef } from "react";

import { CheckIcon, CopyIcon } from "@hugeicons/core-free-icons";

import { useCopyToClipboard } from "@/registry/hooks/use-copy-to-clipboard";
import { Button } from "@/registry/ui/button";
import { Icon } from "@/registry/ui/icon";
import { anchoredToastManager } from "@/registry/ui/toast";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/registry/ui/tooltip";

export function Particle() {
  const copyButtonRef = useRef<HTMLButtonElement>(null);
  const toastTimeout = 2000;

  const { copied: isCopied, copyToClipboard } =
    useCopyToClipboard(toastTimeout);

  async function handleCopy() {
    await copyToClipboard("https://ui.time2code.dev");
    if (copyButtonRef.current) {
      anchoredToastManager.add({
        data: {
          tooltipStyle: true,
        },
        positionerProps: {
          anchor: copyButtonRef.current,
        },
        timeout: toastTimeout,
        title: "Copied!",
      });
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            aria-label="Copy link"
            disabled={isCopied}
            onClick={handleCopy}
            ref={copyButtonRef}
            size="icon"
            variant="outline"
          >
            {isCopied ? (
              <Icon className="size-4" icon={CheckIcon} />
            ) : (
              <Icon className="size-4" icon={CopyIcon} />
            )}
          </Button>
        }
      />
      <TooltipPopup>
        <p>Copy to clipboard</p>
      </TooltipPopup>
    </Tooltip>
  );
}
