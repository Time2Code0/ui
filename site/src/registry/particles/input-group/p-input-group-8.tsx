"use client";

import { useRef } from "react";

import { CheckIcon, CopyIcon } from "@hugeicons/core-free-icons";

import { useCopyToClipboard } from "@/registry/hooks/use-copy-to-clipboard";
import { Button } from "@/registry/ui/button";
import { Icon } from "@/registry/ui/icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/ui/input-group";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/registry/ui/tooltip";

export function Particle() {
  const { copied: isCopied, copyToClipboard } = useCopyToClipboard();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <InputGroup>
      <InputGroupInput
        aria-label="Url"
        defaultValue="https://ui.time2code.dev"
        ref={inputRef}
        type="text"
      />
      <InputGroupAddon align="inline-end">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                aria-label="Copy"
                onClick={() => {
                  if (inputRef.current) {
                    copyToClipboard(inputRef.current.value);
                  }
                }}
                size="icon-xs"
                variant="ghost"
              >
                {isCopied ? (
                  <Icon icon={CheckIcon} />
                ) : (
                  <Icon icon={CopyIcon} />
                )}
              </Button>
            }
          />
          <TooltipPopup>
            <p>Copy to clipboard</p>
          </TooltipPopup>
        </Tooltip>
      </InputGroupAddon>
    </InputGroup>
  );
}
