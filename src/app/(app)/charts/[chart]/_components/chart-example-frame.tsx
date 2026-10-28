"use client";

import type { ChartExamplePreviewLayout } from "./chart-example-preview";

import { Fragment, type ReactNode, useCallback, useState } from "react";

import { InformationCircleIcon, RefreshIcon } from "@hugeicons/core-free-icons";

import { CopyRegistryButton } from "@/components/copy-registry-button";
import { Button } from "@/registry/ui/button";
import {
  Card,
  CardFrame,
  CardFrameAction,
  CardFrameDescription,
  CardFrameFooter,
  CardFrameHeader,
} from "@/registry/ui/card";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/registry/ui/collapsible";
import { Icon } from "@/registry/ui/icon";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/registry/ui/tooltip";

import { ChartPreviewGate } from "./chart-preview-gate";

export function ChartExampleFrame({
  anchorId,
  title,
  description,
  code,
  registryUrl,
  footer,
  hero = false,
  previewLayout = "cartesian",
  children,
}: {
  /** Deep-link target (`#anchorId`) placed on the frame for the gallery sidebar. */
  anchorId?: string;
  title: string;
  description: string;
  /** Highlighted particle source. */
  code: ReactNode;
  /** shadcn registry item URL copied by the header action. */
  registryUrl?: string;
  footer?: string;
  hero?: boolean;
  previewLayout?: ChartExamplePreviewLayout;
  children: ReactNode;
}) {
  const [replayKey, setReplayKey] = useState(0);

  const replay = useCallback(() => setReplayKey((key) => key + 1), []);

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <CardFrame
        className="scroll-mt-[calc(--spacing(16)+4.5rem)] lg:scroll-mt-[calc(--spacing(16)+1.5rem)]"
        id={anchorId}
      >
        <CardFrameHeader className="p-2">
          <CardFrameDescription
            className="flex gap-1.5 truncate"
            render={<p />}
          >
            <Tooltip>
              <TooltipTrigger
                render={
                  <Icon
                    className="size-3.5 h-lh shrink-0"
                    icon={InformationCircleIcon}
                  />
                }
              />
              <TooltipPopup>{description}</TooltipPopup>
            </Tooltip>

            <span className="truncate">{title}</span>
          </CardFrameDescription>
          <CardFrameAction className="gap-1.5">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    aria-label="Replay animation"
                    onClick={replay}
                    size="icon-sm"
                    variant="outline"
                  >
                    <Icon icon={RefreshIcon} />
                  </Button>
                }
              />
              <TooltipPopup>Replay animation</TooltipPopup>
            </Tooltip>
            {registryUrl ? <CopyRegistryButton value={registryUrl} /> : null}
          </CardFrameAction>
        </CardFrameHeader>

        <Card className="flex w-full shrink-0 items-center justify-center p-6 sm:p-8">
          <div className="flex w-full items-stretch justify-stretch">
            <ChartPreviewGate
              layout={previewLayout}
              previewRole={hero ? "hero" : "example"}
            >
              <Fragment key={replayKey}>{children}</Fragment>
            </ChartPreviewGate>
          </div>
        </Card>

        <CardFrameFooter className="overflow-hidden rounded-b-2xl p-0">
          <CodeCollapsibleWrapper>{code}</CodeCollapsibleWrapper>
        </CardFrameFooter>
      </CardFrame>

      {footer ? (
        <p className="text-foreground-muted text-xs">{footer}</p>
      ) : null}
    </div>
  );
}

function CodeCollapsibleWrapper({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      className="group/collapsible relative md:-mx-1"
      onOpenChange={setIsOpen}
      open={isOpen}
    >
      <CollapsiblePanel
        className="relative h-full overflow-hidden data-closed:max-h-32"
        hidden={false}
        keepMounted
      >
        {children}
      </CollapsiblePanel>
      <CollapsibleTrigger className="absolute inset-x-0 -bottom-2 flex h-20 cursor-pointer items-center justify-center rounded-b-2xl bg-linear-to-b from-transparent via-background-muted/80 to-background-muted font-medium text-foreground-muted text-sm transition-colors hover:text-foreground">
        {isOpen ? "Collapse" : "Expand"}
      </CollapsibleTrigger>
    </Collapsible>
  );
}
