"use client";

import { useRef } from "react";

import { SaveIcon } from "@hugeicons/core-free-icons";

import { Button } from "@/registry/ui/button";
import { Icon } from "@/registry/ui/icon";
import { anchoredToastManager } from "@/registry/ui/toast";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/registry/ui/tooltip";

const ANCHORED_SAVE_TOAST_ID = "demo-anchored-save-toast";

export function Particle() {
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const toastTimeout = 2000;

  function handleSave() {
    if (!saveButtonRef.current) {
      return;
    }
    anchoredToastManager.add({
      data: {
        tooltipStyle: true,
      },
      id: ANCHORED_SAVE_TOAST_ID,
      positionerProps: {
        anchor: saveButtonRef.current,
        sideOffset: 6,
      },
      timeout: toastTimeout,
      title: "Draft saved",
    });
  }

  return (
    <Tooltip>
      <TooltipTrigger
        delay={0}
        render={
          <Button
            aria-label="Save"
            onClick={handleSave}
            ref={saveButtonRef}
            size="icon"
            variant="outline"
          >
            <Icon aria-hidden="true" icon={SaveIcon} />
          </Button>
        }
      />
      <TooltipPopup>
        <p>Save</p>
      </TooltipPopup>
    </Tooltip>
  );
}
