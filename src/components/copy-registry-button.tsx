"use client";

import { useCallback } from "react";

import { McpServerIcon, Tick01Icon } from "@hugeicons/core-free-icons";

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
            <Icon icon={copied ? Tick01Icon : McpServerIcon} />
          </Button>
        }
      />
      <TooltipPopup>{copied ? "Copied" : "Copy registry URL"}</TooltipPopup>
    </Tooltip>
  );
}
