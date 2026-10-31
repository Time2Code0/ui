"use client";

import { useRef } from "react";

import { CheckIcon, CopyIcon } from "@hugeicons/core-free-icons";

import { useCopyToClipboard } from "@/registry/hooks/use-copy-to-clipboard";
import { Button } from "@/registry/ui/button";
import { Group, GroupSeparator } from "@/registry/ui/group";
import { Icon } from "@/registry/ui/icon";
import { Input } from "@/registry/ui/input";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/registry/ui/tooltip";

export function Particle() {
  const { copied: isCopied, copyToClipboard } = useCopyToClipboard();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Group aria-label="Url input">
      <Input
        aria-label="Url"
        defaultValue="https://design.time2code.dev"
        ref={inputRef}
        type="text"
      />
      <GroupSeparator />
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
              size="icon"
              variant="outline"
            >
              {isCopied ? <Icon icon={CheckIcon} /> : <Icon icon={CopyIcon} />}
            </Button>
          }
        />
        <TooltipPopup>
          <p>Copy to clipboard</p>
        </TooltipPopup>
      </Tooltip>
    </Group>
  );
}
